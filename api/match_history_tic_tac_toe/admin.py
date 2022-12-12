from django.contrib import admin
from .models import MatchHistoryTicTacToe

# Register your models here.
class TicTacToeHistoryAdminConfig(admin.ModelAdmin):
  ordering = ("id",)
  list_display = ("id", "match", "player", "position")

admin.site.register(MatchHistoryTicTacToe, TicTacToeHistoryAdminConfig)