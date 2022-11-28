from django.urls import re_path
from friends import consumers

websocket_urlpatterns = [
  re_path(r'ws/invites/(?P<room_name>\w+)/(?P<current_user>\w+)/$', consumers.InviteConsumer.as_asgi()),
]