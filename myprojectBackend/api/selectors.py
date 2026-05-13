import hashlib

from django.core.cache import cache


def generate_cache_key(request):
    full_path = request.get_full_path()
    hashed = hashlib.md5(full_path.encode()).hexdigest()

    version = cache.get("cabins_version", 1)

    return f"cabins:{version}:{hashed}"


