import os
from dotenv import load_dotenv

load_dotenv()

# Database
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql+psycopg2://postgres:postgres@localhost:5432/code_review")
SQLALCHEMY_ECHO = os.getenv("SQLALCHEMY_ECHO", "False") == "True"

# JWT
SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key-change-in-production")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# CORS
ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS", "http://localhost:5173,http://127.0.0.1:5173").split(",")

# App
APP_NAME = "Intelligent Code Review Assistant"
APP_VERSION = "0.1.0"
DEBUG = os.getenv("DEBUG", "True") == "True"

