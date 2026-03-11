from datetime import date
from rest_framework import serializers
from django.core.validators import RegexValidator
from .models import Cabins, Guests, Bookings, Settings,Hotel
from PIL import Image

# from django.contrib.auth.mo//dels import User
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer


# -----------------------
# Reusable validators
# -----------------------


def validate_positive(value):
    """Reusable check: value must be > 0."""
    if value is None or value <= 0:
        raise serializers.ValidationError("Value must be greater than zero.")


def validate_positive_type(value):
    """Reusable check: value must be > 0."""
    if value is None or value < 0:
        raise serializers.ValidationError("Value must be positive .")


def validate_alpha_space(value):
    """Reusable check: only letters and spaces allowed (good for nationality / names)."""
    alpha_space = RegexValidator(r"^[A-Za-z\s]+$")
    try:
        alpha_space(value)
    except Exception:
        raise serializers.ValidationError(
            "This field may only contain letters and spaces."
        )


def validate_image_file(value):
    """
    Production-level image validation for countryFlag field:
    1. Ensures file is actually an image (not just renamed file).
    2. Accepts only JPEG and PNG formats.
    3. Limits file size to 2MB.
    """
    # Check size
    max_size = 2 * 1024 * 1024  # 2 MB
    if hasattr(value, "size") and value.size > max_size:
        raise serializers.ValidationError("Image must be smaller than 2MB.")

    # Check content and format
    try:
        img = Image.open(value)
        img.verify()  # verify that it is a valid image
    except Exception:
        raise serializers.ValidationError("Uploaded file is not a valid image.")

    if img.format.upper() not in ["JPEG", "PNG"]:
        raise serializers.ValidationError("Only JPEG and PNG images are allowed.")

    return value


# -----------------------
# Cabin Serializer
# -----------------------


class CabinSerializer(serializers.ModelSerializer):
    """
    Serializer for Cabins.
    - Adds lightweight validation on capacity/price beyond DB validators to give fast API feedback.
    - Keep serializer simple and defer heavy constraints to models (DB) where possible.
    """

    # Example: enforce sane limit for maxCapacity at API layer (model already has validators)
    # The above code is defining a variable named `maxCapacity` in Python.
    maxCapacity = serializers.IntegerField(
        required=True, validators=[validate_positive]
    )

    class Meta:
        model = Cabins
        fields = "__all__"
        read_only_fields = ("user",)

    def validate_maxCapacity(self, value):
        """Ensure a cabin cannot hold more than 5 guests."""
        if value is None:
            raise serializers.ValidationError("Max capacity is required.")

        if value > 2:
            raise serializers.ValidationError(
                "A cabin cannot accommodate more than 2 guests."
            )

        if value < 1:
            raise serializers.ValidationError("Max capacity must be at least 1.")

        return value

    def validate_regularPrice(self, value):
        """Make sure regular price is non-negative and reasonable."""
        if value is None or value < 0:
            raise serializers.ValidationError(
                "Regular price must be zero or a positive number."
            )
        return value

    def validate_discount(self, value):
        """If discount provided, it should not be negative and not more than regularPrice (check in object-level)."""
        if value is not None and value < 0:
            raise serializers.ValidationError("Discount cannot be negative.")
        return value

    def validate(self, attrs):
        """
        Object-level validations:
        - If discount is provided, it should not exceed regularPrice.
        - Keep API-level checks fast and user-friendly; DB-level checks are the final guard.
        """
        regular = attrs.get("regularPrice") or getattr(
            self.instance, "regularPrice", None
        )
        discount = attrs.get("discount") or getattr(self.instance, "discount", None)
        if discount and regular is not None and discount > regular:
            raise serializers.ValidationError(
                {"discount": "Discount cannot be greater than regular price."}
            )
        return attrs

    def validate_image(self, value):
        # If file is uploaded, validate size/type
        return validate_image_file(value)

    # def save(self,validated_data):
    #     return super().save(**kwargs)


# -----------------------
# Guest Serializer
# -----------------------

# serializers.py


class GuestSerializer(serializers.ModelSerializer):
    # Use CharField for better control at the API layer
    fullName = serializers.CharField(required=True, max_length=150)
    email = serializers.EmailField(required=True)
    hotel = serializers.PrimaryKeyRelatedField(
        read_only=True, 
        default=Hotel.objects.first
        )    # CHANGE: Set required=False so Google Login doesn't crash
    # But we keep your logic for when the user eventually fills it in
    nationalID = serializers.IntegerField(required=False, allow_null=True)
    nationality = serializers.CharField(required=False, max_length=60, allow_blank=True)

    class Meta:
        model = Guests
        fields = "__all__"

    # --- Field-level validations (Keep your existing logic) ---

    def validate_fullName(self, value):
        if len(value.strip()) < 3:
            raise serializers.ValidationError(
                "Full name must be at least 3 characters."
            )
        return value.strip()

    def validate_email(self, value):
        qs = Guests.objects.filter(email__iexact=value)
        if self.instance:
            qs = qs.exclude(pk=self.instance.pk)
        if qs.exists():
            raise serializers.ValidationError("A guest with this email already exists.")
        return value.lower()

    def validate_nationalID(self, value):
        # Only run this if a value is actually provided
        if value is None:
            return value
        if value <= 0:
            raise serializers.ValidationError("National ID must be a positive integer.")
        text = str(value)
        if not (6 <= len(text) <= 20):
            raise serializers.ValidationError("National ID length looks invalid.")
        return value

    # # --- Logic for Auto-linking Hotel ---

    def create(self, validated_data):
        # Ensure every guest is linked to the admin's hotel automatically
        if "hotel" not in validated_data:
            hotel = Hotel.objects.first()
            print('GETTED HOTEl',hotel)
            if not hotel:
                raise serializers.ValidationError("No Hotel found in system.")
            validated_data["hotel"] = hotel
        return super().create(validated_data)


# -----------------------
# Booking Serializer (Write)
# -----------------------


class BookingReadSerializer(serializers.ModelSerializer):

    guest = GuestSerializer(read_only=True)
    cabin = CabinSerializer(read_only=True)

    class Meta:
        model = Bookings
        fields = "__all__"


class BookingWriteSerializer(serializers.ModelSerializer):
    """
    Serializer used for creating/updating bookings.
    - PrimaryKeyRelatedField ensures the cabin & guest exist.
    - Adds business-rule validations:
        * startDate <= endDate
        * numNights matches the date difference
        * numGuests <= cabin.maxCapacity
        * totalPrice must cover cabinPrice * numNights (extras optional)
    - Keep heavy price calculations on server side or in a service layer where possible.
    """

    cabin = serializers.PrimaryKeyRelatedField(queryset=Cabins.objects.all())
    guest = serializers.PrimaryKeyRelatedField(queryset=Guests.objects.all())
    # guest = GuestSerializer(many=True)
    # cabin= CabinSerializer(many=True)

    class Meta:
        model = Bookings
        fields = "__all__"

    # ----------------------
    # Field-level validations
    # ----------------------
    def validate_numNights(self, value):
        validate_positive(value)
        if value > 365:  # sanity limit
            raise serializers.ValidationError("Number of nights too large.")
        return value

    def validate_numGuests(self, value):
        validate_positive(value)
        if value > 100:  # sanity limit
            raise serializers.ValidationError("Number of guests too large.")
        return value

    def validate_totalPrice(self, value):
        if value is None or value < 0:
            raise serializers.ValidationError(
                "Total price must be zero or a positive number."
            )
        return value

    # ------------------------
    # Object-level validations
    # ------------------------
    def validate(self, attrs):
        """
        1) Date validation: start <= end and not in the past.
        2) numNights should match the date difference (defensive check).
        3) guest count should not exceed cabin capacity.
        4) pricing: totalPrice should at least cover cabinPrice * numNights.
        """
        start = attrs.get("startDate") or getattr(self.instance, "startDate", None)
        end = attrs.get("endDate") or getattr(self.instance, "endDate", None)
        num_nights = attrs.get("numNights") or getattr(self.instance, "numNights", None)
        cabin = attrs.get("cabin") or getattr(self.instance, "cabin", None)
        num_guests = attrs.get("numGuests") or getattr(self.instance, "numGuests", None)
        cabin_price = attrs.get("cabinPrice") or getattr(
            self.instance, "cabinPrice", None
        )
        extras = attrs.get("extrasPrice") or getattr(self.instance, "extrasPrice", 0)
        total = attrs.get("totalPrice") or getattr(self.instance, "totalPrice", None)

        # Date checks
        if start and end:

            if end <= start:
                raise serializers.ValidationError(
                    {"endDate": "endDate must be after startDate (at least 1 night)."}
                )

            # Defensive check: numNights must equal date difference in days
            expected_nights = (end - start).days or 1

            if num_nights is not None and num_nights != expected_nights:
                raise serializers.ValidationError(
                    {
                        "numNights": f"numNights ({num_nights}) does not match the date range ({expected_nights})."
                    }
                )

        # Cabin capacity check
        if cabin and num_guests is not None:
            # cabin.maxCapacity assumed to be an int - validate against it
            try:
                cap = int(getattr(cabin, "maxCapacity", None))
            except Exception:
                cap = None
            if cap is not None and num_guests > cap:
                raise serializers.ValidationError(
                    {
                        "numGuests": f"numGuests ({num_guests}) exceeds cabin capacity ({cap}). of having guest"
                    }
                )

        # Pricing sanity check
        if cabin_price is not None and num_nights is not None and total is not None:
            min_expected = cabin_price * num_nights
            extras_val = extras or 0
            if total < (min_expected + extras_val):
                raise serializers.ValidationError(
                    {
                        "totalPrice": "totalPrice must be at least cabinPrice * numNights + extrasPrice."
                    }
                )

        return attrs


# -----------------------
# Settings Serializer
# -----------------------


class SettingsSerializer(serializers.ModelSerializer):
    """
    Settings serializer: light validation ensuring min/max logic is coherent.
    """

    minBookingLength = serializers.IntegerField(validators=[validate_positive])
    maxBookingLength = serializers.IntegerField(validators=[validate_positive])
    minGuestsPerBooking = serializers.IntegerField(validators=[validate_positive])
    breakfastPrice = serializers.DecimalField(max_digits=20, decimal_places=2)

    class Meta:

        model = Settings
        fields = "__all__"

    def validate(self, attrs):
        # ensure min <= max for bookings
        min_len = attrs.get("minBookingLength") or getattr(
            self.instance, "minBookingLength", None
        )
        max_len = attrs.get("maxBookingLength") or getattr(
            self.instance, "maxBookingLength", None
        )
        if min_len is not None and max_len is not None and min_len > max_len:
            raise serializers.ValidationError(
                {"maxBookingLength": "maxBookingLength must be >= minBookingLength."}
            )
        return attrs


class GetBookingsLastXDaysSerializer(serializers.Serializer):

    totalBookings = serializers.IntegerField(validators=[validate_positive_type])
    totalSales = serializers.IntegerField(
        validators=[validate_positive_type]
    )  # ! should be decimal field
    totalCheckIns = serializers.IntegerField(validators=[validate_positive_type])
    occupancyRate = serializers.DecimalField(max_digits=5, decimal_places=2)


class MessageSerializer(serializers.Serializer):
    message = serializers.CharField()


class GuestMiniSerializer(serializers.ModelSerializer):
    class Meta:
        model = Guests
        fields = ["fullName", "countryFlag", "nationality"]


class TodayActivitySerializer(serializers.ModelSerializer):
    guest = GuestMiniSerializer()

    class Meta:
        model = Bookings
        fields = ["id", "status", "numNights", "guest"]


class DailyRevenueSerializer(serializers.Serializer):
    date = serializers.DateField()
    totalSales = serializers.DecimalField(max_digits=12, decimal_places=2)
    extrasSales = serializers.DecimalField(max_digits=12, decimal_places=2)
