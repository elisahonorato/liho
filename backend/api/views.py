import base64
import os
from django.http import HttpResponse, JsonResponse
from rest_framework.parsers import MultiPartParser
from rest_framework.views import APIView

from .models import *
from .serializers import *


class PruebaView(APIView):
    parser_classes = [MultiPartParser]
    queue = [f"model{i}" for i in range(1, 3)]
    client_count = 0  # Variable to count the number of clients

    def post(self, request):
        try:
            ip_address = request.META.get("REMOTE_ADDR")
            print("IP Address:", ip_address, "Client count:", PruebaView.client_count)

            uploaded_file = request.FILES.get("file")
            if not uploaded_file:
                if request.data.get('success') == 'true':
                    print("Success")
                    return HttpResponse(request.MESSAGES, status=400)
                return HttpResponse("Error: No file uploaded", status=400)

            if uploaded_file.content_type != "text/csv":
                return HttpResponse("Archivo con formato incorrecto", status=400)

            user_filename = request.data.get("userFilename")
            if user_filename is None or user_filename == "null" or user_filename == "":
                user_filename = self.queue.pop(0)
                self.queue.append(user_filename)

            file = File.objects.create(url=uploaded_file, title=user_filename)
            gltf = GLTFFile.objects.create(file=file)
            n_samples = request.data.get("n_samples")
            n_columns = request.data.get("n_columns")

            if n_samples is None or n_samples == "null":
                n_samples = None
            if n_columns is None or n_columns == "null":
                n_columns = None

            response = gltf.generate_gltf(n_samples, n_columns, user_filename)

            if gltf.dict is not None:
                PruebaView.client_count += 1

                # Base64 encode the GLTF file content
                with open(gltf.path, 'rb') as file:
                    gltf_content = file.read()
                gltf_base64 = base64.b64encode(gltf_content).decode('utf-8')

                # Include the GLTF file content in the JSON response
                response['file_content'] = gltf_base64
                # Create a JSON response with the file content and other data
                return JsonResponse(response, status=200)
            else:
                return HttpResponse(response, status=400)

        except Exception as e:
            return HttpResponse(str(e), status=500)

    def get(self, request):
        return HttpResponse("Método no permitido", status=405)
