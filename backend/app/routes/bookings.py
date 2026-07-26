from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.schemas.booking import BookingCreate, BookingResponse
from app.services.booking_service import BookingService

router = APIRouter()

# For mocking, assume guest is ID 6
def get_current_user_id() -> int:
    return 6

@router.post("", response_model=BookingResponse, status_code=status.HTTP_201_CREATED)
def create_booking(booking: BookingCreate, db: Session = Depends(get_db)):
    guest_id = get_current_user_id()
    return BookingService.create_booking(db, booking, guest_id)

@router.get("", response_model=List[BookingResponse])
def get_my_bookings(db: Session = Depends(get_db)):
    guest_id = get_current_user_id()
    return BookingService.get_guest_bookings(db, guest_id)

@router.get("/host", response_model=List[BookingResponse])
def get_host_bookings(host_id: int = 1, db: Session = Depends(get_db)):
    # Assuming host_id is passed for the mock, normally would be from token
    return BookingService.get_host_bookings(db, host_id)

@router.put("/{booking_id}/cancel", response_model=BookingResponse)
def cancel_booking(booking_id: int, db: Session = Depends(get_db)):
    user_id = get_current_user_id()
    return BookingService.cancel_booking(db, booking_id, user_id)
