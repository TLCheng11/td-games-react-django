import json
from channels.generic.websocket import AsyncWebsocketConsumer

# Consumer for friend invites
class ChatConsumer(AsyncWebsocketConsumer):
  # start connection
  async def connect(self):
    self.room_name = self.scope['url_route']['kwargs']['room_name']
    self.current_user = self.scope['url_route']['kwargs']['current_user']
    self.room_group_name = 'chat_%s' % self.room_name

    await self.channel_layer.group_add(
      self.room_group_name,
      self.channel_name
    )

    # need to accept the connection
    await self.accept()

  # sending back message
  # the function name here link to the 'type' in the .group_send method
  async def send_message(self, event):
    await self.send(text_data=json.dumps({
      'method': event['method'],
      'data': event['data'],
    }))

  # receive data
  # async def receive(self, text_data=None):
  #   text_data_json = json.loads(text_data)
  #   sender = text_data_json['sender']
  #   message = text_data_json['message']

  #   await self.channel_layer.group_send(
  #     self.room_group_name,
  #     {
  #       'type': 'send_message',
  #       'sender': sender,
  #       'message': message,
  #     }
  #   )

  # disconnect from channel
  async def disconnect(self, code):
    await self.channel_layer.group_discard(
      self.room_group_name,
      self.channel_name
    )