# Code Review Assistant

A web app that runs static analysis on Python code and surfaces issues in a clean UI. Paste code or upload `.py` files, hit Analyze, and get back categorized feedback from three different analysis engines.

Built with FastAPI on the backend, React + TypeScript on the frontend, and PostgreSQL for persistence. Runs entirely in Docker.

---

## What it does

- Runs your Python code through **Pyflakes**, **Pylint** (errors and fatals only), and a custom **AST analyzer**
- Surfaces issues grouped by file, deduplicated across engines
- The AST analyzer catches things the linters miss: functions over 50 lines, nesting depth beyond 4 levels, missing docstrings on public functions
- Authenticated users get their analysis history saved automatically
- Multi-file analysis works by pasting files in a separator format (see below)
- Dark and light theme, both actually look good

---

## Stack

| Layer | Tech |
|---|---|
| Backend | Python 3.10+, FastAPI, SQLAlchemy 2, Pydantic v2 |
| Frontend | React 18, TypeScript, Vite |
| Database | PostgreSQL 16 |
| Auth | JWT via `python-jose`, passwords hashed with `passlib[bcrypt]` |
| DevOps | Docker, Docker Compose |

---

## Running it

### Docker (recommended)

```bash
docker-compose up --build
```

That spins up three containers: the FastAPI backend on port 8000, the Vite dev server on port 5173, and a Postgres instance. The backend waits for the database health check before starting.

- Frontend: http://localhost:5173
- Backend API: http://localhost:8000
- Interactive API docs: http://localhost:8000/docs

### Without Docker

**Backend**

```bash
cd backend
python -m venv venv

# Windows
venv\Scripts\activate
# macOS/Linux
source venv/bin/activate

pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

You'll need a Postgres database running. Copy `.env.example` to `.env` and set your `DATABASE_URL`.

**Frontend**

```bash
cd frontend
npm install
npm run dev
```

---

## Configuration

**Backend** — create `backend/.env`:

```env
DATABASE_URL=postgresql+psycopg2://postgres:postgres@localhost:5432/code_review
SECRET_KEY=change-this-to-something-random
ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
DEBUG=True
```

**Frontend** — create `frontend/.env`:

```env
VITE_API_URL=http://localhost:8000
```

---

## API

### Auth

```
POST /auth/register    Create a new account
POST /auth/login       Get a JWT token
GET  /auth/me          Check who you're logged in as
```

### Analysis

```
POST /analyze                 Analyze one or more files
GET  /analysis/history        Your past analyses (requires auth)
GET  /analysis/{id}           A specific past result (requires auth)
```

### Health

```
GET /health    Returns {"status": "healthy"}
```

#### Example request

```bash
curl -X POST http://localhost:8000/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "files": {
      "example.py": "import os\nimport sys\n\ndef foo():\n    pass"
    }
  }'
```

Analysis works without being logged in — you just won't get history saved.

---

## Multi-file format

To analyze multiple files at once, use the separator syntax in the editor:

```
---main.py---
import unused_module

def calculate(x, y):
    return x + y

---utils.py---
def helper():
    pass
```

Each block gets analyzed separately and results are grouped by filename.

---

## Project structure

```
├── backend/
│   ├── app/
│   │   ├── main.py         # Route definitions
│   │   ├── analyzer.py     # Pyflakes, Pylint, and AST engines
│   │   ├── auth.py         # JWT creation and validation
│   │   ├── models.py       # SQLAlchemy models (User, Analysis)
│   │   ├── schemas.py      # Pydantic request/response schemas
│   │   ├── database.py     # DB session and engine setup
│   │   └── config.py       # Environment variable loading
│   ├── tests/
│   │   ├── conftest.py
│   │   ├── test_api.py
│   │   └── test_analyzer.py
│   ├── requirements.txt
│   └── Dockerfile
│
├── frontend/
│   ├── src/
│   │   ├── App.tsx
│   │   ├── api/client.ts         # Axios wrapper
│   │   ├── components/
│   │   │   ├── Editor.tsx
│   │   │   ├── FileUpload.tsx
│   │   │   ├── Header.tsx
│   │   │   └── ResultsPanel.tsx
│   │   ├── hooks/
│   │   │   ├── useAuth.ts
│   │   │   └── useTheme.ts
│   │   └── types/index.ts
│   ├── package.json
│   ├── vite.config.ts
│   └── Dockerfile
│
└── docker-compose.yml
```

---

## Tests

```bash
cd backend
pytest tests/ -v
```

The test suite covers the analysis engines and the main API endpoints. Uses an in-memory SQLite database so no Postgres needed to run tests.

---

## Notes

- The Pylint engine only runs errors and fatals (`-E -F`) to keep it fast. Full linting would add too much latency for interactive use.
- Analysis results are stored as JSON in the `analyses` table alongside the original code, so history is fully replayable.
- The `SECRET_KEY` in `.env.example` and `docker-compose.yml` is for development only — generate a real one before deploying anywhere.
