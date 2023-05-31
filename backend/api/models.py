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
    print(title)
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
            import logging
            import bpy

            if bpy.context.active_object is not None:
                # Access the active object here
                bpy.ops.object.select_all(action="SELECT")
                bpy.ops.object.delete(use_global=False)


            import bpy

            logging.basicConfig(level=logging.WARNING)

            # Disable bpy's debug log messages
            logging.getLogger("bpy").setLevel(logging.WARNING)
            logging.getLogger("bpy.app.handlers").setLevel(logging.WARNING)
            bpy.app.debug = False

            if bpy.context.scene.objects:
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
                if sample_name != None:
                    dict["samples"].append(sample_name)
                    bpy.ops.mesh.primitive_uv_sphere_add(
                        location=(0, 0, 0), radius=volume / 10000
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

            bpy.ops.export_scene.gltf(
                filepath=path,
                check_existing=True,
                export_format="GLB",
                export_materials="EXPORT",
                export_texcoords=True,
                export_normals=True,
                export_tangents=False,
                export_animations=True,
                export_skins=True,
                export_frame_range=True,
                export_force_sampling=True,
                export_nla_strips=True,
                export_def_bones=False,
                export_anim_single_armature=True,
                export_reset_pose_bones=True,
                export_morph=True,
                export_morph_normal=True,
                export_morph_tangent=False,
                export_lights=False,
                will_save_settings=False,
                filter_glob="*.glb",
            )

            file_size = os.path.getsize(path)
            if file_size > 100000000:
                return "El archivo es demasiado grande"
            else:
                # Se guarda en el objeto
                dict["path"] = "http://localhost:8000/" + path
                dict["userFilename"] = user_filename
                dict["vol_relativo"] = volume
                dict["vol_total"] = volume * n_samples

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
    return int(round(number, 5) * 1000)
