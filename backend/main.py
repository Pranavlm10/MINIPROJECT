"""
MindWell FastAPI Backend
Mental health platform API with Supabase integration.
"""

import os
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routes import auth, chat, mood, community, resources

load_dotenv()

app = FastAPI(
    title="MindWell API",
    description="Mental health & well-being platform backend",
    version="1.0.0",
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount routers
app.include_router(auth.router, prefix="/api/auth", tags=["Auth"])
app.include_router(chat.router, prefix="/api/chat", tags=["Chat"])
app.include_router(mood.router, prefix="/api/mood", tags=["Mood"])
app.include_router(community.router, prefix="/api/community", tags=["Community"])
app.include_router(resources.router, prefix="/api/resources", tags=["Resources"])


@app.get("/api/health")
def health_check():
    return {"status": "ok", "message": "MindWell API is running"}


if __name__ == "__main__":
    import uvicorn

    port = int(os.getenv("PORT", 5000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)
