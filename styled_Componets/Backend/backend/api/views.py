from django.shortcuts import render

# Create your views here.
from rest_framework import viewsets
from .models import Cabins, Guests, Bookings, Settings
from .serializers import (
    CabinSerializer,
    GuestSerializer,
    BookingSerializer,
    SettingsSerializer,
)


class CabinViewSet(viewsets.ModelViewSet):
    queryset = Cabins.objects.all()
    serializer_class = CabinSerializer


class GuestsViewSet(viewsets.ModelViewSet):
    queryset = Guests.objects.all()
    serializer_class = GuestSerializer


class BookingsViewSet(viewsets.ModelViewSet):
    queryset = Bookings.objects.prefetch_related("cabin","guest").all()
    serializer_class = BookingSerializer


class SettingsViewSet(viewsets.ModelViewSet):
    queryset = Settings.objects.all()
    serializer_class = SettingsSerializer
