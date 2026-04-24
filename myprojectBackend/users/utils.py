from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string


def send_invite_email(email, invite_link, hotel_name,resend_msg=None):
    subject = f"You're invited to join {hotel_name}"

    html_content = render_to_string(
        "users/emails/invite_email.html",
        {
            "invite_link": invite_link,
            "hotel_name": hotel_name,
            "resend_msg":resend_msg
        },
    )

    text_content = render_to_string(
        "users/emails/invite_email.txt",
        {
            "invite_link": invite_link,
            "hotel_name": hotel_name,
        },
    )

    msg = EmailMultiAlternatives(
        subject,
        text_content,
        "your_email@gmail.com",
        [email],
    )

    msg.attach_alternative(html_content, "text/html")
    msg.send()