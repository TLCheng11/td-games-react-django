from django.db import models
from users.models import MyUser as User
from games.models import Match

# Create your models here.

class TicTacToeHistory(models.Model):
  options = (("X", "X"), ("O", "O"))

  user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="tic_tac_toe_histories")
  match = models.ForeignKey(Match, on_delete=models.CASCADE, related_name="tic_tac_toe_histories")
  player = models.CharField(max_length=1, choices=options)
  position = models.IntegerField()
  created_at = models.DateTimeField(auto_now_add=True)
  updated_at = models.DateTimeField(auto_now=True)