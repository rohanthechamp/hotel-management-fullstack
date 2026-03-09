# Create your models here.
from django.db import models
from datetime import datetime
from django.conf import settings
from django.core.validators import MinValueValidator, MaxValueValidator


class Hotel(models.Model):
    # name ,address,staff,logo,email,    foreign key to every   field
    created_at = models.DateTimeField(auto_now_add=True)
    startDate = models.DateField(db_index=True)

    name = models.CharField(
        max_length=200,
        blank=False,
        null=False,
    )
    email = models.EmailField(unique=True)
    address = models.TextField(blank=False, null=False)
    staffCapacity = models.IntegerField(
        blank=False,
        null=False,
        validators=[MinValueValidator(1), MaxValueValidator(1000)],
        default=100,
    )
    logo = models.ImageField(
        upload_to="hotels/logos/",
        blank=True,
        null=True,
        default="defaults/low-light.png",
    )


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
        max_digits=20, decimal_places=2, blank=True, null=True
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
    created_at = models.DateField(auto_now_add=True, db_index=True)
    fullName = models.TextField(db_index=True, blank=False, null=False)
    email = models.EmailField(blank=False, null=False, db_index=True)
    nationalID = models.BigIntegerField(blank=False, null=False, db_index=True)
    nationality = models.TextField(blank=False, null=False)
    countryFlag = models.ImageField(upload_to="users/%Y/%m/%d", blank=True)
    hotel = models.ForeignKey(to=Hotel, on_delete=models.CASCADE, related_name="guests")

    # ^ foreign  relationship with Bookings
    # & established relationship and name is - bookings via 'related' fields

    def __str__(self):
        return self.fullName

    class Meta:
        ordering = ["-created_at"]


# Create your models here.
class Bookings(models.Model):
    class BookingStatusChoices(models.TextChoices):
        CHECKED_IN = "checked-in", "Checked In"
        CHECKED_OUT = "checked-out", "Checked Out"
        UNCONFIRMED = "unconfirmed", "Unconfirmed"

    user = models.ForeignKey(
        to=settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="booking"
    )
    created_at = models.DateField(db_index=True)
    startDate = models.DateField(db_index=True)
    endDate = models.DateField(db_index=True)
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
        default=BookingStatusChoices.UNCONFIRMED,
    )
    isPaid = models.BooleanField(blank=False, null=False)
    observations = models.TextField()

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
