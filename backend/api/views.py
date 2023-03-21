from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.views import APIView
from . models import *
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser, FileUploadParser
from .serializers import *
# Create your views here.



class FilesViewSet(viewsets.ModelViewSet):
    queryset = File.objects.all()
    serializer_class = FilesSerializer

    def post(self, request):
        print(request.data, request.__dict__)
        return Response({'result': 'maquina'}, status=201)

class PruebaView(APIView):
    parser_classes = [MultiPartParser]
    def post(self, request):
        print(request.FILES)
        return Response({'result': 'maquina'}, status=200)
