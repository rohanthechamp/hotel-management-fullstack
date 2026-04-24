from django.urls import path
from .views import (
    CreateHotelView,
    LoginUserView,
    LogoutView,
    GetCurrentDetails,
    HotelInviteListView,
    UpdateCurrentUserView,
    UpdateCurrentUserPasswordView,
    StaffRegisterView,
    AdminRegisterView,
    SendInviteEmailView,
    ValidateInviteView,
)
from rest_framework_simplejwt.views import (
    TokenRefreshView,
    TokenVerifyView,
)

urlpatterns = [
    # path("register/", RegisterUserView.as_view()),
    path("login/", LoginUserView.as_view()),
    path("logout/", LogoutView.as_view()),
    path("user/me/", GetCurrentDetails.as_view()),
    path("user/me/update/profile", UpdateCurrentUserView.as_view()),
    path("user/me/update/password", UpdateCurrentUserPasswordView.as_view()),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    # Verify (optional)
    path("token/verify/", TokenVerifyView.as_view(), name="token_verify"),
    path("auth/register/admin/", AdminRegisterView.as_view()),
    path("auth/register/staff/", StaffRegisterView.as_view()),
    path("auth/invite/send/", SendInviteEmailView.as_view()),
    path("invite/validate/", ValidateInviteView.as_view(), name="validate-invite"),
    path("admin/hotel/", CreateHotelView.as_view(), name="admin-create-hotel"),
    path("hotel/invites/", HotelInviteListView.as_view(), name="hotel-invites-list"),
]
