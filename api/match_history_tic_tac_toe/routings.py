from django.urls import re_path
from match_history_tic_tac_toe import consumers

websocket_urlpatterns = [
  re_path(r'ws/tictactoe/(?P<match_id>\w+)/(?P<current_user>\w+)/$', consumers.TicTacToeConsumer.as_asgi()),
]