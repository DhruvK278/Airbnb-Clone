from pydantic import BaseModel, Field
from datetime import date, datetime
from typing import Optional
from .listing import ListingListResponse

class BookingBase(BaseModel):
    check_in_date: date
    check_out_date: date
    num_guests: int = Field(..., ge=1)

class BookingCreate(BookingBase):
    listing_id: int

class BookingResponse(BookingBase):
    id: int
    listing_id: int
    guest_id: int
    total_price: float
    status: str
    created_at: datetime
    updated_at: datetime
    
    # We might want to return the listing details when viewing a booking
    listing: Optional[ListingListResponse] = None

    class Config:
        orm_mode = True
        from_attributes = True
