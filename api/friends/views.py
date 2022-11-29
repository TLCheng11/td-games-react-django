from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework.parsers import JSONParser

from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

from .models import Friend
from .serializers import FriendSerializer
from users.models import MyUser as User
from users.serializers import UserSerializer

import logging
logger = logging.getLogger('django')

# Create your views here.

class FriendList(viewsets.ViewSet):
  permission_classes = [AllowAny]
  queryset = Friend.objects.all()

  # helper function to update friend invite through user channel
  def update_friend_invite_through_user_channel(self, username):
      room_group_name = 'user_%s' % username
      logger.info(room_group_name)
      channel_layer = get_channel_layer()
      async_to_sync(channel_layer.group_send)(
          room_group_name, 
              {
                  'type': 'friend_invite'
              }
          )

  # GET api/friends/
  def list(self, request):
    # to get all User object as friend in User friend list
    friends = User.objects.filter(friend__user=request.user.id, friend__status="accepted")
    pendings = User.objects.filter(friend__user=request.user.id, friend__status__in=["pending", "declined"])
    serializer = UserSerializer(friends, many=True)
    serializer_pending = UserSerializer(pendings, many=True)
    return Response({"friends": serializer.data, "pendings": serializer_pending.data}, status=status.HTTP_200_OK)

  # GET api/friends/:pk/
  def retrieve(self, request, pk):
    try:
      relation = Friend.objects.get(user=request.user.id, friend=pk)
    except:
      return Response({"errors": "user not found"}, status=status.HTTP_404_NOT_FOUND)
    serializer = FriendSerializer(relation)
    return Response(serializer.data, status=status.HTTP_200_OK)

  # POST api/friends/
  # to create friend relation when invite
  def create(self, request):
    # check if target is self
    if request.user.username == request.data["friend"]:
      return Response({"errors": "cannot invite self as friend."}, status=status.HTTP_403_FORBIDDEN)

    # check if invite target exist
    try:
      friend = User.objects.get(username=request.data["friend"])
    except:
      return Response({"errors": "user not found"}, status=status.HTTP_404_NOT_FOUND)

    # check if previous declined invite exist:
    try:
      preInvite = Friend.objects.get(user=friend.id, friend=request.user.id, status="declined")
      preInvite.delete()
    except:
      pass

    # construct data to pass into serializer
    relation = {"user": request.user.id, "friend": friend.id, "invited_by": request.user.id}
    serializer = FriendSerializer(data=relation)
    if serializer.is_valid():
      serializer.save()

      # if invitation is vaild, create an opposite relation
      invite = Friend.objects.get(user=relation["user"], friend=relation["friend"])
      Friend.objects.create(user=invite.friend, friend=invite.user, invited_by=invite.invited_by)

      # use user channel to ask target to update friend list
      self.update_friend_invite_through_user_channel(invite.friend.username)

      return Response(serializer.data, status=status.HTTP_201_CREATED)
    else:
      #if relation already exist, return error message according to status
      invite = Friend.objects.get(user=relation["user"], friend=relation["friend"])
      if invite.status == "pending" or invite.status == "declined":
        return Response({"errors": "already have pending invite"}, status=status.HTTP_403_FORBIDDEN)
      return Response({"errors": "user already in friend list"}, status=status.HTTP_403_FORBIDDEN)

  # PATCH api/friends/:pk/
  def partial_update(self, request, pk):
    try:
      invite = Friend.objects.get(id=pk)
    except:
      return Response({"errors": "invite not found"}, status=status.HTTP_404_NOT_FOUND)
    # if invite exist, find the paired relation
    friend = Friend.objects.get(user=invite.friend, friend=invite.user)
    friend.status = request.data["method"]
    friend.save()

    if request.data["method"] == "accepted":
      invite.status = request.data["method"]
      invite.save()

      # use user channel to ask target to update friend list
      self.update_friend_invite_through_user_channel(invite.friend.username)

      return Response({"message": "invite accepted."}, status=status.HTTP_202_ACCEPTED)
    else:  

      # use user channel to ask target to update friend list
      self.update_friend_invite_through_user_channel(invite.friend.username)
      invite.delete()
      return Response({"message": "invite declined."}, status=status.HTTP_202_ACCEPTED)
    

  # DELETE api/friends/:pk/
  def destroy(self, request, pk):
    try:
      invite = Friend.objects.get(id=pk)
    except:
      return Response({"errors": "invite not found"}, status=status.HTTP_404_NOT_FOUND)

    # if invite exist, find the paired relation
    # if friend relation exist, delete it
    try:
      friend = Friend.objects.get(user=invite.friend, friend=invite.user)
      friend.delete()
    except:
      pass

    # use user channel to ask target to update friend list
    self.update_friend_invite_through_user_channel(invite.friend.username)
    invite.delete()
    return Response({"message": "invite cancaled."}, status=status.HTTP_202_ACCEPTED)
