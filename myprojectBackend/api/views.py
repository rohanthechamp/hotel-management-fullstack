from email.policy import strict
from warnings import filters
from rest_framework import generics, filters
from rest_framework.permissions import (
    IsAuthenticated,
    AllowAny,
)
from rest_framework import status
from django.db import transaction
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from sqlalchemy import null
from wtforms import ValidationError

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
from api.utils.helpers import (
    MAPPING,
    decide_ttl,
)
from core.utils.caching import get_cached_data, user_cache_key
from api.selectors import generate_cache_key
from core.utils.selectors import get_model_data 

from api.services import (
    check_cabin_availability,
    get_daily_revenue_last_x_days,
    get_eligible_bookings,
    get_stay_durations,
    get_today_activities,
    validate_user,
)
from core.utils.tokens import (
    generate_access_token,
    generate_refresh_token,
    get_auth_token,
    getTokens,
    verify_token,
)
from myprojectBackend.guest_portal.authentication import GuestJWTAuthentication
from .models import Cabins, Guests, Bookings, Hotel, Settings
from .serializers import (
    BookingReadSerializer,
    CabinSerializer,
    GuestSerializer,
    BookingWriteSerializer,
    SettingsSerializer,
    MessageSerializer,
    TokenResponseSerializer,
)

from rest_framework.views import APIView
from django.core.cache import cache

from api import serializers

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


# ----------------------------------------------------------
# *👤 GUESTS
# ----------------------------------------------------------
class GuestBookingsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, guest_id):

        cache_key = user_cache_key(
            prefix="guest_bookings_version:",
            unique_id=guest_id,
            hotel_id=request.user.hotel.id,
            version=1,
        )
        fields_list = [
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
        ]

        bookings = get_cached_data(
            cache_key,
            fetch_func=lambda: get_model_data(
                hotel_id=request.user.hotel.id,
                id=guest_id,
                model=Bookings,
                fields_list=fields_list,
                query_optimize="yes_select",
                select_field=["cabin"],
            ),
            timeout=60 * 60,
        )

        return Response(list(bookings))


class GuestsCreateListView(generics.ListCreateAPIView):

    permission_classes = [AllowAny]
    # queryset = Guests.objects.all().select_related('hotel')
    serializer_class = GuestSerializer
    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter,
    ]
    search_fields = ["=fullName", "nationality"]
    ordering_fields = ["created_at"]
    ordering = ["id"]

    def get_queryset(self):
        return Guests.objects.select_related("hotel").all()

    def list(self, request, *args, **kwargs):
        email = request.query_params.get("email")
        if email:
            try:

                guest = self.get_queryset().filter(email__iexact=email).first()
                if guest is None:
                    return Response({"detail": "Not found."}, status=404)

                # print('GUESTTTT',guest)
                serializer = self.get_serializer(guest)
                return Response(serializer.data)
            except Guests.DoesNotExist:
                return Response({"detail": "Not found."}, status=404)
        return super().list(request, *args, **kwargs)

    # def perform_create(self, serializer):

    #     isAuthLogin = self.request.data["isAuth2"]
    #     if isAuthLogin:
    #         serializer.save()


class GoogleOAuthJWTView(APIView):

    permission_classes = [AllowAny]

    def post(self, request):
        serializer = GoogleOAuthJWTView(data=request.data)
        serializer.is_valid(raise_exception=True)

        email = serializer.validated_data["email"]
        currentGuest = Guests.objects.get(email=email)

        tokens = getTokens(guest=currentGuest)  #  manual token logic
        response_serializer = TokenResponseSerializer(data=tokens)
        response_serializer.is_valid(raise_exception=True)

        return Response({"data": response_serializer.data}, status=200)


class RefreshAccessTokenView(APIView):

    permission_classes = [AllowAny]

    def post(self, request):

        refresh_token = request.data.get("refresh")

        if not refresh_token:

            return Response({"detail": "Refresh token required"}, status=400)

        payload = verify_token(refresh_token)

        if payload is None:

            return Response({"detail": "Invalid refresh token"}, status=401)

        if payload["type"] != "refresh":

            return Response({"detail": "Invalid token type"}, status=401)

        guest = Guests.objects.filter(id=payload["guest_id"]).first()

        if guest is None:

            return Response({"detail": "Guest not found"}, status=404)

        tokens = getTokens(guest=guest)  #  manual token logic
        response_serializer = TokenResponseSerializer(data=tokens)
        response_serializer.is_valid(raise_exception=True)

        return Response({"data": response_serializer.data}, status=200)




    # # ----------------------------------------------------------
    # # *📄 BOOKINGS
    # # ----------------------------------------------------------
    # #!❌ WRONG (list doing unnecessary work)
    # # List API (WRONG)
    # class BookingsCreateListView(generics.ListAPIView):
    #     queryset = Bookings.objects.select_related("cabin", "guest")
    #     serializer_class = BookingWriteSerializer

    # #&Before (unnecessary joins in list)
    # # List API BEFORE
    # queryset = Bookings.objects.select_related("cabin", "guest")

    # #?After (clean list query)
    # # List API AFTER
    # queryset = Bookings.objects.all()

    # ----------------------------------------------------------
    # # *📄 BOOKINGS
    # # ----------------------------------------------------------
    # #*✅ CORRECT (separate responsibilities)
    # # List API (LIGHTWEIGHT)
    # class BookingsCreateListView(generics.ListAPIView):
    #     queryset = Bookings.objects.all()
    #     serializer_class = BookingWriteSerializer  # returns only IDs
    # # Detail API (RICH DATA)
    # class BookingRetrieveView(generics.RetrieveAPIView):
    #     queryset = Bookings.objects.select_related("cabin", "guest")
    #     serializer_class = BookingReadSerializer  # nested data

class BookingsCreateListView(generics.ListAPIView):

        permission_classes = [IsAuthenticated]
        serializer_class = BookingWriteSerializer
        filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
        ordering_fields = ["startDate", "totalPrice"]
        ordering = ["id"]
        pagination_class = CustomPagination

        def get_queryset(self):
            queryset = Bookings.objects.filter(
                hotel=self.request.user.hotel
            )

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
        CancelBookingPermission,
    ]

    # permission_classes = [AllowAny]

    queryset = Bookings.objects.select_related("cabin", "guest").all()
    serializer_class = BookingReadSerializer

    def perform_destroy(self, instance):
        incoming_guest_id = self.request.query_params.get("guestId")
        actual_guest_id = instance.guest_id

        validate_user(incoming_guest_id, actual_guest_id)
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

        fields_list = ["observations", "numGuests", "cabin__maxCapacity"]
        data = get_model_data(
            hotel_id=request.user.hotel.id,
            id=booking_id,
            model=Bookings,
            fields_list=fields_list,
        ).first()

        if not data:
            return Response({"error": "Booking not found"}, status=404)

        return Response(data)


class CabinBookedDatesView(APIView):
    """
    GET /cabins/<cabin_id>/booked-dates/
    Returns all booked date ranges for a specific cabin
    """

    authentication_classes = [GuestJWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, cabin_id):

        cache_key = f"cabinBookedDates_{cabin_id}"  # prefix invalidate
        cached = cache.get(cache_key)
        if cached:
            return Response(list(cached))
        fields_list = ["startDate", "endDate"]
        cabin_booked_dates = get_model_data(
            hotel_id=request.user.hotel.id,
            id=cabin_id,
            model=Bookings,
            fields_list=fields_list,
        )
        cache.set(cache_key, cabin_booked_dates, 60 * 10)
        return Response(list(cabin_booked_dates))


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
