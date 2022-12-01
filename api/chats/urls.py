from django.urls import path
from . import views

app_name = 'chats'

urlpatterns = [
    path('', views.chat_list, name='chats'),
    path('<int:id>/', views.chat_detail, name='chat_datail'),
    path('messages/<int:chat_id>', views.message_list, name='messages'),
    path('message_edit/<int:id>', views.message_detail, name='message_edit'),
]