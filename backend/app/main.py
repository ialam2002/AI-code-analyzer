import json
from typing import Optional
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session

from .config import ALLOWED_ORIGINS, APP_NAME, APP_VERSION
from .database import engine, get_db
from .models import Base, User, Analysis
from .schemas import (
    FilesPayload, Token, UserCreate, UserLogin, UserResponse,
    AnalysisResponse, HistoryResponse, AnalysisRecord
)
from .analyzer import analyze_files
from .auth import (
    hash_password, create_access_token, get_current_user,
    get_current_optional_user, verify_password, ACCESS_TOKEN_EXPIRE_MINUTES
)
from datetime import timedelta

# Create tables on startup
Base.metadata.create_all(bind=engine)

app = FastAPI(title=APP_NAME, version=APP_VERSION)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ==================== Auth Routes ====================

@app.post("/auth/register", response_model=UserResponse)
def register(user: UserCreate, db: Session = Depends(get_db)):
    """Register a new user"""
    # Check if user exists
    if db.query(User).filter(User.username == user.username).first():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already registered"
        )
    if db.query(User).filter(User.email == user.email).first():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Create new user
    db_user = User(
        username=user.username,
        email=user.email,
        hashed_password=hash_password(user.password)
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


@app.post("/auth/login", response_model=Token)
def login(user: UserLogin, db: Session = Depends(get_db)):
    """Login user and return JWT token"""
    db_user = db.query(User).filter(User.username == user.username).first()
    
    if not db_user or not verify_password(user.password, db_user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials"
        )
    
    # Create access token
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": db_user.username}, expires_delta=access_token_expires
    )
    
    return {"access_token": access_token, "token_type": "bearer"}


@app.get("/auth/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    """Get current user info"""
    return current_user


# ==================== Analysis Routes ====================

@app.post("/analyze", response_model=AnalysisResponse)
async def analyze(
    payload: FilesPayload,
    current_user: Optional[User] = Depends(get_current_optional_user),
    db: Session = Depends(get_db)
):
    """Analyze files and return issues found"""
    reports = analyze_files(payload.files)
    
    # Save to database if user is authenticated
    if current_user:
        for filename, content in payload.files.items():
            analysis = Analysis(
                user_id=current_user.id,
                filename=filename,
                code_content=content,
                results=json.dumps(reports.get(filename, []))
            )
            db.add(analysis)
        db.commit()
    
    return {"reports": reports}


@app.get("/analysis/history", response_model=HistoryResponse)
def get_history(
    skip: int = 0,
    limit: int = 50,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get analysis history for current user"""
    analyses = db.query(Analysis).filter(
        Analysis.user_id == current_user.id
    ).order_by(Analysis.created_at.desc()).offset(skip).limit(limit).all()
    
    total = db.query(Analysis).filter(
        Analysis.user_id == current_user.id
    ).count()
    
    return {
        "analyses": analyses,
        "total": total
    }


@app.get("/analysis/{analysis_id}")
def get_analysis(
    analysis_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get specific analysis result"""
    analysis = db.query(Analysis).filter(
        Analysis.id == analysis_id,
        Analysis.user_id == current_user.id
    ).first()
    
    if not analysis:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Analysis not found"
        )
    
    return {
        "id": analysis.id,
        "filename": analysis.filename,
        "content": analysis.code_content,
        "results": json.loads(analysis.results),
        "created_at": analysis.created_at
    }


# ==================== Health Check ====================

@app.get("/health")
def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "version": APP_VERSION}

