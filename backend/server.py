from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import ssl
import smtplib
import logging
from email.message import EmailMessage
from email.utils import formataddr
from pathlib import Path
from pydantic import BaseModel, EmailStr, Field, ConfigDict
from typing import List
import uuid
from datetime import datetime, timezone


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Gmail SMTP config
SMTP_HOST = os.environ['SMTP_HOST']
SMTP_PORT = int(os.environ['SMTP_PORT'])
SMTP_USER = os.environ['SMTP_USER']
SMTP_PASSWORD = os.environ['SMTP_PASSWORD']
SMTP_FROM_NAME = os.environ.get('SMTP_FROM_NAME', 'Nirmal Natarajan')
CONTACT_RECIPIENT = os.environ['CONTACT_RECIPIENT']

app = FastAPI()
api_router = APIRouter(prefix="/api")

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


# ---------- Models ----------
class StatusCheck(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class StatusCheckCreate(BaseModel):
    client_name: str


class ContactCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=120)
    email: EmailStr
    message: str = Field(..., min_length=1, max_length=5000)


class ContactRecord(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: EmailStr
    message: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    email_sent: bool = False
    auto_reply_sent: bool = False


# ---------- Email helpers ----------
def _build_owner_email(name: str, email: str, message: str) -> EmailMessage:
    msg = EmailMessage()
    msg["Subject"] = f"New Portfolio Contact from {name}"
    msg["From"] = formataddr((SMTP_FROM_NAME, SMTP_USER))
    msg["To"] = CONTACT_RECIPIENT
    msg["Reply-To"] = email

    text_body = (
        f"You have a new message from your portfolio contact form.\n\n"
        f"Name: {name}\n"
        f"Email: {email}\n\n"
        f"Message:\n{message}\n"
    )
    html_body = f"""
    <div style="font-family:Inter,Arial,sans-serif;max-width:600px;margin:auto;padding:24px;background:#0b0f14;color:#e6edf3;border-radius:12px">
      <h2 style="margin:0 0 12px;color:#7dd3fc">New Portfolio Contact</h2>
      <p style="margin:0 0 20px;color:#9aa4b2">You have a new message via your portfolio.</p>
      <table style="width:100%;border-collapse:collapse">
        <tr><td style="padding:8px 0;color:#9aa4b2;width:80px">Name</td><td style="padding:8px 0;font-weight:600">{name}</td></tr>
        <tr><td style="padding:8px 0;color:#9aa4b2">Email</td><td style="padding:8px 0"><a style="color:#7dd3fc" href="mailto:{email}">{email}</a></td></tr>
      </table>
      <div style="margin-top:16px;padding:16px;background:#111827;border-left:3px solid #7dd3fc;border-radius:8px;white-space:pre-wrap">{message}</div>
      <p style="margin-top:20px;font-size:12px;color:#6b7280">Sent from nirmal-portfolio • {datetime.now(timezone.utc).strftime('%b %d, %Y %H:%M UTC')}</p>
    </div>
    """
    msg.set_content(text_body)
    msg.add_alternative(html_body, subtype="html")
    return msg


def _build_autoreply_email(name: str, email: str, message: str) -> EmailMessage:
    msg = EmailMessage()
    msg["Subject"] = "Thanks for reaching out — Nirmal Natarajan"
    msg["From"] = formataddr((SMTP_FROM_NAME, SMTP_USER))
    msg["To"] = email
    msg["Reply-To"] = SMTP_USER

    text_body = (
        f"Hi {name},\n\n"
        "Thank you for getting in touch through my portfolio. I've received your "
        "message and will get back to you as soon as possible — usually within 24-48 hours.\n\n"
        "Here is a copy of what you sent:\n"
        f"--------------------------------\n{message}\n--------------------------------\n\n"
        "In the meantime, feel free to connect with me on LinkedIn:\n"
        "https://www.linkedin.com/in/nirmal-natarajan-0b5951384\n\n"
        "Warm regards,\n"
        "Nirmal Natarajan\n"
        "Aspiring Software Engineer & AI Enthusiast"
    )
    html_body = f"""
    <div style="font-family:Inter,Arial,sans-serif;max-width:600px;margin:auto;padding:28px;background:#ffffff;color:#0b1220;border-radius:14px;border:1px solid #e5e7eb">
      <h2 style="margin:0 0 8px;color:#0ea5e9">Thanks for reaching out, {name}!</h2>
      <p style="margin:0 0 16px;color:#475569">
        I've received your message and will get back to you as soon as possible — usually within 24-48 hours.
      </p>
      <div style="margin:16px 0;padding:14px 16px;background:#f8fafc;border-left:3px solid #0ea5e9;border-radius:8px;white-space:pre-wrap;color:#0f172a">{message}</div>
      <p style="margin:16px 0 4px;color:#475569">In the meantime, feel free to connect with me:</p>
      <p style="margin:0 0 20px">
        <a href="https://www.linkedin.com/in/nirmal-natarajan-0b5951384" style="color:#0ea5e9;text-decoration:none;font-weight:600">LinkedIn →</a>
      </p>
      <hr style="border:none;border-top:1px solid #e5e7eb;margin:20px 0"/>
      <p style="margin:0;color:#0f172a;font-weight:600">Nirmal Natarajan</p>
      <p style="margin:2px 0 0;color:#64748b;font-size:13px">Aspiring Software Engineer & AI Enthusiast</p>
      <p style="margin-top:18px;font-size:11px;color:#94a3b8">This is an automated acknowledgement. Please do not reply to this email.</p>
    </div>
    """
    msg.set_content(text_body)
    msg.add_alternative(html_body, subtype="html")
    return msg


def _send_email(msg: EmailMessage) -> None:
    context = ssl.create_default_context()
    with smtplib.SMTP(SMTP_HOST, SMTP_PORT, timeout=30) as server:
        server.ehlo()
        server.starttls(context=context)
        server.ehlo()
        server.login(SMTP_USER, SMTP_PASSWORD)
        server.send_message(msg)


# ---------- Routes ----------
@api_router.get("/")
async def root():
    return {"message": "Hello World"}


@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_obj = StatusCheck(**input.model_dump())
    doc = status_obj.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    await db.status_checks.insert_one(doc)
    return status_obj


@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    status_checks = await db.status_checks.find({}, {"_id": 0}).to_list(1000)
    for check in status_checks:
        if isinstance(check['timestamp'], str):
            check['timestamp'] = datetime.fromisoformat(check['timestamp'])
    return status_checks


@api_router.post("/contact")
async def submit_contact(payload: ContactCreate):
    record = ContactRecord(
        name=payload.name.strip(),
        email=payload.email,
        message=payload.message.strip(),
    )

    owner_sent = False
    auto_sent = False
    error_detail = None

    try:
        _send_email(_build_owner_email(record.name, record.email, record.message))
        owner_sent = True
    except Exception as e:
        logger.exception("Failed to send owner notification email")
        error_detail = f"owner_email_failed: {e}"

    try:
        _send_email(_build_autoreply_email(record.name, record.email, record.message))
        auto_sent = True
    except Exception as e:
        logger.exception("Failed to send auto-reply email")
        error_detail = (error_detail + " | " if error_detail else "") + f"auto_reply_failed: {e}"

    record.email_sent = owner_sent
    record.auto_reply_sent = auto_sent

    doc = record.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    try:
        await db.contact_messages.insert_one(doc)
    except Exception:
        logger.exception("Failed to persist contact message")

    if not owner_sent:
        raise HTTPException(status_code=502, detail=f"Email delivery failed. {error_detail or ''}".strip())

    return {
        "success": True,
        "id": record.id,
        "email_sent": owner_sent,
        "auto_reply_sent": auto_sent,
        "message": "Your message has been sent. A confirmation email is on its way!",
    }


@api_router.get("/contact/messages")
async def list_contact_messages(limit: int = 50):
    items = await db.contact_messages.find({}, {"_id": 0}).sort("created_at", -1).to_list(limit)
    return items


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
