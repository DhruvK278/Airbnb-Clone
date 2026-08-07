from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from typing import Optional
from datetime import date

from app.database import get_db
from app.schemas.listing import ListingCreate, ListingResponse, ListingListPaginated
from app.services.listing_service import ListingService

def get_current_host_id() -> int:
    return 2  # Match frontend HOST_ID for mock consistency

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
    For now, mocks the host_id.
    """
    host_id = get_current_host_id()
    
    new_listing = ListingService.create_listing(db, listing, host_id)
    return new_listing

@router.get("/{listing_id}/availability")
def get_listing_availability(listing_id: int, year: int, month: int, db: Session = Depends(get_db)):
    """
    Get booked dates for a specific month/year.
    Now works with DateTime (UTC) columns — extracts the date portion for the calendar.
    """
    from datetime import date, datetime, timedelta
    import calendar
    from app.models.booking import Booking
    
    # Build the month range as datetimes for comparison against UTC DateTime columns
    start_dt = datetime(year, month, 1, 0, 0, 0)
    last_day = calendar.monthrange(year, month)[1]
    end_dt = datetime(year, month, last_day, 23, 59, 59)
    
    bookings = db.query(Booking).filter(
        Booking.listing_id == listing_id,
        Booking.status == 'confirmed',
        Booking.check_in_date <= end_dt,
        Booking.check_out_date >= start_dt
    ).all()
    
    booked_dates = set()
    for b in bookings:
        # Extract date portion from UTC datetimes
        current = max(b.check_in_date.date(), date(year, month, 1))
        end = min(b.check_out_date.date(), date(year, month, last_day))
        while current <= end:
            booked_dates.add(current.isoformat())
            current += timedelta(days=1)
            
    return {"booked_dates": list(booked_dates)}

@router.put("/{listing_id}", response_model=ListingResponse)
def update_listing(listing_id: int, listing_data: dict, db: Session = Depends(get_db)):
    """Mock update endpoint"""
    listing = ListingService.get_listing(db, listing_id)
    if not listing:
        raise HTTPException(status_code=404, detail="Listing not found")
        
    host_id = get_current_host_id()
    if listing.host_id != host_id:
        raise HTTPException(status_code=403, detail="Not authorized to edit this listing")
        
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
        
    host_id = get_current_host_id()
    if listing.host_id != host_id:
        raise HTTPException(status_code=403, detail="Not authorized to delete this listing")
        
    db.delete(listing)
    db.commit()

