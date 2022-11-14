import json
from asgiref.sync import sync_to_async
from channels.generic.websocket import AsyncWebsocketConsumer
from .models import MyUser as User

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
  
  @sync_to_async
  def login_user(self):
    User.objects.filter(username=self.room_name).update(is_login=True)

  @sync_to_async
  def logout_user(self):
    User.objects.filter(username=self.room_name).update(is_login=False)