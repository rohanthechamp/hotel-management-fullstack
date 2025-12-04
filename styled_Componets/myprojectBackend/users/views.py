from django.shortcuts import render

from api import serializers
from .serializers import (
    UserLoginSerializer,
    UserRegisterSerializer,
)
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken, TokenError
from .serializers import UserLoginSerializer  # your serializer
from django.contrib.auth import get_user_model
from rest_framework.permissions import AllowAny
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from django.conf import settings


User = get_user_model()


# Create your views here.


class RegisterUserView(APIView):
    def post(self, request, format=None):
        serializer = UserRegisterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()  # calls create() and hashes password
            return Response(
                {"message": "User created successfully"}, status=status.HTTP_201_CREATED
            )
        return Response(
            serializer.errors, status=status.HTTP_400_BAD_REQUEST
        )  # if any error then return this response


# optional: if you use SimpleJWT and want to return tokens here


class LoginUserView(APIView):
    permission_classes = [AllowAny]  # allow unauthenticated users

    def post(self, request, format=None):
        serializer = UserLoginSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        email = serializer.validated_data.get("email")
        password = serializer.validated_data.get("password")

        user = authenticate(request, email=email, password=password)
        if user is None:
            return Response(
                {"detail": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED
            )

        username = user.name  # or any field you want to return

        # Generating tokens
        refresh = RefreshToken.for_user(user)
        access_token = str(refresh.access_token)
        refresh_token = str(refresh)

        # Create response
        response = Response(
            {
                "message": f"User authenticated successfully - {username}",
                "username": username,
                "email": getattr(user, "email", None),
                "access": access_token,
                "refresh":refresh_token,
                # Do NOT send refresh token in JSON anymore
            },
            status=status.HTTP_200_OK,
        )

    
        # response.set_cookie(
        #     key="refresh_token",
        #     value=refresh_token,
        #     httponly=True,
        #     secure=False,  # <--- MUST be False
        #     # samesite="Lax" is the default now
        #     max_age=7 * 24 * 60 * 60,
        # )

        # dev only     samesite="None",  # cross-origin/
        return response


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


class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        refreshToken = request.data.get("refresh", None)

        if not refreshToken:
            return Response(
        {"error": "Refresh token missing or expired"},
        status=status.HTTP_400_BAD_REQUEST,
    )


        try:
            token = RefreshToken(refreshToken)
            token.blacklist()  # <-- logout happens here
        except TokenError:
            return Response(
                {"error": "Invalid or expired refresh token"},
                status=status.HTTP_400_BAD_REQUEST,
            )

            # Clear cookie on client
        response = Response(
            {"message": "Logged out successfully."},
            status=status.HTTP_205_RESET_CONTENT,
        )
   
        return response
