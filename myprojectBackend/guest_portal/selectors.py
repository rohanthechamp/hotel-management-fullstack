from typing import List, Dict, Any
from api.models import Bookings
from guest_portal.serializers import GuestBookingsSerializer


def get_bookings_for_guest(
    hotel_id: int,
    guest_id: int,
) -> List[Dict[str, Any]]:
    """
    Fetch optimized booking queryset and serialize it.
    """
    print("⚡% NO CACHE HIT Guest Bookings")
    queryset = (
        Bookings.objects.filter(
            hotel__id=hotel_id,
            guest__id=guest_id,
        )
        .select_related("cabin")
        .order_by("-created_at")
    )

    serializer = GuestBookingsSerializer(queryset, many=True)

    # serializer.data = list of dictionaries
    return serializer.data
