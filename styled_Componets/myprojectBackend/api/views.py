from ast import BoolOp
from datetime import timedelta
import stat
from urllib import response
from django.db.models import Sum
from django.db.models import Q, F
from collections import defaultdict
from django.db.models.functions import TruncDate

# from time import timezone
from django.utils import timezone
from warnings import filters
from rest_framework import generics, filters
from rest_framework.permissions import IsAdminUser, IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from django_filters.rest_framework import DjangoFilterBackend
from sqlalchemy import true
from api.filters import PaidBookings, RecentPaidBookings
from api.pagination import CustomPagination
from api.utils.helpers import BUCKETS
from .models import Cabins, Guests, Bookings, Settings
from .serializers import (
    BookingReadSerializer,
    CabinSerializer,
    GetBookingsLastXDaysSerializer,
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

    def get_permissions(self):
        """Allow Authenticate GET, admin-only POST."PUT", "PATCH", "DELETE"]

        #^ all cabins - get (see) - post (create)
        #*            - public    - authenticated staff user
        """
        return [IsAuthenticated()] if self.request.method in ["POST"] else [AllowAny()]


class SingleCabinRetrieveView(generics.RetrieveUpdateDestroyAPIView):
    """
    GET    /cabins/<pk>/  -> Retrieve one cabin (public) # ! we have not designed feature
    PUT    /cabins/<pk>/  -> Replace cabin (admin only)
    PATCH  /cabins/<pk>/  -> Partial update (admin only)
    DELETE /cabins/<pk>/  -> Delete cabin (admin only)
    """

    queryset = Cabins.objects.all()
    serializer_class = CabinSerializer

    def get_permissions(self):
        """Public read, admin-only update/delete.

        # ^ single cabin - delete - put/patch
        #*               - admin - object owner
        """
        return (
            [IsAuthenticated()] if self.request.method in ["GET"] else [IsAdminUser()]
        )


# ----------------------------------------------------------
# *👤 GUESTS
# ----------------------------------------------------------


class GuestsCreateListView(generics.ListCreateAPIView):
    """
    GET  /guests/    -> List all guests (public)
    POST /guests/    -> Create a guest (admin only)

    #^ all guest -  get, put/patch, post, delete
    #*           -  admin only...

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

    #^ all guest -  get, put/patch, post, delete
    #*           -  admin only...
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
    #^ all bookings -  get    -   post
    #*           -  public -   authenticated/staff user
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


class SingleBookingRetrieveView(generics.RetrieveUpdateDestroyAPIView):
    """
    GET    /bookings/<pk>/  -> Retrieve one booking (public)
    PUT    /bookings/<pk>/  -> Replace booking (admin only)
    PATCH  /bookings/<pk>/  -> Partial update (admin only)
    DELETE /bookings/<pk>/  -> Delete booking (admin only)

    #^ single booking -  get,                       -put/patch, post, delete
    #*                -  authenticated/staff user   admin only...
    """

    queryset = Bookings.objects.select_related("cabin", "guest").all()
    serializer_class = BookingWriteSerializer

    def get_permissions(self):
        """Public read, admin-only update/delete."""
        return [IsAdminUser()] if self.request.method == "POST" else [IsAuthenticated()]


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

    # permission_classes = (IsAuthenticated,)

    queryset = Settings.objects.all()
    serializer_class = SettingsSerializer

    # def get_permissions(self):
    #     """Allow public GET, admin-only POST."""
    #     return [IsAdminUser()] if self.request.method == "DELETE" else [IsAuthenticated()]


class SingleSettingsView(generics.RetrieveUpdateDestroyAPIView):
    """
    GET    /settings/<pk>/  -> Retrieve setting (public)
    PUT    /settings/<pk>/  -> Replace setting (admin only)
    PATCH  /settings/<pk>/  -> Partial update (admin only)
    DELETE /settings/<pk>/  -> Delete setting (admin only)

    #^ single booking -  get,                       -put/patch, post, delete
    #*                -  authenticated/staff user   admin only...

    """

    # permission_classes = (IsAuthenticated,)

    queryset = Settings.objects.all()
    serializer_class = SettingsSerializer

    # def get_permissions(self):
    #     """Public read, admin-only update/delete."""
    #     return [IsAdminUser()] if self.request.method == "DELETE" else [IsAuthenticated()]


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
    # permission_classes = (/IsAuthenticated,)

    def get(self, request):
        bookingID = int(request.query_params.get("bookingID", 90))
        bookingData = Bookings.objects.filter(id=bookingID).first()
        serializer = BookingReadSerializer(bookingData)
        return Response(serializer.data)


# &DashBoard Data


class GetBookingsLastXDaysView(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request):
        days = int(request.query_params.get("filterValue", 7))
        print("days", days)
        cache_key = f"dashboard_stats_{days}"

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
            totalCabins = Cabins.objects.all().count()
            occuRt = (totalcheckins / totalCabins) * 100
            occupancyRate["occupancyRate"] = occuRt

        data = {**summary, **checkins, **occupancyRate}

        # handle nulls
        data["totalBookings"] = int(data.get("totalBookings") or 0)
        data["totalSales"] = int(data.get("totalSales") or 0)
        data["totalCheckIns"] = int(data.get("totalCheckIns") or 0)

        serializer = GetBookingsLastXDaysSerializer(data=data)
        serializer.is_valid(raise_exception=true)
        response_data = serializer.validated_data
        print(data)

        # cache for 60 seconds (tune this later)
        cache.set(cache_key, response_data, timeout=360)

        return Response(response_data)


class GetTodayActivitiesView(APIView):
    permission_classes = (IsAuthenticated,)

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

        return Response(serializer.data)


class StayDurationView(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request):
        days = int(request.query_params.get("filterValue", 7))
        today = timezone.now()

        cutoff = today - timezone.timedelta(days=days)
        date_q = Q(created_at__gte=cutoff) & Q(created_at__lte=today)  # * base filter

        initialData = Bookings.objects.filter(date_q)
        data = []
        for label, condition in BUCKETS:
            bookingCount = initialData.filter(condition).count()
            if bookingCount > 0:
                data.append({"label": label, "count": bookingCount})

        return Response(data)


# from datetime import timedelta/


# from django.utils import timezone
# from django.core.cache import cache
# from django.db.models import Sum

# from rest_framework.views import APIView
# from rest_framework.permissions import IsAuthenticated
# from rest_framework.response import Response

# from api.models import Bookings


class DailyRevenueLastXDaysView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        days = days = int(request.query_params.get("filterValue", 7))

        today = timezone.now().date()
        start_date = today - timedelta(days=days - 1)

        cache_key = f"daily_revenue_{days}"

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

        cache.set(cache_key, result, 60 * 10)  # cache for 10 minutes

        return Response(result)


class HomeView(APIView):

    permission_classes = (IsAuthenticated,)

    def get(self, request):
        BookingsCount = cache.get_or_set(
            "bookings_count", lambda: Bookings.objects.count(), timeout=300
        )

        data = {"count": BookingsCount, "message": f"Hello {request.user.name}!"}

        serializer = MessageSerializer(data)

        return Response(serializer.data)

    # def get_queryset(self):
    #     return super().get_queryset()
