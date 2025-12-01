from django.urls import path
from .views import RegisterUserView, LoginUserView,LogoutView,CookieTokenRefreshView
# from rest_framework_simplejwt.views import (
#     # TokenRefreshView,
#     TokenVerifyView,
# )

urlpatterns = [
    path("register/", RegisterUserView.as_view()),
    path("login/", LoginUserView.as_view()),
    path("logout/", LogoutView.as_view()),
    path(
        "token/refresh/", CookieTokenRefreshView.as_view(), name="token_refresh_cookie"
    ),
    # Verify (optional)
    # path("token/verify/", TokenVerifyView.as_view(), name="token_verify"),
]
