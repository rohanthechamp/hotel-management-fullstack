from warnings import filters
from rest_framework import generics, filters
from rest_framework.permissions import (
    IsAuthenticated,
)

from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend


from api.pagination import CustomPagination
from api.permission import (
    AllBookingsPermission,
    AllCabinPermission,
    AllSettingsPermission,

    SingleCabinPermission,
    CheckINBookingPermission,
    CheckOUTBookingPermission,
    CancelBookingPermission,
    SingleSettingPermission,
)
from api.utils.helpers import (
    MAPPING,
    decide_ttl,
)
from core.utils.caching import get_cached_data, user_cache_key
from api.selectors import generate_cache_key

from api.services import (
    get_daily_revenue_last_x_days,
    get_eligible_bookings,
    get_stay_durations,
    get_today_activities,
    validate_user,
)


from .models import Cabins, Bookings, Settings
from .serializers import (
    BookingReadSerializer,
    CabinSerializer,
    BookingWriteSerializer,
    SettingsSerializer,
    MessageSerializer,
)

from rest_framework.views import APIView
from django.core.cache import cache

# ----------------------------------------------------------
# *📌 CABINS
# ----------------------------------------------------------


class CabinCreateListView(generics.ListCreateAPIView):
    """
    GET  /cabins/    -> List all cabins (authenticated)
    POST /cabins/    -> Create a cabin (admin only)
    """

    permission_classes = [AllCabinPermission]
    # permission_classes = [AllowAny]
    serializer_class = CabinSerializer
    # filterset_class = CabinsFilter
    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter,
    ]
    search_fields = ["=name", "maxCapacity", "regularPrice"]
    ordering_fields = ["name", "maxCapacity", "regularPrice"]
    ordering = ["id"]  # &default ordering when the data loads
    pagination_class = CustomPagination

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def get_queryset(self):

        queryset = (
            Cabins.objects.filter(hotel_id=self.request.user.hotel.id)
            .select_related("hotel", "user")
            .all()
        )

        # * Filtering
        discount = self.request.query_params.get("discount")

        if discount == "no-discount":
            queryset = queryset.filter(discount__lt=1)

        if discount == "with-discount":
            queryset = queryset.filter(discount__gte=1)

        return queryset

    def list(self, request, *args, **kwargs):
        cache_key = generate_cache_key(request)

        cached_data = cache.get(cache_key)
        if cached_data:
            print("⚡ CACHE HIT")
            return Response(cached_data)

        print("🐢 CACHE MISS")

        queryset = self.filter_queryset(self.get_queryset())

        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            response = self.get_paginated_response(serializer.data)

            cache.set(cache_key, response.data, timeout=60 * 5)
            return response

        serializer = self.get_serializer(queryset, many=True)

        cache.set(cache_key, serializer.data, timeout=60 * 60)

        return Response(serializer.data)


class SingleCabinRetrieveView(generics.RetrieveUpdateDestroyAPIView):
    """
    GET    /cabins/<pk>/  -> Retrieve one cabin (public) # ! we have not designed feature
    PUT    /cabins/<pk>/  -> Replace cabin (admin only)
    PATCH  /cabins/<pk>/  -> Partial update (admin only)
    DELETE /cabins/<pk>/  -> Delete cabin (admin only)
    """

    permission_classes = [SingleCabinPermission]
    # permission_classes = [AllowAny]
    queryset = Cabins.objects.all()
    serializer_class = CabinSerializer


class BookingsCreateListView(generics.ListAPIView):

    permission_classes = [IsAuthenticated]
    serializer_class = BookingWriteSerializer
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    ordering_fields = ["startDate", "totalPrice"]
    ordering = ["id"]
    pagination_class = CustomPagination

    def get_queryset(self):
        queryset = Bookings.objects.filter(hotel=self.request.user.hotel)

        status = self.request.query_params.get("status")
        if status:
            mapping = {
                "checked-out": "checked-out",
                "checked-in": "checked-in",
                "unconfirmed": "unconfirmed",
            }
            queryset = queryset.filter(status=mapping[status])

        return queryset


class SingleBookingRetrieveView(generics.RetrieveUpdateDestroyAPIView):
    """
    GET    /bookings/<pk>/  -> Retrieve one booking (public)
    PUT    /bookings/<pk>/  -> Replace booking (admin only)
    PATCH  /bookings/<pk>/  -> Partial update (admin only)
    DELETE /bookings/<pk>/  -> Delete booking (admin only)

    #^ single booking -  get,                       -put/patch, post, delete
    #*                -  authenticated/staff user   admin only...
    """

    permission_classes = [
        AllBookingsPermission,
        CheckINBookingPermission,
        CheckOUTBookingPermission,
        CancelBookingPermission
    ]

    

    queryset = Bookings.objects.select_related("cabin", "guest").all()
    serializer_class = BookingReadSerializer


# ----------------------------------------------------------
# *⚙️ SETTINGS
# ----------------------------------------------------------


class SettingsCreateListView(generics.ListCreateAPIView):
    """
    GET  /settings/    -> List all settings (public)
    POST /settings/    -> Add a setting (admin only)
    #^ all settings -  get     - post
    #*              -  public  - admin only...
    """

    permission_classes = [AllSettingsPermission]

    queryset = Settings.objects.all()
    serializer_class = SettingsSerializer

    def get_queryset(self):
        user = self.request.user
        data = Settings.objects.filter(hotel=user.hotel)
        print("data as queryset", data)
        return data

    def list(self, request, *args, **kwargs):

        cache_key = f"{request.user.hotel.id}_hotel_settings"

        data = get_cached_data(
            cache_key,
            fetch_func=lambda: self.get_serializer(self.get_queryset().first()).data,
            timeout=60 * 60 * 30,
        )

        return Response(data)


class SingleSettingsView(generics.RetrieveUpdateDestroyAPIView):
    """
    GET    /settings/<pk>/  -> Retrieve setting (public)
    PUT    /settings/<pk>/  -> Replace setting (admin only)
    PATCH  /settings/<pk>/  -> Partial update (admin only)
    DELETE /settings/<pk>/  -> Delete setting (admin only)

    #^ single booking -  get,                       -put/patch, post, delete
    #*                -  authenticated/staff user   admin only...

    """

    permission_classes = [AllSettingsPermission, SingleSettingPermission]

    queryset = Settings.objects.all()
    serializer_class = SettingsSerializer


class BookingReadView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):

        try:
            booking_id_raw = request.query_params.get("bookingID")
            bookingID = int(booking_id_raw)
        except (ValueError, TypeError):
            return Response({"detail": "Invalid ID format"}, status=400)

        cache_key = f"BookingReadView_{bookingID}"
        cached_data = cache.get(cache_key)
        if cached_data:
            return Response(cached_data)

        booking_obj = Bookings.objects.filter(id=bookingID).first()
        if not booking_obj:
            return Response({"detail": "Not found"}, status=404)

        serializer = BookingReadSerializer(booking_obj)
        cache.set(cache_key, serializer.data, timeout=300)

        return Response(serializer.data)


# &DashBoard Data


class GetBookingsLastXDaysView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        days = int(request.query_params.get("filterValue", 7))
        # print("days", days)
        prefix = f"dashboard__LastxDays_{days}"
        # print("Request.user.hotel.id", request.user)
        cache_key = user_cache_key(
            prefix, unique_id=request.user.id, hotel_id=request.user.hotel.id
        )

        ttlValue = decide_ttl(days)
        data = get_cached_data(
            cache_key,
            fetch_func=lambda: get_eligible_bookings(days, request.user.hotel.id),
            timeout=ttlValue,
        )

        return Response(data)


class GetTodayActivitiesView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):

        cache_key = user_cache_key(
            "dashboard__todayActivities",
            unique_id=request.user.id,
            hotel_id=request.user.hotel.id,
        )

        data = get_cached_data(
            cache_key, lambda: get_today_activities(request.user.hotel.id), 3600
        )

        return Response(data)


class StayDurationView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        days = int(request.query_params.get("filterValue", 7))

        prefix = f"dashboard__stats_Duration{days}"
        print("Request.user.hotel.id", request.user.hotel.id)
        cache_key = user_cache_key(
            prefix, unique_id=request.user.id, hotel_id=request.user.hotel.id, version=1
        )
        ttlValue = decide_ttl(days)
        data = get_cached_data(
            cache_key,
            lambda: get_stay_durations(days, request.user.hotel.id),
            timeout=ttlValue,
        )

        return Response(data)


class DailyRevenueLastXDaysView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        days = days = int(request.query_params.get("filterValue", 7))

        prefix = f"dashboard__dailyRevenueLastXDays_{days}"
        cache_key = user_cache_key(
            prefix, unique_id=request.user.id, hotel_id=request.user.hotel
        )

        ttlValue = decide_ttl(days)
        result = get_cached_data(
            cache_key,
            lambda: get_daily_revenue_last_x_days(days, request.user.hotel.id),
            ttlValue,
        )

        return Response(result)


class HomeView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):
        BookingsCount = cache.get_or_set(
            "bookings_count", lambda: Bookings.objects.count(), timeout=300
        )

        data = {"count": BookingsCount, "message": f"Hello {request.user.name}!"}

        serializer = MessageSerializer(data)

        return Response(serializer.data)
