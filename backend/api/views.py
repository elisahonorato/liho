from rest_framework.views import APIView
from . models import *
from rest_framework.parsers import MultiPartParser
from .serializers import *
from django.http import HttpResponse
from .resources.blender import generate_gltf


# Create your views here.
class PruebaView(APIView):
    parser_classes = [MultiPartParser]
    def post(self, request):
        uploaded_file = request.FILES['file']
        if uploaded_file.content_type == 'text/csv':
            self.file = File.objects.create(url = uploaded_file)
            self.file.save()
            self.gltf = GLTFFile.objects.create(file = self.file)




            return HttpResponse({"Uploaded"}, status=200)
        else:
            return HttpResponse({"File not Uploaded"},status=400)










