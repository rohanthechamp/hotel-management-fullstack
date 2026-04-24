# myprojectBackend/celery.py
import os
from celery import Celery
# Set the default Django settings module for the 'celery' program.
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "myprojectBackend.settings")

app = Celery("myprojectBackend")
# Set Celery timezone
app.conf.timezone = "Asia/Kolkata"
app.conf.enable_utc = False

# Use Django's settings module for Celery's configuration
app.config_from_object("django.conf:settings", namespace="CELERY")

# Auto-discover tasks from installed apps
app.autodiscover_tasks()


