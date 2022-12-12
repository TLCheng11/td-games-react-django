from rest_framework import serializers
from .models import MatchHistoryTicTacToe

class TicTacToeMatchHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = MatchHistoryTicTacToe
        fields = ['id','user', 'match', 'player', 'position']