import math
import os
import random

import pandas as pd
from django.db import models


def upload_to(instance, filename):
    # Modify this function to specify the desired upload path and filename
    return f"{instance.type}/{instance.title}.{instance.type}"


class File(models.Model):
    type = "csv"
    title = models.CharField(max_length=80, blank=False)
    url = models.FileField(upload_to=upload_to, blank=False, editable=False)


class GLTFFile(models.Model):
    type = "gltf"
    file = models.OneToOneField(File, on_delete=models.CASCADE, primary_key=True)
    path = None
    dict = None

    def save(self, *args, **kwargs):
        self.dict = None
        super().save(*args, **kwargs)

    def generate_gltf(self, n_columns=None, n_samples=None, user_filename=None):
        try:
            import bpy
            import logging
            context = bpy.context
            active_object = context.active_object

            if bpy.context.active_object is not None:
                # Access the active object here
                bpy.ops.object.select_all(action="SELECT")
                bpy.ops.object.delete(use_global=False)
                if bpy.context.scene.objects:
                    bpy.ops.object.select_all(action="SELECT")
                    bpy.ops.object.delete(use_global=False)
            else:
                bpy.ops.object.select_all(action="SELECT")
                bpy.ops.object.delete(use_global=False)



            volume = 100

            # Create a new mesh data block
            dict = {}
            dict["samples"] = []
            dict["variables"] = []

            # Link the object to the scene
            if self.has_headers():
                header = 1
            else:
                header = None

            df = pd.read_csv(
                self.file.url.path,
                sep=";",
                decimal=",",
                header=header,
                na_values=["", " ", '"', ""],
            )
            columna = df.columns
            if n_columns == None:
                n_columns = len(columna)
            if n_samples == None:
                n_samples = len(df.index)
            columns = columna[0 : int(n_columns)]
            intervalo = [-volume, volume]

            for i, row in df.iloc[0 : int(n_samples)].iterrows():
                numero_x = intervalo[0]

                sample_name = str(row[0])
                if sample_name != None and sample_name != "" and sample_name != " " and sample_name != "nan" and sample_name != "NaN":
                    dict["samples"].append(sample_name)
                    bpy.ops.mesh.primitive_uv_sphere_add(
                        location=(0, 0, 0), radius=volume / 1000000
                    )
                    parent = bpy.context.active_object
                    parent.name = sample_name
                    # Create a UV sphere
                    for column in columns[1:]:
                        r = round_number(row[column]) // 10
                        if r > 0:
                            # borde inferior
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
            # Se guarda primero en un path local
            path = "media/glb/" + self.file.title + ".glb"
            output_file = "console_output.txt"

            # Open the output file in write mode
            with open(output_file, "w") as f:
                # Redirect console output to the file
                old_stdout = os.dup(1)
                os.dup2(f.fileno(), 1)

                # Call the export function
                bpy.ops.export_scene.gltf(
                    filepath=path,
                    # Rest of the export options...
                )

                # Restore console output
                os.dup2(old_stdout, 1)


            # Remove the output file
            os.remove(output_file)


            file_size = os.path.getsize(path)
            if file_size > 100000000:
                return "El archivo es demasiado grande"
            else:
                # Se guarda en el objeto
                dict["path"] = "https://liho.onrender.com/probando/" + path
                dict["userFilename"] = user_filename
                dict["vol_relativo"] = volume
                dict["vol_total"] = volume * n_samples

                self.path = path

                self.dict = dict
                return self.dict

        except Exception as e:
            response = str(e) + "Error al generar el archivo GLTF"
            return response

    def has_headers(self):
        # read the first row of the dataset
        with open(self.file.url.path) as f:
            first_row = f.readline().strip()

        # check if each value in the first row is a valid column name
        for col in first_row.split(","):
            try:
                pd.DataFrame(columns=[col])
            except ValueError:
                return False

        # if all values are valid column names, assume that the dataset has headers
        return True


def round_number(number):
    if isinstance(number, str):
        number = number.replace(',', '.')  # Replace comma with period if the input is a string

    # Convert the number to a float if it's not already
    number = float(number)
    if number == float(number):
        number = float(number)
    else:
        number = 0

    # Round the number and truncate it to an integer
    rounded_number = int(round(number, 5) * 1000)

    return rounded_number