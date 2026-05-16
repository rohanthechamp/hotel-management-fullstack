import logging

from django.shortcuts import render
from django.db import transaction
from rest_framework.views import APIView
from rest_framework import generics, status

# Create your views here.
from django.core.cache import cache
from rest_framework import generics
from rest_framework.permissions import (
    AllowAny,
    IsAuthenticated,
)
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters
from api.models import (
    Cabins,
    Guests,
    Settings,
    Bookings,
    Hotel,
)
from api.serializers import (
    BookingWriteSerializer,
    CabinSerializer,
    GuestSerializer,
    SettingsSerializer,
    BookingReadSerializer,
)
from api.selectors import generate_cache_key
from api.services import check_cabin_availability
from guest_portal.authentication import GuestJWTAuthentication


from api.pagination import CustomPagination
from core.utils.caching import get_cached_data, user_cache_key
from core.utils.selectors import get_model_data
from guest_portal.permission import IsBookingOwner
from core.utils.tokens import getTokens, verify_token
from guest_portal.serializers import (
    GoogleLoginSerializer,
    TokenResponseSerializer,
)
from guest_portal.selectors import get_bookings_for_guest

# -----------------------------------
# HELPERS
# -----------------------------------

logger = logging.getLogger(__name__)


def get_current_hotel():
    """
    SINGLE HOTEL PROJECT
    """

    return Hotel.objects.first()


# -----------------------------------
# CABINS
# -----------------------------------


class CustomerBookingCreateView(generics.CreateAPIView):
    """
    CREATE CUSTOMER BOOKING
    """

    authentication_classes = [GuestJWTAuthentication]

    permission_classes = [IsAuthenticated]

    serializer_class = BookingWriteSerializer

    def perform_create(self, serializer):

        with transaction.atomic():
            # print("booking DATA", self.request.data)

            cabin_id = self.request.data["cabin"]

            # Locking the cabin row
            cabin = Cabins.objects.select_for_update().get(id=cabin_id)

            num_nights = serializer.validated_data["numNights"]
            extras_price = serializer.validated_data.get("extrasPrice", 0)

            # Check overlapping bookings
            check_cabin_availability(cabin_id, serializer.validated_data)

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


class CustomerCabinListView(generics.ListAPIView):
    """
    PUBLIC CABIN LIST
    """

    permission_classes = [AllowAny]

    serializer_class = CabinSerializer

    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter,
    ]

    search_fields = [
        "=name",
        "maxCapacity",
        "regularPrice",
    ]

    ordering_fields = [
        "name",
        "maxCapacity",
        "regularPrice",
    ]

    ordering = ["id"]

    pagination_class = CustomPagination

    def get_queryset(self):

        hotel = get_current_hotel()
        # print("user hotel :", hotel)

        queryset = Cabins.objects.filter(hotel=hotel).select_related(
            "hotel",
            "user",
        )

        discount = self.request.query_params.get("discount")

        if discount == "no-discount":

            queryset = queryset.filter(discount__lt=1)

        if discount == "with-discount":

            queryset = queryset.filter(discount__gte=1)

        return queryset

    def list(self, request, *args, **kwargs):

        cache_key = "customer_cabins"

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

            cache.set(
                cache_key,
                response.data,
                timeout=60 * 5,
            )

            return response

        serializer = self.get_serializer(queryset, many=True)

        cache.set(
            cache_key,
            serializer.data,
            timeout=60 * 60,
        )

        return Response(serializer.data)


class CabinBookedDatesView(APIView):
    """
    GET /cabins/<cabin_id>/booked-dates/
    Returns all booked date ranges for a specific cabin
    """

    permission_classes = [AllowAny]

    def get(self, request, cabin_id):

        cache_key = f"cabin_booked_dates_{cabin_id}"

        cached = cache.get(cache_key)
        if cached:
            print("⚡% CACHE HIT CabinBookedDatesView")
            return Response(cached)

        bookings = Bookings.objects.filter(
            cabin_id=cabin_id,
            status__in=["checked-in", "unconfirmed"],
        ).values("startDate", "endDate")

        data = list(bookings)

        cache.set(cache_key, data, 60 * 10)
        print("⚡ NO CACHE HIT CabinBookedDatesView")

        return Response(data)


# -----------------------------------
# SINGLE CABIN
# -----------------------------------


class CustomerSingleCabinView(generics.RetrieveAPIView):
    """
    PUBLIC SINGLE CABIN
    """

    permission_classes = [AllowAny]
    serializer_class = CabinSerializer

    # Define the base queryset lookup attribute
    lookup_field = "pk"

    def get_queryset(self):
        # 1. Execute the function to get the actual hotel instance/ID
        current_hotel = get_current_hotel()

        # 2. Return the filtered queryset for the retrieve mixin to search within
        return Cabins.objects.filter(hotel=current_hotel)


# -----------------------------------
# SETTINGS
# -----------------------------------


class CustomerSettingsView(generics.ListAPIView):
    """
    PUBLIC HOTEL SETTINGS
    """

    permission_classes = [AllowAny]

    serializer_class = SettingsSerializer

    def get_queryset(self):

        hotel = get_current_hotel()

        return Settings.objects.filter(hotel=hotel)

    def list(self, request, *args, **kwargs):

        hotel = get_current_hotel()

        cache_key = f"{hotel.id}_customer_settings"

        data = get_cached_data(
            cache_key,
            fetch_func=lambda: self.get_serializer(self.get_queryset().first()).data,
            timeout=60 * 60 * 30,
        )

        return Response(data)


# -----------------------------------
# GUEST BOOKINGS
# -----------------------------------


class GuestsCreateListView(generics.ListCreateAPIView):
    """
    PUBLIC GUEST LIST, FILTER & CREATION
    """

    permission_classes = [AllowAny]
    serializer_class = GuestSerializer

    def get_queryset(self):
        """
        Define the base queryset scoped to the current hotel.
        """
        current_hotel = get_current_hotel()
        return Guests.objects.filter(hotel=current_hotel)

    def perform_create(self, serializer):
        """
        Inject the current hotel automatically during creation.
        """
        serializer.save(hotel=get_current_hotel())

    def list(self, request, *args, **kwargs):
        """
        Override list to return a single object if 'email' query param is provided,
        otherwise fall back to regular listing behavior.
        """
        email = request.query_params.get("email")

        if email:
            # Query within the hotel-scoped base queryset
            guest = self.get_queryset().filter(email__iexact=email).first()

            if not guest:
                return Response(
                    {"detail": "Guest not found."}, status=status.HTTP_404_NOT_FOUND
                )

            serializer = self.get_serializer(guest)
            return Response(serializer.data, status=status.HTTP_200_OK)

        return super().list(request, *args, **kwargs)


class CustomerBookingListView(generics.ListAPIView):
    """
    GUEST BOOKINGS
    """

    authentication_classes = [GuestJWTAuthentication]

    permission_classes = [IsAuthenticated]

    serializer_class = BookingReadSerializer

    def get_queryset(self):

        guest = self.request.user

        queryset = Bookings.objects.filter(guest=guest).select_related(
            "cabin",
            "guest",
        )

        return queryset


# -----------------------------------
# SINGLE BOOKING
# -----------------------------------


class CustomerSingleBookingView(generics.RetrieveUpdateDestroyAPIView):

    """
    GUEST SINGLE BOOKING
    """

    authentication_classes = [GuestJWTAuthentication]

    permission_classes = [IsAuthenticated, IsBookingOwner]

    serializer_class = BookingReadSerializer

    queryset = Bookings.objects.select_related(
        "cabin",
        "guest",
    )


# -------------------------------------


class GuestBookingsView(APIView):
    authentication_classes = [GuestJWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, guest_id):

        hotel_id = request.user.hotel.id

        # Unique cache key
        cache_key = user_cache_key(
            prefix="guest_bookings_version_",
            unique_id=guest_id,
            hotel_id=hotel_id,
            # version=2,  # bump version to avoid old broken cache
        )

        # Get serialized cached data
        bookings = get_cached_data(
            cache_key=cache_key,
            fetch_func=lambda: get_bookings_for_guest(
                hotel_id=hotel_id,
                guest_id=guest_id,
            ),
            timeout=60 * 60,
        )
        
        ("bookings", bookings)
        # Debugging
        # print(type(bookings))

        # if bookings:
        #     print(type(bookings[0]))
        #     print("bookings", bookings)

        # Return JSON-safe serialized data
        return Response(bookings)


class BookingMinimalView(APIView):
    authentication_classes = [GuestJWTAuthentication]
    permission_classes = [IsAuthenticated]

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


class SingleGuestRetrieveView(generics.RetrieveUpdateDestroyAPIView):

    authentication_classes = [GuestJWTAuthentication]
    permission_classes = [IsAuthenticated]

    queryset = Guests.objects.all()
    serializer_class = GuestSerializer


class GoogleOAuthJWTView(APIView):

    permission_classes = [AllowAny]

    def post(self, request):
        # print("request.data", request.data)
        serializer = GoogleLoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        email = serializer.validated_data["email"]
        currentGuest = Guests.objects.get(email=email)
        # print("currentGuest", currentGuest)

        accesstoken, refreshtoken = getTokens(
            guest=currentGuest
        )  #  manual to    ken logic
        token_data = {"accesstoken": accesstoken, "refreshtoken": refreshtoken}
        # print("tokens", token_data)

        # Returned the token dictionary inside the response data
        return Response({"data": token_data}, status=status.HTTP_200_OK)


class RefreshAccessTokenView(APIView):

    permission_classes = [AllowAny]

    def post(self, request):

        refreshtoken = request.data.get("refreshtoken")
        logger.info(
            f"refresh token from the request {request} and refreshtoken is {refreshtoken} "
        )

        if not refreshtoken:

            return Response({"detail": "Refresh token required"}, status=400)

        payload = verify_token(refreshtoken)

        if payload is None:

            return Response({"detail": "Invalid refresh token"}, status=401)

        if payload["type"] != "refresh":

            return Response({"detail": "Invalid token type"}, status=401)

        guest = Guests.objects.filter(id=payload["guest_id"]).first()
        logger.info(f"guest {guest}")

        if guest is None:

            return Response({"detail": "Guest not found"}, status=404)

        # tokens = getTokens(guest=guest)  #  manual token logic
        # response_serializer = TokenResponseSerializer(data=tokens)
        # response_serializer.is_valid(raise_exception=True)

        accesstoken, refreshtoken = getTokens(guest=guest)
        token_data = {"accesstoken": accesstoken, "refreshtoken": refreshtoken}

        return Response({"data": token_data}, status=status.HTTP_200_OK)
