from django.shortcuts import render
from .serializers import UserLoginSerializer, UserRegisterSerializer
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import UserLoginSerializer  # your serializer
from django.contrib.auth import get_user_model
from rest_framework.permissions import AllowAny

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
    permission_classes = [AllowAny]  # allow unauthenticated users to hit this endpoint

    def post(self, request, format=None):
        serializer = UserLoginSerializer(data=request.data)
        if not serializer.is_valid():
            # return serializer errors (400)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        # serializer is valid
        email = serializer.validated_data.get("email")
        password = serializer.validated_data.get("password")

        # authenticate using the provided credentials (do NOT hardcode)
        user = authenticate(request, email=email, password=password)

        if user is None:
            # invalid credentials
            return Response(
                {"detail": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED
            )

        # optional: generate JWT tokens (SimpleJWT). Remove if you use cookie-based refresh.
        refresh = RefreshToken.for_user(user)
        access_token = str(refresh.access_token)
        refresh_token = str(refresh)

        # If you prefer to set refresh as HttpOnly cookie, do it here instead of returning it in JSON.
        # Example (uncomment to set cookie):
        # response = Response({...}, status=status.HTTP_200_OK)
        # response.set_cookie("refresh_token", refresh_token, httponly=True, secure=True, samesite="Strict")
        # return response

        # successful response
        return Response(
            {
                "message": f"User authenticated successfully as {user.get_username()}",
                "username": user.get_username(),
                "email": getattr(user, "email", None),
                "access": access_token,
                "refresh": refresh_token,
            },
            status=status.HTTP_200_OK,
        )
