import sys
import os
import random

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.database import SessionLocal
from app.models.listing import Listing, ListingImage, Amenity, ListingAmenity
from app.models.user import User
from app.auth.security import get_password_hash

def add_more():
    db = SessionLocal()
    
    if db.query(Listing).first():
        print("Database already has listings. Skipping seed.")
        db.close()
        return

    print("Creating fake hosts...")
    for i in range(1, 6):
        user = User(
            email=f"host{i}@airbnb.com",
            password_hash=get_password_hash("password123"),
            full_name=f"Host Number {i}",
            bio="I love hosting people from all over the world!",
            is_host=True
        )
        db.add(user)
    db.flush()

    print("Creating amenities...")
    amenities = [
        "Wifi", "Kitchen", "Free parking on premises", "Pool", "Hot tub",
        "Air conditioning", "Heating", "Washer", "Dryer", "TV",
        "Gym", "Breakfast", "Indoor fireplace", "Smoking allowed"
    ]
    for am in amenities:
        db.add(Amenity(name=am, icon_name="star"))
    db.flush()

    print("Creating listings...")
    image_sets = {
        "beach_house": [
            "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=800&h=600&fit=crop",
            "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&h=600&fit=crop",
            "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop",
        ],
        "mountain_cabin": [
            "https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=800&h=600&fit=crop",
            "https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?w=800&h=600&fit=crop",
            "https://images.unsplash.com/photo-1587061949409-02df41d5e562?w=800&h=600&fit=crop",
        ],
        "city_apartment": [
            "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop",
            "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop",
            "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&h=600&fit=crop",
        ],
        "luxury_villa": [
            "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&h=600&fit=crop",
            "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=600&fit=crop",
            "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&h=600&fit=crop",
        ]
    }
    
    new_listings = [
        {
            "host_id": 1, "title": "Cozy Beachfront Cottage", "description": "Wake up to the sound of waves.",
            "location": "Malibu, CA", "latitude": 34.0259, "longitude": -118.7798,
            "property_type": "Cottage", "bedrooms": 2, "bathrooms": 1, "guests_max": 4,
            "price_per_night": 250.0, "cleaning_fee": 50.0, "images": "beach_house",
        },
        {
            "host_id": 2, "title": "Secluded Forest Cabin", "description": "Perfect getaway in the woods.",
            "location": "Aspen, CO", "latitude": 39.1911, "longitude": -106.8175,
            "property_type": "Cabin", "bedrooms": 3, "bathrooms": 2, "guests_max": 6,
            "price_per_night": 300.0, "cleaning_fee": 80.0, "images": "mountain_cabin",
        },
        {
            "host_id": 3, "title": "Downtown Penthouse", "description": "Luxury living in the heart of the city.",
            "location": "New York, NY", "latitude": 40.7128, "longitude": -74.0060,
            "property_type": "Penthouse", "bedrooms": 4, "bathrooms": 3, "guests_max": 8,
            "price_per_night": 600.0, "cleaning_fee": 150.0, "images": "city_apartment",
        },
        {
            "host_id": 4, "title": "Tropical Paradise Villa", "description": "Your own private slice of heaven.",
            "location": "Maui, HI", "latitude": 20.7984, "longitude": -156.3319,
            "property_type": "Villa", "bedrooms": 5, "bathrooms": 4, "guests_max": 10,
            "price_per_night": 800.0, "cleaning_fee": 200.0, "images": "luxury_villa",
        },
        {
            "host_id": 5, "title": "Lakefront Retreat", "description": "Beautiful views and private dock.",
            "location": "Lake Tahoe, NV", "latitude": 39.0968, "longitude": -120.0324,
            "property_type": "House", "bedrooms": 3, "bathrooms": 2, "guests_max": 6,
            "price_per_night": 350.0, "cleaning_fee": 100.0, "images": "beach_house",
        },
        {
            "host_id": 1, "title": "Modern Desert Home", "description": "Stunning architecture in the desert.",
            "location": "Joshua Tree, CA", "latitude": 34.1347, "longitude": -116.3131,
            "property_type": "House", "bedrooms": 2, "bathrooms": 2, "guests_max": 4,
            "price_per_night": 280.0, "cleaning_fee": 75.0, "images": "luxury_villa",
        },
        {
            "host_id": 2, "title": "Historic Townhouse", "description": "Charming historical details throughout.",
            "location": "Charleston, SC", "latitude": 32.7765, "longitude": -79.9311,
            "property_type": "Townhouse", "bedrooms": 3, "bathrooms": 2.5, "guests_max": 5,
            "price_per_night": 220.0, "cleaning_fee": 60.0, "images": "city_apartment",
        },
        {
            "host_id": 3, "title": "Ski-in/Ski-out Chalet", "description": "Direct access to the slopes.",
            "location": "Park City, UT", "latitude": 40.6461, "longitude": -111.4980,
            "property_type": "Chalet", "bedrooms": 4, "bathrooms": 3, "guests_max": 8,
            "price_per_night": 500.0, "cleaning_fee": 120.0, "images": "mountain_cabin",
        },
        {
            "host_id": 4, "title": "Eco-Friendly Treehouse", "description": "Sustainable living in the canopy.",
            "location": "Portland, OR", "latitude": 45.5152, "longitude": -122.6784,
            "property_type": "Treehouse", "bedrooms": 1, "bathrooms": 1, "guests_max": 2,
            "price_per_night": 150.0, "cleaning_fee": 40.0, "images": "mountain_cabin",
        },
        {
            "host_id": 5, "title": "Oceanview Condo", "description": "Breathtaking views from every room.",
            "location": "Miami, FL", "latitude": 25.7617, "longitude": -80.1918,
            "property_type": "Condo", "bedrooms": 2, "bathrooms": 2, "guests_max": 4,
            "price_per_night": 320.0, "cleaning_fee": 85.0, "images": "city_apartment",
        }
    ]

    for ld in new_listings:
        imgs_key = ld.pop("images")
        
        listing = Listing(**ld)
        db.add(listing)
        db.flush()

        # Add images
        for i, url in enumerate(image_sets[imgs_key]):
            db.add(ListingImage(listing_id=listing.id, image_url=url, display_order=i))

        # Add random amenities
        for aid in random.sample(range(1, 15), 5):
            db.add(ListingAmenity(listing_id=listing.id, amenity_id=aid))
            
    db.commit()
    print("Successfully seeded the remote database with 10 listings!")
    db.close()

if __name__ == "__main__":
    add_more()
