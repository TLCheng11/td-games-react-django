from django.db import models
from users.models import MyUser as User

# Create your models here.

class Friend(models.Model):
  options = (("pending", "pending"), ("accepted", "accepted"), ("declined", "declined"))

  user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="user")
  friend = models.ForeignKey(User, on_delete=models.CASCADE, related_name="friend")
  invited_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name="invited_by")
  status = models.CharField(max_length=10, choices=options, default="pending")
  created_at = models.DateTimeField(auto_now_add=True)
  updated_at = models.DateTimeField(auto_now=True)

  class Meta:
    unique_together = ("user", "friend")

  def __str__(self) -> str:
        return self.user.username + " " + self.friend.username