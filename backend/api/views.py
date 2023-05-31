import requests
from django.http import HttpResponse, JsonResponse
from rest_framework.parsers import MultiPartParser
from rest_framework.views import APIView

from .models import *
from .serializers import *


class PruebaView(APIView):
    parser_classes = [MultiPartParser]
    queue = [f"model{i}" for i in range(1, 11)]
    client_count = 0  # Variable to count the number of clients

    def post(self, request):
        try:
            ip_address = request.META.get("REMOTE_ADDR")
            print("IP Address:", ip_address, "Client count:", PruebaView.client_count)

            uploaded_file = request.FILES.get("file")
            if not uploaded_file:
                return HttpResponse("Error: No file uploaded", status=400)

            if uploaded_file.content_type != "text/csv":
                return HttpResponse("Archivo con formato incorrecto", status=400)

            user_filename = request.data.get("userFilename")
            if user_filename is None or user_filename == "null" or user_filename == "":
                user_filename = "modelo"

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
                return JsonResponse(response, status=200)
            else:
                return HttpResponse(response, status=400)

        except Exception as e:
            return HttpResponse(str(e), status=500)

    def get(self, request):
        return HttpResponse("Método no permitido", status=405)
