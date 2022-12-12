from django.urls import path
from . import views

app_name = 'match_history_tic_tac_toe'

urlpatterns = [
    path('<int:match_id>/', views.match_detail, name='match_detail')
]