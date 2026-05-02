# OpenDoc

Open source documentation platform — a beautiful alternative to Mintlify and Fern.

## Features

- 📝 **MDX Support** — Write documentation in Markdown with custom components
- 🔌 **API Documentation** — Auto-generate from OpenAPI specs
- 🔍 **Instant Search** — Cmd+K search with Pagefind
- 🎨 **Beautiful UI** — Modern, clean design that rivals commercial products
- 🌙 **Dark Mode** — Automatic theme support
- 📦 **Self-Hosted** — Full control with Docker. MIT licensed.
- ✏️ **In-Browser Editor** — Edit docs without leaving the browser
- 🔗 **GitHub Sync** — Connect your repo, automatic updates on push

## Quick Start

```bash
# Clone the repository
git clone https://github.com/yourusername/opendoc.git
cd opendoc

# Copy environment file
cp backend/.env.example backend/.env

# Start with Docker
docker-compose up
```

Visit:
- **Frontend**: http://localhost:5173
- **API**: http://localhost:8000

## Testing Without GitHub

For local testing without setting up GitHub OAuth:

1. Click **"Try Sample Docs"** on the projects page
2. This creates a project with sample documentation

Or use the dev API directly:

```bash
# Create a project (no auth required)
curl -X POST http://localhost:8000/api/v1/dev/project \
  -H "Content-Type: application/json" \
  -d '{"name": "My Docs", "slug": "my-docs"}'

# Seed sample docs
curl -X POST http://localhost:8000/api/v1/dev/seed/my-docs

# Import from local folder
curl -X POST "http://localhost:8000/api/v1/local/folder?project_id=1&folder_path=/path/to/docs"
```

## Configuration

### GitHub OAuth (Production)

1. Go to GitHub Settings → Developer settings → OAuth Apps
2. Create a new OAuth App
3. Set Authorization callback URL to: `http://localhost:8000/api/v1/auth/github/callback`
4. Update `.env`:

```
GITHUB_CLIENT_ID=your_client_id
GITHUB_CLIENT_SECRET=your_client_secret
```

## Project Structure

```
opendoc/
├── backend/                 # Python FastAPI backend
│   ├── app/
│   │   ├── api/v1/         # API endpoints
│   │   ├── models/         # SQLAlchemy models
│   │   ├── services/       # Business logic
│   │   └── database/       # Database config
│   └── requirements.txt
│
├── frontend/               # Preact + TypeScript
│   ├── src/
│   │   ├── components/    # UI components
│   │   ├── pages/         # Page components
│   │   └── styles/        # CSS styles
│   └── package.json
│
├── docker-compose.yml      # Local development
└── README.md
```

## Tech Stack

- **Backend**: Python, FastAPI, SQLAlchemy (async), PostgreSQL, Redis
- **Frontend**: Preact, TypeScript, Vite
- **Database**: PostgreSQL
- **Cache**: Redis
- **Deployment**: Docker

## API Documentation

### Projects

```bash
# List projects
GET /api/v1/projects

# Create project (dev mode, no auth)
POST /api/v1/dev/project
{
  "name": "My Docs",
  "slug": "my-docs",
  "description": "Optional description"
}
```

### Documents

```bash
# List documents
GET /api/v1/documents?project_id=1

# Create document
POST /api/v1/local
{
  "project_id": 1,
  "title": "Getting Started",
  "slug": "getting-started",
  "content": "# Hello World"
}
```

### OpenAPI

```bash
# Upload OpenAPI spec
POST /api/v1/openapi/upload?project_id=1
```

### Local Folder Import

```bash
# Import from local folder
POST /api/v1/local/folder?project_id=1&folder_path=/path/to/md/files
```

## Development

```bash
# Backend
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload

# Frontend
cd frontend
npm install
npm run dev
```

## License

MIT License — see [LICENSE](LICENSE) for details.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a PR

## Roadmap

- [x] MDX parsing and rendering
- [x] OpenAPI spec support
- [x] GitHub repository sync
- [x] Static site generation
- [x] In-browser MDX editor
- [x] Versioning
- [ ] Custom domains
- [ ] Analytics
- [ ] Team permissions