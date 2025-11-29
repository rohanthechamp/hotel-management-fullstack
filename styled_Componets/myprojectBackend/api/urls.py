from django.urls import path
from .views import (
    CabinCreateListView,
    HomeView,
    SingleCabinRetrieveView,
    GuestsCreateListView,
    SingleGuestRetrieveView,
    BookingsCreateListView,
    SingleBookingRetrieveView,
    SettingsCreateListView,
    SingleSettingsView,
    HomeView,
    RegisterUserView,
    # LoginUserView
    EmailTokenObtainPairView,
)
from rest_framework_simplejwt.views import (
    TokenRefreshView,
    TokenVerifyView,
)

urlpatterns = [
    path("register/", RegisterUserView.as_view()),
    # path("login/", LoginUserView.as_view()),
    path("cabins/", CabinCreateListView.as_view()),
    path("cabins/<int:pk>/", SingleCabinRetrieveView.as_view()),
    path("guests/", GuestsCreateListView.as_view()),
    path("guests/<int:pk>/", SingleGuestRetrieveView.as_view()),
    path("bookings/", BookingsCreateListView.as_view()),
    path("bookings/<int:pk>/", SingleBookingRetrieveView.as_view()),
    path("settings/", SettingsCreateListView.as_view()),
    path("settings/<int:pk>/", SingleSettingsView.as_view()),
    # custom views
    path("", HomeView.as_view(), name="home"),
    # Custom login using email
    path("token/", EmailTokenObtainPairView.as_view(), name="token_obtain_pair"),
    # JWT Refresh
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    # Verify (optional)
    path("token/verify/", TokenVerifyView.as_view(), name="token_verify"),
]
# ?search=Lake

# ?ordering=-maxCapacity

# ?page_size=20&page=3
