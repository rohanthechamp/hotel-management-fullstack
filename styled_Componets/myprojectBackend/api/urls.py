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
    GetBookingsLastXDaysView,
    GetTodayActivitiesView,
    StayDurationView,
    BookingReadView,
    DailyRevenueLastXDaysView,
    CabinBookedDatesView,
)

urlpatterns = [
    path("cabins/", CabinCreateListView.as_view()),
    path("cabins/<int:pk>/", SingleCabinRetrieveView.as_view()),
    path("guests/", GuestsCreateListView.as_view()),
    path("guests/<int:pk>/", SingleGuestRetrieveView.as_view()),
    path("bookings/", BookingsCreateListView.as_view()),
    path("bookings/<int:pk>/", SingleBookingRetrieveView.as_view()),
    path("bookings/read/", BookingReadView.as_view()),
    path("settings/", SettingsCreateListView.as_view()),
    path("settings/<int:pk>/", SingleSettingsView.as_view()),
    # custom views
    path("", HomeView.as_view(), name="home"),
    # dashboard data
    path("dashboard/bookings/", GetBookingsLastXDaysView.as_view()),
    path("dashboard/activities/today-summary/", GetTodayActivitiesView.as_view()),
    path("dashboard/activities/stay-durations/", StayDurationView.as_view()),
    path("dashboard/revenue/daily/", DailyRevenueLastXDaysView.as_view()),
    path(
        "cabins/<int:cabin_id>/booked-dates/",
        CabinBookedDatesView.as_view(),
        name="cabin-booked-dates",
    ),
]
