from django.contrib import admin
from .models import Game

# Register your models here.
class GameAdminConfig(admin.ModelAdmin):
  ordering = ("id",)
  list_display = ("title", "id", "description")


admin.site.register(Game, GameAdminConfig)
