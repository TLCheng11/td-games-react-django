from rest_framework import serializers
from .models import Chat
from users.serializers import UserSerializer

class ChatSerializer(serializers.ModelSerializer):
    users = UserSerializer(many=True)

    class Meta:   # <- an inter class call Meta
        model = Chat
        fields = ['id', 'users']