from django.urls import re_path
from chats import consumers

websocket_urlpatterns = [
  re_path(r'ws/chats/(?P<room_name>\w+)/$', consumers.ChatRoomConsumer.as_asgi())
]