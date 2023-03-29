from rest_framework import serializers
from . models import *


class FilesSerializer(serializers.ModelSerializer):

    csv_url = serializers.FileField(required=False)
    gltf_url = serializers.FileField(required=False)
    class Meta:
        model = File
        fields = ['id', 'csv']






