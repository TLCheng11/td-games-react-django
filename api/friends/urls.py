from django.urls import path
from .views import FriendList

app_name = 'friends'

urlpatterns = [
    path('', FriendList.as_view({'get': 'list', 'post': 'create'}), name='friend-list'),
    path('<int:pk>/', FriendList.as_view({'get': 'retrieve', 'patch': 'partial_update', 'delete': 'destroy'}), name='friend-pk'),
]