# Generated by Django 4.2 on 2023-05-26 01:35

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("api", "0018_file_type_gltffile_type"),
    ]

    operations = [
        migrations.AddField(
            model_name="gltffile",
            name="dict",
            field=models.JSONField(blank=True, null=True),
        ),
    ]