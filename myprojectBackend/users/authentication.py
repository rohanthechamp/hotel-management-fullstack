from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.exceptions import InvalidToken
from django.conf import settings


# class CookieJWTAuthentication(JWTAuthentication):
#     """
#     Custom JWT authentication that reads tokens from httpOnly cookies
#     instead of Authorization header
#     """

#     def authenticate(self, request):
#         # Try to get token from cookie first
#         access_token = request.COOKIES.get(settings.JWT_AUTH_COOKIE)

#         if access_token is None:
#             return None

#         # Validate the token
#         validated_token = self.get_validated_token(access_token)

# #         # Return user and token
# #         return self.get_user(validated_token), validated_token
# class CookieTokenRefreshView(APIView):
#     permission_classes = [AllowAny]

#     def post(self, request):
#         # read refresh token from cookie first
#         refresh_token = request.COOKIES.get("refresh_token")

#         # If not present in cookie (e.g. client didn't send cookies), allow
#         # the refresh token to be supplied in the request body as fallback
#         # (not recommended for production, prefer secure httpOnly cookies).
#         # if not refresh_token:
#         #   //refresh_token = request.data.get("refresh")

#         if not refresh_token:
#             return Response(
#                 {"error": "Refresh token not found."},
#                 status=status.HTTP_400_BAD_REQUEST,
#             )
#         try:
#             token = RefreshToken(refresh_token)
#             access_token = str(token.access_token)
#             return Response({"access": access_token}, status=status.HTTP_200_OK)
#         except TokenError:
#             return Response(
#                 {"error": "Invalid or expired refresh token."},
#                 status=status.HTTP_400_BAD_REQUEST,
#             )
