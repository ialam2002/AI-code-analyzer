@echo off
REM Quick start script for Windows

echo.
echo ========================================
echo Code Review Assistant - Quick Start
echo ========================================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Python is not installed or not in PATH
    pause
    exit /b 1
)

REM Check if Node is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js is not installed or not in PATH
    pause
    exit /b 1
)

echo [1/4] Setting up backend...
cd backend

if not exist venv (
    echo Creating virtual environment...
    python -m venv venv
)

echo Activating virtual environment...
call venv\Scripts\activate.bat

echo Installing backend dependencies...
pip install -q -r requirements.txt

echo Starting backend server...
echo Backend running on http://localhost:8000
echo API docs available at http://localhost:8000/docs
start "" "http://localhost:8000/docs"

start cmd /k "cd %~dp0backend && venv\Scripts\activate.bat && uvicorn app.main:app --reload --port 8000"

echo.
echo [2/4] Waiting for backend to start...
timeout /t 3 /nobreak

echo [3/4] Setting up frontend...
cd ..\frontend

echo Installing frontend dependencies...
call npm install --silent

echo [4/4] Starting frontend server...
echo Frontend running on http://localhost:5173
start "" "http://localhost:5173"

call npm run dev

echo.
echo ========================================
echo Both servers are running!
echo Backend: http://localhost:8000
echo Frontend: http://localhost:5173
echo API Docs: http://localhost:8000/docs
echo ========================================
pause

