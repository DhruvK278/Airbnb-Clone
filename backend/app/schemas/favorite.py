from pydantic import BaseModel
from datetime import datetime
from typing import Optional
from .listing import ListingListResponse

class FavoriteBase(BaseModel):
    listing_id: int

class FavoriteCreate(FavoriteBase):
    pass

class FavoriteResponse(FavoriteBase):
    id: int
    user_id: int
    created_at: datetime
    
    listing: Optional[ListingListResponse] = None

    class Config:
        orm_mode = True
        from_attributes = True
