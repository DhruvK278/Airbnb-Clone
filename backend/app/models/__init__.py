# Import all models so they're registered with Base.metadata
from app.models.user import User
from app.models.listing import Listing, ListingImage, Amenity, ListingAmenity
from app.models.booking import Booking
from app.models.review import Review
from app.models.favorite import Favorite

__all__ = [
    "User",
    "Listing",
    "ListingImage",
    "Amenity",
    "ListingAmenity",
    "Booking",
    "Review",
    "Favorite",
]
