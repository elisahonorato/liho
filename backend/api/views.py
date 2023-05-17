from django.http import FileResponse, HttpResponse, JsonResponse
from rest_framework.parsers import MultiPartParser
from rest_framework.views import APIView

from .models import *
from .serializers import *


# Create your views here.
class PruebaView(APIView):
    parser_classes = [MultiPartParser]

    def post(self, request):
        uploaded_file = request.FILES["file"]
        if uploaded_file.content_type == "text/csv":
            file = File.objects.create(url=uploaded_file)
            gltf = GLTFFile.objects.create(file=file)
            n_samples = request.POST.get("n_samples")
            n_columns = request.POST.get("n_columns")
            print(request.POST, n_samples, n_columns)
            if n_samples == "null":
                n_samples = None
            if n_columns == "null":
                n_columns = None
            gltf.generate_gltf(n_samples, n_columns)
            if gltf.exists:
                return JsonResponse(gltf.dict, status=200)
            return HttpResponse({"Error al generar el archivo"}, status=400)

        elif uploaded_file.content_type != "text/csv":
            return HttpResponse({"Archivo con el formato incorrecto"}, status=400)

        else:
            return HttpResponse({"Error desconocido"}, status=400)

    def get(self, request):
        return HttpResponse({"Metodo no permitido"}, status=405)
