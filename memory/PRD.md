# Nirmal Natarajan — Portfolio PRD

## Problem Statement
Add Gmail SMTP service for the personal portfolio at https://nirmal-portfolio-pro.preview.emergentagent.com/ so that visitors who fill the "Get In Touch" contact form (name, email, message) deliver the message to **nirnat2002@gmail.com** and the submitter receives an auto-acknowledgement email. Submissions should also be stored in MongoDB.

## Architecture
- **Frontend**: React 19 SPA (`/app/frontend`) — single-page portfolio with sections Home, About, Experience, Projects, Skills, Certifications, Publications, Contact. Tailwind + custom dark "code-IDE" aesthetic, glassmorphism, gradient titles.
- **Backend**: FastAPI (`/app/backend/server.py`) exposing routes under `/api/*`:
  - `POST /api/contact` → validates payload, sends owner notification + auto-reply via Gmail SMTP (port 587 STARTTLS, App Password), persists to `db.contact_messages`.
  - `GET /api/contact/messages` → returns recent submissions (sorted desc).
  - Legacy `/api/`, `/api/status` retained.
- **DB**: MongoDB collection `contact_messages` { id, name, email, message, created_at, email_sent, auto_reply_sent }.
- **SMTP**: `smtp.gmail.com:587` with App Password stored in `backend/.env`.

## User Personas
1. **Recruiter / Hiring Manager** – browses portfolio, submits message via contact form, expects acknowledgement.
2. **Portfolio Owner (Nirmal)** – receives notifications in Gmail inbox; replies directly (Reply-To set to submitter).

## Core Requirements
- Contact form validates required fields (frontend + backend).
- Two transactional emails per submission:
  1. **Owner notification** (HTML + plain text) to `nirnat2002@gmail.com` with Reply-To = submitter.
  2. **Auto-reply** to the submitter with copy of their message and LinkedIn CTA.
- Persist every submission with email delivery status flags for audit.
- Toast feedback on success/error in the UI.

## Implemented (Jan 2026)
- ✅ Gmail SMTP integration via `smtplib` + STARTTLS using App Password.
- ✅ Full portfolio frontend (Hero, About, Experience timeline, Projects grid, Skills, Certifications, Publications, Contact, Footer) with side-nav dots, top-nav, custom dark aesthetic.
- ✅ `POST /api/contact` + MongoDB persistence + `GET /api/contact/messages`.
- ✅ HTML + plain-text email bodies (dark themed for owner, light themed for submitter).
- ✅ Toaster (sonner) feedback in UI; data-testids on all interactive elements.
- ✅ Backend pytest suite: 9/9 passed; Playwright frontend E2E: 100%; real emails verified delivered.

## Backlog (P1 / P2)
- **P1** Auth-protect `GET /api/contact/messages` (admin token) before public sharing.
- **P1** Rate-limit `/api/contact` (e.g., 5 / IP / hour) to prevent abuse.
- **P2** Move SMTP send to `asyncio.to_thread` or switch to `aiosmtplib` (non-blocking).
- **P2** Add hCaptcha / Cloudflare Turnstile to the contact form for spam protection.
- **P2** Admin dashboard route to view stored contact messages.
- **P2** Slack / Telegram webhook for instant ping when a message arrives.

## Files Touched
- `/app/backend/.env` (SMTP credentials)
- `/app/backend/server.py` (contact endpoint + email helpers)
- `/app/frontend/src/App.js`
- `/app/frontend/src/App.css`
- `/app/frontend/src/index.css`
- `/app/frontend/src/components/Portfolio.jsx` (new — full portfolio)
- `/app/backend/tests/test_contact_api.py` (added by testing agent)

## Test Status
Backend: 100% (9/9). Frontend: 100%. Real Gmail SMTP delivery confirmed end-to-end.
