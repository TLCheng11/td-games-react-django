from rest_framework import serializers
from .models import Friend

class FriendSerializer(serializers.ModelSerializer):
    class Meta:
        model = Friend
        fields = ['id','user', 'friend', 'invited_by', 'status']