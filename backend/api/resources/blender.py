import pandas as pd


def generate_gltf(csv_path, gltf_path):
    import bpy

    # create a new geometry node tree
    tree = bpy.data.node_groups.new(type="GeometryNodeTree", name="GeometryNodes")
    # Create a new mesh data block
    gridmesh = bpy.data.meshes.new("GridMesh")

    if "Cube" in bpy.data.meshes:
        mesh = bpy.data.meshes["Cube"]
        print("removing mesh", mesh)
        bpy.data.meshes.remove(mesh)

    # Create a new object that uses the mesh data block
    obj = bpy.data.objects.new("Grid", gridmesh)
    print(list(bpy.data.objects))

    # Link the object to the scene

    df = pd.read_csv(csv_path)
    # Load the material file

    # Crear una visualización 3D de los datos
    for i, row in df.iterrows():
        x, y, z, value = (
            row["numeromuestra"],
            row["intensidad"],
            row["aceleracion"],
            row["altura"],
        )
        # Create a UV sphere
        bpy.ops.mesh.primitive_uv_sphere_add(
            location=(0, 0, 0), segments=z, ring_count=y, radius=value, calc_uvs=True
        )
        mat = bpy.data.materials.new(name="Material")
        mat.use_nodes = True
        mat.node_tree.nodes["Principled BSDF"].inputs["Alpha"].default_value = 0.1
        mat.node_tree.nodes["Principled BSDF"].inputs["Base Color"].default_value = (
            0.05 * x,
            0.05 * y,
            0.05 * z,
            0.1,
        )
        mat.cycles.use_backface_culling = True
        sphere = bpy.context.active_object
        print(sphere)
        sphere.data.materials.append(mat)

    # Exportar el modelo a SVG
    bpy.context.scene.render.film_transparent = True
    export_path = gltf_path

    # Export the active object
    bpy.ops.export_scene.gltf(
        filepath=export_path,
        check_existing=True,
        convert_lighting_mode="SPEC",
        export_format="GLB",
        ui_tab="GENERAL",
        export_copyright="",
        export_image_format="AUTO",
        export_texture_dir="",
        export_keep_originals=True,
        export_texcoords=True,
        export_normals=True,
        export_draco_mesh_compression_enable=False,
        export_draco_mesh_compression_level=6,
        export_draco_position_quantization=14,
        export_draco_normal_quantization=10,
        export_draco_texcoord_quantization=12,
        export_draco_color_quantization=10,
        export_draco_generic_quantization=12,
        export_tangents=False,
        export_materials="EXPORT",
        export_original_specular=False,
        export_colors=True,
        export_attributes=False,
        use_mesh_edges=False,
        use_mesh_vertices=True,
        export_cameras=False,
        use_selection=False,
        use_visible=True,
        use_renderable=False,
        use_active_collection_with_nested=True,
        use_active_collection=False,
        use_active_scene=True,
        export_extras=True,
        export_yup=True,
        export_apply=False,
        export_animations=True,
        export_frame_range=True,
        export_frame_step=1,
        export_force_sampling=True,
        export_nla_strips=True,
        export_nla_strips_merged_animation_name="Animation",
        export_def_bones=False,
        export_optimize_animation_size=False,
        export_anim_single_armature=True,
        export_reset_pose_bones=True,
        export_current_frame=False,
        export_skins=True,
        export_all_influences=False,
        export_morph=True,
        export_morph_normal=True,
        export_morph_tangent=False,
        export_lights=False,
        will_save_settings=False,
        filter_glob="*.glb;*.gltf",
    )
