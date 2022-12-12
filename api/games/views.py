from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated

from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

from users.models import MyUser as User
from .models import Game, Match, UserMatch
from .serializers import GameSerializer, MatchSerializer
from match_history_tic_tac_toe.serializers import TicTacToeMatchHistorySerializer

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

# Game Controllers
@api_view(["GET"])
@permission_classes([AllowAny])
def game_list(request):

  # GET api/games/
  if request.method == "GET":
    games = Game.objects.all()
    serializer = GameSerializer(games, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def game_detail(request, id):

  try:
    game = Game.objects.get(pk=id)
  except:
    return Response({"errors": "game not found"}, status=status.HTTP_404_NOT_FOUND)

  # GET api/games/game_id/
  if request.method == "GET":
    serializer = GameSerializer(game)
    return Response(serializer.data, status=status.HTTP_200_OK)

# ==========================================================================================
# Match Controllers
@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
def match_list(request, game_id):

  # GET api/games/game_id/matches/
  if request.method == "GET":
    matches = request.user.match_set.filter(game = game_id)
    serializer = MatchSerializer(matches, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

  # POST api/games/game_id/matches/
  if request.method == "POST":
    matchData = {"game": game_id}
    serializer = MatchSerializer(data=matchData, partial=True)
    if serializer.is_valid():
      match = serializer.save()

      #if the match is created, create the UserMatch relations
      UserMatch.objects.create(user=request.user, 
                              friend_id=request.data["friend_id"], 
                              invited_by=request.user.id, 
                              match=match,
                              diffculty=request.data["diffculty"])
      friend = User.objects.get(pk=request.data["friend_id"])
      UserMatch.objects.create(user=friend, 
                              friend_id=request.user.id, 
                              invited_by=request.user.id, 
                              match=match,
                              diffculty=request.data["diffculty"])

      return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response({"errors": "Fail to create match."}, status=status.HTTP_405_METHOD_NOT_ALLOWED)

@api_view(["GET", "POST", "PATCH"])
@permission_classes([IsAuthenticated])
def match_detail(request, game_id, match_id):

  # GET api/games/game_id/matches/match_id/
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

  # POST api/games/game_id/matches/match_id/
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

  # PATCH api/games/game_id/matches/match_id/
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

# ==========================================================================================
# UserMatch Controllers

@api_view(["PATCH"])
@permission_classes([IsAuthenticated])
def user_match_list(request, game_id, match_id):

  # PATCH api/games/game_id/match_id/user_matches/
  if request.method == "PATCH":
    UserMatch.objects.filter(match=match_id).update(status=request.data["status"])
    user_matches = UserMatch.objects.filter(match=match_id)
    for um in user_matches:
      update_match_status_through_user_channel(um.user.username)
    return Response({"messages": "updated"}, status=status.HTTP_202_ACCEPTED)