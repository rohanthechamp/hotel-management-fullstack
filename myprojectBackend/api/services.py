from csv import Error
from rest_framework.exceptions import PermissionDenied
from datetime import timedelta

from core.utils.selectors import get_model_data

from api.serializers import (
    GetBookingsLastXDaysSerializer,
    TodayActivitySerializer,
)
from api.utils.helpers import BUCKETS
from .models import Bookings
from rest_framework.exceptions import ValidationError
from django.utils import timezone
from django.db.models import Q, Count, Sum
from django.db.models.functions import TruncDate
# Replace 'your_app' with the actual name of your Django app
from api.models import Bookings, Cabins

today = timezone.now()


def check_cabin_availability(cabin_id, validated_data):
    """
    Checks if a cabin is available for the given dates.
    Raises a ValidationError if an overlap is found.
    """

    start_date = validated_data["startDate"]
    end_date = validated_data["endDate"]

    overlap_exists = Bookings.objects.filter(
        cabin_id=cabin_id,
        status__in=["checked-in", "unconfirmed"],
        startDate__lt=end_date,
        endDate__gt=start_date,
    ).exists()

    if overlap_exists:
        raise ValidationError("This cabin is already booked for the selected dates.")


def validate_user(incoming_guest_id: int, actual_guest_id: int):
    if not incoming_guest_id and actual_guest_id:
        raise ValueError("incoming_guest_id and actual_guest_id is needed ")
    if int(incoming_guest_id) != actual_guest_id:
        raise PermissionDenied("Identity Mismatch: You do not own this resource.")


def get_eligible_bookings(days, hotel_id):

    cutoff = today - timezone.timedelta(days=days)

    date_q = (
        Q(hotel_id=hotel_id) & Q(created_at__gte=cutoff) & Q(created_at__lte=today)
    )  # * base filter

    allBookings = Bookings.objects.filter(
        date_q,
    )

    summary = allBookings.aggregate(
        totalBookings=Count("id"),
        totalSales=Sum("totalPrice"),
    )
    # print("summery", summary)

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
    return response_data


def get_today_activities(hotel_id):

    reqFilter = Q(
        hotel_id=hotel_id,
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

    data = serializer.data
    return data


def get_stay_durations(days, hotel_id):

    cutoff = today - timezone.timedelta(days=days)
    date_q = (
        Q(hotel_id=hotel_id) & Q(created_at__gte=cutoff) & Q(created_at__lte=today)
    )  # * base filter

    initialData = Bookings.objects.filter(date_q)
    data = []
    for label, condition in BUCKETS:
        bookingCount = initialData.filter(condition).count()
        if bookingCount > 0:
            data.append({"label": label, "count": bookingCount})

    return data


def get_daily_revenue_last_x_days(days,hotel_id):
    today = timezone.now().date()
    start_date = today - timedelta(days=days - 1)

    date_q = Q(hotel_id=hotel_id) &  Q(created_at__gte=start_date) & Q(created_at__lte=today)
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

    return result
