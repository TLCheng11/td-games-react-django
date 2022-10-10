from django.urls import path
from users.views import UserCreate, UserLogin, BlacklistTokenUpdateView

app_name = "users"

urlpatterns = [
    path("register/", UserCreate.as_view(), name="user_create"),
    path("login/<str:email>", UserLogin.as_view(), name="user_login"),
    path('logout/blacklist/', BlacklistTokenUpdateView.as_view(), name='blacklist')
]