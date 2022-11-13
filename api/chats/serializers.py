from rest_framework import serializers
from .models import Chat, Message
from users.serializers import UserSerializer

class ChatSerializer(serializers.ModelSerializer):
    users = UserSerializer(many=True)

    class Meta:   # <- an inter class call Meta
        model = Chat
        fields = ['id', 'users']

class MessageSerializer(serializers.ModelSerializer):
    user = UserSerializer()

    class Meta:
        model = Message
        fields = ['id', 'user', 'chat', 'message', 'created_at', 'updated_at']