# Generated by Django 4.1.7 on 2023-03-29 01:07

import api.models
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("api", "0015_alter_file_url"),
    ]

    operations = [
        migrations.AddField(
            model_name="gltffile",
            name="url",
            field=models.FileField(blank=True, upload_to=api.models.upload_to),
        ),
    ]