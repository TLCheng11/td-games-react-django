from django.urls import re_path
from chats import consumers

websocket_urlpatterns = [
  re_path(r'ws/chats/(?P<room_name>\w+)/(?P<current_user>\w+)/$', consumers.ChatConsumer.as_asgi()),
]