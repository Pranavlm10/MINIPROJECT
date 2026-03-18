"""
Community routes — anonymous peer support forum.
Uses in-memory storage with Supabase persistence when available.
"""

import random
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, Query

from middleware.auth import get_current_user, CurrentUser
from models.schemas import CreatePostRequest, ReplyRequest
from config.supabase import get_supabase

router = APIRouter()

# ── Alias generator ──────────────────────────────────────

ADJECTIVES = [
    "Brave", "Calm", "Gentle", "Kind", "Serene", "Warm",
    "Wise", "Strong", "Hopeful", "Peaceful", "Resilient", "Bright",
]
NOUNS = [
    "Phoenix", "Panda", "Dolphin", "Butterfly", "Sunrise", "River",
    "Star", "Cloud", "Moon", "Garden", "Sparrow", "Lotus",
]


def generate_alias() -> str:
    adj = random.choice(ADJECTIVES)
    noun = random.choice(NOUNS)
    return f"{adj}{noun}{random.randint(0, 99)}"


# ── In-memory fallback ───────────────────────────────────

_posts: list[dict] = []
_post_id_counter = 1


@router.post("/")
async def create_post(
    body: CreatePostRequest,
    user: CurrentUser = Depends(get_current_user),
):
    """Create an anonymous community post."""
    global _post_id_counter
    content = body.content.strip()

    if not content:
        raise HTTPException(status_code=400, detail="Content is required")
    if len(content) > 2000:
        raise HTTPException(status_code=400, detail="Content must be under 2000 characters")

    alias = generate_alias()
    now = datetime.now(timezone.utc).isoformat()

    # Try Supabase
    sb = get_supabase()
    if sb:
        try:
            result = sb.table("community_posts").insert({
                "author_uid": user.uid,
                "author_alias": alias,
                "content": content,
                "category": body.category or "general",
                "support_count": 0,
            }).execute()

            if result.data:
                row = result.data[0]
                return {
                    "success": True,
                    "data": {
                        "id": str(row["id"]),
                        "authorAlias": row["author_alias"],
                        "content": row["content"],
                        "category": row["category"],
                        "replies": [],
                        "supportCount": 0,
                        "timestamp": row["created_at"],
                    },
                }
        except Exception:
            pass

    # In-memory fallback
    post = {
        "id": str(_post_id_counter),
        "authorAlias": alias,
        "authorUid": user.uid,
        "content": content,
        "category": body.category or "general",
        "replies": [],
        "supportCount": 0,
        "supportedBy": [],
        "timestamp": now,
    }
    _post_id_counter += 1
    _posts.insert(0, post)

    # Return without private fields
    safe_post = {k: v for k, v in post.items() if k not in ("authorUid", "supportedBy")}
    return {"success": True, "data": safe_post}


@router.get("/")
async def list_posts(
    user: CurrentUser = Depends(get_current_user),
    page: int = Query(default=1, ge=1),
    limit: int = Query(default=20, ge=1, le=100),
    category: str = Query(default="all"),
):
    """List community posts (paginated, filterable by category)."""
    sb = get_supabase()

    if sb:
        try:
            query = sb.table("community_posts").select("*").order("created_at", desc=True)

            if category and category != "all":
                query = query.eq("category", category)

            start = (page - 1) * limit
            query = query.range(start, start + limit - 1)
            result = query.execute()

            if result.data is not None:
                # Fetch replies for each post
                post_ids = [row["id"] for row in result.data]
                replies_result = (
                    sb.table("community_replies")
                    .select("*")
                    .in_("post_id", post_ids)
                    .order("created_at", desc=False)
                    .execute()
                ) if post_ids else type("R", (), {"data": []})()

                replies_by_post: dict[int, list] = {}
                for r in replies_result.data or []:
                    pid = r["post_id"]
                    if pid not in replies_by_post:
                        replies_by_post[pid] = []
                    replies_by_post[pid].append({
                        "id": str(r["id"]),
                        "authorAlias": r["author_alias"],
                        "content": r["content"],
                        "timestamp": r["created_at"],
                    })

                posts = [
                    {
                        "id": str(row["id"]),
                        "authorAlias": row["author_alias"],
                        "content": row["content"],
                        "category": row["category"],
                        "replies": replies_by_post.get(row["id"], []),
                        "supportCount": row.get("support_count", 0),
                        "timestamp": row["created_at"],
                    }
                    for row in result.data
                ]

                # Get total count
                count_query = sb.table("community_posts").select("id", count="exact")
                if category and category != "all":
                    count_query = count_query.eq("category", category)
                count_result = count_query.execute()
                total = count_result.count or len(posts)

                return {
                    "success": True,
                    "data": {
                        "posts": posts,
                        "pagination": {
                            "page": page,
                            "limit": limit,
                            "total": total,
                            "totalPages": -(-total // limit),  # ceil div
                        },
                    },
                }
        except Exception:
            pass

    # In-memory fallback
    filtered = _posts if category == "all" else [p for p in _posts if p["category"] == category]
    start_idx = (page - 1) * limit
    paginated = filtered[start_idx : start_idx + limit]
    safe_posts = [
        {k: v for k, v in p.items() if k not in ("authorUid", "supportedBy")}
        for p in paginated
    ]

    return {
        "success": True,
        "data": {
            "posts": safe_posts,
            "pagination": {
                "page": page,
                "limit": limit,
                "total": len(filtered),
                "totalPages": -(-len(filtered) // limit),
            },
        },
    }


@router.post("/{post_id}/reply")
async def reply_to_post(
    post_id: str,
    body: ReplyRequest,
    user: CurrentUser = Depends(get_current_user),
):
    """Reply to a community post anonymously."""
    content = body.content.strip()
    if not content:
        raise HTTPException(status_code=400, detail="Reply content is required")

    alias = generate_alias()
    now = datetime.now(timezone.utc).isoformat()

    sb = get_supabase()
    if sb:
        try:
            result = sb.table("community_replies").insert({
                "post_id": int(post_id),
                "author_alias": alias,
                "content": content,
            }).execute()

            if result.data:
                row = result.data[0]
                return {
                    "success": True,
                    "data": {
                        "id": str(row["id"]),
                        "authorAlias": row["author_alias"],
                        "content": row["content"],
                        "timestamp": row["created_at"],
                    },
                }
        except Exception:
            pass

    # In-memory fallback
    post = next((p for p in _posts if p["id"] == post_id), None)
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")

    reply = {
        "id": str(int(datetime.now(timezone.utc).timestamp() * 1000)),
        "authorAlias": alias,
        "content": content,
        "timestamp": now,
    }
    post["replies"].append(reply)

    return {"success": True, "data": reply}


@router.post("/{post_id}/support")
async def support_post(
    post_id: str,
    user: CurrentUser = Depends(get_current_user),
):
    """Send a support reaction to a post."""
    sb = get_supabase()

    if sb:
        try:
            # Check for duplicate support
            existing = (
                sb.table("post_supports")
                .select("id")
                .eq("post_id", int(post_id))
                .eq("user_id", user.uid)
                .execute()
            )
            if existing.data:
                raise HTTPException(status_code=400, detail="You have already supported this post")

            # Insert support
            sb.table("post_supports").insert({
                "post_id": int(post_id),
                "user_id": user.uid,
            }).execute()

            # Increment count
            post_result = (
                sb.table("community_posts")
                .select("support_count")
                .eq("id", int(post_id))
                .single()
                .execute()
            )
            new_count = (post_result.data.get("support_count", 0) + 1) if post_result.data else 1
            sb.table("community_posts").update({"support_count": new_count}).eq("id", int(post_id)).execute()

            return {"success": True, "data": {"supportCount": new_count}}
        except HTTPException:
            raise
        except Exception:
            pass

    # In-memory fallback
    post = next((p for p in _posts if p["id"] == post_id), None)
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")

    if user.uid in post.get("supportedBy", []):
        raise HTTPException(status_code=400, detail="You have already supported this post")

    post.setdefault("supportedBy", []).append(user.uid)
    post["supportCount"] = post.get("supportCount", 0) + 1

    return {"success": True, "data": {"supportCount": post["supportCount"]}}
