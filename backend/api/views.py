from django.http import HttpResponse, JsonResponse
from rest_framework.parsers import MultiPartParser
from rest_framework.views import APIView

from .models import *
from .serializers import *


class PruebaView(APIView):
    parser_classes = [MultiPartParser]

    def post(self, request):
        uploaded_file = request.FILES.get("file")
        if not uploaded_file:
            return HttpResponse("Error: No file uploaded", status=400)

        if uploaded_file.content_type == "text/csv":
            user_filename = request.data.get("userFilename")
            if user_filename == "undefined":
                user_filename = "file"
            file = File.objects.create(url=uploaded_file, title=user_filename)
            gltf = GLTFFile.objects.create(file=file)
            n_samples = request.data.get("n_samples")
            n_columns = request.data.get("n_columns")

            if n_samples == "null":
                n_samples = None
            if n_columns == "null":
                n_columns = None

            gltf.generate_gltf(n_samples, n_columns, user_filename)

            if gltf.exists:
                return JsonResponse(gltf.dict, status=200)
            else:
                return HttpResponse("Error al generar el archivo", status=400)

        else:
            return HttpResponse("Archivo con formato incorrecto", status=400)

    def get(self, request):
        return HttpResponse("Método no permitido", status=405)
