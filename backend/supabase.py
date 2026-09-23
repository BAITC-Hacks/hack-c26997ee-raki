from functools import lru_cache

from supabase import Client, create_client

from .config import get_settings


@lru_cache
def get_supabase() -> Client:
    settings = get_settings()
    if not settings.supabase_url or not settings.supabase_key:
        raise RuntimeError("SUPABASE_URL and SUPABASE_ANON_KEY must be configured")
    return create_client(settings.supabase_url, settings.supabase_key)


def get_user_supabase(access_token: str) -> Client:
    """Create a request-scoped client so Supabase RLS sees the caller's JWT."""
    settings = get_settings()
    if not settings.supabase_url or not settings.supabase_key:
        raise RuntimeError("SUPABASE_URL and SUPABASE_ANON_KEY must be configured")
    client = create_client(settings.supabase_url, settings.supabase_key)
    client.postgrest.auth(access_token)
    return client
