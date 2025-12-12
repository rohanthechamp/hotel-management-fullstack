from datetime import timedelta, datetime
import django_filters
from rest_framework import filters
from .models import Bookings, Cabins


# class CabinsFilter(django_filters.FilterSet):
#     class Meta:
#         model = Cabins
#         fields = {"discount": ["lt", "gt"]}

    # def get_queryset(self):
    #     queryset = super(CLASS_NAME, self).get_queryset()
    #     queryset = queryset # TODO
    #     return queryset


# class BookingFilter(django_filters.FilterSet):
#     class Meta:
#         model = Bookings
#         fields = {"status": ["in"]}

    


# * fetching the payment status paid and booked in 3 days
class RecentPaidBookings(filters.BaseFilterBackend):

    def filter_queryset(self, request, queryset, view):
        return queryset.filter(
            isPaid=True, created_at__gt=datetime.now() - timedelta(days=3)
        )


class PaidBookings(filters.BaseFilterBackend):

    def filter_queryset(self, request, queryset, view):
        return queryset.filter(isPaid=True)
