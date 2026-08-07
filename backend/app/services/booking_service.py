from sqlalchemy.orm import Session
from sqlalchemy import or_, and_
from datetime import date, datetime, timezone, time
from zoneinfo import ZoneInfo
from typing import List, Optional
from fastapi import HTTPException, status
from app.models.booking import Booking
from app.models.listing import Listing
from app.schemas.booking import BookingCreate

# Fixed check-in / check-out times (property-local time)
CHECK_IN_TIME = time(15, 0)   # 3:00 PM
CHECK_OUT_TIME = time(11, 0)  # 11:00 AM


class BookingService:

    @staticmethod
    def normalize_to_utc(dt: datetime, listing_timezone: str) -> datetime:
        """
        Convert an incoming datetime to UTC.

        - If the datetime is offset-aware (e.g., the frontend sent an ISO string
          with +05:30), convert it directly to UTC.
        - If it is naive, treat it as being in the listing's timezone, then convert.
        """
        if dt.tzinfo is not None:
            # Already offset-aware → just convert to UTC
            return dt.astimezone(timezone.utc).replace(tzinfo=None)
        else:
            # Naive → assume it's in the listing's timezone
            tz = ZoneInfo(listing_timezone)
            localized = dt.replace(tzinfo=tz)
            return localized.astimezone(timezone.utc).replace(tzinfo=None)

    @staticmethod
    def apply_fixed_times(
        check_in_dt: datetime,
        check_out_dt: datetime,
        listing_timezone: str,
    ) -> tuple[datetime, datetime]:
        """
        Given datetimes (which may be date-only with time=00:00), apply the
        fixed 3 PM check-in and 11 AM check-out in the listing's local timezone,
        then normalize to UTC.
        """
        tz = ZoneInfo(listing_timezone)

        # Build local datetimes with fixed times
        check_in_local = datetime.combine(check_in_dt.date(), CHECK_IN_TIME, tzinfo=tz)
        check_out_local = datetime.combine(check_out_dt.date(), CHECK_OUT_TIME, tzinfo=tz)

        # Convert to UTC (strip tzinfo for DB storage as naive-UTC)
        check_in_utc = check_in_local.astimezone(timezone.utc).replace(tzinfo=None)
        check_out_utc = check_out_local.astimezone(timezone.utc).replace(tzinfo=None)

        return check_in_utc, check_out_utc

    @staticmethod
    def validate_booking_dates(db: Session, listing_id: int, check_in_utc: datetime, check_out_utc: datetime):
        # 1. Ensure check_out is after check_in
        if check_in_utc >= check_out_utc:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Check-out date must be after check-in date"
            )
            
        # 2. Ensure dates are in the future
        now_utc = datetime.now(timezone.utc).replace(tzinfo=None)
        if check_in_utc < now_utc:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Check-in date cannot be in the past"
            )
            
        # 3. Check no overlapping bookings
        # Overlap happens if a confirmed booking's check_in < requested_check_out AND booking's check_out > requested_check_in
        overlapping = db.query(Booking).filter(
            Booking.listing_id == listing_id,
            Booking.status == 'confirmed',
            Booking.check_in_date < check_out_utc,
            Booking.check_out_date > check_in_utc
        ).first()
        
        if overlapping:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Dates are unavailable"
            )

    @staticmethod
    def calculate_total_price(price_per_night: float, cleaning_fee: float, check_in_utc: datetime, check_out_utc: datetime, num_guests: int) -> float:
        # Calculate nights from dates (use date part only for night count)
        nights = (check_out_utc.date() - check_in_utc.date()).days
        if nights <= 0:
            nights = 1
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

        listing_tz = listing.timezone or "UTC"

        # Apply fixed check-in (3 PM) / check-out (11 AM) in listing's local timezone
        check_in_utc, check_out_utc = BookingService.apply_fixed_times(
            booking_data.check_in_date,
            booking_data.check_out_date,
            listing_tz,
        )

        BookingService.validate_booking_dates(
            db, booking_data.listing_id, check_in_utc, check_out_utc
        )
        
        total_price = BookingService.calculate_total_price(
            listing.price_per_night,
            listing.cleaning_fee,
            check_in_utc,
            check_out_utc,
            booking_data.num_guests
        )
        
        new_booking = Booking(
            listing_id=booking_data.listing_id,
            guest_id=guest_id,
            check_in_date=check_in_utc,
            check_out_date=check_out_utc,
            num_guests=booking_data.num_guests,
            total_price=total_price,
            status="confirmed",
            guest_timezone=booking_data.guest_timezone,
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
