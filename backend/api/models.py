import os
import pandas as pd
from django.db import models
import bpy


def upload_to(instance, filename):
    # Specify the relative upload path using the original filename
    upload_path = "modelo"
    return upload_path


class File(models.Model):
    type = "csv"
    title = models.CharField(max_length=80, blank=False)
    url = models.FileField(upload_to=upload_to, blank=True, editable=True)
    gltf = None

    def generate_gltf(self, n_columns=None, n_samples=None, user_filename=None):
        gltf = bpy.ops.export_scene.gltf(
                filepath=self.url,
                export_format="GLTF_SEPARATE",
                # Rest of the export options...
            )
        self.gltf = gltf
    


class GLTFFile(models.Model):
    type = "gltf"
    dict = None
    url = models.CharField(max_length=80, blank=True)




    def save(self, *args, **kwargs):
        self.dict = None
        super().save(*args, **kwargs)

    def generate_gltf(self, n_columns=None, n_samples=None, user_filename=None):
        print("generando gltf")
        try:
            context = bpy.context

            # Clear the scene
            bpy.ops.object.select_all(action="DESELECT")
            bpy.ops.object.select_by_type(type="MESH")
            bpy.ops.object.delete()

            volume = 100

            # Create a new mesh data block
            dict = {"samples": [], "variables": []}

            # Link the object to the scene
            header = 1 if self.has_headers() else None

            file_path = self.file.path

            df = pd.read_csv(
                file_path,
                sep=";",
                decimal=",",
                header=header,
                na_values=["", " ", '"', ""],
            )

            columns = df.columns[0: n_columns] if n_columns else df.columns
            intervalo = [-volume, volume]

            for i, row in df.iloc[0: n_samples].iterrows():
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

            # Export the scene to GLTF
            output_file = os.path.join("media", user_filename)
            bpy.ops.export_scene.gltf(
                filepath=output_file,
                export_format="GLTF_SEPARATE",
                # Rest of the export options...
            )

            file_size = os.path.getsize(output_file)
            if file_size > 100000000:
                return "El archivo es demasiado grande"
            else:
                self.path = output_file
                dict["path"] = self.path
                dict["userFilename"] = user_filename
                dict["vol_relativo"] = volume
                dict["vol_total"] = volume * (n_samples or len(df.index))

                self.dict = dict
                return self.dict

        except Exception as e:
            response = str(e) + "Error al generar el archivo GLTF"
            return response

    def has_headers(self):
        with open(self.file.path) as file_obj:
            first_line = file_obj.readline().strip()

        # Check if each value in the first line is a valid column name
        for col in first_line.split(";"):
            try:
                pd.DataFrame(columns=[col])
            except ValueError:
                return False

        # If all values are valid column names, assume that the file has headers
        return True


def round_number(number):
    if isinstance(number, str):
        number = number.replace(",", ".")
    number = float(number) if number == float(number) else 0
    rounded_number = int(round(number, 5) * 1000)
    return rounded_number
