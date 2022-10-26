from django.urls import path
from .views import FriendList

app_name = 'friends'

urlpatterns = [
    path('<int:pk>/', FriendList.as_view({'get': 'retrieve'}), name='friend-retrieve'),
    path('', FriendList.as_view({'get': 'list', 'post': 'create'}), name='friend-list'),
]