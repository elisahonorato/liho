# Generated by Django 4.2.2 on 2023-06-27 21:29

import api.models
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='file',
            name='title',
            field=models.CharField(max_length=200),
        ),
        migrations.AlterField(
            model_name='gltffile',
            name='url',
            field=models.FileField(blank=True, max_length=500, upload_to=api.models.upload_to),
        ),
    ]