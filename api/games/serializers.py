from rest_framework import serializers
from .models import Game, Match

class GameSerializer(serializers.ModelSerializer):
    class Meta:
        model = Game
        fields = ['id','title', 'description', 'image_url']

class MatchSerializer(serializers.ModelSerializer):
    class Meta:
        model = Match
        fields = ['id','users', 'game', 'game_settings', 'game_status', 'finished']