from django.db import models
import pandas as pd
import os
import random
import math




# lets us explicitly set upload path and filename
def upload_to(instance, filename):
    return '%s/%s' % (instance.type, filename)



class File(models.Model):
    type = "csv"
    title = models.CharField(max_length=80, blank=False, null=False)
    print(title)
    url = models.FileField(upload_to=upload_to, blank=True)

class GLTFFile(models.Model):
    type = "gltf"
    file = models.OneToOneField(File, on_delete=models.CASCADE, primary_key=True)
    path = None
    dict = None
    exists = False

    def save(self, *args, **kwargs):
        self.dict = None
        super().save(*args, **kwargs)
        self.path = self.file.url.path.replace(".csv", ".glb")
        self.generate_gltf()

    def generate_gltf(self):

        try:
            import bpy
            if bpy.context.scene.objects:
                bpy.ops.object.select_all(action='SELECT')
                bpy.ops.object.delete(use_global=False)
            volume = 100

            # Create a new mesh data block
            dict = {}
            dict['samples'] = []
            dict['variables'] = []

            # Link the object to the scene
            if self.has_headers():
                header = 1
            else:
                header = None

            df = pd.read_csv(self.file.url.path, sep=';', decimal=',',header=header, na_values=['', ' ', '"', ""])

            for i, row in df.iloc[0:10].iterrows():
                columns = df.columns
                sample_name = str(row[0])
                if sample_name != None:
                    dict['samples'].append(sample_name)
                    bpy.ops.mesh.primitive_uv_sphere_add(location=(0, 0, 0), radius = volume/10000)
                    parent = bpy.context.active_object
                    parent.name = sample_name


                    # Create a UV sphere
                    if len(columns) > 30:
                        columns = columns[0:40]

                    for column in columns[1:]:

                        r = round_number(row[column])//10
                        if r > 0:
                            print(column)
                            x = random.randint(-(volume-r), volume-r)
                            bpy.ops.mesh.primitive_uv_sphere_add(location=(x, 0, 0), radius = r)
                            sphere = bpy.context.active_object
                            sphere.name = sample_name + "_" + column
                            sphere.parent = parent
                            if column not in dict['variables']:
                                dict['variables'].append(column)

                    parent.select_set(True)




            bpy.ops.mesh.primitive_uv_sphere_add(location=(0, 0, 0), radius = volume)
            sphere = bpy.context.active_object
            sphere.name = "Volumen"
            print(len(sphere.children))
            bpy.ops.mesh.primitive_uv_sphere_add(location=(0, 0, 0), radius = volume*10)
            spher = bpy.context.active_object
            spher.name = "Volumen_Total"
            bpy.ops.export_scene.gltf(filepath=self.path, check_existing=True, convert_lighting_mode='SPEC', export_format='GLB', ui_tab='GENERAL', export_copyright='', export_image_format='AUTO', export_keep_originals=False, export_texcoords=True, export_normals=False, use_mesh_edges=False, use_mesh_vertices=True, export_cameras=False, use_selection=False, use_visible=True, use_renderable=False, use_active_collection_with_nested=True, use_active_collection=False, use_active_scene=True, export_extras=True, export_yup=True, export_apply=False, export_animations=True, export_frame_range=True, export_frame_step=1, export_force_sampling=True, export_nla_strips=True, export_nla_strips_merged_animation_name='Animation', export_def_bones=False, export_optimize_animation_size=False, export_anim_single_armature=False, export_reset_pose_bones=False, export_current_frame=False, export_skins=False, export_all_influences=False, export_morph=False, export_morph_normal=False, export_morph_tangent=False, export_lights=False, will_save_settings=False, filter_glob='*.glb;*.gltf')
            dict['path'] = self.path
            dict['vol'] = volume
            self.dict = dict
            self.exists = True
            print(self.dict)

        except Exception as e:
            response = str(e) + "Error al generar el archivo GLTF"
            self.dict = None
            return response
    def has_headers(self):
    # read the first row of the dataset
        with open(self.file.url.path) as f:
            first_row = f.readline().strip()

        # check if each value in the first row is a valid column name
        for col in first_row.split(','):
            try:
                pd.DataFrame(columns=[col])
            except ValueError:
                return False

        # if all values are valid column names, assume that the dataset has headers
        return True


def round_number(number):
    return int(round(number, 5) * 1000)




