# Generated by Django 4.1.7 on 2023-03-28 23:04

import api.models
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ("api", "0011_gltffile_delete_gltf"),
    ]

    operations = [
        migrations.AddField(
            model_name="gltffile",
            name="file",
            field=models.ForeignKey(
                default=1, on_delete=django.db.models.deletion.CASCADE, to="api.file"
            ),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name="gltffile",
            name="gltf_file",
            field=models.FileField(
                blank=True, default=0, upload_to=api.models.upload_to
            ),
        ),
    ]