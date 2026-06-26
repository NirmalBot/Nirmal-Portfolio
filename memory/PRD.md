# Nirmal Natarajan — Portfolio (PRD)

## Original Problem Statement
> Add Gmail SMTP service to the portfolio at https://nirmal-portfolio-pro.preview.emergentagent.com/. Visitors using the "Contact" form must email submissions to `nirnat2002@gmail.com` and receive an auto-reply that includes the LinkedIn URL `https://www.linkedin.com/in/nirmal-natarajan-0b5951384`. Match the original portfolio's cream/peach + coral red + emerald green colour palette. Expand the Skills section with a wider stack list. Add a "View Case Study" modal popup for every project showing its description.

## Architecture
- **Frontend**: React 19 (CRA + Craco), Tailwind, sonner, lucide-react, axios. Single-page portfolio at `/app/frontend/src/components/Portfolio.jsx`.
- **Backend**: FastAPI + Motor (MongoDB) + Python `smtplib` for Gmail SMTP over TLS (port 587). Routes under `/api`.
- **DB**: MongoDB `contact_messages` collection persists every submission with delivery flags.

## User Personas
- **Recruiter / Hiring Manager** — drops a message via Contact form; expects acknowledgement with social links.
- **Portfolio Owner (Nirmal)** — receives notifications in Gmail; can audit submissions via `GET /api/contact/messages`.

## Core Requirements (static)
1. Public single-page portfolio: Hero, About, Experience, Projects, Skills, Certifications, Publications, Contact.
2. Contact form → owner notification email to `nirnat2002@gmail.com`.
3. Contact form → auto-reply to submitter including LinkedIn URL.
4. Every submission persisted to MongoDB.
5. Light cream/peach theme with coral red (#ef4444) primary + emerald green (#10b981) secondary.
6. Skills section covers languages, frameworks, cloud/devops, data/ML, and engineering practices — no duplicates.
7. Every featured project exposes a "View Case Study" modal with full description + problem / approach / outcome + tech stack.

## Implemented (Jun 26, 2026)
- **SMTP**: `POST /api/contact` sends owner notification + auto-reply via Gmail App Password and persists `ContactRecord` (id, name, email, message, created_at, email_sent, auto_reply_sent).
- **Auto-reply**: Coral-themed HTML + plain text. Includes `https://www.linkedin.com/in/nirmal-natarajan-0b5951384` (verified by unit test).
- **Admin list**: `GET /api/contact/messages` lists submissions (desc by created_at, `_id` excluded).
- **Light theme**: `--bg #fdf8f4`, `--accent #ef4444`, `--success #10b981` in `/app/frontend/src/index.css`.
- **Hero**: User-provided portrait + floating CGPA (9.01) and Projects (5+) stat cards.
- **Skills (6 groups, deduped)**: Languages · Web & Frontend · Backend & Frameworks · Cloud & DevOps · Data & ML · Practices & Tools.
- **Project case-study modal**: Hero image, category, full description, // problem // approach // outcome sections, tech-stack chips, "Discuss this project" CTA → scrolls to contact. Close on ✕ / backdrop / Esc; body scroll locked while open.
- **Testing**: Backend pytest 11/11 ✅ — Frontend Playwright end-to-end ✅ (iteration 1 + 2 both 100%).

## Backlog
**P0**: none.
**P1**:
- Auth-gate `GET /api/contact/messages`.
- Move `smtplib` to `asyncio.to_thread` to avoid blocking the event loop.
- Centralise LinkedIn URL + colour palette into a single source of truth.
**P2**:
- Wire hero "Download Resume" CTA to a real PDF.
- Replace Unsplash project images with real project screenshots.
- Add OG/meta tags + favicon.
- Rate-limit / hCaptcha on `/api/contact`.
- Optional filter chips (All / ML / Mobile / Conversational AI) above the project grid.

## Configuration (backend/.env)
- `SMTP_HOST=smtp.gmail.com`, `SMTP_PORT=587`
- `SMTP_USER=nirnat2002@gmail.com`
- `SMTP_PASSWORD=<App Password>` (configured)
- `CONTACT_RECIPIENT=nirnat2002@gmail.com`

## Notes
- No auth credentials created — `test_credentials.md` not required.
