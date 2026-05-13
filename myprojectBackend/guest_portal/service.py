
from .models import Bookings
from rest_framework.exceptions import ValidationError
from django.utils import timezone


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
