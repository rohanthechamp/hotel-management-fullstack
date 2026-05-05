from celery import shared_task

import logging
from celery import group
from django.conf import settings
from smtplib import SMTPConnectError
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.utils.html import strip_tags

from users.utils import send_invite_email
logger = logging.getLogger("django")

@shared_task(
    bind=True,
    autoretry_for=(Exception,),
    retry_backoff=2,
    retry_backoff_max=60,
    retry_kwargs={"max_retries": 5},
)
def send_invite_email_task(email, invite_link, hotel_name,resend=None):
    send_invite_email(email, invite_link, hotel_name,resend)