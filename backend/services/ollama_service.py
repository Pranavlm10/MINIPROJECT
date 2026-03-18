"""
Ollama LLM service for personalized AI counselor responses.
Integrates with the local Ollama server to generate context-aware,
empathetic responses based on the user's conversation history and mood data.
"""

import httpx
from typing import Optional

OLLAMA_BASE = "http://localhost:11434"
MODEL_NAME = "llama3.2"

SYSTEM_PROMPT = """You are MindWell, a compassionate and professional AI mental health counselor for students. Your role is to provide empathetic, evidence-based emotional support.

CORE PRINCIPLES:
- Always validate the user's feelings before offering advice
- Use active listening techniques (reflect back what they said, ask clarifying questions)
- Draw from CBT (Cognitive Behavioral Therapy), mindfulness, and positive psychology
- Be warm but professional — never use emojis or overly casual language
- Keep responses concise (2-3 paragraphs max)
- When suggesting coping strategies, explain WHY they work
- Never diagnose conditions — you are a supportive counselor, not a clinician
- If crisis indicators are present, immediately prioritize safety and provide hotline numbers

PERSONALIZATION:
- Reference the user's previous mood patterns and conversations when relevant
- Notice emotional trends (e.g., "I notice you've been feeling anxious a lot this week")
- Celebrate progress and improvements
- Adjust your tone based on the detected emotion — be more gentle when they're distressed, more collaborative when they're calm

SAFETY:
- If the user mentions self-harm, suicide, or crisis situations, ALWAYS respond with empathy first, then provide crisis resources:
  * 988 Suicide & Crisis Lifeline: Call or text 988 (24/7)
  * Crisis Text Line: Text HOME to 741741 (24/7)
  * AASRA (India): Call 9820466726 (24/7)
  * Vandrevala Foundation (India): Call 1860-2662-345 (24/7)
"""


def _build_context(
    user_message: str,
    conversation_history: list[dict],
    mood_summary: Optional[dict] = None,
) -> list[dict]:
    """Build the message context for Ollama, including history and mood data."""
    messages = [{"role": "system", "content": SYSTEM_PROMPT}]

    # Add mood context if available
    if mood_summary:
        mood_context = "USER'S RECENT MOOD DATA:\n"
        if mood_summary.get("recentMoods"):
            mood_context += f"- Recent moods: {', '.join(mood_summary['recentMoods'])}\n"
        if mood_summary.get("dominantMood"):
            mood_context += f"- Most frequent mood this week: {mood_summary['dominantMood']}\n"
        if mood_summary.get("trend"):
            mood_context += f"- Trend: {mood_summary['trend']}\n"

        messages.append({
            "role": "system",
            "content": mood_context + "\nUse this data to personalize your response. Reference patterns if relevant, but don't overwhelm the user with data."
        })

    # Add conversation history (last 5 exchanges to keep context manageable and fast)
    for entry in conversation_history[-5:]:
        messages.append({"role": "user", "content": entry.get("userMessage", "")})
        messages.append({"role": "assistant", "content": entry.get("aiResponse", "")})

    # Add current message
    messages.append({"role": "user", "content": user_message})

    return messages


async def generate_ollama_response(
    user_message: str,
    conversation_history: list[dict],
    mood_summary: Optional[dict] = None,
) -> Optional[str]:
    """
    Generate a personalized response using Ollama.
    Returns None if Ollama is not available (falls back to template responses).
    """
    messages = _build_context(user_message, conversation_history, mood_summary)

    try:
        async with httpx.AsyncClient(timeout=httpx.Timeout(90.0, connect=10.0)) as client:
            print(f"[Ollama] Sending request to {MODEL_NAME}...")
            response = await client.post(
                f"{OLLAMA_BASE}/api/chat",
                json={
                    "model": MODEL_NAME,
                    "messages": messages,
                    "stream": False,
                    "options": {
                        "temperature": 0.7,
                        "top_p": 0.9,
                        "num_predict": 300,  # Shorter responses for faster generation
                    },
                },
            )
            response.raise_for_status()
            data = response.json()
            ai_text = data.get("message", {}).get("content", "").strip()
            print(f"[Ollama] Response received ({len(ai_text)} chars)")
            return ai_text
    except httpx.TimeoutException:
        print("[Ollama] Request timed out after 90 seconds")
        return None
    except httpx.ConnectError:
        print("[Ollama] Cannot connect — is Ollama running?")
        return None
    except Exception as e:
        print(f"[Ollama] Error: {e}")
        return None


async def is_ollama_available() -> bool:
    """Check if Ollama server is reachable and the model is loaded."""
    try:
        async with httpx.AsyncClient(timeout=5.0) as client:
            resp = await client.get(f"{OLLAMA_BASE}/api/tags")
            if resp.status_code == 200:
                models = resp.json().get("models", [])
                available = any(m.get("name", "").startswith(MODEL_NAME) for m in models)
                if available:
                    print(f"[Ollama] Model {MODEL_NAME} available")
                else:
                    print(f"[Ollama] Model {MODEL_NAME} NOT found. Available: {[m['name'] for m in models]}")
                return available
    except Exception as e:
        print(f"[Ollama] Server not reachable: {e}")
    return False
