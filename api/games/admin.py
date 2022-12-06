from django.contrib import admin
from .models import Game, Match, UserMatch

# Register your models here.
class GameAdminConfig(admin.ModelAdmin):
  ordering = ("id",)
  list_display = ("title", "id", "description")

class MatchAdminConfig(admin.ModelAdmin):
  ordering = ("id",)
  list_display = ("id", "game", "finished")

class UserMatchAdminConfig(admin.ModelAdmin):
  ordering = ("id",)
  list_display = ("id", "user", "match", "status")


admin.site.register(Game, GameAdminConfig)
admin.site.register(Match, MatchAdminConfig)
admin.site.register(UserMatch, UserMatchAdminConfig)
