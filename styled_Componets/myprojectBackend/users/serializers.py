from rest_framework import serializers
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer


User = get_user_model()


# -----------------------
# UserRegister Serializer
# -----------------------


class UserRegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["email", "name", "password"]  # ignore tc
        extra_kwargs = {"password": {"write_only": True}}

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
    password = serializers.CharField(write_only=True, min_length=8, trim_whitespace=False)

