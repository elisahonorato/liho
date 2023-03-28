from django.db import models



# lets us explicitly set upload path and filename
def upload_to(instance, filename):
    print(filename)
    if filename.endswith('.csv'):
        return 'csv/{filename}'.format(filename=filename)
    elif filename.endswith('.gltf'):
        return 'gltf/{filename}'.format(filename=filename)


class File(models.Model):
    title = models.CharField(max_length=80, blank=False, null=False)
    url = models.FileField(upload_to=upload_to, blank=True)

class Gltf(models.Model):
    title = models.CharField(max_length=80, blank=False, null=False)
    url = models.FileField(upload_to=upload_to, blank=True)



