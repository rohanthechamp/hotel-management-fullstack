from api.models import Bookings
from ast import BoolOp
import stat
from django.db.models import Sum
from django.db.models import Sum, Count
from django.utils import timezone
from django.db.models import Q, F
from django.db.models.functions import TruncDate

# from time import timezone
from django.utils import timezone
from warnings import filters
from rest_framework import generics, filters
from rest_framework.permissions import IsAdminUser, IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from django_filters.rest_framework import DjangoFilterBackend
from api.filters import PaidBookings, RecentPaidBookings
from api.pagination import CustomPagination
from api.models import Cabins, Guests, Bookings, Settings

from django.core.cache import cache
from rest_framework.views import APIView
from django.utils import timezone

from api.utils.helpers import BUCKETS


# def run():

    # cutoff_date = timezone.now().date() - timezone.timedelta(days=90)
    # LastXDaysBooking= (
    #     Bookings.objects.filter(created_at__gt=cutoff_date).order_by("-created_at")
    # ).values("created_at", "totalPrice", "extrasPrice").count()

    # LastXDaysBookings={[x for x in list(LastXDaysBooking)]}
    # print("list",LastXDaysBookings)

    # data = [x for x in LastXDaysBookings]
    # print("data", data)
    # print(LastXDaysBooking)

    # days = 35
    # pass

    # today = timezone.now()
    # cutoff = today - timezone.timedelta(days=days)

    # baseQuery = Bookings.objects.filter(created_at__gte=cutoff, created_at__lte=today)

    # data1 = baseQuery.aggregate(
    #     totalBookings=Count("id"),
    #     totalSales=Sum("totalPrice"),
    # )
    # today = timezone.now()
    # cutoff = today - timezone.timedelta(days=9)
    # date_q = Q(created_at__gte=cutoff) & Q(created_at__lte=today)  # * base filter

    # baseQ = Bookings.objects.filter(date_q, status="checked-in")
    # bucket = {("1 night", Q(numNights=1))}
    # today = timezone.now()

    # cutoff = today - timezone.timedelta(days=30)
    # date_q = Q(created_at__gte=cutoff) & Q(created_at__lte=today)  # * base filter

    # initialData = Bookings.objects.filter(date_q)
    # data = []
    # for label, condition in BUCKETS:
    #     bookingCount = initialData.filter(condition).count()
    #     print(bookingCount)
    #     if int(bookingCount) > 0:
    #         data.append({"label": label, "count": bookingCount})

    # print(data)

    # print(Bookings.objects.filter(status="unconfirmed"))

    # print(
    #     "data totalBookings - ",
    #     data1["totalBookings"],
    # )
    # print(
    #     "data totalSales - ",
    #     data1["totalSales"],
    # )
    # print(
    #     "data2 totalCheckIns - ",
    #     data2["totalCheckIns"],
    # )

    # print("data1", data1)
    # print("data2", data2)
    # ?Rooms Occupied ÷ Total Rooms Available) x 100.
    # totalCabins = Cabins.objects.count()
    # totalBookings = Bookings.objects.count()
    # occupancyRate= (totalCabins/totalBookings)*100
    # print(totalCabins)
    # print("occupancyRate",occupancyRate r )

    # stayDurationData = (
    #     Bookings.objects.filter(date_q)
    #     .values("numNights")
    #     .distinct()
    #     .order_by(F("numNights").asc(nulls_last=True))
    # )

    # Bookings.objects.filter(datefilter ,numNights=minValue || numNights=maxValue ).count

    # print(stayDurationData)
    # today = timezone.now().date()
    # cutoff = today - timezone.timedelta(days=28)
    # date_q = (
    #     Q(created_at__gte=cutoff)
    #     & Q(created_at__lte=today)
    #     & Q(status="checked-out")
    #     & Q(isPaid=True)
    # )  # * base filter

    # allBookings = (
    #     Bookings.objects.filter(date_q)
    #     .annotate(day=TruncDate("created_at"))
    #     .values("day")
    #     .annotate(
    #         extraSales=Sum("extrasPrice"),
    #         totalSales=Sum("totalPrice"),
    #     )
    #     .order_by("day")[:5]
    # )

    # checkins = allBookings.filter(status="checked-in").aggregate(
    #     totalCheckIns=Count("id")
    # )
    # totalcheckins = checkins["totalCheckIns"]
    # cabins = Cabins.objects.all().count()
    # summary = allBookings.annotate(
    #     extraSales=Sum("extrasPrice"),
    #     totalSales=Sum("totalPrice"),
    # ).values("startDate")
    # print("summery ", allBookings)

    # print(f"Cabins: {cabins}, Total Check-ins: {totalcheckins}")

    # print(totalcheckins / cabins * 100)
    # print(
    #     f"Total Sales : {summary["totalSales"]} and totalBookings: {summary["totalBookings"]}"
    # )
    # print(Bookings.objects.all().count())

import time
from django.db import connection, reset_queries
from api.models import Cabins

def run():
    # Clear previous query logs
    # reset_queries()
    
    # # Method 1: .all().count()
    # start_time = time.time()
    # count1 = Cabins.objects.all().count()
    # end_time = time.time()
    
    # print(f"--- Method 1 (.all().count()) --- Cabins.objects.all().count() ")
    # print(f"Result: {count1}")
    # print(f"Time: {end_time - start_time:.4f} seconds")
    # print(f"SQL: {connection.queries[-1]['sql']}\n")

    # # Clear logs for second test
    # reset_queries()

    # # Method 2: .count()
    # start_time = time.time()
    # count2 = Cabins.objects.count()
    # end_time = time.time()

    # print(f"--- Method 2 (.count()) --- Cabins.objects.count()")
    # print(f"Result: {count2}")
    # print(f"Time: {end_time - start_time:.4f} seconds")
    # print(f"SQL: {connection.queries[-1]['sql']}\n")
    # queryset = Bookings.objects.filter(status='confirmed').annotate(total=Sum('price'))
        
    #     # This returns the execution plan as a string
    # plan = queryset.explain(analyze=True)
    # print(plan)
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
    
    plan = todayActivities.explain(analyze=True)
    print(plan)