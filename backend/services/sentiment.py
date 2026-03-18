"""
Sentiment analysis and therapeutic response engine.
Python port of the Node.js sentiment service.
Uses TextBlob for polarity analysis instead of the npm 'sentiment' package.
"""

from textblob import TextBlob
import random

# ── Crisis keywords ──────────────────────────────────────

CRISIS_KEYWORDS = [
    "suicide", "suicidal", "kill myself", "end my life", "want to die",
    "self-harm", "self harm", "cutting myself", "hurt myself",
    "no reason to live", "better off dead", "can't go on",
    "not worth living", "hopeless", "give up on life",
    "ending it", "ending it all", "overdose",
]


# ── Emotion mapping ─────────────────────────────────────

def get_emotion_label(polarity: float) -> str:
    """Map TextBlob polarity (-1 to +1) to an emotion label."""
    if polarity >= 0.5:
        return "joyful"
    if polarity >= 0.2:
        return "happy"
    if polarity >= 0.05:
        return "calm"
    if polarity > -0.05:
        return "neutral"
    if polarity > -0.2:
        return "concerned"
    if polarity > -0.4:
        return "sad"
    if polarity > -0.6:
        return "anxious"
    return "distressed"


# ── Therapeutic responses (emoji-free, professional) ─────

THERAPEUTIC_RESPONSES: dict[str, list[str]] = {
    "joyful": [
        "It's wonderful to hear you're feeling positive! What's been bringing you joy today? Reflecting on these moments can help build emotional resilience.",
        "That's great to hear! Positive emotions are worth savoring. Try to take a mental snapshot of how you're feeling right now — you can revisit this feeling during tougher times.",
        "I love the positive energy! Research shows that acknowledging good moments can amplify their effect on your well-being. What made today special?",
    ],
    "happy": [
        "I'm glad you're in a good space right now! What's contributing to this feeling? Recognizing sources of happiness helps us nurture them.",
        "That sounds really positive! Maintaining awareness of what makes you happy is a powerful self-care strategy. Would you like to talk more about what's been going well?",
        "It's great that you're feeling good! Building on positive moments is an important part of emotional well-being.",
    ],
    "calm": [
        "It sounds like you're in a balanced state, which is wonderful. Is there anything on your mind you'd like to explore or reflect on?",
        "A calm mind is a gift. Would you like to use this moment for some reflection, gratitude journaling, or simply to chat about your day?",
        "You seem at peace right now. This is a great time to set intentions or reflect on what's been working well for you.",
    ],
    "neutral": [
        "Thanks for sharing. I'm here to listen and support you. How are you really feeling today? Sometimes we carry more than we show on the surface.",
        "I hear you. Would you like to explore your feelings a bit deeper? Sometimes talking through our thoughts can reveal what we truly need.",
        "I'm here for you, whatever you need. Would you like to talk about your day, explore a coping strategy, or just have a conversation?",
    ],
    "concerned": [
        "I sense something might be weighing on you. It's completely okay to feel this way. Would you like to talk about what's on your mind?",
        "It sounds like things might be a bit challenging right now. Remember, it's okay not to be okay. I'm here to listen without judgment.",
        "I want you to know that your feelings are valid. Would it help to talk through what's been going on? Sometimes sharing can lighten the emotional load.",
    ],
    "sad": [
        "I'm sorry you're going through a difficult time. Your feelings are completely valid. Would you like to talk about what's making you sad?",
        "It takes courage to acknowledge sadness. I'm here with you. Would you like to try a grounding exercise, or would talking things through feel better?",
        "I hear the sadness in your words, and I want you to know you don't have to carry it alone. What would feel most helpful right now — talking, a coping strategy, or just knowing someone cares?",
    ],
    "anxious": [
        "Anxiety can feel overwhelming, but you've taken a brave step by reaching out. Let's try a quick grounding exercise: Name 5 things you can see, 4 you can touch, 3 you can hear, 2 you can smell, and 1 you can taste.",
        "I understand that feeling of anxiety — it's more common than you might think, especially for students. Let's work through this together. Can you tell me what's triggering your anxiety right now?",
        "When anxiety hits, your body's fight-or-flight response activates. Try this: breathe in for 4 counts, hold for 7, exhale for 8. Repeat 3 times. I'm right here with you.",
    ],
    "distressed": [
        "I can tell you're going through something really tough right now, and I want you to know that reaching out was the right thing to do. You are not alone in this.",
        "I hear you, and your pain is valid. Right now, the most important thing is your safety and well-being. Would you like me to share some professional resources that can provide immediate support?",
        "What you're feeling sounds really heavy, and no one should have to face that alone. I care about your well-being. Let's talk about getting you some additional support — would that be okay?",
    ],
}


# ── Coping strategies ────────────────────────────────────

COPING_STRATEGIES: dict[str, list[dict[str, str]]] = {
    "joyful": [
        {"title": "Gratitude Journaling", "description": "Write down 3 things you're grateful for to amplify positive feelings."},
        {"title": "Share the Joy", "description": "Tell a friend or family member about your positive experience."},
    ],
    "happy": [
        {"title": "Mindful Savoring", "description": "Pause and fully immerse yourself in this positive moment."},
        {"title": "Create a Joy List", "description": "Start a list of things that bring you happiness for future reference."},
    ],
    "calm": [
        {"title": "Meditation", "description": "Try a 5-minute guided meditation to deepen your sense of calm."},
        {"title": "Reflective Writing", "description": "Write about what's helped you feel balanced today."},
    ],
    "neutral": [
        {"title": "Body Scan", "description": "Do a quick body scan to check in with how you're physically feeling."},
        {"title": "Goal Setting", "description": "Use this balanced moment to set a small, achievable goal for today."},
    ],
    "concerned": [
        {"title": "Progressive Muscle Relaxation", "description": "Tense and release each muscle group for 5 seconds to relieve tension."},
        {"title": "Thought Reframing", "description": "Write down your worry, then write a more balanced perspective next to it."},
    ],
    "sad": [
        {"title": "Self-Compassion Break", "description": 'Place your hand on your heart and say: "This is a moment of suffering. May I be kind to myself."'},
        {"title": "Gentle Movement", "description": "Take a short walk outside or do some gentle stretching to shift your energy."},
        {"title": "Connect with Someone", "description": "Reach out to a trusted friend, family member, or counselor."},
    ],
    "anxious": [
        {"title": "5-4-3-2-1 Grounding", "description": "Name 5 things you see, 4 you touch, 3 you hear, 2 you smell, 1 you taste."},
        {"title": "4-7-8 Breathing", "description": "Inhale for 4 counts, hold for 7 counts, exhale for 8 counts. Repeat 3 times."},
        {"title": "Worry Time", "description": "Schedule 15 minutes to write all your worries. Outside this time, gently redirect your focus."},
    ],
    "distressed": [
        {"title": "Immediate Grounding", "description": "Hold an ice cube, splash cold water on your face, or press your feet firmly on the ground."},
        {"title": "Reach Out Now", "description": "Contact a crisis helpline: 988 Suicide & Crisis Lifeline (call/text 988) or Crisis Text Line (text HOME to 741741)."},
        {"title": "Safety Planning", "description": "Remove access to anything harmful. Go to a safe space. Call someone you trust."},
    ],
}


# ── Public functions ─────────────────────────────────────

def analyze_text(text: str) -> dict:
    """Analyze text for sentiment, emotion, and crisis indicators."""
    lower_text = text.lower()
    blob = TextBlob(text)
    polarity = blob.sentiment.polarity  # -1 to +1

    is_crisis = any(kw in lower_text for kw in CRISIS_KEYWORDS)
    emotion = get_emotion_label(polarity)

    if is_crisis:
        emotion = "distressed"

    return {
        "score": round(polarity, 4),
        "comparative": round(polarity, 4),
        "emotion": emotion,
        "isCrisis": is_crisis,
    }


def generate_response(analysis: dict) -> dict:
    """Generate an empathetic, context-aware response based on sentiment analysis."""
    emotion = analysis["emotion"]
    is_crisis = analysis["isCrisis"]

    responses = THERAPEUTIC_RESPONSES.get(emotion, THERAPEUTIC_RESPONSES["neutral"])
    message = random.choice(responses)

    strategies = COPING_STRATEGIES.get(emotion, COPING_STRATEGIES["neutral"])

    response = {
        "message": message,
        "emotion": emotion,
        "strategies": strategies,
        "isCrisis": is_crisis,
    }

    if is_crisis:
        response["crisisResources"] = {
            "message": "I'm concerned about your safety. Please reach out to a professional immediately:",
            "resources": [
                {"name": "988 Suicide & Crisis Lifeline", "contact": "Call or text 988", "available": "24/7"},
                {"name": "Crisis Text Line", "contact": "Text HOME to 741741", "available": "24/7"},
                {"name": "AASRA (India)", "contact": "Call 9820466726", "available": "24/7"},
                {"name": "iCall (India)", "contact": "Call 9152987821", "available": "Mon-Sat, 8am-10pm"},
                {"name": "Vandrevala Foundation (India)", "contact": "Call 1860-2662-345", "available": "24/7"},
                {"name": "IASP Crisis Centres", "contact": "https://www.iasp.info/resources/Crisis_Centres/", "available": "Directory"},
            ],
        }

    return response
