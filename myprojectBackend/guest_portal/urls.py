from django.urls import path

from .views import (
    CustomerCabinListView,
    CustomerSingleCabinView,
    CustomerBookingCreateView,
    CustomerBookingListView,
    CustomerSingleBookingView,
    CustomerSettingsView,
    GuestBookingsView,
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
    # SETTINGS
    path("settings/", CustomerSettingsView.as_view()),
    # GUEST PROFILE / DATA
    path("guest/bookings/<int:guest_id>/", GuestBookingsView.as_view()),
    path("guest/<int:pk>/", SingleGuestRetrieveView.as_view()),
]
