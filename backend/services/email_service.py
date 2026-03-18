"""
SMTP email service for MindWell.
Handles sending verification emails, password reset links, and notifications.
"""

import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from dotenv import load_dotenv

load_dotenv()

SMTP_HOST = os.getenv("SMTP_HOST", "smtp.gmail.com")
SMTP_PORT = int(os.getenv("SMTP_PORT", "587"))
SMTP_USER = os.getenv("SMTP_USER", "")
SMTP_PASS = os.getenv("SMTP_PASS", "")
SMTP_SENDER_NAME = os.getenv("SMTP_SENDER_NAME", "MindWell")
SMTP_SENDER_EMAIL = os.getenv("SMTP_SENDER_EMAIL", SMTP_USER)


def _get_base_template(content: str) -> str:
    """Wrap email content in a clean, branded HTML template."""
    return f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin:0;padding:0;background-color:#fafaf9;font-family:'Inter',Arial,sans-serif;">
        <div style="max-width:560px;margin:40px auto;background:#ffffff;border:1px solid #e7e5e4;border-radius:12px;overflow:hidden;">
            <!-- Header -->
            <div style="background:#f0fdfa;padding:24px 32px;border-bottom:1px solid #e7e5e4;">
                <h1 style="margin:0;font-size:22px;color:#0f766e;font-weight:600;">MindWell</h1>
            </div>
            <!-- Content -->
            <div style="padding:32px;">
                {content}
            </div>
            <!-- Footer -->
            <div style="padding:20px 32px;background:#fafaf9;border-top:1px solid #e7e5e4;text-align:center;">
                <p style="margin:0;font-size:12px;color:#a8a29e;">
                    This email was sent by MindWell — Your Mental Wellness Companion
                </p>
                <p style="margin:4px 0 0;font-size:12px;color:#a8a29e;">
                    SDG 3: Good Health &amp; Well-Being
                </p>
            </div>
        </div>
    </body>
    </html>
    """


def send_email(to_email: str, subject: str, html_body: str) -> bool:
    """Send an email using SMTP. Returns True on success."""
    if not SMTP_USER or not SMTP_PASS:
        print("SMTP not configured — skipping email send")
        return False

    try:
        msg = MIMEMultipart("alternative")
        msg["From"] = f"{SMTP_SENDER_NAME} <{SMTP_SENDER_EMAIL}>"
        msg["To"] = to_email
        msg["Subject"] = subject

        msg.attach(MIMEText(html_body, "html"))

        with smtplib.SMTP(SMTP_HOST, SMTP_PORT) as server:
            server.starttls()
            server.login(SMTP_USER, SMTP_PASS)
            server.send_message(msg)

        print(f"Email sent to {to_email}: {subject}")
        return True
    except Exception as e:
        print(f"Email send failed: {e}")
        return False


def send_welcome_email(to_email: str, display_name: str) -> bool:
    """Send a welcome email after successful signup."""
    content = f"""
    <h2 style="margin:0 0 16px;color:#1c1917;font-size:20px;">Welcome to MindWell, {display_name}!</h2>
    <p style="color:#57534e;font-size:15px;line-height:1.6;">
        Thank you for joining MindWell. We're here to support your mental well-being journey.
    </p>
    <p style="color:#57534e;font-size:15px;line-height:1.6;">Here's what you can do:</p>
    <ul style="color:#57534e;font-size:15px;line-height:1.8;padding-left:20px;">
        <li><strong>AI Counselor</strong> — Chat with an empathetic AI for emotional support</li>
        <li><strong>Mood Journal</strong> — Track how you're feeling over time</li>
        <li><strong>Self-Help Resources</strong> — Evidence-based coping strategies</li>
        <li><strong>Peer Community</strong> — Connect anonymously with other students</li>
    </ul>
    <div style="text-align:center;margin:28px 0 12px;">
        <a href="{os.getenv('FRONTEND_URL', 'http://localhost:5173')}/dashboard"
           style="background:#0d9488;color:#ffffff;padding:12px 32px;border-radius:8px;text-decoration:none;font-weight:600;font-size:15px;display:inline-block;">
            Go to Dashboard
        </a>
    </div>
    <p style="color:#a8a29e;font-size:13px;margin-top:24px;">
        Remember: If you're ever in crisis, please reach out to a professional helpline immediately.
    </p>
    """
    return send_email(to_email, "Welcome to MindWell!", _get_base_template(content))


def send_password_reset_notification(to_email: str) -> bool:
    """Send a notification that password was successfully reset."""
    content = """
    <h2 style="margin:0 0 16px;color:#1c1917;font-size:20px;">Password Updated</h2>
    <p style="color:#57534e;font-size:15px;line-height:1.6;">
        Your MindWell account password has been successfully changed.
    </p>
    <p style="color:#57534e;font-size:15px;line-height:1.6;">
        If you didn't make this change, please reset your password immediately or contact support.
    </p>
    <div style="background:#fef3c7;border:1px solid #fcd34d;border-radius:8px;padding:16px;margin:20px 0;">
        <p style="margin:0;color:#92400e;font-size:14px;">
            <strong>Security tip:</strong> Never share your password with anyone, including people
            claiming to be from MindWell.
        </p>
    </div>
    """
    return send_email(to_email, "Your MindWell password was changed", _get_base_template(content))


def send_mood_reminder(to_email: str, display_name: str) -> bool:
    """Send a gentle mood check-in reminder."""
    content = f"""
    <h2 style="margin:0 0 16px;color:#1c1917;font-size:20px;">Time for a Check-In, {display_name}</h2>
    <p style="color:#57534e;font-size:15px;line-height:1.6;">
        We noticed you haven't logged your mood in a while. Taking a moment to check in with
        yourself is a small but powerful act of self-care.
    </p>
    <div style="text-align:center;margin:28px 0 12px;">
        <a href="{os.getenv('FRONTEND_URL', 'http://localhost:5173')}/journal"
           style="background:#0d9488;color:#ffffff;padding:12px 32px;border-radius:8px;text-decoration:none;font-weight:600;font-size:15px;display:inline-block;">
            Log My Mood
        </a>
    </div>
    <p style="color:#a8a29e;font-size:13px;margin-top:24px;">
        You can unsubscribe from reminders in your account settings.
    </p>
    """
    return send_email(to_email, f"How are you feeling today, {display_name}?", _get_base_template(content))
