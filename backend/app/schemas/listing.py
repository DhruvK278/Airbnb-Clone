from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime

# --- AMENITIES ---
class AmenitySchema(BaseModel):
    id: int
    name: str
    icon_name: str

    class Config:
        orm_mode = True
        from_attributes = True

# --- IMAGES ---
class ListingImageSchema(BaseModel):
    id: int
    image_url: str
    display_order: int

    class Config:
        orm_mode = True
        from_attributes = True

# --- LISTINGS ---
class ListingBase(BaseModel):
    title: str = Field(..., max_length=255)
    description: str
    location: str = Field(..., max_length=255)
    latitude: float
    longitude: float
    property_type: str = Field(..., max_length=100)
    bedrooms: int = Field(..., ge=0)
    bathrooms: int = Field(..., ge=0)
    guests_max: int = Field(..., ge=1)
    price_per_night: float = Field(..., ge=0)
    cleaning_fee: float = Field(default=0, ge=0)

class ListingCreate(ListingBase):
    amenity_ids: List[int] = Field(default_factory=list)
    image_urls: List[str] = Field(default_factory=list)

class ListingListResponse(ListingBase):
    """Lighter response for search results"""
    id: int
    host_id: int
    rating: float = 0.0
    review_count: int = 0
    is_active: bool = True
    images: List[ListingImageSchema] = []
    
    class Config:
        orm_mode = True
        from_attributes = True

from app.schemas.user import UserResponse

class ListingResponse(ListingListResponse):
    """Detailed response for single listing view"""
    created_at: datetime
    updated_at: datetime
    amenities: List[AmenitySchema] = []
    host: UserResponse
    
    class Config:
        orm_mode = True
        from_attributes = True

class ListingListPaginated(BaseModel):
    listings: List[ListingListResponse]
    total: int
    skip: int
    limit: int
