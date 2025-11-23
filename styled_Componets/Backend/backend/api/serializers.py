from rest_framework import serializers
from .models import Cabins, Guests, Bookings, Settings


class CabinSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cabins
        fields = "__all__"


class GuestSerializer(serializers.ModelSerializer):
    class Meta:
        model = Guests
        fields = "__all__"


class BookingSerializer(serializers.ModelSerializer):

    # * nested serializers of cabin and guest relationship
    cabin = CabinSerializer(read_only=True)
    guest = GuestSerializer(read_only=True)

    class Meta:
        model = Bookings
        fields = "__all__"


class SettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Settings
        fields = "__all__"
