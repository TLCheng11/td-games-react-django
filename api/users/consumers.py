import json
from asgiref.sync import sync_to_async, async_to_sync
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.layers import get_channel_layer
from .models import MyUser as User

import logging
logger = logging.getLogger('django')

class UserConsumer(AsyncWebsocketConsumer):
  # start connection
  async def connect(self):
    self.room_name = self.scope['url_route']['kwargs']['room_name']
    self.room_group_name = 'user_%s' % self.room_name

    await self.channel_layer.group_add(
      self.room_group_name,
      self.channel_name
    )

    # need to accept the connection
    await self.accept()
    await self.update_login_status(True)

  # disconnect from channel
  async def disconnect(self, code):
    await self.channel_layer.group_discard(
      self.room_group_name,
      self.channel_name
    )
    await self.update_login_status(False)

  # function to update friend login status
  async def friend_login_status_update(self, event):
    await self.send(text_data=json.dumps({
      'action': 'friend_login_or_logout',
      'username': event['username'],
      'is_login': event['is_login']
    }))

  @sync_to_async
  def update_login_status(self, status):
    user = User.objects.get(username=self.room_name)
    user.is_login = status
    user.save()
    friends = User.objects.filter(friend__user=user.id, friend__status="accepted")
    for friend in friends:
        room_group_name = 'user_%s' % friend.username
        async_to_sync(self.channel_layer.group_send)(
            room_group_name, 
                {
                    'type': 'friend_login_status_update',
                    'username': user.username,
                    'is_login': status
                }
            )