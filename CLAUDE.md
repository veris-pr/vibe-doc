# CLAUDE.md — AI Agent Guidelines

This document provides guidance for AI agents working on the OpenDoc project.

## Project Overview

OpenDoc is an open-source documentation platform (Mintlify/Fern alternative) with:
- **Backend**: Python FastAPI + SQLAlchemy (async) + PostgreSQL + Redis
- **Frontend**: Preact + TypeScript + Vite
- **Deployment**: Docker

## Key Files & Directories

```
backend/
├── app/
│   ├── api/v1/           # API routes (auth, projects, documents, etc.)
│   ├── models/           # SQLAlchemy ORM models
│   ├── services/         # Business logic
│   │   ├── mdx_parser.py       # MDX parsing and navigation generation
│   │   ├── github_sync.py      # GitHub repo sync and webhooks
│   │   ├── builder.py          # Static site generator
│   │   ├── openapi_renderer.py # OpenAPI spec parser
│   │   └── local_loader.py     # Local folder file loader
│   └── database.py        # DB connection and session management
├── requirements.txt
└── Dockerfile

frontend/
├── src/
│   ├── components/       # Reusable UI components (MDXEditor.tsx, Header.tsx)
│   ├── pages/           # Page components
│   │   ├── admin/       # Admin dashboard (Projects.tsx, Layout.tsx)
│   │   └── docs/        # Docs viewer (Viewer.tsx)
│   ├── styles/          # CSS files
│   └── main.tsx         # App entry point
├── package.json
└── vite.config.ts

docker-compose.yml        # Local development orchestration
```

## Important Patterns

### Database Models (backend/app/models/__init__.py)

- `User` — authenticated users (via GitHub OAuth)
- `Organization` — groups of users
- `Project` — documentation project (has slug, github_repo, custom_domain)
- `Document` — individual MDX document (title, slug, path, content, frontmatter)
- `Version` — doc versions for versioning support

### API Patterns

All API endpoints use FastAPI dependency injection:
```python
async def endpoint(
    current_user: User = Depends(get_current_user),  # Auth required
    db: AsyncSession = Depends(get_db)                # DB session
):
```

### Dev-Only Endpoints (no auth)

For testing without GitHub setup:
- `POST /api/v1/dev/project` — create project
- `POST /api/v1/dev/seed/{slug}` — add sample docs
- `POST /api/v1/local/folder` — import from local folder

### Frontend Component Patterns

Preact with TypeScript:
- Use `signal` from `@preact/signals` for reactive state
- Use `useState` and `useEffect` from `preact/hooks`
- CSS goes in `src/styles/` or as inline `<style>` tag

## Commands

```bash
# Start all services
docker-compose up

# Backend only
cd backend && uvicorn app.main:app --reload

# Frontend only  
cd frontend && npm run dev

# Build frontend
cd frontend && npm run build
```

## Security Considerations

- **Auth**: JWT tokens with Redis blacklist for logout
- **Input validation**: Pydantic models with Field constraints
- **SQL**: SQLAlchemy ORM prevents injection
- **XSS**: HTML escaping in MDX rendering
- **Path traversal**: Validate file paths in zip extraction

## Common Tasks

### Adding a new API endpoint

1. Create route in `backend/app/api/v1/<feature>.py`
2. Register in `backend/app/api/v1/__init__.py`
3. Add to router with `api_router.include_router(...)`

### Adding a frontend component

1. Create in `frontend/src/components/`
2. Import and use in a page

### Adding a database model

1. Add to `backend/app/models/__init__.py`
2. Run migrations if needed

## Testing Flow

1. Click "Try Sample Docs" in frontend to create test project
2. View docs at `/docs/sample-docs`
3. Use `/api/v1/local/folder` to import local MDX files

## Environment Variables

```
DATABASE_URL=postgresql+asyncpg://...
REDIS_URL=redis://...
SECRET_KEY=...
GITHUB_CLIENT_ID=...
GITHUB_CLIENT_SECRET=...
```

## Status

- Core: Complete ✅
- GitHub sync: Complete ✅
- MDX parsing: Complete ✅
- OpenAPI rendering: Complete ✅
- In-browser editor: Complete ✅
- Static site generation: Complete ✅
- Local testing without GitHub: Complete ✅