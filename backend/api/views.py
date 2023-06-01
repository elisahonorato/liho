import base64
import os
import concurrent.futures
from django.http import HttpResponse, JsonResponse
from rest_framework.parsers import MultiPartParser
from rest_framework.views import APIView

from .models import *
from .serializers import *
import threading


class PruebaView(APIView):
    parser_classes = [MultiPartParser]
    max_clients = 2
    client_count = 0
    queue_lock = threading.Lock()

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.filename = None

    def post(self, request):
        try:
            uploaded_file = request.FILES.get("file")
            if not uploaded_file:
                if request.data.get('message') == "success":
                    print("Success")
                    return HttpResponse("Procesando el archivo completo", status=200)
                return HttpResponse("Error: No file uploaded", status=400)

            if uploaded_file.content_type != "text/csv":
                return HttpResponse("Archivo con formato incorrecto", status=400)

            user_filename = request.data.get("userFilename")
            if user_filename is None or user_filename == "null" or user_filename == "" or user_filename == "undefined":
                with self.queue_lock:
                    self.client_count += 1
                    if self.client_count > self.max_clients:
                        return HttpResponse("Error: Maximum number of clients reached", status=400)
                    user_filename = f"model{self.client_count}"

            file = File.objects.create(url=uploaded_file, title=user_filename)
            gltf = GLTFFile.objects.create(file=file)
            n_samples = request.data.get("n_samples")
            n_columns = request.data.get("n_columns")

            if n_samples is None or n_samples == "null":
                n_samples = None
            if n_columns is None or n_columns == "null":
                n_columns = None

            with concurrent.futures.ThreadPoolExecutor() as executor:
                future = executor.submit(
                    self.process_request,
                    request,
                    gltf,
                    n_samples,
                    n_columns,
                )
                response = future.result()

            if response is not None:
                return JsonResponse(response, status=200, safe=False)  # Set safe parameter to False

        except Exception as e:
            return HttpResponse(str(e), status=500)

    def process_request(self, request, gltf, n_samples, n_columns):
        response = gltf.generate_gltf(n_samples, n_columns, self.filename)

        if gltf.dict is not None:
            with open(gltf.path, "rb") as file:
                gltf_content = file.read()
            gltf_base64 = base64.b64encode(gltf_content).decode("utf-8")

            response["file_content"] = gltf_base64

        return response

    def get(self, request):
        return HttpResponse("Método no permitido", status=405)
