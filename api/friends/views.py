from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework.parsers import JSONParser
from .models import Friend
from .serializers import FriendSerializer
from users.models import MyUser as User
from users.serializers import UserSerializer

# Create your views here.

class FriendList(viewsets.ViewSet):
  permission_classes = [AllowAny]
  queryset = Friend.objects.all()

  # GET api/friends/
  def list(self, request):
    # to get all User object as friend in User friend list
    friends = User.objects.filter(friend__user=request.user.id)
    serializer = UserSerializer(friends, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

  # POST api/friends/
  # to create friend relation when invite
  def create(self, request):
    try:
      friend = User.objects.get(username=request.data["friend"])
    except:
      return Response({"errors": "user not found"}, status=status.HTTP_404_NOT_FOUND)
      
    relation = {"user": request.user.id, "friend": friend.id, "invited_by": request.user.id}
    serializer = FriendSerializer(data=relation)
    if serializer.is_valid():
      serializer.save()

      # if invitation is vaild, create an opposite relation
      friend = Friend.objects.get(user=relation["user"], friend=relation["friend"])
      Friend.objects.create(user=friend.friend, friend=friend.friend, invited_by=friend.invited_by)
      return Response(serializer.data, status=status.HTTP_201_CREATED)
    else:
      #if relation already exist, return error message according to status
      friend = Friend.objects.get(user=relation["user"], friend=relation["friend"])
      if friend.status == "pending":
        return Response({"errors": "already have pending invite"}, status=status.HTTP_403_FORBIDDEN)
      return Response({"errors": "user already in friend list"}, status=status.HTTP_403_FORBIDDEN)