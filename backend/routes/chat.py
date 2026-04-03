"""
Chat routes — AI counselor conversation endpoints.
Uses Ollama LLM for personalized responses with template fallback.
Persists to Supabase when available, in-memory otherwise.
"""

from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException

from middleware.auth import get_current_user, CurrentUser
from models.schemas import ChatRequest
from services.sentiment import analyze_text, generate_response
from services.ollama_service import generate_ollama_response, is_ollama_available
from config.supabase import get_supabase

router = APIRouter()

# In-memory fallback storage
_conversations: dict[str, list[dict]] = {}


def _get_mood_summary(user_id: str) -> dict | None:
    """Fetch the user's recent mood data for context personalization."""
    sb = get_supabase()
    if not sb:
        return None

    try:
        result = (
            sb.table("mood_entries")
            .select("mood, created_at")
            .eq("user_id", user_id)
            .order("created_at", desc=True)
            .limit(14)
            .execute()
        )
        if not result.data:
            return None

        moods = [r["mood"] for r in result.data]
        # Find dominant mood
        mood_counts: dict[str, int] = {}
        for m in moods:
            mood_counts[m] = mood_counts.get(m, 0) + 1
        dominant = max(mood_counts, key=mood_counts.get) if mood_counts else None

        # Simple trend detection
        if len(moods) >= 4:
            positive = {"amazing", "happy", "calm"}
            recent_positive = sum(1 for m in moods[:4] if m in positive)
            older_positive = sum(1 for m in moods[4:8] if m in positive) if len(moods) > 4 else 2
            if recent_positive > older_positive:
                trend = "improving"
            elif recent_positive < older_positive:
                trend = "declining"
            else:
                trend = "stable"
        else:
            trend = "not enough data"

        return {
            "recentMoods": moods[:7],
            "dominantMood": dominant,
            "trend": trend,
            "totalEntries": len(moods),
        }
    except Exception:
        return None


def _get_history(user_id: str) -> list[dict]:
    """Get conversation history from Supabase or in-memory."""
    sb = get_supabase()
    if sb:
        try:
            result = (
                sb.table("chat_messages")
                .select("user_message, ai_response")
                .eq("user_id", user_id)
                .order("created_at", desc=True)
                .limit(10)
                .execute()
            )
            if result.data:
                return [
                    {"userMessage": r["user_message"], "aiResponse": r["ai_response"]}
                    for r in reversed(result.data)
                ]
        except Exception:
            pass

    return [
        {"userMessage": e["userMessage"], "aiResponse": e["aiResponse"]}
        for e in _conversations.get(user_id, [])[-10:]
    ]


@router.post("/")
async def send_message(
    body: ChatRequest,
    user: CurrentUser = Depends(get_current_user),
):
    """Send a message to the AI counselor. Uses Ollama for personalized responses."""
    message = body.message.strip()
    if not message:
        raise HTTPException(status_code=400, detail="Message is required")

    print(f"[Chat] User '{user.uid}' sent: {message[:80]}")

    # Always run sentiment analysis (for emotion badges + crisis detection)
    analysis = analyze_text(message)
    print(f"[Chat] Sentiment: {analysis['emotion']}, crisis={analysis['isCrisis']}")

    # Try Ollama for a personalized response
    ai_response_text = None
    ollama_available = await is_ollama_available()
    print(f"[Chat] Ollama available: {ollama_available}")

    if ollama_available:
        history = _get_history(user.uid)
        mood_summary = _get_mood_summary(user.uid)
        print(f"[Chat] Context: {len(history)} history, mood={'yes' if mood_summary else 'no'}")
        ai_response_text = await generate_ollama_response(message, history, mood_summary)
        print(f"[Chat] Ollama result: {'OK ' + str(len(ai_response_text)) + ' chars' if ai_response_text else 'FAILED - using fallback'}")

    # Fall back to template responses if Ollama is unavailable or failed
    if not ai_response_text:
        template_response = generate_response(analysis)
        ai_response_text = template_response["message"]
        strategies = template_response["strategies"]
    else:
        # Still provide strategies from the template system
        template_response = generate_response(analysis)
        strategies = template_response["strategies"]

    entry = {
        "id": str(int(datetime.now(timezone.utc).timestamp() * 1000)),
        "userMessage": message,
        "aiResponse": ai_response_text,
        "emotion": analysis["emotion"],
        "analysis": {
            "score": analysis["score"],
            "comparative": analysis["comparative"],
            "isCrisis": analysis["isCrisis"],
        },
        "strategies": strategies,
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }

    # Add crisis resources if detected
    if analysis["isCrisis"]:
        entry["crisisResources"] = {
            "message": "I'm concerned about your safety. Please reach out to a professional immediately:",
            "resources": [
                {"name": "988 Suicide & Crisis Lifeline", "contact": "Call or text 988", "available": "24/7"},
                {"name": "Crisis Text Line", "contact": "Text HOME to 741741", "available": "24/7"},
                {"name": "AASRA (India)", "contact": "Call 9820466726", "available": "24/7"},
                {"name": "iCall (India)", "contact": "Call 9152987821", "available": "Mon-Sat, 8am-10pm"},
                {"name": "Vandrevala Foundation (India)", "contact": "Call 1860-2662-345", "available": "24/7"},
            ],
        }

    # Persist to Supabase
    sb = get_supabase()
    if sb:
        try:
            sb.table("chat_messages").insert({
                "user_id": user.uid,
                "user_message": message,
                "ai_response": ai_response_text,
                "emotion": analysis["emotion"],
                "analysis": entry["analysis"],
                "strategies": strategies,
                "crisis_resources": entry.get("crisisResources"),
            }).execute()
        except Exception:
            pass

    # In-memory storage
    if user.uid not in _conversations:
        _conversations[user.uid] = []
    _conversations[user.uid].append(entry)

    return {"success": True, "data": entry}


@router.get("/history")
async def get_chat_history(user: CurrentUser = Depends(get_current_user)):
    """Retrieve chat history for the authenticated user (last 50 messages)."""
    sb = get_supabase()

    if sb:
        try:
            result = (
                sb.table("chat_messages")
                .select("*")
                .eq("user_id", user.uid)
                .order("created_at", desc=True)
                .limit(50)
                .execute()
            )
            if result.data:
                entries = [
                    {
                        "id": str(row["id"]),
                        "userMessage": row["user_message"],
                        "aiResponse": row["ai_response"],
                        "emotion": row["emotion"],
                        "analysis": row.get("analysis", {}),
                        "strategies": row.get("strategies", []),
                        "crisisResources": row.get("crisis_resources"),
                        "timestamp": row["created_at"],
                    }
                    for row in reversed(result.data)
                ]
                return {"success": True, "data": entries}
        except Exception:
            pass

    history = _conversations.get(user.uid, [])
    return {"success": True, "data": history[-50:]}


@router.delete("/history")
async def clear_history(user: CurrentUser = Depends(get_current_user)):
    """Clear chat history for the authenticated user."""
    sb = get_supabase()

    if sb:
        try:
            sb.table("chat_messages").delete().eq("user_id", user.uid).execute()
        except Exception:
            pass

    _conversations.pop(user.uid, None)
    return {"success": True, "message": "Chat history cleared"}
