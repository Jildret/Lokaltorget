from pydantic import BaseModel, EmailStr, field_validator
import uuid

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    role: str = "seeker"

    @field_validator('password')
    @classmethod
    def password_min_length(cls, v: str) -> str:
        if len(v) < 8:
            raise ValueError('Lösenordet måste vara minst 8 tecken långt')
        return v

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: uuid.UUID
    email: EmailStr
    role: str

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"

class VerifyEmail(BaseModel):
    email: EmailStr
    code: str