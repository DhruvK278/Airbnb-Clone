# Airbnb Clone

A full-stack Airbnb clone built with **Next.js** (TypeScript + Tailwind CSS) and **FastAPI** (Python + SQLAlchemy + SQLite).

## Tech Stack

| Layer      | Technology                                  |
| ---------- | ------------------------------------------- |
| Frontend   | Next.js 16, TypeScript, Tailwind CSS v4     |
| Backend    | FastAPI, SQLAlchemy 2.0, Pydantic v2        |
| Database   | SQLite                                      |
| State Mgmt | React Context + TanStack Query             |
| Deployment | Vercel (frontend) + Render (backend)        |

## Getting Started

### Prerequisites

- Node.js 18+
- Python 3.9+
- Git

### Backend Setup

```bash
cd backend
python -m venv venv
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

pip install -r requirements.txt
python app/main.py
```

Backend runs at: `http://localhost:8000`
Swagger docs at: `http://localhost:8000/docs`

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at: `http://localhost:3000`

## Project Structure

```
Airbnb-Clone/
├── frontend/          # Next.js application
│   ├── src/app/       # App router pages
│   ├── src/components # React components
│   └── src/lib/       # API client, types, utilities
│
├── backend/           # FastAPI application
│   ├── app/main.py    # App entry point
│   ├── app/models/    # SQLAlchemy models
│   ├── app/routes/    # API route handlers
│   ├── app/schemas/   # Pydantic schemas
│   └── app/services/  # Business logic
│
└── README.md
```

## Current Status

- [x] Phase 1: Project setup & scaffolding
- [ ] Phase 2: Database design, models & seed data
- [ ] Phase 3: Backend API (all endpoints)
- [ ] Phase 4: Frontend — Home, Search, Listing Detail
- [ ] Phase 5: Frontend — Booking Flow, My Trips, Host Dashboard
- [ ] Phase 6: Polish, Bonus Features, Deployment & Docs