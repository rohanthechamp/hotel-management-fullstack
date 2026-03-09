from functools import cache
from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from django.core.cache import cache
from flask import request

from api.utils.helpers import user_cache_key
from .models import Bookings

CACHE_PREFIX = ["dashboardLastxDays", "dailyRevenueLastXDays"]


@receiver(post_save, sender=Bookings)
@receiver(post_delete, sender=Bookings)
def invalidate_Cache(sender, instance, **kwargs):
    print("🚨 SIGNAL TRIGGERED clear_booking_dashboard_caches 🚨")

    current_user = getattr(instance, "user", None)
    if not (current_user and current_user.is_authenticated):
        return

    for prefix in CACHE_PREFIX:
        current_cache_key = user_cache_key(prefix, current_user, 1)
        cache.delete(current_cache_key)
