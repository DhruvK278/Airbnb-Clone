from sqlalchemy.orm import Session
from sqlalchemy import or_, and_
from datetime import date
from typing import List, Optional
from fastapi import HTTPException, status
from app.models.booking import Booking
from app.models.listing import Listing
from app.schemas.booking import BookingCreate

class BookingService:
    @staticmethod
    def validate_booking_dates(db: Session, listing_id: int, check_in_date: date, check_out_date: date):
        # 1. Ensure check_out is after check_in
        if check_in_date >= check_out_date:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Check-out date must be after check-in date"
            )
            
        # 2. Ensure dates are in the future
        if check_in_date < date.today():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Check-in date cannot be in the past"
            )
            
        # 3. Check no overlapping bookings
        # Overlap happens if a confirmed booking's check_in < requested_check_out AND booking's check_out > requested_check_in
        overlapping = db.query(Booking).filter(
            Booking.listing_id == listing_id,
            Booking.status == 'confirmed',
            Booking.check_in_date < check_out_date,
            Booking.check_out_date > check_in_date
        ).first()
        
        if overlapping:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Dates are unavailable"
            )

    @staticmethod
    def calculate_total_price(price_per_night: float, cleaning_fee: float, check_in_date: date, check_out_date: date, num_guests: int) -> float:
        nights = (check_out_date - check_in_date).days
        base_price = price_per_night * nights
        service_fee = round(base_price * 0.16, 2)
        occupancy_fee = max(0, num_guests - 2) * 15
        
        return round(base_price + service_fee + cleaning_fee + occupancy_fee, 2)

    @staticmethod
    def create_booking(db: Session, booking_data: BookingCreate, guest_id: int) -> Booking:
        listing = db.query(Listing).filter(Listing.id == booking_data.listing_id).first()
        if not listing:
            raise HTTPException(status_code=404, detail="Listing not found")
            
        if booking_data.num_guests > listing.guests_max:
            raise HTTPException(status_code=400, detail=f"Maximum {listing.guests_max} guests allowed")
            
        BookingService.validate_booking_dates(
            db, booking_data.listing_id, booking_data.check_in_date, booking_data.check_out_date
        )
        
        total_price = BookingService.calculate_total_price(
            listing.price_per_night,
            listing.cleaning_fee,
            booking_data.check_in_date,
            booking_data.check_out_date,
            booking_data.num_guests
        )
        
        new_booking = Booking(
            listing_id=booking_data.listing_id,
            guest_id=guest_id,
            check_in_date=booking_data.check_in_date,
            check_out_date=booking_data.check_out_date,
            num_guests=booking_data.num_guests,
            total_price=total_price,
            status="confirmed"
        )
        
        db.add(new_booking)
        db.commit()
        db.refresh(new_booking)
        return new_booking

    @staticmethod
    def get_guest_bookings(db: Session, guest_id: int) -> List[Booking]:
        return db.query(Booking).filter(Booking.guest_id == guest_id).all()

    @staticmethod
    def get_host_bookings(db: Session, host_id: int) -> List[Booking]:
        return db.query(Booking).join(Listing).filter(Listing.host_id == host_id).all()

    @staticmethod
    def cancel_booking(db: Session, booking_id: int, user_id: int) -> Booking:
        booking = db.query(Booking).filter(Booking.id == booking_id).first()
        if not booking:
            raise HTTPException(status_code=404, detail="Booking not found")
            
        # Optional: ensure user is the guest or host (omitted for mocked simplified logic, but let's check guest at least)
        if booking.guest_id != user_id:
            # Maybe it's the host?
            listing = db.query(Listing).filter(Listing.id == booking.listing_id).first()
            if not listing or listing.host_id != user_id:
                raise HTTPException(status_code=403, detail="Not authorized to cancel this booking")
                
        booking.status = "cancelled"
        db.commit()
        db.refresh(booking)
        return booking
