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
    await self.login_user()

  # disconnect from channel
  async def disconnect(self, code):
    await self.channel_layer.group_discard(
      self.room_group_name,
      self.channel_name
    )
    await self.logout_user()

  # function to update friend login status
  async def friend_login_status_update(self, event):
    await self.send(text_data=json.dumps({
      'username': event['username'],
      'is_login': event['is_login']
    }))
  
  @sync_to_async
  def login_user(self):
    User.objects.filter(username=self.room_name).update(is_login=True)

  @sync_to_async
  def logout_user(self):
    User.objects.filter(username=self.room_name).update(is_login=False)

# TODO
# try to call other channel but not working
  @sync_to_async
  def notice_friends(self):
    user = User.objects.get(username=self.room_name)
    friends = User.objects.filter(friend__user=user.id, friend__status="accepted")
    for friend in friends:
      room = 'user_%s' % friend.username
      async_to_sync(self.channel_layer.group_send(
        room,
        {
          'type': 'friend_joined',
          'username': friend.username
        }
      ))