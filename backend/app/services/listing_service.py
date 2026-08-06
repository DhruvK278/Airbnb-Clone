from typing import Optional, List, Tuple
from sqlalchemy.orm import Session
from sqlalchemy import or_, and_, not_
from datetime import date
from app.models.listing import Listing, ListingImage, Amenity, ListingAmenity
from app.models.booking import Booking
from app.schemas.listing import ListingCreate

class ListingService:
    @staticmethod
    def get_listing(db: Session, listing_id: int) -> Optional[Listing]:
        return db.query(Listing).filter(Listing.id == listing_id).first()

    @staticmethod
    def create_listing(db: Session, listing: ListingCreate, host_id: int) -> Listing:
        # Extract related data
        amenity_ids = listing.amenity_ids
        image_urls = listing.image_urls
        
        # Create listing
        db_listing = Listing(
            host_id=host_id,
            title=listing.title,
            description=listing.description,
            location=listing.location,
            latitude=listing.latitude,
            longitude=listing.longitude,
            property_type=listing.property_type,
            bedrooms=listing.bedrooms,
            bathrooms=listing.bathrooms,
            guests_max=listing.guests_max,
            price_per_night=listing.price_per_night,
            cleaning_fee=listing.cleaning_fee,
        )
        db.add(db_listing)
        db.flush() # To get the listing.id
        
        # Add images
        for i, url in enumerate(image_urls):
            db.add(ListingImage(listing_id=db_listing.id, image_url=url, display_order=i))
            
        # Add amenities
        for aid in amenity_ids:
            db.add(ListingAmenity(listing_id=db_listing.id, amenity_id=aid))
            
        db.commit()
        db.refresh(db_listing)
        return db_listing

    @staticmethod
    def get_listings(
        db: Session,
        location: Optional[str] = None,
        min_price: Optional[float] = None,
        max_price: Optional[float] = None,
        property_type: Optional[str] = None,
        bedrooms: Optional[int] = None,
        guests: Optional[int] = None,
        check_in_date: Optional[date] = None,
        check_out_date: Optional[date] = None,
        skip: int = 0,
        limit: int = 20,
    ) -> Tuple[List[Listing], int]:
        
        query = db.query(Listing).filter(Listing.is_active == True)
        
        # Basic filters
        if location:
            query = query.filter(Listing.location.ilike(f"%{location}%"))
        if min_price is not None:
            query = query.filter(Listing.price_per_night >= min_price)
        if max_price is not None:
            query = query.filter(Listing.price_per_night <= max_price)
        if property_type:
            query = query.filter(Listing.property_type == property_type)
        if bedrooms is not None:
            query = query.filter(Listing.bedrooms >= bedrooms)
        if guests is not None:
            query = query.filter(Listing.guests_max >= guests)
            
        # Date availability filter
        if check_in_date and check_out_date:
            # We want listings that do NOT have a confirmed booking overlapping this date range
            # Overlap condition: booking.check_in_date < target_out AND booking.check_out_date > target_in
            # Allow same day checkin/checkout by using strictly less/greater
            overlapping_bookings = db.query(Booking.listing_id).filter(
                Booking.status == 'confirmed',
                Booking.check_in_date < check_out_date,
                Booking.check_out_date > check_in_date
            )
            query = query.filter(not_(Listing.id.in_(overlapping_bookings)))

        total = query.count()
        listings = query.order_by(Listing.id.desc()).offset(skip).limit(limit).all()
        
        return listings, total
