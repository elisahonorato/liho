from django.db import models

class Doc(models.Model):
    upload = models.FileField(upload_to='sci_data/')
    
    def __str__(self) -> str:
        return str(self.pk)
    
