from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.schemas.favorite import FavoriteResponse, FavoriteCreate
from app.models.favorite import Favorite

router = APIRouter()

def get_current_user_id() -> int:
    return 6

@router.get("", response_model=List[FavoriteResponse])
def get_favorites(db: Session = Depends(get_db)):
    user_id = get_current_user_id()
    return db.query(Favorite).filter(Favorite.user_id == user_id).all()

@router.post("", response_model=FavoriteResponse, status_code=status.HTTP_201_CREATED)
def add_favorite(fav: FavoriteCreate, db: Session = Depends(get_db)):
    user_id = get_current_user_id()
    
    existing = db.query(Favorite).filter(
        Favorite.user_id == user_id, 
        Favorite.listing_id == fav.listing_id
    ).first()
    
    if existing:
        return existing
        
    db_fav = Favorite(user_id=user_id, listing_id=fav.listing_id)
    db.add(db_fav)
    db.commit()
    db.refresh(db_fav)
    return db_fav

@router.delete("/{listing_id}", status_code=status.HTTP_204_NO_CONTENT)
def remove_favorite(listing_id: int, db: Session = Depends(get_db)):
    user_id = get_current_user_id()
    fav = db.query(Favorite).filter(
        Favorite.user_id == user_id, 
        Favorite.listing_id == listing_id
    ).first()
    
    if not fav:
        raise HTTPException(status_code=404, detail="Favorite not found")
        
    db.delete(fav)
    db.commit()
