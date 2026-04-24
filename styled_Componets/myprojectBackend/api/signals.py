from django.db.models.signals import post_save, post_delete, post_migrate
from django.dispatch import receiver
from django.core.cache import cache
from flask import request

from api.utils.helpers import user_cache_key
from .models import Bookings, Cabins


CACHE_PATTERN = ["cabinBookedDates_", "dashboard__", "BookingReadView_"]

@receiver(post_save, sender=Bookings)
@receiver(post_delete, sender=Bookings)
def invalidate_Cache(sender, instance, **kwargs):
    print("🚨 SIGNAL TRIGGERED clear_booking_dashboard_caches 🚨")
    guest_id = instance.guest_id
    current_user = getattr(instance, "user", None)
    if not (current_user and current_user.is_authenticated):
        return

    for pattern in CACHE_PATTERN:
        cache.delete_pattern(f"{pattern}*")

    cache.delete("bookings_count")
    version_key = f"guest_bookings_version:{guest_id}"
    version = cache.get(version_key, 1)
    cache.set(version_key, version + 1)


@receiver(post_save, sender=Cabins)
@receiver(post_delete, sender=Cabins)
def invalidate_Cache1(sender, instance, **kwargs):
    print("🚨 SIGNAL TRIGGERED cabin_list 🚨")

    current_user = getattr(instance, "user", None)
    if not (current_user and current_user.is_authenticated):
        return
    cache.delete("cabin_list")
