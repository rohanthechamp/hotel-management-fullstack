from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from django.contrib.auth import get_user_model
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


@receiver(post_save, sender=HotelInvite)
@receiver(post_delete, sender=HotelInvite)
def invalidate_Cache1(sender, instance, **kwargs):
    print("🚨 SIGNAL TRIGGERED Hotel Invite 🚨")
    admin_id = instance.hotel.admin.id
    cache_key = f"ReadHotelInviteView__{admin_id}"
    cache.delete(cache_key)
