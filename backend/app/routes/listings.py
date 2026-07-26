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

@router.get("/{listing_id}/availability")
def get_listing_availability(listing_id: int, year: int, month: int, db: Session = Depends(get_db)):
    """
    Get booked dates for a specific month/year.
    """
    from datetime import date
    import calendar
    from app.models.booking import Booking
    
    start_date = date(year, month, 1)
    end_date = date(year, month, calendar.monthrange(year, month)[1])
    
    bookings = db.query(Booking).filter(
        Booking.listing_id == listing_id,
        Booking.status == 'confirmed',
        Booking.check_in_date <= end_date,
        Booking.check_out_date >= start_date
    ).all()
    
    booked_dates = []
    for b in bookings:
        # Simplistic range appending
        current = max(b.check_in_date, start_date)
        end = min(b.check_out_date, end_date)
        while current <= end:
            booked_dates.append(current.isoformat())
            from datetime import timedelta
            current += timedelta(days=1)
            
    return {"booked_dates": list(set(booked_dates))}

@router.put("/{listing_id}", response_model=ListingResponse)
def update_listing(listing_id: int, listing_data: dict, db: Session = Depends(get_db)):
    """Mock update endpoint"""
    listing = ListingService.get_listing(db, listing_id)
    if not listing:
        raise HTTPException(status_code=404, detail="Listing not found")
        
    for key, value in listing_data.items():
        if hasattr(listing, key):
            setattr(listing, key, value)
            
    db.commit()
    db.refresh(listing)
    return listing

@router.delete("/{listing_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_listing(listing_id: int, db: Session = Depends(get_db)):
    """Mock delete endpoint"""
    listing = ListingService.get_listing(db, listing_id)
    if not listing:
        raise HTTPException(status_code=404, detail="Listing not found")
        
    db.delete(listing)
    db.commit()

