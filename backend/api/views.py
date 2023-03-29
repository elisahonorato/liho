from rest_framework.views import APIView
from . models import *
from rest_framework.parsers import MultiPartParser
from .serializers import *
from django.http import HttpResponse, FileResponse
from .resources.blender import generate_gltf


# Create your views here.
class PruebaView(APIView):
    parser_classes = [MultiPartParser]
    def post(self, request):
        uploaded_file = request.FILES['file']
        if uploaded_file.content_type == 'text/csv':
            self.file = File.objects.create(url = uploaded_file)
            self.gltf = GLTFFile.objects.create(file = self.file)
            self.gltf.save()
            with open(self.gltf.path, 'rb') as f:
                gltf = f.read()
            response = FileResponse(gltf)

            response['Content-Type'] = 'model/gltf-binary'
            return response

        elif uploaded_file.content_type != 'text/csv':
            return HttpResponse({"Archivo con el formato incorrecto"},status=400)

        else:
            return HttpResponse({"Error desconocido"},status=400)










