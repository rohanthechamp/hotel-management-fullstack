from django.db.models.signals import post_save, post_delete, post_migrate
from django.dispatch import receiver
from django.core.cache import cache

from api.models import Guests,Bookings


CACHE_PATTERN = ["guest_bookings_version_"]
@receiver(post_save, sender=Guests)
@receiver(post_delete, sender=Guests)
@receiver(post_save, sender=Bookings)
@receiver(post_delete, sender=Bookings)
def invalidate_cache(sender, instance, **kwargs):

    print("🚨 SIGNAL TRIGGERED", instance.id)
   

    # delete guest bookings cache
    cache.delete_pattern("guest_bookings_version_*")

    # delete cabin booked dates cache
    if instance.cabin_id:
        cache_key = f"cabin_booked_dates_{instance.cabin_id}"
        cache.delete(cache_key)
