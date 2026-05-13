from django.shortcuts import render
from django.db import transaction
from rest_framework.views import APIView

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
from guest_portal.permission import (
    AllGuestsPermission,
    SingleGuestPermission,
)

# -----------------------------------
# HELPERS
# -----------------------------------


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

        queryset = (
            Cabins.objects.filter(hotel=hotel)
            .select_related(
                "hotel",
                "user",
            )
            .all()
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


# -----------------------------------
# SINGLE CABIN
# -----------------------------------


class CustomerSingleCabinView(generics.RetrieveAPIView):
    """
    PUBLIC SINGLE CABIN
    """    


    permission_classes = [AllowAny]


    serializer_class = CabinSerializer

    def get_queryset(self):
        return Cabins.objects.filter(hotel=self.request.user.hotel)


# -----------------------------------
# SETTINGS
# -----------------------------------


class CustomerSettingsView(generics.ListAPIView):
    """
    PUBLIC HOTEL SETTINGS
    """ 
    authentication_classes = [GuestJWTAuthentication]

    permission_classes = [IsAuthenticated]



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


class CustomerSingleBookingView(generics.RetrieveDestroyAPIView):
    """
    GUEST SINGLE BOOKING
    """

    authentication_classes = [GuestJWTAuthentication]

    permission_classes = [IsAuthenticated]

    serializer_class = BookingReadSerializer

    queryset = Bookings.objects.select_related(
        "cabin",
        "guest",
    )

    def get_object(self):

        booking = super().get_object()

        if booking.guest_id != self.request.user.id:

            raise ValidationError("Not your booking.")

        return booking

    def perform_destroy(self, instance):

        if instance.guest_id != self.request.user.id:

            raise ValidationError("Cannot cancel another guest booking.")

        return super().perform_destroy(instance)


# -------------------------------------
class GuestBookingsView(APIView):
    authentication_classes = [GuestJWTAuthentication]
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


class SingleGuestRetrieveView(generics.RetrieveUpdateDestroyAPIView):

    permission_classes = [AllGuestsPermission, SingleGuestPermission]

    queryset = Guests.objects.all()
    serializer_class = GuestSerializer
