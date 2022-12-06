from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny

from .models import Game, Match
from .serializers import GameSerializer, MatchSerializer

# Create your views here.

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
@permission_classes([AllowAny])
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
@api_view(["GET"])
@permission_classes([AllowAny])
def match_list(request, game_id):

  # GET api/games/matches
  if request.method == "GET":
    matches = request.user.match_set.filter(game = game_id)
    serializer = MatchSerializer(matches, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)