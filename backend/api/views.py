from rest_framework.views import APIView
from . models import *
from rest_framework.parsers import MultiPartParser
from .serializers import *
from django.http import HttpResponse, FileResponse, JsonResponse


# Create your views here.
class PruebaView(APIView):
    parser_classes = [MultiPartParser]
    def post(self, request):
        uploaded_file = request.FILES['file']
        if uploaded_file.content_type == 'text/csv':
            file = File.objects.create(url = uploaded_file)
            gltf = GLTFFile.objects.create(file = file)
            if gltf.exists:
                return JsonResponse(gltf.dict, status=200)
            else:
                return HttpResponse({"Error al generar el archivo"},status=400)



        elif uploaded_file.content_type != 'text/csv':
            return HttpResponse({"Archivo con el formato incorrecto"},status=400)

        else:
            return HttpResponse({"Error desconocido"},status=400)

    def get(self, request):
        return HttpResponse({"Metodo no permitido"},status=405)
