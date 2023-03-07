from django.shortcuts import render
from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.request import Request
from .serializers import RoomSerializer
from .models import Room

from api.resources.blender import Blender

# Create your views here.


class RoomView(generics.ListAPIView):
    queryset = Room.objects.all()
    serializer_class = RoomSerializer
    
class CreateModel(APIView):
    def post(self, request: Request):
        csv = request.FILES.get('modelo_csv')
        svg = Blender(csv).generate_model()
        return svg
