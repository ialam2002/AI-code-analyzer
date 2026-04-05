#!/bin/bash
# Quick start script for macOS/Linux

set -e

echo ""
echo "========================================"
echo "Code Review Assistant - Quick Start"
echo "========================================"
echo ""

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "ERROR: Python 3 is not installed"
    exit 1
fi

# Check if Node is installed
if ! command -v node &> /dev/null; then
    echo "ERROR: Node.js is not installed"
    exit 1
fi

echo "[1/4] Setting up backend..."
cd backend

if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
fi

echo "Activating virtual environment..."
source venv/bin/activate

echo "Installing backend dependencies..."
pip install -q -r requirements.txt

echo "[2/4] Starting backend server..."
echo "Backend running on http://localhost:8000"
echo "API docs available at http://localhost:8000/docs"

# Start backend in background
uvicorn app.main:app --reload --port 8000 &
BACKEND_PID=$!

echo ""
echo "[3/4] Waiting for backend to start..."
sleep 3

echo "[4/4] Setting up frontend..."
cd ../frontend

echo "Installing frontend dependencies..."
npm install --silent

echo ""
echo "Starting frontend server..."
echo "Frontend running on http://localhost:5173"
echo ""

# Start frontend (this runs in foreground)
npm run dev &
FRONTEND_PID=$!

echo ""
echo "========================================"
echo "Both servers are running!"
echo "Backend: http://localhost:8000"
echo "Frontend: http://localhost:5173"
echo "API Docs: http://localhost:8000/docs"
echo "========================================"
echo ""
echo "Press Ctrl+C to stop both servers"
echo ""

# Keep script running until Ctrl+C
wait

