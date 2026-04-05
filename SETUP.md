# Setup Guide - Intelligent Code Review Assistant

This guide walks you through setting up and running the full-stack application locally.

## Prerequisites

- Python 3.10 or higher
- Node.js 18 or higher
- npm or yarn
- Git
- (Optional) Docker & Docker Compose

## Option 1: Local Development Setup (Recommended)

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd Fullstack
```

### 2. Setup Backend

#### Windows (PowerShell)

```powershell
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
.\venv\Scripts\Activate.ps1

# Install dependencies
pip install -r requirements.txt

# Start development server
uvicorn app.main:app --reload --port 8000
```

#### macOS/Linux

```bash
cd backend

# Create virtual environment
python3 -m venv venv

# Activate virtual environment
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start development server
uvicorn app.main:app --reload --port 8000
```

The backend will be available at `http://localhost:8000`

**API Documentation:**
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

### 3. Setup Frontend

In a new terminal:

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will be available at `http://localhost:5173`

### 4. Test the Application

Open your browser and go to `http://localhost:5173`

Try this Python code:
```python
import unused_module
print("Hello World")
```

The analyzer should report:
- Unused import: `unused_module`

## Option 2: Docker Setup (All-in-One)

### Prerequisites
- Docker
- Docker Compose

### Run the Full Stack

```bash
docker-compose up --build
```

This will start:
- **Backend**: `http://localhost:8000`
- **Frontend**: `http://localhost:5173`

### Logs

View logs from all services:
```bash
docker-compose logs -f
```

View logs from specific service:
```bash
docker-compose logs -f backend
docker-compose logs -f frontend
```

### Stop Services

```bash
docker-compose down
```

## Configuration

### Backend Configuration (.env)

Located in `backend/.env`:

```env
# Database
DATABASE_URL=postgresql+psycopg2://postgres:postgres@localhost:5432/code_review

# Security
SECRET_KEY=dev-secret-key-change-in-production
ALGORITHM=HS256

# CORS (comma-separated origins)
ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173,http://localhost:3000

# Debug mode
DEBUG=True
```

For production, change:
- `SECRET_KEY` to a secure random string
- `DEBUG` to `False`
- `DATABASE_URL` to PostgreSQL if scaling

### Frontend Configuration (.env)

Located in `frontend/.env`:

```env
VITE_API_URL=http://localhost:8000
```

For production deployment, change to your backend URL.

## Database

### SQLite (Development)

The application uses SQLite by default, which creates a `analysis.db` file in the `backend/` directory.

### PostgreSQL (Production)

To use PostgreSQL:

1. Install PostgreSQL
2. Create a database:
   ```sql
   CREATE DATABASE code_review_assistant;
   ```

3. Update `.env`:
   ```env
   DATABASE_URL=postgresql://user:password@localhost:5432/code_review_assistant
   ```

4. Run migrations:
   ```bash
   alembic upgrade head
   ```

## Testing

### Backend Tests

```bash
cd backend

# Run all tests
pytest tests/

# Run with verbose output
pytest tests/ -v

# Run specific test file
pytest tests/test_analyzer.py

# Run with coverage
pytest tests/ --cov=app
```

### Frontend Tests

```bash
cd frontend

# Run tests
npm test

# Run with coverage
npm test -- --coverage
```

## Troubleshooting

### Backend Issues

**Port already in use (8000)**
```bash
# Find and kill process on port 8000
# Windows:
netstat -ano | findstr :8000
taskkill /PID <PID> /F

# macOS/Linux:
lsof -i :8000
kill -9 <PID>
```

**Module not found error**
- Ensure virtual environment is activated
- Reinstall requirements: `pip install -r requirements.txt`

**Database errors**
- Delete `analysis.db` and restart the backend
- Backend will recreate it automatically

### Frontend Issues

**Port already in use (5173)**
```bash
# Vite will automatically try the next port (5174, 5175, etc.)
# Or manually specify:
npm run dev -- --port 3000
```

**npm install fails**
- Clear npm cache: `npm cache clean --force`
- Delete node_modules: `rm -rf node_modules`
- Reinstall: `npm install`

**API connection errors**
- Check backend is running on `http://localhost:8000`
- Check `VITE_API_URL` in `frontend/.env`
- Check CORS configuration in backend `.env`

## Development Workflow

### Adding New Features

1. **Backend**:
   - Create new files in `app/` directory
   - Update `app/main.py` with new routes
   - Add tests in `tests/`

2. **Frontend**:
   - Create new components in `src/components/`
   - Add types in `src/types/`
   - Add styles in `src/styles/`

### Code Quality

```bash
# Backend - format code
cd backend
black app/

# Backend - lint code
pylint app/

# Frontend - format code
cd frontend
npm run format

# Frontend - lint code
npm run lint
```

## Deployment

### Heroku

1. Create a Heroku account
2. Install Heroku CLI
3. Deploy:
   ```bash
   heroku create your-app-name
   git push heroku main
   ```

### Railway

1. Connect your GitHub repository
2. Deploy with one click

### DigitalOcean / AWS

1. Set up a VPS with Docker
2. Clone repository
3. Run: `docker-compose up -d`

## Performance Tips

- Use PostgreSQL for production (better than SQLite)
- Enable caching with Redis for frequently analyzed code
- Use CDN for frontend assets
- Implement rate limiting on API endpoints
- Add monitoring and logging

## Next Steps

1. Add AI-powered code improvement suggestions
2. Implement GitHub/GitLab integration
3. Add team collaboration features
4. Build mobile app with React Native
5. Add code metrics and analytics dashboard

## Support

For issues or questions:
1. Check GitHub Issues
2. Review documentation at `/docs`
3. Contact: support@example.com

---

Happy coding! 🚀

