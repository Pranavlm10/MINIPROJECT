"""
Auth routes — user profile and email endpoints.
"""

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from middleware.auth import get_current_user, CurrentUser
from services.email_service import send_welcome_email, send_email, _get_base_template
from datetime import datetime, timezone

router = APIRouter()


@router.get("/profile")
def get_profile(user: CurrentUser = Depends(get_current_user)):
    return {
        "success": True,
        "user": {
            "uid": user.uid,
            "email": user.email,
            "displayName": user.name,
            "createdAt": datetime.now(timezone.utc).isoformat(),
        },
    }


class SendTestEmailRequest(BaseModel):
    email: str


@router.post("/test-email")
def test_email(body: SendTestEmailRequest):
    """Send a test email to verify SMTP configuration."""
    content = """
    <h2 style="margin:0 0 16px;color:#1c1917;font-size:20px;">SMTP Test Successful!</h2>
    <p style="color:#57534e;font-size:15px;line-height:1.6;">
        If you're reading this, your MindWell SMTP configuration is working correctly.
    </p>
    <p style="color:#57534e;font-size:15px;line-height:1.6;">
        Email verification, password resets, and notifications will now be delivered.
    </p>
    """
    success = send_email(body.email, "MindWell — SMTP Test", _get_base_template(content))
    if success:
        return {"success": True, "message": f"Test email sent to {body.email}"}
    raise HTTPException(status_code=500, detail="Failed to send email. Check SMTP credentials.")


@router.post("/welcome-email")
def welcome_email(user: CurrentUser = Depends(get_current_user)):
    """Send the welcome email to the currently authenticated user."""
    success = send_welcome_email(user.email, user.name)
    if success:
        return {"success": True, "message": f"Welcome email sent to {user.email}"}
    raise HTTPException(status_code=500, detail="Failed to send welcome email")
