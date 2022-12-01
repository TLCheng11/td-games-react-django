from django.db import models

# Create your models here.

class Game(models.Model):
  title = models.CharField(max_length=255, unique=True)
  image_url = models.CharField(max_length=255)
  description = models.TextField(blank=True)
  created_at = models.DateTimeField(auto_now_add=True)
  updated_at = models.DateTimeField(auto_now=True)

  def __str__(self) -> str:
    return str(self.id) + ": " + self.title