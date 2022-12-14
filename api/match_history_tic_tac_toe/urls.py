from django.urls import path
from . import views

app_name = 'match_history_tic_tac_toe'

urlpatterns = [
    path('<int:match_id>/', views.match_detail, name='tic_tac_toe_match_detail'),
    path('<int:match_id>/histories/', views.history_list, name='tic_tac_toe_match_histories'),
]