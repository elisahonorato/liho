from django.db import models
from .resources.blender import generate_gltf
from pygltflib import GLTF2, Scene



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
        self.path = self.file.url.path.replace(".csv", ".glb")
        generate_gltf(self.file.url.path, self.path)
        self.gltf_file = GLTF2().load(self.path)











