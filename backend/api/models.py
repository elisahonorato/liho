import os
from typing import Any
import pandas as pd
from django.db import models
import requests
import csv
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
    url = models.CharField(blank=False)

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

            if bpy.context.active_object is not None:
                bpy.ops.object.select_all(action="SELECT")
                bpy.ops.object.delete(use_global=False)
                if bpy.context.scene.objects:
                    bpy.ops.object.select_all(action="SELECT")
                    bpy.ops.object.delete(use_global=False)
            else:
                bpy.ops.object.select_all(action="SELECT")
                bpy.ops.object.delete(use_global=False)

            volume = 100
            dict = {"samples": [], "variables": [], "volumes": ["Rel", "Abs", int(volume)]}

            df = pd.read_csv(self.url.url, sep=";", decimal=",", na_values=["", " ", '"', ""], header=self.has_headers())
            columna = df.columns

            if n_samples != 'all' and n_columns != 'all':
                n_samples = int(n_samples)
                n_columns = int(n_columns)
            else:
                n_samples = int(len(df))
                n_columns = int(len(columna))

            intervalo = [-volume, volume]

            for i, row in df.iloc[0: 4].iterrows():
                numero_x = intervalo[0]

                sample_name = str(row[0])
                if sample_name not in dict["samples"] and sample_name != "nan":
                    dict["samples"].append(sample_name)
                    bpy.ops.mesh.primitive_uv_sphere_add(
                        location=(0, 0, 0), radius=volume / 10000000
                    )
                    parent = bpy.context.active_object
                    parent.name = sample_name
                    parent.select_set(True)

                    for column in columna[1: n_columns]:
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
                    model_volumen_relativo.name = dict["volumes"][0] + sample_name
                    model_volumen_relativo.parent = parent

            bpy.ops.mesh.primitive_uv_sphere_add(location=(0, 0, 0), radius=volume * 10)
            spher = bpy.context.active_object
            spher.name = dict["volumes"][1]

            bpy.ops.export_scene.gltf(export_format='GLB')
            with open('model.glb', 'rb') as f:
                content = f.read()

            self.gltf = GLTFFile.objects.create()
            self.gltf.dict = dict
            gltf_base64 = base64.b64encode(content).decode("utf-8")
            self.gltf.dict['content'] = gltf_base64

            self.save()

            bpy.ops.object.select_all(action="SELECT")
            bpy.ops.object.delete(use_global=True)

            return self.gltf.dict

        except Exception as e:
            response = str(e) + "Error al generar el archivo GLTF"
            return response
