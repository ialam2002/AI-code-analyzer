from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List, Dict, Any
from datetime import datetime

# User schemas
class UserCreate(BaseModel):
    username: str = Field(..., min_length=3, max_length=50)
    email: EmailStr
    password: str = Field(..., min_length=8)

class UserLogin(BaseModel):
    username: str
    password: str

class UserResponse(BaseModel):
    id: int
    username: str
    email: str
    created_at: datetime
    is_active: bool
    
    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"

# Analysis schemas
class FilesPayload(BaseModel):
    files: Dict[str, str]

class AnalysisResult(BaseModel):
    filename: str
    issues: List[str]
    summary: Optional[Dict[str, Any]] = None

class AnalysisResponse(BaseModel):
    reports: Dict[str, List[str]]

class AnalysisRecord(BaseModel):
    id: int
    filename: str
    created_at: datetime
    user_id: Optional[int]
    
    class Config:
        from_attributes = True

class HistoryResponse(BaseModel):
    analyses: List[AnalysisRecord]
    total: int

