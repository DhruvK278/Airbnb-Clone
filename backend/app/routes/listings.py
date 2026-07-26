from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from typing import Optional
from datetime import date

from app.database import get_db
from app.schemas.listing import ListingCreate, ListingResponse, ListingListPaginated
from app.services.listing_service import ListingService

router = APIRouter()

@router.get("", response_model=ListingListPaginated)
def get_listings(
    location: Optional[str] = Query(None, description="Search by location"),
    min_price: Optional[float] = Query(None, description="Minimum price per night"),
    max_price: Optional[float] = Query(None, description="Maximum price per night"),
    property_type: Optional[str] = Query(None, description="Filter by property type"),
    bedrooms: Optional[int] = Query(None, description="Minimum number of bedrooms"),
    guests: Optional[int] = Query(None, description="Minimum number of guests allowed"),
    check_in_date: Optional[date] = Query(None, description="Desired check-in date"),
    check_out_date: Optional[date] = Query(None, description="Desired check-out date"),
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db)
):
    """
    Search and filter listings.
    """
    if check_in_date and check_out_date and check_in_date >= check_out_date:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail="check_in_date must be before check_out_date"
        )
        
    listings, total = ListingService.get_listings(
        db=db,
        location=location,
        min_price=min_price,
        max_price=max_price,
        property_type=property_type,
        bedrooms=bedrooms,
        guests=guests,
        check_in_date=check_in_date,
        check_out_date=check_out_date,
        skip=skip,
        limit=limit
    )
    
    return {
        "listings": listings,
        "total": total,
        "skip": skip,
        "limit": limit
    }

@router.get("/{listing_id}", response_model=ListingResponse)
def get_listing(listing_id: int, db: Session = Depends(get_db)):
    """
    Get a single listing by ID.
    """
    listing = ListingService.get_listing(db, listing_id)
    if not listing:
        raise HTTPException(status_code=404, detail="Listing not found")
    return listing

@router.post("", response_model=ListingResponse, status_code=status.HTTP_201_CREATED)
def create_listing(listing: ListingCreate, db: Session = Depends(get_db)):
    """
    Create a new listing.
    For now, mocks the host_id to 1.
    """
    # Mocking authenticated host ID as 1
    host_id = 1 
    
    new_listing = ListingService.create_listing(db, listing, host_id)
    return new_listing
