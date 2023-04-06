from django.db import models
from .resources.blender import generate_gltf
from pygltflib import GLTF2, Scene
import pandas as pd
import os



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
        super().save(*args, **kwargs)
        self.path = self.file.url.path.replace(".csv", ".glb")
        self.generate_gltf()

    def generate_gltf(self):

        try:
            # Load the material file
            import bpy
            # create a new geometry node tree
            tree = bpy.data.node_groups.new(type='GeometryNodeTree', name='GeometryNodes')
            # Create a new mesh data block
            gridmesh = bpy.data.meshes.new('GridMesh')
            dict = {}

            if "Cube" in bpy.data.meshes:
                mesh = bpy.data.meshes["Cube"]
                print("removing mesh", mesh)
                bpy.data.meshes.remove(mesh)

            if "Sphere" in bpy.data.meshes:
                mesh = bpy.data.meshes["Sphere"]
                print("removing mesh", mesh)
                bpy.data.meshes.remove(mesh)

            # Create a new object that uses the mesh data block
            obj = bpy.data.objects.new('Grid', gridmesh)
            print(list(bpy.data.objects))

            # Link the object to the scene

            df = pd.read_csv(self.file.url.path, sep=';', decimal=',', encoding='utf-8', engine='python', on_bad_lines='warn')
            print(df)
            dict['path'] = self.path
            dict['model'] = {'samples': []}
            model = dict['model']
            samples = model['samples']

            for i, row in df.iterrows():
                columns = df.columns
                x, y, z = row[0], row[1], row[2]
                # Create a UV sphere
                bpy.ops.mesh.primitive_uv_sphere_add(location=(0, 0, 0), radius = z)

                sphere = bpy.context.active_object
                sphere.name = str(i)
                sample_dict = { 'colors' : [x, y], 'variables': [columns[0], columns[1]]}
                samples.append(sample_dict)



            bpy.ops.export_scene.gltf(filepath=self.path, check_existing=True, convert_lighting_mode='SPEC', export_format='GLB', ui_tab='GENERAL', export_copyright='', export_image_format='AUTO', export_texture_dir='', export_keep_originals=True, export_texcoords=True, export_normals=True, export_draco_mesh_compression_enable=False, export_draco_mesh_compression_level=6, export_draco_position_quantization=14, export_draco_normal_quantization=10, export_draco_texcoord_quantization=12, export_draco_color_quantization=10, export_draco_generic_quantization=12, export_tangents=False, export_materials='EXPORT', export_original_specular=False, export_colors=True, export_attributes=False, use_mesh_edges=False, use_mesh_vertices=True, export_cameras=False, use_selection=False, use_visible=True, use_renderable=False, use_active_collection_with_nested=True, use_active_collection=False, use_active_scene=True, export_extras=True, export_yup=True, export_apply=False, export_animations=True, export_frame_range=True, export_frame_step=1, export_force_sampling=True, export_nla_strips=True, export_nla_strips_merged_animation_name='Animation', export_def_bones=False, export_optimize_animation_size=False, export_anim_single_armature=True, export_reset_pose_bones=True, export_current_frame=False, export_skins=True, export_all_influences=False, export_morph=True, export_morph_normal=True, export_morph_tangent=False, export_lights=False, will_save_settings=False, filter_glob='*.glb;*.gltf')
            self.exists = True
            self.dict = dict




        except Exception as e:
            response = str(e) + "Error al generar el archivo GLTF"
            self.dict = None
            return response
