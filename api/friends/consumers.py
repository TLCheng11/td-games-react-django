import json
from channels.generic.websocket import AsyncWebsocketConsumer
import logging
logger = logging.getLogger('django')

# Consumer for friend invites
class InviteConsumer(AsyncWebsocketConsumer):
  # start connection
  async def connect(self):
    self.room_name = self.scope['url_route']['kwargs']['room_name']
    self.current_user = self.scope['url_route']['kwargs']['current_user']
    self.room_group_name = 'invite_%s' % self.room_name

    await self.channel_layer.group_add(
      self.room_group_name,
      self.channel_name
    )

    # need to accept the connection
    await self.accept()

  # sending back message
  # the function name here link to the 'type' in the .group_send method
  async def update(self, event):
    if (self.current_user == event['payload']):
      await self.send(text_data=json.dumps({
        'update': True
      }))

  # receive data
  async def receive(self, text_data=None):
    text_data_json = json.loads(text_data)
    payload = text_data_json['payload']

    await self.channel_layer.group_send(
      self.room_group_name,
      {
        'type': 'update',
        'payload': payload
      }
    )

  # disconnect from channel
  async def disconnect(self, code):
    await self.channel_layer.group_discard(
      self.room_group_name,
      self.channel_name
    )