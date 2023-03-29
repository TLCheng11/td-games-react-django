from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer

from .models import Chat, Message
from .serializers import ChatSerializer, MessageSerializer
from users.models import MyUser as User

import logging
logger = logging.getLogger('django')

def send_message_through_channel(channel_layer, room_group_name, request, serializer):
  async_to_sync(channel_layer.group_send)(
      room_group_name, 
      {
        'type': 'send_message',
        'method': request.method,
        'data': serializer.data,
      }
    )

# Create your views here.
# trying the view with sepreate functions

# Chat Controllers
@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
def chat_list(request):
  
  # GET api/chats/
  if request.method == "GET":

    # find all chats related to current user
    chats = request.user.chat_set.all()
    serializer = ChatSerializer(chats, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

  # POST api/chats/
  if request.method == "POST":
    # find friend as user object
    friend_id = request.data["friend"]
    friend = User.objects.get(pk=friend_id)

    # compare if the chat room between two users already exist
    chat_list_1 = [chat for chat in request.user.chat_set.all() if chat.users.count() == 2]
    chat_list_2 = [chat for chat in friend.chat_set.all() if chat.users.count() == 2]
    chats = set(chat_list_1) & set(chat_list_2)

    # retur the chat room if it exist
    if len(chats) > 0:
      chat = list(chats)[0]
      serializer = ChatSerializer(chat)
      return Response(serializer.data, status=status.HTTP_200_OK)
    
    # create a new chat room if it doesn't exist
    else:
      chat = Chat.objects.create()
      chat.users.add(request.user, through_defaults={})
      chat.users.add(friend, through_defaults={})
      serializer = ChatSerializer(chat)
      return Response(serializer.data, status=status.HTTP_201_CREATED)

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def chat_detail(request, id):
  
  if request.method == "GET":
    chat = Chat.objects.get(pk=id)
    serializer = ChatSerializer(chat)
    return Response(serializer.data, status=status.HTTP_200_OK)

# Messages Controllers
@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
def message_list(request, chat_id):
  
  # GET chats/messages/chat_id/
  # get all message related to chat_id
  if request.method == "GET":
    chat = Chat.objects.get(pk=chat_id)
    messages = chat.messages.all()
    serializer = MessageSerializer(messages, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

  # POSt chats/messages/chat_id/
  # create message object for chat_id
  if request.method == "POST":
    chat = Chat.objects.get(pk=chat_id)
    message = Message.objects.create(user=request.user, chat=chat, message=request.data["message"])
    serializer = MessageSerializer(message)

    # send out the message through chat channel
    channel_layer = get_channel_layer()
    room_group_name = 'chat_%s' % chat_id
    send_message_through_channel(channel_layer, room_group_name, request, serializer)

    return Response(serializer.data, status=status.HTTP_202_ACCEPTED)

@api_view(["PATCH", "DELETE"])
@permission_classes([IsAuthenticated])
def message_detail(request, id):
  try: 
    message = Message.objects.get(pk=id)
  except:
    return Response({"errors": "message not found"}, status=status.HTTP_404_NOT_FOUND)

  # if request.user != message.user:
  #   return Response({"errors": "only sender can edit message"}, status=status.HTTP_403_FORBIDDEN)

  channel_layer = get_channel_layer()
  room_group_name = 'chat_%s' % message.chat.id

  # UPDATE chats/message_edit/id/
  if request.method == "PATCH":
    serializer = MessageSerializer(message, data=request.data, partial=True)
    if serializer.is_valid():
      serializer.save()

      if "read" in request.data:
        pass
      else:
        send_message_through_channel(channel_layer, room_group_name, request, serializer)
      
      return Response(serializer.data, status=status.HTTP_202_ACCEPTED)

  if request.method == "DELETE":
    
    # send out the message through chat channel
    serializer = MessageSerializer(message)
    send_message_through_channel(channel_layer, room_group_name, request, serializer)
    message.delete()

    return Response({"message": "message deleted."}, status=status.HTTP_202_ACCEPTED)
  
# Unread Messages
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def message_unread(request):

  # GET chats/messages_unread/
  # get all unread message related to user

  if request.method == "GET":
    chats = request.user.chat_set.all()
    messages = []
    for chat in chats:
      messages += chat.messages.all().exclude(user=request.user).filter(read=False)
    serializer = MessageSerializer(messages, many=True)
          

    return Response(serializer.data, status=status.HTTP_202_ACCEPTED)
