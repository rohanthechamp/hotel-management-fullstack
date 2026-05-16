from rest_framework import serializers

from api.models import Guests,Bookings


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
