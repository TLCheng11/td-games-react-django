from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated

from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

# from users.models import MyUser as User
from games.models import Match, UserMatch
from games.serializers import MatchSerializer
from .serializers import TicTacToeMatchHistorySerializer

import logging
logger = logging.getLogger('django')

# Create your views here.

# Common function to update channel
def update_match_status_through_user_channel(username):
  room_group_name = 'user_%s' % username
  # logger.info(room_group_name)
  channel_layer = get_channel_layer()
  async_to_sync(channel_layer.group_send)(
    room_group_name, 
      {
        'type': 'match_status_update'
      }
    )

@api_view(["GET", "POST", "PATCH"])
@permission_classes([IsAuthenticated])
def match_detail(request, match_id):

  # GET api/tictactoe/match_id/
  if request.method == "GET":
    try:
      match = Match.objects.get(pk=match_id)
    except:
      return Response({"errors": "match not found"}, status=status.HTTP_404_NOT_FOUND)

    match_serializer = MatchSerializer(match)
    result = {"match": match_serializer.data, "history":"new game"}
    history = match.tic_tac_toe_histories.last()

    if history:
      history_serializer = TicTacToeMatchHistorySerializer(history)
      result["history"] = history_serializer.data

    if match.game_status == "":
      # create empty board base on diffculty
      first = match.user_matches.first()
      second = match.user_matches.last()
      board = ""
      if first.diffculty == "normal":
        board = '{"board":[" ", " ", " ", " ", " ", " ", " ", " ", " "]}'
      else:
        board = '{"board":[" ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " "]}'
      # create game_settings base on 
      x = first.user
      o = second.user
      game_settings = '{"X":['+str(x.id)+',"'+x.username+'"],"O":['+str(o.id)+',"'+o.username+'"]}'
      # update match data
      match.game_status = board
      match.game_settings = game_settings
      match.save()
      match_serializer = MatchSerializer(match)
      result["match"] = match_serializer.data
    # logger.info(result)
    return Response(result, status=status.HTTP_200_OK)

  # POST api/tictactoe/match_id/
  if request.method == "POST":
    try:
      match = Match.objects.get(pk=match_id)
    except:
      return Response({"errors": "match not found"}, status=status.HTTP_404_NOT_FOUND)
    
    match.game_status = request.data["game_status"]
    history_data = {"user": request.user.id ,"match": match.id, "player": request.data["player"], "position": request.data["position"]}
    serializer = TicTacToeMatchHistorySerializer(data=history_data)
    if serializer.is_valid():
      serializer.save()
      match.save()
      return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response({"errors": "fail to add history"}, status=status.HTTP_406_NOT_ACCEPTABLE)

  # PATCH api/tictactoe/match_id/
  if request.method == "PATCH":
    try:
      match = Match.objects.get(pk=match_id)
    except:
      return Response({"errors": "match not found"}, status=status.HTTP_404_NOT_FOUND)

    match.user_matches.update(status="finished")
    match.finished = request.data["finished"]
    match.save()
    serializer = MatchSerializer(match)
    return Response(serializer.data, status=status.HTTP_202_ACCEPTED)