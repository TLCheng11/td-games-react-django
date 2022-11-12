from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
# from .models import Friend
# from .serializers import FriendSerializer
from users.models import MyUser as User
from users.serializers import UserSerializer

# Create your views here.

class ChatControllers(viewsets.ModelViewSet):
  pass