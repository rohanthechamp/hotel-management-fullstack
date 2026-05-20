import email
from email.policy import default
from traceback import print_tb

from itsdangerous import Serializer
from rest_framework import serializers
import re
from api.models import Guests, Bookings
from users.models import Hotel
from django.contrib.auth.hashers import make_password


class GoogleLoginSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)

    def validate_email(self, value):
        """Custom validation to check if guest exists."""
        if not Guests.objects.filter(email=value).exists():
            raise serializers.ValidationError("Email not found in our guest list.")
        return value


class TokenResponseSerializer(serializers.Serializer):
    access = serializers.CharField()
    refresh = serializers.CharField()


class GuestBookingsSerializer(serializers.ModelSerializer):
    # Flatten the cabin relationship properties neatly
    cabin_name = serializers.CharField(source="cabin.name", read_only=True)
    cabin_image = serializers.ImageField(source="cabin.image", read_only=True)

    class Meta:
        model = Bookings
        fields = [
            "id",
            "guest_id",
            "startDate",
            "endDate",
            "numNights",
            "totalPrice",
            "numGuests",
            "status",
            "created_at",
            "cabin_name",
            "cabin_image",
        ]


class GuestRegisterSerializer(serializers.ModelSerializer):
    passwordConfirm = serializers.CharField(write_only=True)
    password = serializers.CharField(write_only=True, style={"input_type": "password"})

    class Meta:
        model = Guests
        fields = ["fullName", "email", "password", "isOAuthUser", "passwordConfirm"]

    def validate_email(self, value):
        # A standard regex for general email format
        pattern = r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"

        print(value)
        if not re.match(pattern, value):
            raise serializers.ValidationError("Invalid Email")

        if Guests.objects.filter(email=value).exists():
            raise serializers.ValidationError("A guest with this email already exists.")
        return value

    def validate(self, data):
        if data["password"] != data["passwordConfirm"]:
            raise serializers.ValidationError("Passwords do not match")
        return data

    def create(self, validated_data):
        validated_data.pop("passwordConfirm")
        hotel = Hotel.objects.first()
        user_pass = validated_data["password"]
        hashed_password = make_password(password=user_pass)
        fullname = validated_data["fullName"]
        print("fullname", fullname)

        guest = Guests.objects.create(
            fullName=fullname,
            email=validated_data["email"],
            password=hashed_password,
            hotel=hotel,
        )

        return guest


class GuestLoginSerializer(serializers.Serializer):

    email = serializers.EmailField(required=True)
    password = serializers.CharField(
        write_only=True, min_length=8, trim_whitespace=False
    )
