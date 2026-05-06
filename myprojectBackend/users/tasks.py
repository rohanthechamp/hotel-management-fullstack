from celery import shared_task
import logging

from users.utils import send_invite_email

logger = logging.getLogger("django")


@shared_task(
    bind=True,
    autoretry_for=(Exception,),
    retry_backoff=2,
    retry_backoff_max=60,
    retry_kwargs={"max_retries": 5},
)
def send_invite_email_task(
    self,
    email,
    invite_link,
    hotel_name,
    resend=None,
):
    task_id = self.request.id
    retry_count = self.request.retries

    logger.info(
        f"📨 [TASK STARTED] task_id={task_id} | "
        f"email={email} | hotel={hotel_name} | retries={retry_count}"
    )

    try:
        send_invite_email(
            email,
            invite_link,
            hotel_name,
            resend,
        )

        logger.info(
            f"✅ [EMAIL SENT SUCCESSFULLY] " f"task_id={task_id} | recipient={email}"
        )

    except Exception as e:
        logger.error(
            f"❌ [EMAIL TASK FAILED] "
            f"task_id={task_id} | recipient={email} | error={str(e)}",
            exc_info=True,
        )

        raise
