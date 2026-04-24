from django.contrib.auth.models import (
    BaseUserManager,
    AbstractBaseUser,
    PermissionsMixin,
)
from django.db import models
from django.conf import settings

import uuid
from django.utils import timezone


# Create your models here.
# class MyUserManager(BaseUserManager):
#     def create_user(self, email, name, password=None, tc=True, role="Staff"):
#         """
#         Creates and saves a User with the given email, date of
#         birth and password.
#         """
#         if not email:
#             raise ValueError("Users must have an email address")

#         user = self.model(
#             email=self.normalize_email(email), name=name, tc=tc, role=role
#         )

#         user.set_password(password)
#         user.save(using=self._db)
#         return user


#     def create_superuser(self, email, name, password=None, tc=True, role="Admin"):
#         """
#         Creates and saves a superuser with the given email, date of
#         birth and password.
#         """
#         user = self.create_user(email, password=password, name=name, tc=tc, role=role)
#         user.is_staff = True
#         user.is_superuser = True
#         user.save(using=self._db)
#         return user
class MyUserManager(BaseUserManager):
    def create_user(
        self, email, name, hotel=None, password=None, tc=True, role="Staff"
    ):
        if not email:
            raise ValueError("Users must have an email address")

        user = self.model(
            email=self.normalize_email(email), name=name, tc=tc, role=role, hotel=hotel
        )

        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, name, password=None):
        user = self.create_user(
            email=email, name=name, password=password, hotel=None, role="Admin"
        )
        user.is_staff = True
        user.is_superuser = True
        user.save(using=self._db)
        return user


class Hotel(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    startDate = models.DateField(db_index=True)

    name = models.CharField(max_length=200)
    email = models.EmailField(unique=True)
    address = models.TextField()

    staffCapacity = models.IntegerField(default=100)

    logo = models.ImageField(
        upload_to="hotels/logos/",
        blank=True,
        null=True,
        default="defaults/low-light.png",
    )

    admin = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="owned_hotel",
    )

    def __str__(self):
        return self.name


class HotelInvite(models.Model):
    hotel = models.ForeignKey(Hotel, on_delete=models.CASCADE, related_name="invites")

    code = models.UUIDField(default=uuid.uuid4, unique=True, editable=False,db_index=True)

    email = models.EmailField(null=True, blank=True)

    is_used = models.BooleanField(default=False)
    expires_at = models.DateTimeField()

    created_at = models.DateTimeField(auto_now_add=True)

    def is_valid(self):
        """Standard method for logic checks"""
        return not self.is_used and not self.is_expired

    @property
    def is_expired(self):
        """Returns True if the current time is past the expiration date"""
        return timezone.now() > self.expires_at

    @property
    def status(self):
        """Returns the string representation of the invite state"""
        if self.is_used:
            return "used"
        if self.is_expired:
            return "expired"
        return "pending"

    def __str__(self):
        return f"{self.email} - {self.status}"


class User(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(unique=True)
    name = models.CharField(max_length=200)

    role = models.CharField(
        max_length=20,
        choices=[("Staff", "Staff"), ("Admin", "Admin")],
        default="Staff",
    )

    tc = models.BooleanField(default=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)

    created_at = models.DateField(auto_now_add=True)
    updated_at = models.DateField(auto_now=True)
    hotel = models.ForeignKey(
        to=Hotel, on_delete=models.CASCADE, related_name="staff", null=True, blank=True
    )
    objects = MyUserManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["name"]

    def __str__(self):
        hotel_name = self.hotel.name if self.hotel else "No Hotel"
        return f"{self.email} ({self.role}) - {hotel_name}"


class Profile(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="profile"
    )
    photo = models.ImageField(upload_to="users/%Y/%m/%d", blank=True)

    def __str__(self):

        return str(self.user)


#   !  psql -U postgres -d postgres -h localhost -p 5432
