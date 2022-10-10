from django.urls import path
from users.views import UserCreate, UserUpdate, BlacklistTokenUpdateView

app_name = "users"

urlpatterns = [
    path("register/", UserCreate.as_view(), name="user_create"),
    path("update/<int:id>", UserUpdate.as_view(), name="user_update"),
    path('logout/blacklist/', BlacklistTokenUpdateView.as_view(), name='blacklist')
]