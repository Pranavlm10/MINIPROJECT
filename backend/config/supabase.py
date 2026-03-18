"""
Supabase client configuration.
Initializes the admin client using the service role key for server-side operations.
"""

import os
from dotenv import load_dotenv
from supabase import create_client, Client

# Ensure .env is loaded before reading env vars
load_dotenv()

supabase_url: str = os.getenv("SUPABASE_URL", "")
supabase_service_key: str = os.getenv("SUPABASE_SERVICE_ROLE_KEY", "")

supabase: Client | None = None

if supabase_url and supabase_service_key and "your-" not in supabase_url:
    try:
        supabase = create_client(supabase_url, supabase_service_key)
        print(f"Supabase connected: {supabase_url}")
    except Exception as e:
        print(f"Supabase initialization warning: {e}")
        supabase = None
else:
    print("Supabase not configured — running in demo mode (in-memory storage)")


def get_supabase() -> Client | None:
    """Return the initialized Supabase client."""
    return supabase
