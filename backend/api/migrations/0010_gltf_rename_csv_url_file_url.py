# Generated by Django 4.1.7 on 2023-03-28 21:53

import api.models
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("api", "0009_delete_gltf_rename_url_file_csv_url"),
    ]

    operations = [
        migrations.CreateModel(
            name="Gltf",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("title", models.CharField(max_length=80)),
                ("url", models.FileField(blank=True, upload_to=api.models.upload_to)),
            ],
        ),
        migrations.RenameField(
            model_name="file",
            old_name="csv_url",
            new_name="url",
        ),
    ]