# def validate_positive(value):
#     """Reusable check: value must be > 0."""
#     if value is None or value <= 0:
#         raise serializers.ValidationError("Value must be greater than zero.")


# def validate_alpha_space(value):
#     """Reusable check: only letters and spaces allowed (good for nationality / names)."""
#     alpha_space = RegexValidator(r"^[A-Za-z\s]+$")
#     try:
#         alpha_space(value)
#     except Exception:
#         raise serializers.ValidationError(
#             "This field may only contain letters and spaces."
#         )


# def validate_image_file(value):
#     """
#     Production-level image validation for countryFlag field:
#     1. Ensures file is actually an image (not just renamed file).
#     2. Accepts only JPEG and PNG formats.
#     3. Limits file size to 2MB.
#     """
#     # Check size
#     max_size = 2 * 1024 * 1024  # 2 MB
#     if hasattr(value, "size") and value.size > max_size:
#         raise serializers.ValidationError("Image must be smaller than 2MB.")

#     # Check content and format
#     try:
#         img = Image.open(value)
#         img.verify()  # verify that it is a valid image
#     except Exception:
#         raise serializers.ValidationError("Uploaded file is not a valid image.")

#     if img.format.upper() not in ["JPEG", "PNG"]:
#         raise serializers.ValidationError("Only JPEG and PNG images are allowed.")

#     return value
import string

from django.db.models import Q

# from .models import ExpenseModel
import json
from django.db.models import Sum, Q, QuerySet, OuterRef, F, Subquery
from django.db.models.functions import ExtractMonth
from django.utils import timezone
from django.core.cache import cache
from django.contrib.postgres.search import (
    SearchQuery,
    SearchVector,
    SearchRank,
)
import logging
from dateutil.relativedelta import relativedelta
from django.db.models.functions import TruncDay
import calendar

# from myapp.models import Budget
# import pandas as pd
# import matplotlib.pyplot as plt
# from io import BytesIO
# import base64
# from myapp.models import ExpenseModel, Income, Budget
from typing import List, Optional
from django.contrib.auth.models import User


import traceback

# from tablib import Dataset
import re

BUCKETS = [
    ("1 night", Q(numNights=1)),
    ("2 nights", Q(numNights=2)),
    ("3 nights", Q(numNights=3)),
    ("4–5 nights", Q(numNights__gte=4, numNights__lte=5)),
    ("6–7 nights", Q(numNights__gte=6, numNights__lte=7)),
    ("8–14 nights", Q(numNights__gte=8, numNights__lte=14)),
    ("15–21 nights", Q(numNights__gte=15, numNights__lte=21)),
    ("21+ nights", Q(numNights__gte=22)),
]


import re
from typing import Optional, Union
from django.contrib.auth.models import User

def user_cache_key(
    prefix: str,
    *,
    user: Optional[User] = None,
    hotel_id: Optional[int] = None,
    version: Optional[int] = None,
) -> str:
    """
    Build a cache key for either user OR hotel (mutually exclusive).
    """

    _VALID = re.compile(r"^[A-Za-z0-9_]+$")
    if not _VALID.match(prefix):
        raise ValueError(f"Invalid cache prefix: {prefix!r}")

    # ❗ Enforce rule: only one allowed
    if user and hotel_id:
        raise ValueError("Provide either user or hotel_id, not both")

    if not user and not hotel_id:
        raise ValueError("Either user or hotel_id must be provided")

    if user:
        base = f"{prefix}_u{user.id}"
    else:
        base = f"{prefix}_h{hotel_id}"

    return f"v{version}:{base}" if version is not None else base

def decide_ttl(filterValue: int) -> int:
    if not isinstance(filterValue, int):
        raise TypeError(f"filterValue must be int, got {type(filterValue)}")

    if filterValue == 7:
        return 14400
    elif filterValue == 14:
        return 32400
    return 43200