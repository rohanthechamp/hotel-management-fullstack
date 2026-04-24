from rest_framework import serializers
from django.contrib.auth import get_user_model
from PIL import Image
from .models import HotelInvite, Profile
from .models import Hotel


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


class HotelSerializer(serializers.ModelSerializer):
    admin_email = serializers.EmailField(source="admin.email", read_only=True)

    class Meta:
        model = Hotel
        fields = [
            "id",
            "name",
            "email",
            "address",
            "staffCapacity",
            "logo",
            "startDate",
            "created_at",
            "admin",
            "admin_email",
        ]
        read_only_fields = ["admin", "created_at"]


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


class StaffRegisterSerializer(serializers.ModelSerializer):
    passwordConfirm = serializers.CharField(write_only=True)
    invite_code = serializers.UUIDField()

    class Meta:
        model = User
        fields = ["email", "name", "password", "passwordConfirm", "invite_code"]

    def validate(self, data):
        if data["password"] != data["passwordConfirm"]:
            raise serializers.ValidationError("Passwords do not match")

        try:
            invite = HotelInvite.objects.get(code=data["invite_code"])
        except HotelInvite.DoesNotExist:
            raise serializers.ValidationError({"invite_code": "Invalid"})

        if not invite.is_valid():
            raise serializers.ValidationError({"invite_code": "Expired/used"})

        if invite.email and invite.email != data["email"]:
            raise serializers.ValidationError("This invite is not for this email")

        data["invite"] = invite
        return data

    def create(self, validated_data):
        password = validated_data.pop("password")
        validated_data.pop("passwordConfirm")
        invite = validated_data.pop("invite")

        user = User.objects.create_user(
            email=validated_data["email"],
            name=validated_data["name"],
            password=password,
            hotel=invite.hotel,
            role="Staff",
        )

        invite.is_used = True
        invite.save()

        return user


# class UserRegisterSerializer(serializers.ModelSerializer):

#     class Meta:
#         model = User
#         fields = ["email", "name", "password"]  # ignore tc
#         extra_kwargs = {
#             "password": {"write_only": True},
#         }

#     def validate_email(self, value):
#         if User.objects.filter(email=value).exists():
#             raise serializers.ValidationError("This email is already registered.")
#         return value

#     def create(self, validated_data):
#         validated_data.pop("passwordConfirm", None)
#         user = User.objects.create_user(
#             name=validated_data.get("name"),
#             email=validated_data.get("email"),
#             tc=True,  # always true
#             password=validated_data.get("password"),
#         )
#         return user


class UserLoginSerializer(serializers.Serializer):

    email = serializers.EmailField(required=True)
    password = serializers.CharField(
        write_only=True, min_length=8, trim_whitespace=False
    )


class AdminRegisterSerializer(serializers.ModelSerializer):
    passwordConfirm = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = [
            "email",
            "name",
            "password",
            "passwordConfirm",
        ]
        extra_kwargs = {"password": {"write_only": True}}

    def validate(self, data):
        if data["password"] != data["passwordConfirm"]:
            raise serializers.ValidationError("Passwords do not match")
        return data

    def create(self, validated_data):
        password = validated_data.pop("password")
        validated_data.pop("passwordConfirm")

        user = User.objects.create_user(
            email=validated_data["email"],
            name=validated_data["name"],
            password=password,
            role="Admin",
        )

        return user


class ValidateInviteSerializer(serializers.Serializer):
    valid = serializers.BooleanField()
    email = serializers.EmailField(required=False, allow_null=True)
    hotel_name = serializers.CharField(required=False, allow_null=True)


class CreateHotelSerializer(serializers.ModelSerializer):
    # This allows you to use "admin_id" in your JSON body
    admin = serializers.IntegerField(write_only=True)

    class Meta:
        model = Hotel
        fields = ["id","name", "email", "address", "startDate", "admin"]

    def create(self, validated_data):
        # Extract admin_id and assign it to the admin field
        admin = validated_data.pop("admin_id")
        return Hotel.objects.create(admin=admin, **validated_data)


class HotelInviteSerializer(serializers.ModelSerializer):

    created_at = serializers.DateTimeField(format="%Y-%m-%d %H:%M:%S", read_only=True)
    expires_at = serializers.DateTimeField(format="%Y-%m-%d %H:%M:%S", read_only=True)

    is_expired = serializers.BooleanField(read_only=True)
    status = serializers.CharField(read_only=True)

    class Meta:
        model = HotelInvite
        fields = [
            "email",
            "is_used",
            "expires_at",
            "created_at",
            "is_expired",
            "status",
        ]


class StaffRegisterSerializer(serializers.ModelSerializer):
    passwordConfirm = serializers.CharField(write_only=True)
    invite_code = serializers.UUIDField()

    class Meta:
        model = User
        fields = ["email", "name", "password", "passwordConfirm", "invite_code"]

    def validate(self, data):
        if data["password"] != data["passwordConfirm"]:
            raise serializers.ValidationError("Passwords do not match")

        try:
            invite = HotelInvite.objects.get(code=data["invite_code"])
        except HotelInvite.DoesNotExist:
            raise serializers.ValidationError({"invite_code": "Invalid"})

        if not invite.is_valid():
            raise serializers.ValidationError({"invite_code": "Expired/used"})

        if invite.email and invite.email != data["email"]:
            raise serializers.ValidationError("This invite is not for this email")

        data["invite"] = invite
        return data

    def create(self, validated_data):
        password = validated_data.pop("password")
        validated_data.pop("passwordConfirm")
        invite = validated_data.pop("invite")

        user = User.objects.create_user(
            email=validated_data["email"],
            name=validated_data["name"],
            password=password,
            hotel=invite.hotel,
            role="Staff",
        )

        invite.is_used = True
        invite.save()

        return user
