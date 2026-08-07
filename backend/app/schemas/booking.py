from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional
from .listing import ListingListResponse

class BookingBase(BaseModel):
    check_in_date: datetime
    check_out_date: datetime
    num_guests: int = Field(..., ge=1)

class BookingCreate(BookingBase):
    listing_id: int
    guest_timezone: Optional[str] = None

class BookingResponse(BookingBase):
    id: int
    listing_id: int
    guest_id: int
    total_price: float
    status: str
    guest_timezone: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    
    # We might want to return the listing details when viewing a booking
    listing: Optional[ListingListResponse] = None

    class Config:
        orm_mode = True
        from_attributes = True
