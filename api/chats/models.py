from django.db import models
from users.models import MyUser as User

# Create your models here.

class Chat(models.Model):
  user = models.ManyToManyField(User, through='UserChat')
  created_at = models.DateTimeField(auto_now_add=True)
  updated_at = models.DateTimeField(auto_now=True)

  def __str__(self) -> str:
        return "Chatroom: " + str(self.id)

class UserChat(models.Model):
  user = models.ForeignKey(User, on_delete=models.CASCADE)
  chat = models.ForeignKey(Chat, on_delete=models.CASCADE)
  last_viewed_on: models.DateTimeField()
  created_at = models.DateTimeField(auto_now_add=True)
  updated_at = models.DateTimeField(auto_now=True)

  class Meta:
    unique_together = [['user', 'chat']]

  def __str__(self) -> str:
        return "Chatroom: " + str(self.chat.id) + " User: " + self.user.username

class Message(models.Model):
  user = models.ForeignKey(User, on_delete=models.CASCADE)
  chat = models.ForeignKey(Chat, on_delete=models.CASCADE)
  message = models.TextField()
  created_at = models.DateTimeField(auto_now_add=True)
  updated_at = models.DateTimeField(auto_now=True)

  def __str__(self) -> str:
        return self.user.username + ": " + self.message
