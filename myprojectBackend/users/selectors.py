from .serializers import HotelInviteSerializer

from .models import HotelInvite


def get_latest_hotel_invite(hotel, email: str):
    """Fetch the most recent invite for a specific hotel and email."""
    return (
        HotelInvite.objects.filter(hotel=hotel, email=email)
        .order_by("-created_at")
        .first()
    )


def get_hotel_code(code):
    return HotelInvite.objects.select_related("hotel").get(code=code)


def get_hotel_invites(admin_id):
    invite_data=HotelInvite.objects.filter(hotel__admin_id=admin_id)
    serializer = HotelInviteSerializer(invite_data, many=True)
    invites = serializer.data
    return invites
