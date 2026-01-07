from rest_framework import serializers
from django.contrib.auth import get_user_model
from PIL import Image
from .models import Profile


# from rest_framework_simplejwt.serializers import TokenObtainPairSerializer


User = get_user_model()


# -----------------------
# UserRegister Serializer
# -----------------------
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


class ProfileUserSerializer(serializers.ModelSerializer):

    class Meta:
        model = Profile
        fields = ["photo"]  #
        # read_only_fields = ["photo"]

    def validate_photo(self, value):
        return validate_image_file(value)


# ? to get current user info
class UserMeSerializer(serializers.ModelSerializer):
    photo = serializers.ImageField(source="profile.photo", required=False, use_url=True)

    class Meta:
        model = User
        fields = ["email", "name", "photo"]


class UpdateCurrentUserSerializer(serializers.ModelSerializer):

    photo = serializers.ImageField(source="profile.photo", required=False)

    class Meta:
        model = User
        fields = ["name", "photo"]

    def update(self, instance, validated_data):
        profile_data = validated_data.pop("profile", None)

        instance.name = validated_data.get("name", instance.name)
        instance.save()

        # update profile fields
        if profile_data:
            profile = instance.profile
            for attr, value in profile_data.items():
                setattr(profile, attr, value)
            profile.save()

        return instance


class UpdateUserPassword(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = ["password"]
        extra_kwargs = {"password": {"write_only": True}}

    def update(self, instance, validated_data):
        password = validated_data.get("password")
        if password:
            instance.set_password(password)  # <-- hashes automatically
            instance.save()
        return instance


class UserRegisterSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = ["email", "name", "password"]  # ignore tc
        extra_kwargs = {
            "password": {"write_only": True},
        }

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("This email is already registered.")
        return value

    def create(self, validated_data):
        validated_data.pop("passwordConfirm", None)
        user = User.objects.create_user(
            name=validated_data.get("name"),
            email=validated_data.get("email"),
            tc=True,  # always true
            password=validated_data.get("password"),
        )
        return user


class UserLoginSerializer(serializers.Serializer):

    email = serializers.EmailField(required=True)
    password = serializers.CharField(
        write_only=True, min_length=8, trim_whitespace=False
    )
