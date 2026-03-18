"""
Mood tracking routes.
Uses in-memory storage with Supabase persistence when available.
"""

from datetime import datetime, timezone, timedelta
from fastapi import APIRouter, Depends, HTTPException, Query

from middleware.auth import get_current_user, CurrentUser
from models.schemas import MoodRequest, VALID_MOODS
from config.supabase import get_supabase

router = APIRouter()

# In-memory fallback
_mood_entries: dict[str, list[dict]] = {}


@router.post("/")
async def log_mood(
    body: MoodRequest,
    user: CurrentUser = Depends(get_current_user),
):
    """Log a new mood entry."""
    if body.mood not in VALID_MOODS:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid mood. Must be one of: {', '.join(VALID_MOODS)}",
        )

    now = datetime.now(timezone.utc)
    entry = {
        "id": str(int(now.timestamp() * 1000)),
        "mood": body.mood,
        "notes": (body.notes or "").strip(),
        "timestamp": now.isoformat(),
        "date": now.strftime("%Y-%m-%d"),
    }

    # Persist to Supabase
    sb = get_supabase()
    if sb:
        try:
            result = sb.table("mood_entries").insert({
                "user_id": user.uid,
                "mood": body.mood,
                "notes": entry["notes"],
            }).execute()
            if result.data:
                entry["id"] = str(result.data[0]["id"])
        except Exception:
            pass

    # In-memory fallback
    if user.uid not in _mood_entries:
        _mood_entries[user.uid] = []
    _mood_entries[user.uid].append(entry)

    return {
        "success": True,
        "data": entry,
        "message": "Mood logged successfully!",
    }


@router.get("/")
async def get_mood_history(
    user: CurrentUser = Depends(get_current_user),
    days: int = Query(default=30, ge=1, le=365),
):
    """Get mood history for the authenticated user."""
    cutoff = datetime.now(timezone.utc) - timedelta(days=days)

    sb = get_supabase()
    entries = []

    if sb:
        try:
            result = (
                sb.table("mood_entries")
                .select("*")
                .eq("user_id", user.uid)
                .gte("created_at", cutoff.isoformat())
                .order("created_at", desc=False)
                .execute()
            )
            if result.data:
                entries = [
                    {
                        "id": str(row["id"]),
                        "mood": row["mood"],
                        "notes": row.get("notes", ""),
                        "timestamp": row["created_at"],
                        "date": row["created_at"][:10],
                    }
                    for row in result.data
                ]
        except Exception:
            pass

    # Fallback to in-memory
    if not entries:
        all_entries = _mood_entries.get(user.uid, [])
        entries = [
            e for e in all_entries
            if datetime.fromisoformat(e["timestamp"]) >= cutoff
        ]

    # Calculate distribution
    distribution = {m: 0 for m in VALID_MOODS}
    for e in entries:
        distribution[e["mood"]] = distribution.get(e["mood"], 0) + 1

    return {
        "success": True,
        "data": {
            "entries": entries,
            "distribution": distribution,
            "totalEntries": len(entries),
            "dateRange": {
                "from": cutoff.isoformat(),
                "to": datetime.now(timezone.utc).isoformat(),
            },
        },
    }


@router.get("/today")
async def get_today_status(user: CurrentUser = Depends(get_current_user)):
    """Check if the user has logged a mood today."""
    today = datetime.now(timezone.utc).strftime("%Y-%m-%d")

    sb = get_supabase()
    if sb:
        try:
            result = (
                sb.table("mood_entries")
                .select("*")
                .eq("user_id", user.uid)
                .gte("created_at", f"{today}T00:00:00")
                .limit(1)
                .execute()
            )
            if result.data:
                row = result.data[0]
                return {
                    "success": True,
                    "data": {
                        "hasLoggedToday": True,
                        "entry": {
                            "id": str(row["id"]),
                            "mood": row["mood"],
                            "notes": row.get("notes", ""),
                            "timestamp": row["created_at"],
                            "date": row["created_at"][:10],
                        },
                    },
                }
        except Exception:
            pass

    # In-memory fallback
    all_entries = _mood_entries.get(user.uid, [])
    today_entry = next((e for e in reversed(all_entries) if e["date"] == today), None)

    return {
        "success": True,
        "data": {
            "hasLoggedToday": today_entry is not None,
            "entry": today_entry,
        },
    }
