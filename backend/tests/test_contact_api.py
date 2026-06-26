"""Backend tests for portfolio contact form, SMTP integration, MongoDB persistence,
and legacy status/root endpoints."""
import os
import time
import uuid
import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "").rstrip("/")
if not BASE_URL:
    # fallback: read from frontend/.env
    try:
        with open("/app/frontend/.env") as f:
            for line in f:
                if line.startswith("REACT_APP_BACKEND_URL="):
                    BASE_URL = line.split("=", 1)[1].strip().rstrip("/")
                    break
    except Exception:
        pass

API = f"{BASE_URL}/api"


@pytest.fixture(scope="module")
def client():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


# ---------- Legacy endpoints ----------
class TestLegacy:
    def test_root_returns_hello_world(self, client):
        r = client.get(f"{API}/", timeout=30)
        assert r.status_code == 200
        assert r.json() == {"message": "Hello World"}

    def test_status_create_and_get(self, client):
        client_name = f"TEST_{uuid.uuid4().hex[:8]}"
        r = client.post(f"{API}/status", json={"client_name": client_name}, timeout=30)
        assert r.status_code == 200, r.text
        data = r.json()
        assert data["client_name"] == client_name
        assert "id" in data and isinstance(data["id"], str)
        assert "timestamp" in data

        r2 = client.get(f"{API}/status", timeout=30)
        assert r2.status_code == 200
        items = r2.json()
        assert any(it.get("client_name") == client_name for it in items)


# ---------- Contact validation ----------
class TestContactValidation:
    def test_empty_name_rejected(self, client):
        r = client.post(f"{API}/contact", json={
            "name": "",
            "email": "qatest+portfolio@example.com",
            "message": "Test message",
        }, timeout=30)
        assert r.status_code == 422, r.text

    def test_invalid_email_rejected(self, client):
        r = client.post(f"{API}/contact", json={
            "name": "QA Tester",
            "email": "not-an-email",
            "message": "Test message",
        }, timeout=30)
        assert r.status_code == 422, r.text

    def test_empty_message_rejected(self, client):
        r = client.post(f"{API}/contact", json={
            "name": "QA Tester",
            "email": "qatest+portfolio@example.com",
            "message": "",
        }, timeout=30)
        assert r.status_code == 422, r.text

    def test_missing_fields_rejected(self, client):
        r = client.post(f"{API}/contact", json={"name": "Only Name"}, timeout=30)
        assert r.status_code == 422


# ---------- Contact full flow (sends REAL emails) ----------
class TestContactSubmission:
    """Sends real emails via Gmail SMTP. Uses a unique tag to find the record."""

    def test_submit_persists_and_emails(self, client):
        unique_tag = f"TEST_{uuid.uuid4().hex[:10]}"
        payload = {
            "name": f"QA Bot {unique_tag}",
            "email": "qatest+portfolio@example.com",
            "message": f"Automated test message tag={unique_tag}",
        }
        r = client.post(f"{API}/contact", json=payload, timeout=90)
        assert r.status_code == 200, f"Expected 200, got {r.status_code}: {r.text}"
        data = r.json()
        assert data.get("success") is True
        assert data.get("email_sent") is True, f"email_sent not true: {data}"
        assert data.get("auto_reply_sent") is True, f"auto_reply_sent not true: {data}"
        assert "id" in data and isinstance(data["id"], str)

        # Verify persistence via GET /api/contact/messages
        time.sleep(1)
        r2 = client.get(f"{API}/contact/messages", timeout=30)
        assert r2.status_code == 200, r2.text
        items = r2.json()
        assert isinstance(items, list)
        match = next((it for it in items if it.get("id") == data["id"]), None)
        assert match is not None, f"submitted record not found in /contact/messages"
        assert match["name"] == payload["name"]
        assert match["email"] == payload["email"]
        assert match["message"] == payload["message"]
        assert match.get("email_sent") is True
        assert match.get("auto_reply_sent") is True
        assert "created_at" in match

    def test_messages_sorted_desc(self, client):
        # Insert two records and check ordering
        tag_a = f"TEST_A_{uuid.uuid4().hex[:6]}"
        tag_b = f"TEST_B_{uuid.uuid4().hex[:6]}"
        for tag in (tag_a, tag_b):
            r = client.post(f"{API}/contact", json={
                "name": f"Sort {tag}",
                "email": "qatest+portfolio@example.com",
                "message": f"ordering test tag={tag}",
            }, timeout=90)
            assert r.status_code == 200
            time.sleep(1)

        r = client.get(f"{API}/contact/messages?limit=50", timeout=30)
        assert r.status_code == 200
        items = r.json()
        # find indexes
        idx_a = next((i for i, it in enumerate(items) if tag_a in it.get("message", "")), None)
        idx_b = next((i for i, it in enumerate(items) if tag_b in it.get("message", "")), None)
        assert idx_a is not None and idx_b is not None
        # b was inserted after a, so b should appear first (lower index) in desc order
        assert idx_b < idx_a, f"Expected B (newer) before A (older); idx_a={idx_a} idx_b={idx_b}"

    def test_no_mongodb_objectid_in_messages(self, client):
        r = client.get(f"{API}/contact/messages", timeout=30)
        assert r.status_code == 200
        for item in r.json():
            assert "_id" not in item, "Mongo _id should be excluded from response"
