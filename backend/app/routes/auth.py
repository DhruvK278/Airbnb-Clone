from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.user import UserCreate, UserLogin, UserResponse
from app.models.user import User
import hashlib

router = APIRouter()

def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()

@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def register(user: UserCreate, db: Session = Depends(get_db)):
    # Check if email exists
    existing = db.query(User).filter(User.email == user.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
        
    db_user = User(
        email=user.email,
        password_hash=hash_password(user.password),
        full_name=user.full_name,
        profile_picture_url=user.profile_picture_url,
        bio=user.bio,
        is_host=user.is_host
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

@router.post("/login", response_model=UserResponse)
def login(user: UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(
        User.email == user.email, 
        User.password_hash == hash_password(user.password)
    ).first()
    
    if not db_user:
        raise HTTPException(status_code=401, detail="Invalid credentials")
        
    return db_user

@router.get("/me", response_model=UserResponse)
def get_current_user(user_id: int = 6, db: Session = Depends(get_db)):
    # Mocking authenticated user: default to Guest (David Kim, id=6)
    db_user = db.query(User).filter(User.id == user_id).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user
