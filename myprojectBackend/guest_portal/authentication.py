from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed
from core.utils.tokens import verify_token
from api.models import Guests


class GuestJWTAuthentication(BaseAuthentication):

    def authenticate(self, request):

        auth_header = request.headers.get("Authorization")
        print("GuestJWTAuthentication", auth_header)

        if not auth_header:

            return None

        try:

            prefix, token = auth_header.split()

            if prefix != "Bearer":

                raise AuthenticationFailed("Invalid token prefix")

        except ValueError:

            raise AuthenticationFailed("Invalid authorization header")

        payload = verify_token(token)
        

        if payload is None:

            raise AuthenticationFailed("Invalid or expired token")

        if payload["type"] != "access":

            raise AuthenticationFailed("Invalid token type")

        guest = Guests.objects.filter(id=payload["guest_id"]).first()

        if guest is None:

            raise AuthenticationFailed("Guest not found")

        return (guest, token)
