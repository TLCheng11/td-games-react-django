from django.urls import re_path
from friends import consumers

websocket_urlpatterns = [
  re_path(r'ws/friends/(?P<room_name>\w+)/$', consumers.FriendListConsumer.as_asgi())
]