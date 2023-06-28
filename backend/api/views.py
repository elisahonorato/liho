import base64
import os
from django.http import HttpResponse, JsonResponse
from rest_framework.parsers import MultiPartParser
from rest_framework.views import APIView

from .models import *
from .serializers import *


class PruebaView(APIView):
    parser_classes = [MultiPartParser]

    def post(self, request):
        try:
            uploaded_file = request.FILES.get("file")

            
            user_filename = request.data.get("userFilename")
            if uploaded_file is None:
                return HttpResponse("Error: No file uploaded", status=400)
            elif uploaded_file.content_type != "text/csv":
                return HttpResponse("Archivo con formato incorrecto", status=400)
            file_queryset = File.objects.filter(url=uploaded_file, title=user_filename)
            if file_queryset.exists():
                file = file_queryset.first()
            else:
                file = File.objects.create(url=uploaded_file, title=user_filename)
            
  
            n_samples = request.data.get("n_samples")
            n_columns = request.data.get("n_columns")

            # Check if the value is not None before converting to an integer
            if n_samples != 'all':
                n_samples = int(n_samples)

            if n_columns != 'all':
                n_columns = int(n_columns)


            response = self.process_request(request, file, n_samples, n_columns, user_filename)
        

            if file.gltf is not None:
                return JsonResponse(response, status=200, safe=False)  # Set safe parameter to False
            else:
                return HttpResponse(response, status=500)

        except Exception as e:
            return HttpResponse(str(e), status=500)

    def process_request(self, request, file, n_samples, n_columns, filename):
        response = file.generate_gltf(n_samples, n_columns, filename)
        return response
        

      

    def get(self, request):
        return HttpResponse("GET request", status=200)
