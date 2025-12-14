import stat
from warnings import filters
from rest_framework import generics, filters
from rest_framework.permissions import IsAdminUser, IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from django_filters.rest_framework import DjangoFilterBackend
from api.filters import PaidBookings, RecentPaidBookings
from api.pagination import CustomPagination
from .models import Cabins, Guests, Bookings, Settings
from .serializers import (
    CabinSerializer,
    GuestSerializer,
    BookingWriteSerializer,
    SettingsSerializer,
    MessageSerializer,
)
from django.core.cache import cache
from rest_framework.views import APIView


# ----------------------------------------------------------
# *📌 CABINS
# ----------------------------------------------------------


class CabinCreateListView(generics.ListCreateAPIView):
    """
    GET  /cabins/    -> List all cabins (authenticated)
    POST /cabins/    -> Create a cabin (admin only)
    """

    serializer_class = CabinSerializer
    # filterset_class = CabinsFilter
    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter,
    ]
    search_fields = ["=name", "maxCapacity", "regularPrice"]
    ordering_fields = ["name", "maxCapacity", "regularPrice"]
    # ordering = ["id"]  # &default ordering when the data loads
    pagination_class = CustomPagination

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def get_queryset(self):
        queryset = Cabins.objects.all()

        # * Filtering
        discount = self.request.query_params.get("discount")

        if discount == "no-discount":
            queryset = queryset.filter(discount__lt=1)

        if discount == "with-discount":
            queryset = queryset.filter(discount__gte=1)

        return queryset

    # def get_permissions(self):
    #     """Allow Authenticate GET, admin-only POST."PUT", "PATCH", "DELETE"]"""
    #     return (
    #         [IsAdminUser()]
    #         if self.request.method in ["POST", "PUT", "PATCH", "DELETE"]
    #         else [IsAuthenticated()]
    # )


class SingleCabinRetrieveView(generics.RetrieveUpdateDestroyAPIView):
    """
    GET    /cabins/<pk>/  -> Retrieve one cabin (public)
    PUT    /cabins/<pk>/  -> Replace cabin (admin only)
    PATCH  /cabins/<pk>/  -> Partial update (admin only)
    DELETE /cabins/<pk>/  -> Delete cabin (admin only)
    """

    queryset = Cabins.objects.all()
    serializer_class = CabinSerializer

    # def get_permissions(self):
    #     """Public read, admin-only update/delete."""
    #     return (
    #         [IsAuthenticated()] if self.request.method in ["GET"] else [IsAdminUser()]
    #     )


# ----------------------------------------------------------
# *👤 GUESTS
# ----------------------------------------------------------


class GuestsCreateListView(generics.ListCreateAPIView):
    """
    GET  /guests/    -> List all guests (public)
    POST /guests/    -> Create a guest (admin only)
    """

    queryset = Guests.objects.all()
    serializer_class = GuestSerializer
    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter,
    ]
    search_fields = ["=fullName", "nationality"]
    ordering_fields = ["created_at"]
    ordering = ["id"]
    # pagination_class=PageNumberPagination

    def get_permissions(self):
        """Allow public GET, admin-only POST."""
        return [IsAdminUser()] if self.request.method == "POST" else [IsAuthenticated()]


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
        return [IsAuthenticated()] if self.request.method != "GET" else [IsAdminUser()]


# ----------------------------------------------------------
# *📄 BOOKINGS
# ----------------------------------------------------------


class BookingsCreateListView(generics.ListCreateAPIView):
    """
    GET  /bookings/    -> List all bookings (public)
    POST /bookings/    -> Create a booking (admin only)
    """

    queryset = Bookings.objects.prefetch_related("cabin", "guest").all()
    # filterset_class = BookingFilter
    serializer_class = BookingWriteSerializer
    filter_backends = [
        DjangoFilterBackend,
        filters.OrderingFilter,
    ]  # PaidBookings]
    ordering_fields = ["startDate", "totalPrice"]
    ordering = ["id"]

    pagination_class = CustomPagination

    def get_permissions(self):
        """Allow public GET, admin-only POST."""
        return [IsAdminUser()] if self.request.method == "POST" else [IsAuthenticated()]

    def get_queryset(self):
        queryset = self.queryset

        # * Filtering
        status = self.request.query_params.get("status")
        if status:

            mapping = {
                "checked-out": "checked-out",
                "checked-in": "checked-in",
                "unconfirmed": "unconfirmed",
            }

            value = mapping[status]
            # print(value)
            queryset = queryset.filter(status=value)

        return queryset


class SingleBookingRetrieveView(generics.RetrieveUpdateDestroyAPIView):
    """
    GET    /bookings/<pk>/  -> Retrieve one booking (public)
    PUT    /bookings/<pk>/  -> Replace booking (admin only)
    PATCH  /bookings/<pk>/  -> Partial update (admin only)
    DELETE /bookings/<pk>/  -> Delete booking (admin only)
    """

    queryset = Bookings.objects.select_related("cabin", "guest").all()
    serializer_class = BookingWriteSerializer

    # def get_permissions(self):
    #     """Public read, admin-only update/delete."""
    #     return [IsAdminUser()] if self.request.method == "POST" else [IsAuthenticated()]


# ----------------------------------------------------------
# *⚙️ SETTINGS
# ----------------------------------------------------------


class SettingsCreateListView(generics.ListCreateAPIView):
    """
    GET  /settings/    -> List all settings (public)
    POST /settings/    -> Add a setting (admin only)

    """

    # permission_classes = (IsAuthenticated,)

    queryset = Settings.objects.all()
    serializer_class = SettingsSerializer

    def get_permissions(self):
        """Allow public GET, admin-only POST."""
        return [IsAdminUser()] if self.request.method == "POST" else [IsAuthenticated()]


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
        return [IsAdminUser()] if self.request.method != "GET" else [IsAuthenticated()]


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

        data = {"count": BookingsCount, "message": f"Hello {request.user.name}!"}

        serializer = MessageSerializer(data)

        return Response(serializer.data)

    def get_queryset(self):
        return super().get_queryset()
