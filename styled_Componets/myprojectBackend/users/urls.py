from django.urls import path
from .views import RegisterUserView, LoginUserView
from rest_framework_simplejwt.views import (
    TokenRefreshView,
    TokenVerifyView,
)

urlpatterns = [
    path("register/", RegisterUserView.as_view()),
    path("login/", LoginUserView.as_view()),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    # Verify (optional)
    path("token/verify/", TokenVerifyView.as_view(), name="token_verify"),
]
