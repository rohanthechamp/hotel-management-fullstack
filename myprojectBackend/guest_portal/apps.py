from django.apps import AppConfig


class GuestPortalConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "guest_portal"


    def ready(self):
        import guest_portal.signals

        _ = guest_portal.signals  # Mar
