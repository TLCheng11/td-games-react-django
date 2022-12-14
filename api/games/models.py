from django.db import models
from users.models import MyUser as User

# Create your models here.

class Game(models.Model):
  title = models.CharField(max_length=255, unique=True)
  image_url = models.CharField(max_length=255)
  description = models.TextField(blank=True)
  created_at = models.DateTimeField(auto_now_add=True)
  updated_at = models.DateTimeField(auto_now=True)

  def __str__(self) -> str:
    return self.title

class Match(models.Model):
  users = models.ManyToManyField(User, through="UserMatch")
  game = models.ForeignKey(Game, on_delete=models.CASCADE, related_name="matches")
  game_settings = models.TextField(blank=True)
  game_status = models.TextField(blank=True)
  finished = models.BooleanField(default=False)
  created_at = models.DateTimeField(auto_now_add=True)
  updated_at = models.DateTimeField(auto_now=True)

  def __str__(self) -> str:
    return str(self.id) + ": " + self.game.title

class UserMatch(models.Model):
  status_options = (("pending", "pending"), ("accepted", "accepted"), ("declined", "declined"), ("finished", "finished"))
  diff_options = (("normal", "normal"), ("medium", "medium"), ("hard", "hard"))

  user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="user_matches")
  friend_id = models.IntegerField()
  invited_by = models.IntegerField()
  match = models.ForeignKey(Match, on_delete=models.CASCADE, related_name="user_matches")
  status = models.CharField(max_length=10, choices=status_options, default="pending")
  diffculty = models.CharField(max_length=6, choices=diff_options, default="normal")
  created_at = models.DateTimeField(auto_now_add=True)
  updated_at = models.DateTimeField(auto_now=True)

  class Meta:
    unique_together = ("user", "match")

  def __str__(self) -> str:
    return str(self.id) + ": " + self.match.game.title + " match"