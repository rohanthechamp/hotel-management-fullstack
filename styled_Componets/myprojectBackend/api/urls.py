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
    )

    urlpatterns = [
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
    ]
    # ?search=Lake

    # ?ordering=-maxCapacity

    # ?page_size=20&page=3