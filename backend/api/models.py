from django.db import models


# lets us explicitly set upload path and filename
def upload_to(instance, filename):
    return 'images/{filename}'.format(filename=filename)

class File(models.Model):
    title = models.CharField(max_length=80, blank=False, null=False)
    csv_url = models.FileField(upload_to=upload_to, blank=True)


