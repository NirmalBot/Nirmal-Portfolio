# Nirmal Natarajan — Portfolio (PRD)

## Original Problem Statement
> Add Gmail SMTP service to the portfolio at https://nirmal-portfolio-pro.preview.emergentagent.com/. Visitors using the "Contact" form must email submissions to `nirnat2002@gmail.com` and receive an auto-reply that includes the LinkedIn URL `https://www.linkedin.com/in/nirmal-natarajan-0b5951384`. Match the original portfolio's cream/peach + coral red + emerald green colour palette.

## Architecture
- **Frontend**: React 19 (CRA + Craco), Tailwind, sonner (toasts), lucide-react, axios. Single-page portfolio at `/app/frontend/src/components/Portfolio.jsx`.
- **Backend**: FastAPI + Motor (MongoDB), Python `smtplib` for Gmail SMTP over TLS (port 587). Routes under `/api`.
- **DB**: MongoDB `contact_messages` collection stores every submission with delivery flags.

## User Personas
- **Recruiter / Hiring Manager** — visits portfolio, drops a message via Contact form; expects acknowledgement.
- **Portfolio Owner (Nirmal)** — receives notifications in Gmail; can audit submissions via `GET /api/contact/messages`.

## Core Requirements (static)
1. Public portfolio (Hero, About, Experience, Projects, Skills, Certifications, Publications, Contact).
2. Contact form → owner notification email to `nirnat2002@gmail.com`.
3. Contact form → auto-reply to submitter with LinkedIn URL.
4. Every submission persisted to MongoDB.
5. Light cream/peach theme with coral red (#ef4444) primary + emerald green (#10b981) secondary.

## Implemented (Jun 26, 2026)
- Backend `POST /api/contact` sends 2 emails via Gmail SMTP App Password and persists `ContactRecord` (id, name, email, message, created_at, email_sent, auto_reply_sent).
- Backend `GET /api/contact/messages` lists submissions (desc by created_at, `_id` excluded).
- Auto-reply HTML + plain-text contain `https://www.linkedin.com/in/nirmal-natarajan-0b5951384`.
- Owner email uses coral-themed HTML template; auto-reply uses branded coral card with CTA button.
- Frontend portfolio with 8 sections, intersection-observer side nav dots, top sticky nav, sonner toasts.
- Light theme palette in `/app/frontend/src/index.css`: bg `#fdf8f4`, accent `#ef4444`, success `#10b981`.
- Hero uses user-provided portrait (suit photo) with floating CGPA + Projects stat cards.
- Tested: backend 11/11 pytest, frontend Playwright — both 100%.

## Backlog
**P0**: none.
**P1**:
- Add admin auth to `GET /api/contact/messages` before publishing the route.
- Move blocking `smtplib` into `asyncio.to_thread` to avoid blocking the event loop.
- Centralise LinkedIn URL + colour palette in a single source of truth.
**P2**:
- Resume PDF download wiring on hero CTA.
- Replace Unsplash project images with real screenshots.
- Add OG/meta tags and favicon.
- Rate-limit / hCaptcha on `/api/contact` to deter spam.

## Configuration (backend/.env)
- `SMTP_HOST=smtp.gmail.com`, `SMTP_PORT=587`
- `SMTP_USER=nirnat2002@gmail.com`
- `SMTP_PASSWORD=<App Password>` (configured)
- `CONTACT_RECIPIENT=nirnat2002@gmail.com`

## Notes
- No auth credentials created — `test_credentials.md` not needed.
