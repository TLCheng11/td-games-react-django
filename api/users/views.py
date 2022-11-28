from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken

from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer

from users.serializers import UserSerializer
from users.models import MyUser

import logging
logger = logging.getLogger('django')

# Create your views here.

class UserCreate(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            newUser = serializer.save()
            if newUser:
                return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserLogin(APIView):
    permission_classes = [IsAuthenticated]

    def find_user(self, email):
        try:
            user = MyUser.objects.get(email=email)
        except MyUser.DoesNotExist:
            return False
        return user

    def patch(self, request, email):
        user = self.find_user(email)
        if not user:
            return Response(status=status.HTTP_404_NOT_FOUND)
        serializer = UserSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            
            friends = MyUser.objects.filter(friend__user=user.id, friend__status="accepted")
            for friend in friends:
                channel_layer = get_channel_layer()
                room_group_name = 'user_%s' % friend.username
                async_to_sync(channel_layer.group_send)(
                    room_group_name, 
                        {
                            'type': 'friend_login_status_update',
                            'username': user.username,
                            'is_login': request.data['is_login']
                        }
                    )

            return Response(serializer.data, status=status.HTTP_202_ACCEPTED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class BlacklistTokenUpdateView(APIView):
    permission_classes = [AllowAny]
    authentication_classes = ()

    def post(self, request):
        try:
            refresh_token = request.data["refresh_token"]
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response(status=status.HTTP_205_RESET_CONTENT)
        except Exception as e:
            return Response(status=status.HTTP_400_BAD_REQUEST)