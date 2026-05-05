import uuid
from datetime import timedelta
from django.utils import timezone
from django.db import transaction
from rest_framework_simplejwt.tokens import RefreshToken
from .selectors import get_latest_hotel_invite
from .models import HotelInvite
from .tasks import send_invite_email_task

@transaction.atomic
def process_hotel_invite_service(hotel, email: str):
    """
    Business logic for sending/resending invitations.
    Returns (invite_code, is_resend)
    """
    invite = get_latest_hotel_invite(hotel=hotel, email=email)
    is_resend = False

    if invite:
        is_resend = True
        # Logic: If expired or used, refresh it. If still valid, just resend the code.
        if invite.is_expired or invite.is_used:
            invite.code = uuid.uuid4()
            invite.created_at = timezone.now()
            invite.expires_at = timezone.now() + timedelta(days=2)
            invite.is_used = False
            invite.save()
    else:
        # Create a brand new invite
        invite = HotelInvite.objects.create(
            hotel=hotel,
            email=email,
            expires_at=timezone.now() + timedelta(days=2),
        )

    # Trigger Task
    resend_msg = "Again" if is_resend else None
    invite_link = f"http://localhost:5173/staff_invitation/invitation_link/join?code={invite.code}"
    
    send_invite_email_task.delay(
        email, invite_link, hotel.name, resend_msg
    )

    return invite.code




def get_auth_token(user):
    # Generating tokens
    refresh = RefreshToken.for_user(user)
    access_token = str(refresh.access_token)
    refresh_token = str(refresh)
    return (access_token,refresh_token)
