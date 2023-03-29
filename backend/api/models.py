from django.db import models
from .resources.blender import generate_gltf



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

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        print(self.file.url.path)
        generate_gltf(self.file.url.path, self.file.url.path.replace(".csv", ".gltf"))









