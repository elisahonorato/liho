from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.views import APIView
from . models import *
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser, FileUploadParser
from .serializers import *
from django.http import HttpResponse

# Create your views here.
class PruebaView(APIView):
    parser_classes = [MultiPartParser]
    def post(self, request):
        uploaded_file = request.FILES['file']
        if uploaded_file.content_type == 'text/csv':
            return HttpResponse({"File Uploaded"},status=200)
        else:
            return HttpResponse({"File not Uploaded"},status=400)






