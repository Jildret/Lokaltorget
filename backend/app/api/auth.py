import random
from datetime import datetime, timedelta

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError

from app.database import get_db
from app.models.user import User
from app.schemas.user import UserCreate, UserLogin, UserResponse, Token, VerifyEmail
from app.auth.security import hash_password, verify_password, create_access_token
from app.auth.email import send_verification_email
from app.auth.dependencies import get_current_user

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/register", response_model=UserResponse)
def register(user_in: UserCreate, db: Session = Depends(get_db)):
    code = str(random.randint(100000, 999999))
    expires = datetime.utcnow() + timedelta(minutes=15)

    new_user = User(
        email=user_in.email,
        password_hash=hash_password(user_in.password),
        role=user_in.role,
        is_verified=False,
        verification_code=code,
        verification_code_expires=expires,
    )
    db.add(new_user)
    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=400, detail="E-postadressen används redan")
    db.refresh(new_user)

    send_verification_email(new_user.email, code)

    return new_user

@router.post("/verify")
def verify_email(data: VerifyEmail, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == data.email).first()
    if not user:
        raise HTTPException(status_code=404, detail="Användaren hittades inte")
    if user.is_verified:
        return {"message": "E-postadressen är redan verifierad"}
    if user.verification_code != data.code:
        raise HTTPException(status_code=400, detail="Felaktig kod")
    if user.verification_code_expires < datetime.utcnow():
        raise HTTPException(status_code=400, detail="Koden har gått ut, begär en ny")

    user.is_verified = True
    user.verification_code = None
    db.commit()
    return {"message": "E-postadressen är nu verifierad!"}

@router.post("/login", response_model=Token)
def login(credentials: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == credentials.email).first()
    if not user or not verify_password(credentials.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Fel e-post eller lösenord")
    if not user.is_verified:
        raise HTTPException(status_code=403, detail="Du måste verifiera din e-postadress innan du kan logga in")
    token = create_access_token(str(user.id))
    return {"access_token": token}

@router.get("/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user