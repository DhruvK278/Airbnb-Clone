from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.schemas.review import ReviewCreate, ReviewResponse
from app.models.review import Review
from app.models.booking import Booking
from app.models.listing import Listing

router = APIRouter()

def get_current_user_id() -> int:
    return 6

@router.get("", response_model=List[ReviewResponse])
def get_reviews(listing_id: int, db: Session = Depends(get_db)):
    return db.query(Review).filter(Review.listing_id == listing_id).all()

@router.post("", response_model=ReviewResponse, status_code=status.HTTP_201_CREATED)
def create_review(review: ReviewCreate, db: Session = Depends(get_db)):
    guest_id = get_current_user_id()
    
    # Check if booking exists and belongs to guest
    booking = db.query(Booking).filter(Booking.id == review.booking_id).first()
    if not booking or booking.guest_id != guest_id:
        raise HTTPException(status_code=403, detail="Not authorized or booking not found")
        
    # Check if booking is completed
    if booking.status != "completed":
        raise HTTPException(status_code=400, detail="Can only review completed bookings")
        
    # Check if already reviewed
    existing = db.query(Review).filter(Review.booking_id == booking.id).first()
    if existing:
        raise HTTPException(status_code=400, detail="Already reviewed this booking")
        
    db_review = Review(
        booking_id=booking.id,
        guest_id=guest_id,
        listing_id=booking.listing_id,
        rating=review.rating,
        comment=review.comment
    )
    db.add(db_review)
    db.flush()
    
    # Aggregate and update listing cached rating
    listing = db.query(Listing).filter(Listing.id == booking.listing_id).first()
    reviews = db.query(Review).filter(Review.listing_id == booking.listing_id).all()
    
    listing.review_count = len(reviews)
    listing.rating = round(sum(r.rating for r in reviews) / len(reviews), 2)
    
    db.commit()
    db.refresh(db_review)
    return db_review
