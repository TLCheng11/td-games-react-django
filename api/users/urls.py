from django.urls import path
from users.views import UserCreate, BlacklistTokenUpdateView

app_name = "users"

urlpatterns = [
    path("register/", UserCreate.as_view(), name="user_create"),
    path('logout/blacklist/', BlacklistTokenUpdateView.as_view(), name='blacklist')
]