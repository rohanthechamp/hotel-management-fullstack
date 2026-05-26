import re
from typing import Optional
from django.core.cache import cache
def user_cache_key(
    prefix: str,
    *,
    unique_id: int,
    hotel_id: int,
    version: Optional[int] = None,
) -> str:
    """
    Build a cache key including both user and hotel (mutually inclusive).
    """
    # Instead of: if not unique_id or not hotel_id:
    if unique_id is None or hotel_id is None:
        raise ValueError("IDs cannot be None")
    # 1. Validate Prefix
    _VALID = re.compile(
        r"^[A-Za-z0-9_:]+$"
    )  # Added ':' to allow it in prefix if needed
    if not _VALID.match(prefix):
        raise ValueError(f"Invalid cache prefix: {prefix!r}")
    
    # 2. Strict validation for IDs (ensure they aren't 0 or None)
    if not unique_id or not hotel_id:
        raise ValueError("Both unique_id and hotel_id must be provided and non-zero.")

    # 3. Construct the base
    base = f"{prefix}_u{unique_id}_h{hotel_id}"

    # 4. Handle Versioning
    return f"v{version}:{base}" if version is not None else base


def get_cached_data(cache_key, fetch_func, timeout=600):
    """
    Generic helper to get data from cache or fetch from DB.

    :param cache_key: Unique string for the cache lookup
    :param fetch_func: A function (lambda or reference) that gets the data if cache misses
    :param timeout: Time in seconds to store the data
    """
    # today_start = timezone.now().replace(hour=0, minute=0, second=0, microsecond=0)
    # tomorrow_start = today_start + timedelta(days=1)
    # reqFilter = (
    #     Q(
    #         created_at__gte=timezone.now().replace(
    #             hour=0, minute=0, second=0, microsecond=0
    #         )
    #     )
    #     & Q(created_at__lte=tomorrow_start)
    #     & Q(status__in=["checked-in", "checked-out", "unconfirmed"])
    # )
    # data = cache.get(cache_key)

    # if data is not None:
    #     print("⚡ CACHE HIT AN")
    #     return data

    # Cache miss: Execute the database function
    data = fetch_func()

    if data is not None:
        cache.set(cache_key, data, timeout)

    return data
