from email.policy import default
from random import choices
from secrets import choice
from django.db import models
from users.models import MyUser as User

# Create your models here.

class Friend(models.Model):
  options = (("pending", "Pending"), ("accepted", "Accepted"), ("declined", "Declined"))

  user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="user")
  friend = models.ForeignKey(User, on_delete=models.CASCADE, related_name="friend")
  invited_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name="invited_by")
  status = models.CharField(max_length=10, choices=options, default="pending")
  created_at = models.DateTimeField(auto_now_add=True)
  updated_at = models.DateTimeField(auto_now=True)

  def __str__(self) -> str:
        return self.user + " " + self.friend