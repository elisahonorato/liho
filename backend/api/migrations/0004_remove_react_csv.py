# Generated by Django 4.1.7 on 2023-03-20 18:32

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ("api", "0003_react_csv"),
    ]

    operations = [
        migrations.RemoveField(
            model_name="react",
            name="csv",
        ),
    ]