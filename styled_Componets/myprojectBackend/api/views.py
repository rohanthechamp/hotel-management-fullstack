from datetime import timedelta
import hashlib
from http import server
from django.db.models import Sum
from django.db.models import Q
from django.db.models.functions import TruncDate
from django.utils import timezone
from warnings import filters
from rest_framework import generics, filters
from rest_framework.permissions import (
    IsAdminUser,
    IsAuthenticated,
    IsAuthenticatedOrReadOnly,
    AllowAny,
)
from django.db import transaction
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from api.pagination import CustomPagination
from api.permission import (
    AllBookingsPermission,
    AllCabinPermission,
    AllGuestsPermission,
    AllSettingsPermission,
    SingleCabinPermission,
    CheckINBookingPermission,
    CheckOUTBookingPermission,
    CancelBookingPermission,
    SingleGuestPermission,
    SingleSettingPermission,
)
from api.utils.helpers import BUCKETS, decide_ttl, user_cache_key
from .models import Cabins, Guests, Bookings, Hotel, Settings
from .serializers import (
    BookingReadSerializer,
    CabinSerializer,
    GetBookingsLastXDaysSerializer,
    GuestAllBookingSerializer,
    GuestSerializer,
    BookingWriteSerializer,
    SettingsSerializer,
    MessageSerializer,
    TodayActivitySerializer,
)
from django.core.cache import cache
from rest_framework.views import APIView
from django.db.models import Sum, Count
from django.utils import timezone
from django.core.cache import cache
from rest_framework.exceptions import ValidationError, PermissionDenied

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

    def generate_cache_key(self, request):
        full_path = request.get_full_path()
        hashed = hashlib.md5(full_path.encode()).hexdigest()

        version = cache.get("cabins_version", 1)

        return f"cabins:{version}:{hashed}"

    def list(self, request, *args, **kwargs):
        cache_key = self.generate_cache_key(request)

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


# ----------------------------------------------------------
# *👤 GUESTS
# ----------------------------------------------------------
class GuestBookingsView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, guest_id):

        version_key = f"guest_bookings_version:{guest_id}"
        version = cache.get(version_key, 1)

        cache_key = f"guest_bookings:{guest_id}:{version}"

        cached = cache.get(cache_key)
        if cached:
            return Response(cached)

        bookings = list(
            Bookings.objects.filter(guest_id=guest_id)
            .select_related("cabin")
            .values(
                "id",
                "guest_id",
                "startDate",
                "endDate",
                "numNights",
                "totalPrice",
                "numGuests",
                "status",
                "created_at",
                "cabin__name",
                "cabin__image",
            )
        )

        cache.set(cache_key, bookings, timeout=60 * 60)

        return Response(bookings)


class GuestsCreateListView(generics.ListCreateAPIView):

    permission_classes = [AllowAny]
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

    def list(self, request, *args, **kwargs):
        email = request.query_params.get("email")
        if email:
            try:
                guest = Guests.objects.get(email__iexact=email)
                serializer = self.get_serializer(guest)
                return Response(serializer.data)
            except Guests.DoesNotExist:
                return Response({"detail": "Not found."}, status=404)
        return super().list(request, *args, **kwargs)


class SingleGuestRetrieveView(generics.RetrieveUpdateDestroyAPIView):

    permission_classes = [AllGuestsPermission, SingleGuestPermission]
    # permission_classes = [AllowAny]

    queryset = Guests.objects.all()
    serializer_class = GuestSerializer


# ----------------------------------------------------------
# *📄 BOOKINGS
# ----------------------------------------------------------


class BookingsCreateListView(generics.ListCreateAPIView):
    """
    GET  /bookings/    -> List all bookings (public)
    POST /bookings/    -> Create a booking (admin only)
    #^ all bookings -  get    -   post
    #*           -  public -   authenticated/staff user
    """

    permission_classes = [AllBookingsPermission]
    # permission_classes = [AllowAny]

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

    # def get_permissions(self):
    #     """Allow public GET, admin-only POST."""
    #     return [IsAdminUser()] if self.request.method == "POST" else [IsAuthenticated()]

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

    def perform_create(self, serializer):

        with transaction.atomic():

            cabin_id = self.request.data["cabin"]

            # Locking the cabin row
            cabin = Cabins.objects.select_for_update().get(id=cabin_id)

            start_date = serializer.validated_data["startDate"]
            end_date = serializer.validated_data["endDate"]
            num_nights = serializer.validated_data["numNights"]
            extras_price = serializer.validated_data.get("extrasPrice", 0)

            # Check overlapping bookings
            overlapping_booking = Bookings.objects.filter(
                cabin_id=cabin_id,
                status__in=["checked-in", "unconfirmed"],
                startDate__lt=end_date,
                endDate__gt=start_date,
            ).exists()

            if overlapping_booking:
                raise ValidationError("Cabin already booked for these dates.")

            # -------- PRICE CALCULATION --------
            base_price = cabin.regularPrice - cabin.discount
            total_price = (base_price * num_nights) + extras_price
            # -----------------------------------

            hotel = Hotel.objects.first()

            serializer.save(
                hotel=hotel,
                totalPrice=total_price,
                cabinPrice=cabin.regularPrice,
            )


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
        CancelBookingPermission,
    ]

    # permission_classes = [AllowAny]

    queryset = Bookings.objects.select_related("cabin", "guest").all()
    serializer_class = BookingReadSerializer

    def perform_destroy(self, instance):
        incoming_guest_id = self.request.query_params.get("guestId")
        actual_guest_id = instance.guest_id

        if not incoming_guest_id or int(incoming_guest_id) != actual_guest_id:

            raise PermissionDenied("Identity Mismatch: You do not own this resource.")

        return super().perform_destroy(instance)


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
        hotel = request.user.hotel
        cache_key = f"{hotel.id}_hotel_settings"

        cached_data = cache.get(cache_key)
        if cached_data is not None:
            return Response(cached_data)

        instance = self.get_queryset().first()
        serializer = self.get_serializer(instance)

        cache.set(cache_key, serializer.data, 60 * 60 * 30)
        return Response(serializer.data)


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
class BookingReadView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):

        try:
            booking_id_raw = request.query_params.get("bookingID", 90)
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
        cache.set(cache_key, serializer.data, timeout=300)  # ५ मिनिटे

        return Response(serializer.data)


class BookingMinimalView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, id):
        booking_id = id

        if not booking_id:
            return Response({"error": "bookingID is required"}, status=400)

        try:
            booking_id = int(booking_id)
        except ValueError:
            return Response({"error": "Invalid bookingID"}, status=400)

        data = (
            Bookings.objects.filter(id=booking_id)
            .values("observations", "numGuests", "cabin__maxCapacity")
            .first()
        )

        if not data:
            return Response({"error": "Booking not found"}, status=404)

        return Response(data)


class CabinBookedDatesView(APIView):
    """
    GET /cabins/<cabin_id>/booked-dates/
    Returns all booked date ranges for a specific cabin
    """

    permission_classes = [AllowAny]

    def get(self, request, cabin_id):

        cache_key = f"cabinBookedDates_{cabin_id}"  # prefix invalidate
        cached = cache.get(cache_key)
        if cached:
            return Response(list(cached))

        bookings = Bookings.objects.filter(cabin_id=cabin_id).values(
            "startDate", "endDate"
        )
        cache.set(cache_key, bookings, 60 * 10)
        return Response(list(bookings))


# &DashBoard Data


class GetBookingsLastXDaysView(APIView):
    permission_classes = [IsAuthenticated]
    # permission_classes = [AllowAny]

    def get(self, request):
        days = int(request.query_params.get("filterValue", 7))
        print("days", days)
        prefix = f"dashboard__LastxDays_{days}"
        print("Request.user.hotel.id", request.user)
        cache_key = user_cache_key(prefix, hotel_id=request.user.hotel.id, version=1)

        cached = cache.get(cache_key)
        if cached:
            return Response(cached)

        today = timezone.now()
        cutoff = today - timezone.timedelta(days=days)

        date_q = Q(created_at__gte=cutoff) & Q(created_at__lte=today)  # * base filter

        allBookings = Bookings.objects.filter(date_q)

        summary = allBookings.aggregate(
            totalBookings=Count("id"),
            totalSales=Sum("totalPrice"),
        )
        print("summery", summary)

        checkins = allBookings.filter(status="checked-in").aggregate(
            totalCheckIns=Count("id")
        )

        # ?Rooms Occupied ÷ Total Rooms Available) x 100.
        totalcheckins = checkins["totalCheckIns"]
        occupancyRate = {"occupancyRate": 0}
        if totalcheckins != 0:
            totalCabins = Cabins.objects.count()
            occuRt = (totalcheckins / totalCabins) * 100
            occupancyRate["occupancyRate"] = occuRt

        data = {**summary, **checkins, **occupancyRate}

        # handle nulls
        data["totalBookings"] = int(data.get("totalBookings") or 0)
        data["totalSales"] = int(data.get("totalSales") or 0)
        data["totalCheckIns"] = int(data.get("totalCheckIns") or 0)

        serializer = GetBookingsLastXDaysSerializer(data=data)
        serializer.is_valid(raise_exception=True)
        response_data = serializer.validated_data
        # print(data)

        ttlValue = decide_ttl(days)
        cache.set(cache_key, response_data, timeout=ttlValue)

        return Response(response_data)


class GetTodayActivitiesView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):

        # today_start = timezone.now().replace(hour=0, minute=0, second=0, microsecond=0)
        # tomorrow_start = today_start + timedelta(days=1)
        # reqFilter = (
        #     Q(
        #         created_at__gte=timezone.now().replace(
        #             hour=0, minute=0, second=0, microsecond=0
        #         )
        #     )
        #     & Q(created_at__lte=tomorrow_start)
        #     & Q(status__in=["checked-in", "checked-out", "unconfirmed"])
        # )

        prefix = "dashboard__todayActivities"
        cache_key = user_cache_key(prefix, hotel_id=request.user.hotel.id)

        cached = cache.get(cache_key)

        if cached:
            return Response(cached)

        today = timezone.localdate()

        reqFilter = Q(
            startDate__lte=today,
            endDate__gte=today,
            status__in=["checked-in", "checked-out", "unconfirmed"],
        )

        todayActivities = (
            Bookings.objects.filter(reqFilter)
            .select_related("guest")
            .only(
                "id",
                "guest__fullName",
                "guest__countryFlag",
                "guest__nationality",
                "status",
                "numNights",
            )
            .order_by("startDate", "status")[:20]
        )
        serializer = TodayActivitySerializer(todayActivities, many=True)
        cache.set(cache_key, serializer.data, timeout=3600)
        return Response(serializer.data)


class StayDurationView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        days = int(request.query_params.get("filterValue", 7))

        prefix = f"dashboard__stats_Duration{days}"
        print("Request.user.hotel.id", request.user.hotel.id)
        cache_key = user_cache_key(prefix, hotel_id=request.user.hotel.id, version=1)
        cached = cache.get(cache_key)
        if cached:
            return Response(cached)
        today = timezone.now()

        cutoff = today - timezone.timedelta(days=days)
        date_q = Q(created_at__gte=cutoff) & Q(created_at__lte=today)  # * base filter

        initialData = Bookings.objects.filter(date_q)
        data = []
        for label, condition in BUCKETS:
            bookingCount = initialData.filter(condition).count()
            if bookingCount > 0:
                data.append({"label": label, "count": bookingCount})

        ttlValue = decide_ttl(days)
        cache.set(cache_key, data, timeout=ttlValue)

        return Response(data)


class DailyRevenueLastXDaysView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        days = days = int(request.query_params.get("filterValue", 7))

        today = timezone.now().date()
        start_date = today - timedelta(days=days - 1)
        prefix = f"dashboard__dailyRevenueLastXDays_{days}"
        cache_key = user_cache_key(prefix, hotel_id=request.user.hotel, version=1)
        cached = cache.get(cache_key)
        if cached:
            return Response(cached)

        date_q = Q(created_at__gte=start_date) & Q(created_at__lte=today)
        revenue_q = date_q & Q(status="checked-out") & Q(isPaid=True)

        qs = Bookings.objects.filter(revenue_q)

        daily = (
            qs.annotate(day=TruncDate("created_at"))
            .values("day")
            .annotate(
                totalSales=Sum("totalPrice"),
                extrasSales=Sum("extrasPrice"),
            )
            .order_by("day")
        )

        daily_map = {row["day"]: row for row in daily}

        result = []
        for i in range(days):
            day = start_date + timedelta(days=i)
            row = daily_map.get(day, {})

            result.append(
                {
                    "date": day,
                    "totalSales": row.get("totalSales", 0) or 0,
                    "extrasSales": row.get("extrasSales", 0) or 0,
                }
            )

        ttlValue = decide_ttl(days)
        cache.set(cache_key, result, ttlValue)

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

    # def get_queryset(self):
    #     return super().get_queryset()
