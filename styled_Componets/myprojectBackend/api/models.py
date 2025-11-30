# Create your models here.
from django.db import models
from datetime import datetime
from django.conf import settings
from django.core.validators import MinValueValidator, MaxValueValidator
from django.contrib.auth.models import AbstractUser


from django.contrib.auth.models import BaseUserManager

from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.db import models


class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError("The Email field must be set")
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        # The key change is here: remove 'username' if it's not needed
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        extra_fields.setdefault("is_active", True)

        if extra_fields.get("is_staff") is not True:
            raise ValueError("Superuser must have is_staff=True.")
        if extra_fields.get("is_superuser") is not True:
            raise ValueError("Superuser must have is_superuser=True.")

        # Call create_user with only necessary fields
        return self.create_user(email, password, **extra_fields)


class CustomUser(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(unique=True)
    first_name = models.CharField(max_length=30, blank=True)
    # Add other fields here

    objects = CustomUserManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = (
        []
    )  # If you use email as the sole login field, this can be empty or contain other required fields like first_name

    def __str__(self):
        return self.email

    # ... other methods ...


class Cabins(models.Model):
    user = models.ForeignKey(
        to=settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="cabins"
    )
    created_at = models.DateField(default=datetime.today, db_index=True)
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


class Guests(models.Model):
    created_at = models.DateField(default=datetime.today, db_index=True)
    fullName = models.TextField(db_index=True, blank=False, null=False)
    email = models.EmailField(blank=False, null=False, db_index=True)
    nationalID = models.BigIntegerField(blank=False, null=False, db_index=True)
    nationality = models.TextField(blank=False, null=False)
    countryFlag = models.ImageField(upload_to="users/%Y/%m/%d", blank=True)

    # ^ foreign  relationship with Bookings
    # & established relationship and name is - bookings via 'related' fields

    def __str__(self):
        return self.fullName

    class Meta:
        ordering = ["-created_at"]


# Create your models here.
class Bookings(models.Model):
    user = models.ForeignKey(
        to=settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="booking"
    )
    created_at = models.DateField(default=datetime.today, db_index=True)
    startDate = models.DateField(default=datetime.today, db_index=True)
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
    status = models.BooleanField(blank=False, null=False)
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

    def __str__(self):
        return f"Booking, created at {self.created_at}! by {self.guest.fullName} for {self.numNights} number of Nights ."

    class Meta:
        ordering = ["-created_at"]


class Settings(models.Model):
    created_at = models.DateField(default=datetime.today, db_index=True)
    minBookingLength = models.IntegerField(blank=False, null=False)
    maxBookingLength = models.IntegerField(blank=False, null=False)
    minGuestsPerBooking = models.IntegerField(blank=False, null=False)
    breakfastPrice = models.DecimalField(
        max_digits=20, decimal_places=2, blank=False, null=False
    )

    def __str__(self):
        return "Settings for HOTEL"
