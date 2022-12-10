from rest_framework import serializers
from users.serializers import UserSerializer
from .models import Game, Match, UserMatch

class GameSerializer(serializers.ModelSerializer):
    class Meta:
        model = Game
        fields = ['id','title', 'description', 'image_url']

class UserMatchSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserMatch
        fields = ['id', 'match', 'user', 'friend_id', 'invited_by', 'diffculty', 'status']

class MatchSerializer(serializers.ModelSerializer):
    users = UserSerializer(many=True)
    user_matches = UserMatchSerializer(many=True)

    class Meta:
        model = Match
        fields = ['id', 'users', 'user_matches', 'game', 'game_settings', 'game_status', 'finished']
