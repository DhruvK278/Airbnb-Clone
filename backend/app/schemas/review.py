from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional
from .user import UserResponse

class ReviewBase(BaseModel):
    rating: int = Field(..., ge=1, le=5)
    comment: str

class ReviewCreate(ReviewBase):
    booking_id: int

class ReviewResponse(ReviewBase):
    id: int
    booking_id: int
    guest_id: int
    listing_id: int
    created_at: datetime
    
    # Guest info is useful for rendering the review
    guest: Optional[UserResponse] = None

    class Config:
        orm_mode = True
        from_attributes = True
