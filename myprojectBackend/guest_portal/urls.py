from django.urls import path
from .views import (
    BookingMinimalView,
    CabinBookedDatesView,
    CustomerCabinListView,
    CustomerSingleCabinView,
    CustomerBookingCreateView,
    CustomerBookingListView,
    CustomerSingleBookingView,
    CustomerSettingsView,
    GoogleOAuthJWTView,
    GuestBookingsView,
    GuestsCreateListView,
    RefreshAccessTokenView,
    SingleGuestRetrieveView,
)

urlpatterns = [
    # CABINS (PUBLIC)
    path("cabins/", CustomerCabinListView.as_view()),
    path("cabins/<int:pk>/", CustomerSingleCabinView.as_view()),
    # BOOKINGS (GUEST)
    path("bookings/", CustomerBookingListView.as_view()),  # get my bookings
    path("bookings/create/", CustomerBookingCreateView.as_view()),
    path("bookings/<int:pk>/", CustomerSingleBookingView.as_view()),
    path("bookings/<int:id>/minimal/", BookingMinimalView.as_view()),
    # SETTINGS
    path("settings/", CustomerSettingsView.as_view()),
    # GUEST PROFILE / DATA
    path("guest/bookings/<int:guest_id>/", GuestBookingsView.as_view()),
    path("guest/<int:pk>/", SingleGuestRetrieveView.as_view()),
    # -----------------------------
    # GUEST (CREATE + LOOKUP)
    # -----------------------------
    path("guests/", GuestsCreateListView.as_view()),
    # -----------------------------
    # AUTH (GOOGLE → JWT)
    # -----------------------------
    path("auth/google/", GoogleOAuthJWTView.as_view()),
    # -----------------------------
    # TOKEN REFRESH 
    # -----------------------------
    path("auth/refresh/", RefreshAccessTokenView.as_view()),
    # -------------------------
    path(
        "cabins/<int:cabin_id>/booked-dates/",
        CabinBookedDatesView.as_view(),
    ),
]
