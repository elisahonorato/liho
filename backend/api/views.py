import base64
import concurrent.futures
from django.http import HttpResponse, JsonResponse
from rest_framework.parsers import MultiPartParser
from rest_framework.views import APIView

from .models import GLTFFile
from .serializers import GLTFFileSerializer

class PruebaView(APIView):
    parser_classes = [MultiPartParser]
    max_clients = 2
    client_count = 0
    queue_lock = threading.Lock()

    def post(self, request):
        try:
            uploaded_file = request.FILES.get("file")
            if not uploaded_file:
                if request.data.get('message') == "success":
                    return HttpResponse("Procesando el archivo completo", status=200)
                return HttpResponse("Error: No file uploaded", status=400)

            if uploaded_file.content_type != "text/csv":
                return HttpResponse("Archivo con formato incorrecto", status=400)

            user_filename = request.data.get("userFilename")
            if not user_filename or user_filename in ["null", "", "undefined"]:
                with self.queue_lock:
                    self.client_count += 1
                    if self.client_count > self.max_clients:
                        return HttpResponse("Error: Maximum number of clients reached", status=400)
                    user_filename = f"model{self.client_count}"

            gltf_file = GLTFFile(file=uploaded_file, title=user_filename)
            gltf_file.save()

            n_samples = request.data.get("n_samples")
            n_columns = request.data.get("n_columns")

            if n_samples == "null":
                n_samples = None
            if n_columns == "null":
                n_columns = None

            response = self.process_request(request, gltf_file, n_samples, n_columns, user_filename)

            if isinstance(response, dict):
                return JsonResponse(response, status=200)  # No need for `safe=False` in recent Django versions
            else:
                return HttpResponse(response, status=500)

        except Exception as e:
            return HttpResponse(str(e), status=500)

    def process_request(self, request, gltf_file, n_samples, n_columns, filename):
        response = gltf_file.generate_gltf(n_samples, n_columns, filename)

        if gltf_file.dict is not None:
            with open(gltf_file.path, "rb") as file:
                gltf_content = file.read()
            gltf_base64 = base64.b64encode(gltf_content).decode("utf-8")

            response["file_content"] = gltf_base64

        return response

    def get(self, request):
        try:
            gltf_id = request.query_params.get('id')
            gltf = GLTFFile.objects.get(id=gltf_id)
            n_samples = request.query_params.get("n_samples")
            n_columns = request.query_params.get("n_columns")

            if n_samples == "null":
                n_samples = None
            if n_columns == "null":
                n_columns = None

            response = self.process_request(request, gltf, n_samples, n_columns, gltf.title)

            if isinstance(response, dict):
                return JsonResponse(response, status=200)  # No need for `safe=False` in recent Django versions
            else:
                return HttpResponse(response, status=500)

        except Exception as e:
            return HttpResponse(str(e), status=500)
