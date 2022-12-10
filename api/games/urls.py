from django.urls import path
from . import views

app_name = 'games'

urlpatterns = [
    path('', views.game_list, name='games'),
    path('<int:id>/', views.game_detail, name='game_detail'),
    path('<int:game_id>/matches/', views.match_list, name='matches'),
    path('<int:game_id>/<int:match_id>/', views.user_match_list, name='user_matches'),
]