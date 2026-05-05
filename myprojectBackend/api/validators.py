from rest_framework import serializers
from django.core.validators import RegexValidator
from PIL import Image
from django.core.validators import URLValidator
from django.core.exceptions import ValidationError
from urllib.parse import urlparse

# -----------------------
# Reusable validators
# -----------------------
def validate_secure_image_url(value):
    # 1. Basic URL structural validation
    standard_validator = URLValidator()
    try:
        standard_validator(value)
    except ValidationError:
        raise serializers.ValidationError("This is not a valid URL.")

    # 2. Enforce HTTPS
    if not value.startswith("https://"):
        raise serializers.ValidationError(
            "For security, image URLs must start with 'https://'."
        )

    # 3. Whitelist: Ensure it comes from flagcdn.com
    parsed_url = urlparse(value)
    if parsed_url.netloc != "flagcdn.com":
        raise serializers.ValidationError("Image must be hosted on flagcdn.com.")

    # 4. Restrict to specific file extensions
    valid_extensions = [".jpg", ".jpeg", ".png", ".webp", ".gif", ".svg"]
    if not any(value.lower().endswith(ext) for ext in valid_extensions):
        raise serializers.ValidationError(
            "URL must point to a valid image file (jpg, png, webp, svg, etc.)."
        )

    return value


def validate_positive(value):
    """Reusable check: value must be > 0."""
    if value is None or value <= 0:
        raise serializers.ValidationError("Value must be greater than zero.")
    return value


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




def validate_national_id(value):
    if value is None or value == "":
        return value

    # Force to string in case DRF passes it as an int from the model layer
    str_value = str(value)

    if not str_value.isdigit():
        raise serializers.ValidationError("National ID must contain only digits.")

    if not (6 <= len(str_value) <= 20):
        raise serializers.ValidationError(
            "National ID must be between 6 and 20 digits."
        )

    if int(str_value) == 0:
        raise serializers.ValidationError("National ID cannot be all zeros.")

    return value
