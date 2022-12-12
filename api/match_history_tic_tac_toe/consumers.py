import json
from channels.generic.websocket import AsyncWebsocketConsumer
import logging
logger = logging.getLogger('django')

# Consumer for friend invites
class TicTacToeConsumer(AsyncWebsocketConsumer):
  # start connection
  async def connect(self):
    self.match_id = self.scope['url_route']['kwargs']['match_id']
    self.current_user = self.scope['url_route']['kwargs']['current_user']
    self.room_group_name = 'tictactoe_%s' % self.match_id

    await self.channel_layer.group_add(
      self.room_group_name,
      self.channel_name
    )

    # need to accept the connection
    await self.accept()

  # sending back message
  # the function name here link to the 'type' in the .group_send method
  async def update_move(self, event):
    if (self.current_user == event['to_user']):
      await self.send(text_data=json.dumps(event['new_move']))

  # disconnect from channel
  async def disconnect(self, code):
    await self.channel_layer.group_discard(
      self.room_group_name,
      self.channel_name
    )