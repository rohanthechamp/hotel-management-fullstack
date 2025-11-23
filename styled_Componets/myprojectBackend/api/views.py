from rest_framework import generics
from rest_framework.permissions import AllowAny, IsAdminUser, IsAuthenticated
from rest_framework.response import Response

from .models import Cabins, Guests, Bookings, Settings
from .serializers import (
    CabinSerializer,
    GuestSerializer,
    BookingWriteSerializer,
    SettingsSerializer,
    MessageSerializer,
)
from django.core.cache import cache
from django.http import JsonResponse
from rest_framework.views import APIView

# ----------------------------------------------------------
# 📌 CABINS
# ----------------------------------------------------------


class CabinCreateListView(generics.ListCreateAPIView):
    """
    GET  /cabins/    -> List all cabins (public)
    POST /cabins/    -> Create a cabin (admin only)
    """

    queryset = Cabins.objects.all()
    serializer_class = CabinSerializer

    def get_permissions(self):
        """Allow public GET, admin-only POST."""
        return [IsAdminUser()] if self.request.method == "POST" else [AllowAny()]


class SingleCabinRetrieveView(generics.RetrieveUpdateDestroyAPIView):
    """
    GET    /cabins/<pk>/  -> Retrieve one cabin (public)
    PUT    /cabins/<pk>/  -> Replace cabin (admin only)
    PATCH  /cabins/<pk>/  -> Partial update (admin only)
    DELETE /cabins/<pk>/  -> Delete cabin (admin only)
    """

    queryset = Cabins.objects.all()
    serializer_class = CabinSerializer

    def get_permissions(self):
        """Public read, admin-only update/delete."""
        return [IsAdminUser()] if self.request.method != "GET" else [AllowAny()]


# ----------------------------------------------------------
# 👤 GUESTS
# ----------------------------------------------------------


class GuestsCreateListView(generics.ListCreateAPIView):
    """
    GET  /guests/    -> List all guests (public)
    POST /guests/    -> Create a guest (admin only)
    """

    queryset = Guests.objects.all()
    serializer_class = GuestSerializer

    def get_permissions(self):
        """Allow public GET, admin-only POST."""
        return [IsAdminUser()] if self.request.method == "POST" else [AllowAny()]


class SingleGuestRetrieveView(generics.RetrieveUpdateDestroyAPIView):
    """
    GET    /guests/<pk>/  -> Retrieve one guest (public)
    PUT    /guests/<pk>/  -> Replace guest (admin only)
    PATCH  /guests/<pk>/  -> Partial update (admin only)
    DELETE /guests/<pk>/  -> Delete guest (admin only)
    """

    queryset = Guests.objects.all()
    serializer_class = GuestSerializer

    def get_permissions(self):
        """Public read, admin-only update/delete."""
        return [IsAdminUser()] if self.request.method != "GET" else [AllowAny()]


# ----------------------------------------------------------
# 📄 BOOKINGS
# ----------------------------------------------------------


class BookingsCreateListView(generics.ListCreateAPIView):
    """
    GET  /bookings/    -> List all bookings (public)
    POST /bookings/    -> Create a booking (admin only)
    """

    queryset = Bookings.objects.prefetch_related("cabin", "guest").all()
    serializer_class = BookingWriteSerializer

    def get_permissions(self):
        """Allow public GET, admin-only POST."""
        return [IsAdminUser()] if self.request.method == "POST" else [AllowAny()]


class SingleBookingRetrieveView(generics.RetrieveUpdateDestroyAPIView):
    """
    GET    /bookings/<pk>/  -> Retrieve one booking (public)
    PUT    /bookings/<pk>/  -> Replace booking (admin only)
    PATCH  /bookings/<pk>/  -> Partial update (admin only)
    DELETE /bookings/<pk>/  -> Delete booking (admin only)
    """

    queryset = Bookings.objects.select_related("cabin", "guest").all()
    serializer_class = BookingWriteSerializer

    def get_permissions(self):
        """Public read, admin-only update/delete."""
        return [IsAdminUser()] if self.request.method != "GET" else [AllowAny()]


# ----------------------------------------------------------
# ⚙️ SETTINGS
# ----------------------------------------------------------


class SettingsCreateListView(generics.ListCreateAPIView):
    """
    GET  /settings/    -> List all settings (public)
    POST /settings/    -> Add a setting (admin only)
    """

    queryset = Settings.objects.all()
    serializer_class = SettingsSerializer

    def get_permissions(self):
        """Allow public GET, admin-only POST."""
        return [IsAdminUser()] if self.request.method == "POST" else [AllowAny()]


class SingleSettingsView(generics.RetrieveUpdateDestroyAPIView):
    """
    GET    /settings/<pk>/  -> Retrieve setting (public)
    PUT    /settings/<pk>/  -> Replace setting (admin only)
    PATCH  /settings/<pk>/  -> Partial update (admin only)
    DELETE /settings/<pk>/  -> Delete setting (admin only)
    """

    queryset = Settings.objects.all()
    serializer_class = SettingsSerializer

    def get_permissions(self):
        """Public read, admin-only update/delete."""
        return [IsAdminUser()] if self.request.method != "GET" else [AllowAny()]


# # * function based views
# def homeView(request):
#     BookingsCount = cache.get_or_set(
#         "bookings_count", lambda: Bookings.objects.count(), timeout=300
#     )

#     data = {"message": f"{BookingsCount} products in DB"}
#     serializer = MessageSerializer(data)

#     def get(self, request):
#         return Response({"message": f"Hello {request.user.username}!"})
#     return JsonResponse({"data": serializer.data})


class HomeView(APIView):

    permission_classes = (IsAuthenticated,)

    def get(self, request):
        BookingsCount = cache.get_or_set(
            "bookings_count", lambda: Bookings.objects.count(), timeout=300
        )

        data = {"count": BookingsCount, "message": f"Hello {request.user.username}!"}

        serializer = MessageSerializer(data)

        return Response(serializer.data)
