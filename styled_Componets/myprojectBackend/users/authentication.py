from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.exceptions import InvalidToken
from django.conf import settings


class CookieJWTAuthentication(JWTAuthentication):
    """
    Custom JWT authentication that reads tokens from httpOnly cookies
    instead of Authorization header
    """

    def authenticate(self, request):
        # Try to get token from cookie first
        access_token = request.COOKIES.get(settings.JWT_AUTH_COOKIE)

        if access_token is None:
            return None

        # Validate the token
        validated_token = self.get_validated_token(access_token)

        # Return user and token
        return self.get_user(validated_token), validated_token
