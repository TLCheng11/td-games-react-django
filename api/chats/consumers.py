import json
from channels.generic.websocket import AsyncWebsocketConsumer

class ChatRoomConsumer(AsyncWebsocketConsumer):
  # start connection
  async def connect(self):
    self.room_name = self.scope['url_route']['kwargs']['room_name']
    self.room_group_name = 'chat_%s' % self.room_name

    await self.channel_layer.group_add(
      self.room_group_name,
      self.channel_name
    )

    # need to accept the connection
    await self.accept()

    # use group send to send out messages
    await self.channel_layer.group_send(
      self.room_group_name,
      {
        'type': 'message',
        'message': 'hello'
      }
    )

  # sending back message
  # the function name here link to the 'type' in the .group_send method
  async def message(self, event):
    message = event['message']

    await self.send(text_data=json.dumps({
      'message': message,
    }))

  # receive data
  async def receive(self, text_data=None):
    text_data_json = json.loads(text_data)
    message = text_data_json['message']

    await self.channel_layer.group_send(
      self.room_group_name,
      {
        'type': 'message',
        'message': message
      }
    )

  # disconnect from channel
  async def disconnect(self, code):
    await self.channel_layer.group_discard(
      self.room_group_name,
      self.channel_name
    )