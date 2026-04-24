# Create your models here.
from django.db import models
from datetime import datetime
from django.conf import settings
from django.core.validators import MinValueValidator, MaxValueValidator
from sqlalchemy import true
from django.db.models import Index
from django.db.models.functions import Upper
from api.validators import validate_secure_image_url
from users.models import Hotel


class Cabins(models.Model):
    user = models.ForeignKey(
        to=settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="cabins"
    )
    hotel = models.ForeignKey(to=Hotel, on_delete=models.CASCADE, related_name="cabins")

    created_at = models.DateTimeField(auto_now_add=True, db_index=True)

    name = models.TextField()
    maxCapacity = models.IntegerField(
        blank=False, null=False, validators=[MinValueValidator(1), MaxValueValidator(2)]
    )
    regularPrice = models.DecimalField(
        max_digits=20, decimal_places=2, blank=False, null=False
    )
    discount = models.DecimalField(
        max_digits=20, decimal_places=2, blank=True, null=True, db_index=True
    )
    observations = models.TextField()
    image = models.ImageField(upload_to="users/%Y/%m/%d", blank=True)
    # ^ one to many relationship with Bookings
    # & established relationship and name is - bookings via 'related' fields

    def __str__(self):
        return self.name

    class Meta:
        ordering = ["-created_at"]
        permissions = [
            ("mark_clean", "Can mark room as cleaned"),
            ("assign_room", "Can assign room to booking"),
        ]


class Guests(models.Model):
    created_at = models.DateField(auto_now_add=True)
    fullName = models.TextField(blank=False, null=False)
    email = models.EmailField(blank=False, null=False, db_index=True)
    nationalID = models.BigIntegerField(blank=True, null=True)
    nationality = models.TextField(blank=True, null=True)
    countryFlag = models.URLField(
        max_length=500, null=True, blank=True, validators=[validate_secure_image_url]
    )
    hotel = models.ForeignKey(to=Hotel, on_delete=models.CASCADE, related_name="guests")

    # ^ foreign  relationship with Bookings
    # & established relationship and name is - bookings via 'related' fields

    def __str__(self):
        return self.fullName

    class Meta:
        ordering = ["-created_at"]
        indexes = [
            models.Index(
                # Use 'expressions' instead of 'fields' for functions
                fields=["email"],
                name="guest_email_lookup_idx",
                include=[
                    "fullName", 
                    "hotel", 
                    "nationalID", 
                    "nationality", 
                    "countryFlag"
                ]
            ),
        ]


# Create your models here.
class Bookings(models.Model):
    class BookingStatusChoices(models.TextChoices):
        CHECKED_IN = "checked-in", "Checked In"
        CHECKED_OUT = "checked-out", "Checked Out"
        UNCONFIRMED = "unconfirmed", "Unconfirmed"

    user = models.ForeignKey(
        to=settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        related_name="bookings_handled",
        null=True,
        blank=True,
    )
    created_at = models.DateField()
    startDate = models.DateField()
    endDate = models.DateField()
    numNights = models.IntegerField(
        blank=False, null=False, validators=[MinValueValidator(1), MaxValueValidator(7)]
    )
    numGuests = models.IntegerField(
        blank=False, null=False, validators=[MinValueValidator(1), MaxValueValidator(4)]
    )
    cabinPrice = models.DecimalField(
        max_digits=20, decimal_places=2, blank=False, null=False
    )
    extrasPrice = models.DecimalField(
        max_digits=20, decimal_places=2, blank=True, null=True
    )
    totalPrice = models.DecimalField(
        max_digits=20, decimal_places=2, blank=False, null=False
    )
    status = models.CharField(
        blank=False,
        null=False,
        db_index=True,
        choices=BookingStatusChoices.choices,
        default=BookingStatusChoices.UNCONFIRMED,
    )
    isPaid = models.BooleanField(default=False, blank=False, null=False)
    observations = models.TextField(max_length=500, blank=True)

    # ^ foreign key relationship with Cabins Table
    cabin = models.ForeignKey(
        "Cabins", on_delete=models.CASCADE, related_name="bookings"
    )

    # ^ foreign key of Guest Table
    guest = models.ForeignKey(
        "Guests", on_delete=models.CASCADE, related_name="bookings"
    )
    # ^ foreign key of Hotel Table
    hotel = models.ForeignKey(
        to=Hotel, on_delete=models.CASCADE, related_name="bookings"
    )

    def __str__(self):
        return f"Booking, created at {self.created_at}! by {self.guest.fullName} for {self.numNights} number of Nights ."

    class Meta:
        ordering = ["-created_at"]
        permissions = [
            ("checkin_guest", "Can check in guest"),
            ("checkout_guest", "Can check out guest"),
            ("cancel_booking", "Can cancel booking"),
        ]
        indexes = [
            
            models.Index(
                fields=['created_at'], 
                name='booking_date_metrics_idx',
                include=['totalPrice'] 
            ),
        ]


class Settings(models.Model):
    created_at = models.DateField(auto_now_add=True, db_index=True)
    minBookingLength = models.IntegerField(blank=False, null=False)
    maxBookingLength = models.IntegerField(blank=False, null=False)
    minGuestsPerBooking = models.IntegerField(blank=False, null=False)
    breakfastPrice = models.DecimalField(
        max_digits=20, decimal_places=2, blank=False, null=False
    )
    hotel = models.ForeignKey(
        to=Hotel, on_delete=models.CASCADE, related_name="settings"
    )

    def __str__(self):
        return "Settings for HOTEL"


# Bookings.objects.delete()
# Bookings.objects.all().count()
# print(Bookings.objects.all().count())
# Bookings.objects.all().delete()
# &Django does not allow you to define the relationship on both sides manually. You must define it once on the "Many" side (the Staff model) using a ForeignKey.
