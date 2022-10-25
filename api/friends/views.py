from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from .models import Friend
from .serializers import FriendSerializer
from users.models import MyUser as User
from users.serializers import UserSerializer

# Create your views here.

class FriendList(viewsets.ViewSet):
  permission_classes = [AllowAny]
  queryset = Friend.objects.all()

  def list(self, request):
    # to get all User object as friend in User friend list
    friends = User.objects.filter(friend__user=request.user.id)
    serializer = UserSerializer(friends, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

  # to create friend relation when invite
  def create(self, request):
    serializer = FriendSerializer(data=request.data)
    print(request.data)
    if serializer.is_valid():
      serializer.save()

      # if invitation is vaild, create an opposite relation
      relation = Friend.objects.get(user=request.data["user"], friend=request.data["friend"])
      Friend.objects.create(user=relation.friend, friend=relation.user, invited_by=relation.invited_by)
      return Response(serializer.data, status=status.HTTP_201_CREATED)
    else:

      #if relation already exist, return error message according to status
      relation = Friend.objects.get(user=request.data["user"], friend=request.data["friend"])
      if relation.status == "pending":
        return Response({"errors": "already have pending invite"}, status=status.HTTP_403_FORBIDDEN)
      return Response({"errors": "user already in friend list"}, status=status.HTTP_403_FORBIDDEN)