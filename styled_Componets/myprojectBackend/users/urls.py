from django.urls import path
from .views import RegisterUserView, LoginUserView, LogoutView, GetCurrentDetails,UpdateCurrentUserView,UpdateCurrentUserPasswordView
from rest_framework_simplejwt.views import (
    TokenRefreshView,
    TokenVerifyView,
    
)

urlpatterns = [
    path("register/", RegisterUserView.as_view()),
    path("login/", LoginUserView.as_view()),
    path("logout/", LogoutView.as_view()),
    path("user/me/", GetCurrentDetails.as_view()),
    path("user/me/update/profile", UpdateCurrentUserView.as_view()),
    path("user/me/update/password", UpdateCurrentUserPasswordView.as_view()),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    # Verify (optional)
    path("token/verify/", TokenVerifyView.as_view(), name="token_verify"),
]
