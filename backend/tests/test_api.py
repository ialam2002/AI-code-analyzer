import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_health_check():
    """Test health check endpoint"""
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"


def test_analyze_endpoint():
    """Test analyze endpoint without authentication"""
    payload = {
        "files": {
            "test.py": "import unused\nprint('hello')"
        }
    }
    response = client.post("/analyze", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "reports" in data
    assert "test.py" in data["reports"]


def test_analyze_multiple_files():
    """Test analyzing multiple files"""
    payload = {
        "files": {
            "file1.py": "import unused\nprint('hello')",
            "file2.py": "print(1 + 2)"
        }
    }
    response = client.post("/analyze", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "file1.py" in data["reports"]
    assert "file2.py" in data["reports"]


class TestAuthEndpoints:
    def test_register_user(self):
        """Test user registration"""
        response = client.post("/auth/register", json={
            "username": "newuser",
            "email": "newuser@example.com",
            "password": "SecurePass123!"
        })
        assert response.status_code == 200
        data = response.json()
        assert data["username"] == "newuser"
        assert data["email"] == "newuser@example.com"

    def test_register_duplicate_username(self):
        """Test registration with duplicate username"""
        client.post("/auth/register", json={
            "username": "testuser",
            "email": "test1@example.com",
            "password": "SecurePass123!"
        })
        # Try to register again with same username
        response = client.post("/auth/register", json={
            "username": "testuser",
            "email": "test2@example.com",
            "password": "SecurePass123!"
        })
        assert response.status_code == 400

    def test_login(self):
        """Test user login"""
        # Register first
        client.post("/auth/register", json={
            "username": "loginuser",
            "email": "login@example.com",
            "password": "SecurePass123!"
        })
        # Then login
        response = client.post("/auth/login", json={
            "username": "loginuser",
            "password": "SecurePass123!"
        })
        assert response.status_code == 200
        data = response.json()
        assert "access_token" in data
        assert data["token_type"] == "bearer"

    def test_login_wrong_password(self):
        """Test login with wrong password"""
        client.post("/auth/register", json={
            "username": "wrongpass",
            "email": "wrong@example.com",
            "password": "CorrectPass123!"
        })
        response = client.post("/auth/login", json={
            "username": "wrongpass",
            "password": "WrongPass123!"
        })
        assert response.status_code == 401

    def test_get_current_user(self):
        """Test getting current user with token"""
        # Register and login
        client.post("/auth/register", json={
            "username": "currentuser",
            "email": "current@example.com",
            "password": "SecurePass123!"
        })
        login_response = client.post("/auth/login", json={
            "username": "currentuser",
            "password": "SecurePass123!"
        })
        token = login_response.json()["access_token"]
        
        # Get current user
        response = client.get(
            "/auth/me",
            headers={"Authorization": f"Bearer {token}"}
        )
        assert response.status_code == 200
        assert response.json()["username"] == "currentuser"

    def test_get_current_user_without_token(self):
        """Test getting current user without token"""
        response = client.get("/auth/me")
        assert response.status_code == 401

