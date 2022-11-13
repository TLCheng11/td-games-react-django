from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAdminUser
from .models import Chat, UserChat
from .serializers import ChatSerializer
from users.models import MyUser as User
from users.serializers import UserSerializer

# Create your views here.
# trying the view with sepreate functions

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
def chat_detail(request, id):
  
  if request.method == "GET":
    chat = Chat.objects.get(pk=id)
    serializer = ChatSerializer(chat)
    return Response(serializer.data, status=status.HTTP_200_OK)