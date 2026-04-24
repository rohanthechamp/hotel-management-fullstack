from functools import partial
import uuid
from xml.etree.ElementTree import iselement
from django.shortcuts import render
from requests import get
from django.core.cache import cache

from api import serializers
from users.models import Hotel, HotelInvite
from users.tasks import send_invite_email_task
from .serializers import (
    AdminRegisterSerializer,
    CreateHotelSerializer,
    HotelInviteSerializer,
    HotelSerializer,
    UpdateCurrentUserSerializer,
    UpdateUserPassword,
    UserLoginSerializer,
    UserMeSerializer,
    StaffRegisterSerializer,
    ValidateInviteSerializer,
)
from django.core.mail import send_mail
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
from rest_framework import status

User = get_user_model()
from rest_framework.generics import CreateAPIView


# Create your views here.from django.core.mail import send_mail
from django.utils import timezone
from datetime import timedelta
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django.contrib.auth import get_user_model
from .serializers import CreateHotelSerializer

User = get_user_model()


class CreateHotelView(APIView):
    # Changed to AllowAny so you don't need a Bearer Token while testing
    permission_classes = [AllowAny]

    def post(self, request):
        # --- ORIGINAL LOGIC (COMMENTED OUT) ---
        # if request.user.role != "Admin":
        #     return Response({"error": "Only admins can create hotel"}, status=403)
        # ---------------------------------------

        serializer = CreateHotelSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        # 1. Save the hotel (the serializer handles the admin_id mapping)
        hotel = serializer.save()

        # 2. Manual Logic for API Testing:
        # Get the admin_id from the request body to link the user
        admin_id = request.data.get("admin_id")

        if admin_id:
            try:
                # Find the specific user you want to link
                user_to_link = User.objects.get(id=admin_id)

                # Link the hotel to this user
                user_to_link.hotel = hotel
                user_to_link.save()
            except User.DoesNotExist:
                return Response(
                    {
                        "message": "Hotel created, but admin_id user not found to link.",
                        "hotel_id": hotel.id,
                    },
                    status=201,
                )

        return Response(
            {
                "message": "Hotel created and linked successfully",
                "hotel_id": hotel.id,
                "linked_user_id": admin_id,
            },
            status=201,
        )


class AdminRegisterView(CreateAPIView):
    serializer_class = AdminRegisterSerializer



class SendInviteEmailView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        if request.user.role != "Admin":
            return Response(
                {"error": "Only admin is allowed to send invites"},
                status=status.HTTP_403_FORBIDDEN,
            )

        email = request.data.get("email")
        if not email:
            return Response(
                {"error": "Email is required"}, status=status.HTTP_400_BAD_REQUEST
            )

        is_exits = (
            HotelInvite.objects.filter(hotel=request.user.hotel, email=email)
            .order_by("-created_at")
            .first()
        )

        invite_code, resend_msg = None

        if is_exits:

            if not is_exits.is_expired and not is_exits.is_used:
                pass
            else:
                is_exits.created_at = timezone.now()
                is_exits.code = uuid.uuid4()
                is_exits.expires_at = timezone.now() + timedelta(days=2)
                is_exits.is_used = False

                is_exits.save()

            invite_code = is_exits.code

        if not is_exits:
            invite = HotelInvite.objects.create(
                hotel=request.user.hotel,
                email=email,
                expires_at=timezone.now() + timedelta(days=2),
            )
            invite_code = invite.code

        if is_exits:
            resend_msg = "Again"

        invite_link = f"http://localhost:5173/staff_invitation/invitation_link/join?code={invite_code}"
        send_invite_email_task.delay(
            email, invite_link, request.user.hotel.name, resend_msg
        )

        return Response(
            {"message": "Invite sent successfully", "email": email},
            status=status.HTTP_201_CREATED,
        )   


class ValidateInviteView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        code = request.query_params.get("code")

        if not code:
            return Response(
                {"valid": False, "error": "Invite code is required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            invite = HotelInvite.objects.select_related("hotel").get(code=code)
        except HotelInvite.DoesNotExist:
            return Response({"valid": False}, status=status.HTTP_200_OK)

        # 🔥 core validation
        if not invite.is_valid():
            return Response({"valid": False}, status=status.HTTP_200_OK)

        # ✅ valid case
        data = {
            "valid": True,
            "email": invite.email,
            "hotel_name": invite.hotel.name,
        }

        serializer = ValidateInviteSerializer(data)
        return Response(serializer.data, status=status.HTTP_200_OK)


class HotelInviteListView(APIView):  # Renamed for REST standards
    permission_classes = [IsAuthenticated]

    def get(self, request):

        admin_id = request.user.id
        # print('admin id',admin_id,request.user)
        cache_key = f"hotel_invites_{admin_id}"

        # 1. Try to get cached data
        cached_data = cache.get(cache_key)
        if cached_data:
            return Response(cached_data)

        invites = HotelInvite.objects.filter(hotel__admin_id=admin_id)

        serializer = HotelInviteSerializer(invites, many=True)
        data = serializer.data

        cache.set(cache_key, data, 3600)

        return Response(data)


class StaffRegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, format=None):
        serializer = StaffRegisterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()  # calls create() and hashes password
            return Response(
                {"message": "User created successfully"}, status=status.HTTP_201_CREATED
            )
        return Response(
            serializer.errors, status=status.HTTP_400_BAD_REQUEST
        )  # if any error then return this response


# class AdminHotelView(APIView):
#     permission_classes = [IsAuthenticated]

#     def get(self, request):
#         try:
#             hotel = request.user.owned_hotel
#         except Hotel.DoesNotExist:
#             return Response(
#                 {"error": "No hotel found for this admin"},
#                 status=status.HTTP_404_NOT_FOUND,
#             )

#         serializer = HotelSerializer(hotel)
#         return Response(serializer.data)


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
        userRole = user.role

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
                "refresh": refresh_token,
                "userRole": userRole,
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


class LogoutView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        refreshToken = request.data.get("refreshToken", None)
        # print('USER  refresh token -',refreshToken)
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


class GetCurrentDetails(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user_id = request.user.id
        # Unique key per user
        cache_key = f"user_details_{user_id}"

        # 1. Try to get data from cache
        cached_user_data = cache.get(cache_key)

        if cached_user_data is not None:
            return Response(cached_user_data)

        # 2. If not cached, serialize the current user
        serializer = UserMeSerializer(request.user)
        data = serializer.data

        # 3. Store in cache (e.g., for 2 hours / 7200 seconds)
        cache.set(cache_key, data, 7200)

        return Response(data)


class UpdateCurrentUserView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request):

        cache.delete(f"user_details_{self.request.user.id}")
        serializer = UpdateCurrentUserSerializer(
            instance=request.user,
            data=request.data,
            partial=True,
        )

        if serializer.is_valid():
            serializer.save()
            return Response(
                {"message": "User Updated successfully."},
                status=status.HTTP_200_OK,
            )
        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST,
        )


class UpdateCurrentUserPasswordView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request):
        serializer = UpdateUserPassword(
            instance=request.user,
            data=request.data,
            partial=True,
        )

        if serializer.is_valid():
            serializer.save()
            return Response(
                {"message": "User Password Updated successfully."},
                status=status.HTTP_200_OK,
            )
        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST,
        )
