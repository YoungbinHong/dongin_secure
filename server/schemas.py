from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional

class UserBase(BaseModel):
    username: str = Field(..., min_length=3, max_length=50)
    name: str = Field(..., min_length=1, max_length=100)
    position: str = Field(..., max_length=50)

class UserCreate(UserBase):
    password: str = Field(..., min_length=8)
    role: str = Field(default="user")

class UserUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=100)
    position: Optional[str] = Field(None, max_length=50)
    role: Optional[str] = None
    is_active: Optional[bool] = None

class UserResponse(UserBase):
    id: int
    role: str
    is_active: bool
    created_at: Optional[datetime]

    class Config:
        from_attributes = True

class PasswordChange(BaseModel):
    current_password: str
    new_password: str = Field(..., min_length=8)

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"

class TokenData(BaseModel):
    username: Optional[str] = None
    role: Optional[str] = None

class LoginRequest(BaseModel):
    username: str
    password: str