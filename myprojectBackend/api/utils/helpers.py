from django.db.models import Q

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

MAPPING = {
    "checked-out": "checked-out",
    "checked-in": "checked-in",
    "unconfirmed": "unconfirmed",
}


def decide_ttl(filterValue: int) -> int:
    if not isinstance(filterValue, int):
        raise TypeError(f"filterValue must be int, got {type(filterValue)}")

    if filterValue == 7:
        return 14400
    elif filterValue == 14:
        return 32400
    return 43200
