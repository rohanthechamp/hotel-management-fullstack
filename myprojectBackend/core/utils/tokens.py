from typing import Tuple

from rest_framework_simplejwt.tokens import RefreshToken
import jwt
from datetime import (
    datetime,
    timedelta,
    timezone,
)
from django.conf import settings
ACCESS_TOKEN_MINUTES = 15
REFRESH_TOKEN_DAYS = 7
def generate_access_token(guest):

    payload = {
        "guest_id": guest.id,
        "email": guest.email,
        "type": "access",
        "exp": (datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_MINUTES)),
        "iat": datetime.now(timezone.utc),
    }

    return jwt.encode(
        payload,
        settings.SECRET_KEY,
        algorithm="HS256",
    )



def generate_refresh_token(guest):

    payload = {
        "guest_id": guest.id,
        "email": guest.email,
        "type": "refresh",
        "exp": (datetime.now(timezone.utc) + timedelta(days=REFRESH_TOKEN_DAYS)),
        "iat": datetime.now(timezone.utc),
    }

    return jwt.encode(
        payload,
        settings.SECRET_KEY,
        algorithm="HS256",
    )


def getTokens(guest) -> tuple[str, str]:

    # Using variables as keys with None or empty string values

    accesstoken = generate_access_token(guest)
    refreshtoken = generate_refresh_token(guest)

    return (accesstoken, refreshtoken)


def verify_token(token):

    try:

        payload = jwt.decode(
            token,
            settings.SECRET_KEY,
            algorithms=["HS256"],
        )

        return payload

    except jwt.ExpiredSignatureError:

        return None

    except jwt.InvalidTokenError:

        return None


def get_auth_token(user):
    # Generating tokens
    refresh = RefreshToken.for_user(user)
    access_token = str(refresh.access_token)
    refresh_token = str(refresh)
    
    return (access_token, refresh_token)
