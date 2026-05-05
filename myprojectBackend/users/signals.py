from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from django.contrib.auth import get_user_model

# from myprojectBackend.core.utils.caching import user_cache_key
from .models import HotelInvite, Profile
import logging
from django.core.cache import cache

User = get_user_model()
logger = logging.getLogger(__name__)


@receiver(post_save, sender=User)
def build_profile(sender, instance, created, **kwargs):
    if created:
        print("🚨🚨🚨 build_profile Signal Triggered and now in Action 🚨🚨🚨")
        Profile.objects.get_or_create(user=instance)
        logger.info(f"Profile is created for {instance.name}")


@receiver([post_save, post_delete], sender=HotelInvite)
def invalidate_hotel_invites(sender, instance, **kwargs):
    hotel_id = instance.hotel.id
    version_key = f"hotel_invites_version_{hotel_id}"
    
    try:
        cache.incr(version_key)
    except ValueError:
        # If the key doesn't exist yet, initialize it
        cache.set(version_key, 2)