import os
from typing import Any
import pandas as pd
from django.db import models
import requests
import csv

import tempfile
from django.core.files.base import ContentFile

import random
from django.core.validators import FileExtensionValidator
import base64

def round_number(number):
    if isinstance(number, str):
        number = number.replace(",", ".")
    number = float(number) if number == float(number) else 0
    rounded_number = int(round(number, 5) * 1000)
    return rounded_number

def upload_to(instance, filename):
    return f'csv/modelo1.csv'

class GLTFFile(models.Model):
    type = "gltf"
    dict = None
    url =  models.CharField(blank=False)
    


class File(models.Model):
    type = "csv"
    title = models.CharField(max_length=200, blank=False)
    url = models.FileField(
        blank=True,
        editable=True,
        upload_to=upload_to,
        validators=[FileExtensionValidator(allowed_extensions=['csv'])]
    )
    gltf = None

    def __init__(self, content=None, *args, **kwargs):
        self.content = content
        super().__init__(*args, **kwargs)

    def save(self, *args, **kwargs):
        if self.content:
            self.url.save(self.title, ContentFile(self.content), save=False)
        super().save(*args, **kwargs)



    def has_headers(self):
        response = requests.get(self.url.url)
        content = response.content.decode('utf-8')

        csv_reader = csv.reader(content.splitlines(), delimiter=',')
        first_row = next(csv_reader, [])
        num_headers = len(first_row)

        return num_headers if num_headers > 0 else 0

    def generate_gltf(self, n_columns=None, n_samples=None, user_filename=None):
        try:
            import bpy
            self.clean_blocks(bpy)
            if bpy.context.scene.objects:
                bpy.ops.object.select_all(action='SELECT')
                bpy.ops.object.delete(use_global=False, confirm=False)
          
                

            volume = 100
            

            # Create a new mesh data block
            dict = {"samples": [], "variables": []}

        
            

            # Link the object to the scene
          
            df = pd.read_csv(self.url.url, sep=";", decimal=",", na_values=["", " ", '"', ""], header=self.has_headers())
            # Filter columns to exclude 'Unnamed: 0' and 'dtype'
            
     
            columna = df.columns
            if n_samples != 'all':
                n_samples = int(n_samples)

            if n_columns != 'all':
                n_columns = int(n_columns)
            if n_samples or n_columns == 'all':
                columns = columna[0 : int(len(columna))]
                n_samples = int(len(df))
            else: 
                columns = columna[0 : int(n_columns)]
            intervalo = [-volume, volume]
            print("paso 1")


            for i, row in df.iloc[0: int(n_samples)].iterrows():
                numero_x = intervalo[0]

                sample_name = str(row[0])
                if sample_name and sample_name.strip().lower() not in ["nan", ""]:
                    dict["samples"].append(sample_name)
                    bpy.ops.mesh.primitive_uv_sphere_add(
                        location=(0, 0, 0), radius=volume / 1000000
                    )
                    parent = bpy.context.active_object
                    parent.name = sample_name

                    # Create UV spheres
                    for column in columns[1:]:
                        r = round_number(row[column]) // 10
                        if r > 0:
                            if -(r + abs(numero_x)) < intervalo[0]:
                                posicion_x = numero_x + r
                            else:
                                posicion_x = numero_x
                            numero_x += r

                            bpy.ops.mesh.primitive_uv_sphere_add(
                                location=(posicion_x, 0, 0), radius=r
                            )
                            sphere = bpy.context.active_object
                            sphere.name = sample_name + "_" + column
                            sphere.parent = parent
                            if column not in dict["variables"]:
                                dict["variables"].append(column)

                    bpy.ops.mesh.primitive_uv_sphere_add(
                        location=(0, 0, 0), radius=volume
                    )
                    model_volumen_relativo = bpy.context.active_object
                    model_volumen_relativo.name = "model_volumen_relativo" + sample_name
                    model_volumen_relativo.parent = parent
                    parent.select_set(True)

            bpy.ops.mesh.primitive_uv_sphere_add(location=(0, 0, 0), radius=volume * 10)
            spher = bpy.context.active_object
            spher.name = "Volumen_Total" 
            spher.select_set(True)
            
            
            

            with tempfile.NamedTemporaryFile(suffix='.glb', delete=False) as temp_file:
                filepath = temp_file.name
                bpy.ops.export_scene.gltf(filepath=filepath)


                with open(filepath, "rb") as f:
                    content = f.read()
                    self.gltf = GLTFFile.objects.create()
                    self.gltf.dict = dict
                    gltf_base64 = base64.b64encode(content).decode("utf-8")
                    self.gltf.dict['content'] = gltf_base64
                   
                    self.save()
                    self.gltf.delete()
                    os.unlink(filepath)
  


                    return self.gltf.dict
                
               
                

        except Exception as e:
            response = str(e) + "Error al generar el archivo GLTF"
            print("errooor",response)
            return response


    def clean_blocks(self, bpy):
        for block in bpy.data.meshes:
            if block.users == 0:
                bpy.data.meshes.remove(block)

        for block in bpy.data.materials:
            if block.users == 0:
                bpy.data.materials.remove(block)

        for block in bpy.data.textures:
            if block.users == 0:
                bpy.data.textures.remove(block)

        for block in bpy.data.images:
            if block.users == 0:
                bpy.data.images.remove(block)




