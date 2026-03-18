"""
Authentication middleware.
FastAPI dependency that verifies Supabase JWT tokens.
Falls back to demo user in development mode.
"""

import os
from typing import Optional

from fastapi import Depends, HTTPException, Request
from pydantic import BaseModel
from config.supabase import get_supabase


class CurrentUser(BaseModel):
    uid: str
    email: str
    name: str


DEMO_USER = CurrentUser(
    uid="demo-user-001",
    email="demo@mindwell.app",
    name="Demo User",
)


async def get_current_user(request: Request) -> CurrentUser:
    """
    Extract and verify the Bearer token from the Authorization header.
    In development mode without valid Supabase credentials, falls back to a demo user.
    """
    auth_header: Optional[str] = request.headers.get("authorization")
    is_dev = os.getenv("ENVIRONMENT", "development") != "production"

    # No token provided
    if not auth_header or not auth_header.startswith("Bearer "):
        if is_dev:
            return DEMO_USER
        raise HTTPException(status_code=401, detail="Unauthorized: No token provided")

    token = auth_header.split("Bearer ")[1]
    sb = get_supabase()

    # Supabase not configured
    if sb is None:
        if is_dev:
            return DEMO_USER
        raise HTTPException(status_code=500, detail="Auth service not configured")

    try:
        user_response = sb.auth.get_user(token)
        user = user_response.user

        if not user:
            raise ValueError("Invalid token")

        return CurrentUser(
            uid=user.id,
            email=user.email or "",
            name=(
                user.user_metadata.get("display_name")
                or user.user_metadata.get("full_name")
                or user.email
                or ""
            ),
        )
    except Exception:
        if is_dev:
            return DEMO_USER
        raise HTTPException(status_code=403, detail="Forbidden: Invalid token")
