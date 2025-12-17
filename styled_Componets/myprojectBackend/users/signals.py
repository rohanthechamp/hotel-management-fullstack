from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth import get_user_model
from .models import Profile
import logging

User = get_user_model()
logger = logging.getLogger(__name__)


@receiver(post_save, sender=User)
def build_profile(sender, instance, created, **kwargs):
    if created:
        print("🚨🚨🚨 build_profile Signal Triggered and now in Action 🚨🚨🚨")
        Profile.objects.get_or_create(user=instance)
        logger.info(f"Profile is created for {instance.name}")
