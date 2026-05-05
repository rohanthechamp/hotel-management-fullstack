import hashlib
from typing import Type, Optional, List, Any
from typing import Optional
from django.db.models import Model
from django.core.cache import cache


def generate_cache_key(request):
    full_path = request.get_full_path()
    hashed = hashlib.md5(full_path.encode()).hexdigest()

    version = cache.get("cabins_version", 1)

    return f"cabins:{version}:{hashed}"


def get_model_data(
    hotel_id: int,
    model: Type[Model],
    fields_list: List[str],
    id: Optional[int] = None,
    query_optimize: Optional[str] = None,
    select_field: Optional[List[str]] = None,
):
    # check if id is there else throw error
    if not id and not hotel_id:
        raise ValueError("provided id or hotel id is missing")

    # start with all but remember django is lazy (no db hit yet)
    queryset = model.objects.all()

    # if we want to optimize using select_related
    if (
        query_optimize
        and query_optimize.startswith("yes")
        and query_optimize.endswith("select")
    ):
        if select_field:
            # use * to unpack list because select_related doesn't take dicts
            queryset = queryset.select_related(*select_field)

    # filter by id and get only specific fields
    # again use * to unpack fields_list
    return queryset.filter(id=id, hotel_id=hotel_id).values(*fields_list)
