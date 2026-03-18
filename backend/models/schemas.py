"""
Pydantic models for request/response validation.
"""

from typing import Optional
from pydantic import BaseModel, Field


# ── Chat ──────────────────────────────────────────────

class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1, max_length=5000)


class Strategy(BaseModel):
    title: str
    description: str


class CrisisResource(BaseModel):
    name: str
    contact: str
    available: str


class CrisisInfo(BaseModel):
    message: str
    resources: list[CrisisResource]


class ChatAnalysis(BaseModel):
    score: float
    comparative: float
    isCrisis: bool


class ChatEntry(BaseModel):
    id: str
    userMessage: str
    aiResponse: str
    emotion: str
    analysis: ChatAnalysis
    strategies: list[Strategy]
    crisisResources: Optional[CrisisInfo] = None
    timestamp: str


# ── Mood ──────────────────────────────────────────────

VALID_MOODS = [
    "amazing", "happy", "calm", "neutral",
    "anxious", "sad", "angry", "distressed",
]


class MoodRequest(BaseModel):
    mood: str = Field(..., description="One of: amazing, happy, calm, neutral, anxious, sad, angry, distressed")
    notes: Optional[str] = Field(default="", max_length=5000)


class MoodEntry(BaseModel):
    id: str
    mood: str
    notes: str
    timestamp: str
    date: str


class MoodDistribution(BaseModel):
    entries: list[MoodEntry]
    distribution: dict[str, int]
    totalEntries: int
    dateRange: dict[str, str]


# ── Community ─────────────────────────────────────────

class CreatePostRequest(BaseModel):
    content: str = Field(..., min_length=1, max_length=2000)
    category: Optional[str] = "general"


class ReplyRequest(BaseModel):
    content: str = Field(..., min_length=1, max_length=2000)


class ReplyEntry(BaseModel):
    id: str
    authorAlias: str
    content: str
    timestamp: str


class PostEntry(BaseModel):
    id: str
    authorAlias: str
    content: str
    category: str
    replies: list[ReplyEntry]
    supportCount: int
    timestamp: str
