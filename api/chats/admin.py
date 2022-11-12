from django.contrib import admin
from .models import Chat, UserChat, Message

# Register your models here.
admin.site.register(Chat)
admin.site.register(UserChat)
admin.site.register(Message)