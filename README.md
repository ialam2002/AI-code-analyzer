# 🔍 Intelligent Code Review Assistant

A full-stack web application that analyzes Python code for bugs, style issues, and potential improvements using AI-powered analysis combined with traditional linting tools.

## ✨ Features

- ✅ **Multi-Engine Analysis**: Pyflakes + Pylint + Custom AST analysis
- ✅ **Code Quality Metrics**: Complexity, nesting depth, missing docstrings
- ✅ **Real-time Feedback**: Instant analysis as you type or upload files
- ✅ **File Upload Support**: Drag & drop Python files for batch analysis
- ✅ **User Authentication**: JWT-based login/registration system
- ✅ **Analysis History**: Save and view past analysis results
- ✅ **Dark/Light Theme**: Automatic theme detection with toggle
- ✅ **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- ✅ **Professional UI**: Modern, clean interface with smooth animations

## 🚀 Quick Start

### Prerequisites
- Python 3.10+
- Node.js 18+

### Backend Setup

```bash
cd backend
python -m venv venv
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

Backend runs on `http://localhost:8000`

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`

## 🐳 Docker Setup

```bash
docker-compose up --build
```

This starts:
- Backend on `http://localhost:8000`
- Frontend on `http://localhost:5173`

## 📁 Project Structure

```
Fullstack/
├── backend/
│   ├── app/
│   │   ├── main.py              # FastAPI application
│   │   ├── analyzer.py          # Code analysis engines
│   │   ├── auth.py              # Authentication
│   │   ├── models.py            # Database models
│   │   ├── schemas.py           # Pydantic schemas
│   │   └── config.py            # Configuration
│   ├── tests/
│   ├── requirements.txt
│   ├── .env.example
│   └── Dockerfile
│
├── frontend/
│   ├── src/
│   │   ├── components/          # React components
│   │   ├── hooks/               # Custom React hooks
│   │   ├── api/                 # API client
│   │   ├── types/               # TypeScript types
│   │   ├── styles/              # CSS modules
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   ├── .env.example
│   └── Dockerfile
│
├── docker-compose.yml
├── .gitignore
└── README.md
```

## 🔌 API Endpoints

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login and get JWT token
- `GET /auth/me` - Get current user info

### Analysis
- `POST /analyze` - Analyze Python code
- `GET /analysis/history` - Get user's analysis history
- `GET /analysis/{id}` - Get specific analysis result

### Documentation
- Interactive API docs: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## 🧪 Testing

```bash
cd backend
pytest tests/ -v
```

## 📦 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Backend** | Python 3.10+, FastAPI, SQLAlchemy, Pydantic |
| **Frontend** | React 18, TypeScript, Vite, Axios |
| **Database** | SQLite (dev), PostgreSQL (prod) |
| **DevOps** | Docker, Docker Compose |

## 🎯 Features in Detail

### Code Analysis Engines
- **Pyflakes**: Undefined names, unused imports, syntax errors
- **Pylint**: Comprehensive code quality (optional)
- **AST Analysis**: Custom complexity, nesting depth, docstring checks

### Multi-File Support
Paste multiple files using the separator format:
```
---filename1.py---
import unused
print('hello')

---filename2.py---
def unused_func():
    pass
```

## 🛠️ Configuration

### Backend (.env)
```env
DATABASE_URL=postgresql+psycopg2://postgres:postgres@localhost:5432/code_review
SECRET_KEY=your-secret-key-here
ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
DEBUG=True
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:8000
```

## 🚀 Deployment

### Heroku
```bash
heroku create your-app
git push heroku main
```

### Railway/DigitalOcean
Connect GitHub repo and deploy with Docker support.

## 📝 API Usage Example

```bash
curl -X POST http://localhost:8000/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "files": {
      "test.py": "import unused\nprint(\"hello\")"
    }
  }'
```

## 🤝 Contributing

1. Fork the repo
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

MIT License
