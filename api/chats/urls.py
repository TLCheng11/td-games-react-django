from django.urls import path
from . import views

app_name = 'chats'

urlpatterns = [
    path('', views.chat_list, name='chats'),
    path('<int:pk>/', views.chat_detail, name='chat_datail')
]