from django.urls import path
from .views import FriendList

app_name = 'friends'

urlpatterns = [
    path('', FriendList.as_view({'get': 'list', 'post': 'create'}), name='friend-list'),
    path('<int:pk>/', FriendList.as_view({'get': 'retrieve', 'delete': 'destroy'}), name='friend-pk'),
    path('<int:pk>/<str:method>/', FriendList.as_view({'patch': 'partial_update'}), name='friend-update'),
]