"""
Seed script for the Airbnb Clone database.
Creates realistic test data: users, listings, images, amenities, bookings, reviews, favorites.

Usage:
    cd backend
    python app/seed_database.py
"""

import sys
import os
import hashlib
from datetime import date, datetime, timedelta, timezone

# Ensure the backend/ directory is on the Python path
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), ".."))

from app.database import SessionLocal, init_db
from app.models.user import User
from app.models.listing import Listing, ListingImage, Amenity, ListingAmenity
from app.models.booking import Booking
from app.models.review import Review
from app.models.favorite import Favorite


def hash_password(password: str) -> str:
    """Simple hash for mocked auth — NOT production-safe."""
    return hashlib.sha256(password.encode()).hexdigest()


def calculate_total_price(
    price_per_night: float,
    check_in: date,
    check_out: date,
    num_guests: int,
    cleaning_fee: float = 50.0,
) -> float:
    """Compute total price using the same formula the API will use."""
    nights = (check_out - check_in).days
    base_price = price_per_night * nights
    service_fee = round(base_price * 0.16, 2)
    occupancy_fee = max(0, num_guests - 2) * 15
    return round(base_price + service_fee + cleaning_fee + occupancy_fee, 2)


def seed():
    init_db()
    db = SessionLocal()

    try:
        # Check if already seeded
        if db.query(User).first():
            print("Database already seeded. Delete listings.db and re-run to reseed.")
            return

        print("Seeding database...")

        # ─── USERS ─────────────────────────────────────────────
        users = [
            # Hosts (5)
            User(
                email="sarah.johnson@example.com",
                password_hash=hash_password("password123"),
                full_name="Sarah Johnson",
                profile_picture_url="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop",
                bio="Superhost in NYC. I love sharing my beautiful apartments with travelers from around the world.",
                is_host=True,
            ),
            User(
                email="marcus.chen@example.com",
                password_hash=hash_password("password123"),
                full_name="Marcus Chen",
                profile_picture_url="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop",
                bio="LA-based host with a passion for design and architecture. My spaces reflect my love for modern living.",
                is_host=True,
            ),
            User(
                email="elena.martinez@example.com",
                password_hash=hash_password("password123"),
                full_name="Elena Martinez",
                profile_picture_url="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop",
                bio="Miami real estate enthusiast. I offer luxury beachfront properties for the perfect vacation.",
                is_host=True,
            ),
            User(
                email="james.wilson@example.com",
                password_hash=hash_password("password123"),
                full_name="James Wilson",
                profile_picture_url="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop",
                bio="San Francisco tech professional who hosts unique lofts and apartments in the Bay Area.",
                is_host=True,
            ),
            User(
                email="aisha.patel@example.com",
                password_hash=hash_password("password123"),
                full_name="Aisha Patel",
                profile_picture_url="https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=200&h=200&fit=crop",
                bio="Chicago host offering cozy stays in the Windy City. From downtown condos to neighborhood gems.",
                is_host=True,
            ),
            # Guests (3)
            User(
                email="david.kim@example.com",
                password_hash=hash_password("password123"),
                full_name="David Kim",
                profile_picture_url="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop",
                bio="Avid traveler exploring cities across the US.",
                is_host=False,
            ),
            User(
                email="rachel.green@example.com",
                password_hash=hash_password("password123"),
                full_name="Rachel Green",
                profile_picture_url="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop",
                bio="Weekend explorer and food lover.",
                is_host=False,
            ),
            User(
                email="tom.baker@example.com",
                password_hash=hash_password("password123"),
                full_name="Tom Baker",
                profile_picture_url="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop",
                bio="Business traveler who appreciates comfort and convenience.",
                is_host=False,
            ),
        ]
        db.add_all(users)
        db.flush()
        print(f"  Created {len(users)} users ({sum(1 for u in users if u.is_host)} hosts, {sum(1 for u in users if not u.is_host)} guests)")

        # ─── AMENITIES ─────────────────────────────────────────
        amenity_data = [
            ("WiFi", "wifi"),
            ("Kitchen", "utensils"),
            ("Air conditioning", "snowflake"),
            ("Heating", "flame"),
            ("Washer", "shirt"),
            ("Dryer", "wind"),
            ("Free parking", "car"),
            ("Pool", "waves"),
            ("Hot tub", "bath"),
            ("TV", "tv"),
            ("Gym", "dumbbell"),
            ("Smoke alarm", "bell"),
            ("First aid kit", "plus-circle"),
            ("Fire extinguisher", "shield"),
            ("Self check-in", "key"),
        ]
        amenities = [Amenity(name=name, icon_name=icon) for name, icon in amenity_data]
        db.add_all(amenities)
        db.flush()
        print(f"  Created {len(amenities)} amenities")

        # ─── LISTINGS ──────────────────────────────────────────
        # Image sets (Unsplash — real, publicly accessible)
        image_sets = {
            "apartment_nyc": [
                "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop",
                "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop",
                "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop",
                "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&h=600&fit=crop",
            ],
            "loft_nyc": [
                "https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=800&h=600&fit=crop",
                "https://images.unsplash.com/photo-1515263487990-61b07816b324?w=800&h=600&fit=crop",
                "https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=800&h=600&fit=crop",
            ],
            "modern_la": [
                "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop",
                "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop",
                "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop",
                "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&h=600&fit=crop",
                "https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=800&h=600&fit=crop",
            ],
            "villa_la": [
                "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&h=600&fit=crop",
                "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=600&fit=crop",
                "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&h=600&fit=crop",
                "https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=800&h=600&fit=crop",
            ],
            "beach_miami": [
                "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=800&h=600&fit=crop",
                "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&h=600&fit=crop",
                "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop",
                "https://images.unsplash.com/photo-1540541338287-41700207dee6?w=800&h=600&fit=crop",
            ],
            "condo_miami": [
                "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=800&h=600&fit=crop",
                "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800&h=600&fit=crop",
                "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=800&h=600&fit=crop",
            ],
            "loft_sf": [
                "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&h=600&fit=crop",
                "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop",
                "https://images.unsplash.com/photo-1617098900591-3f90928e8c54?w=800&h=600&fit=crop",
                "https://images.unsplash.com/photo-1600566753086-00f18f6b6769?w=800&h=600&fit=crop",
            ],
            "cabin": [
                "https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?w=800&h=600&fit=crop",
                "https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=800&h=600&fit=crop",
                "https://images.unsplash.com/photo-1587061949409-02df41d5e562?w=800&h=600&fit=crop",
            ],
            "chicago_condo": [
                "https://images.unsplash.com/photo-1560448075-cbc16bb4af8e?w=800&h=600&fit=crop",
                "https://images.unsplash.com/photo-1560185127-6ed189bf02f4?w=800&h=600&fit=crop",
                "https://images.unsplash.com/photo-1556020685-ae41abfc9365?w=800&h=600&fit=crop",
                "https://images.unsplash.com/photo-1600585152220-90363fe7e115?w=800&h=600&fit=crop",
            ],
            "treehouse": [
                "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&h=600&fit=crop",
                "https://images.unsplash.com/photo-1587061949409-02df41d5e562?w=800&h=600&fit=crop",
                "https://images.unsplash.com/photo-1444525873963-75d329ef9e1b?w=800&h=600&fit=crop",
            ],
        }

        listings_data = [
            # Host 1: Sarah Johnson (NYC) — 4 listings
            {
                "host_id": 1, "title": "Cozy Manhattan Studio near Central Park",
                "description": "Charming studio apartment just 2 blocks from Central Park. Recently renovated with modern furnishings, a fully equipped kitchen, and fast WiFi. Perfect for solo travelers or couples exploring NYC.",
                "location": "New York, NY", "latitude": 40.7831, "longitude": -73.9712,
                "property_type": "Apartment", "bedrooms": 1, "bathrooms": 1, "guests_max": 2,
                "price_per_night": 150.0, "cleaning_fee": 50.0, "images": "apartment_nyc",
                "amenity_ids": [1, 2, 3, 4, 10, 12, 13, 15],
            },
            {
                "host_id": 1, "title": "Spacious Brooklyn Loft with City Views",
                "description": "Industrial-chic loft in Williamsburg with exposed brick, 16-foot ceilings, and stunning Manhattan skyline views. Walking distance to the best restaurants and nightlife in Brooklyn.",
                "location": "New York, NY", "latitude": 40.7081, "longitude": -73.9571,
                "property_type": "Loft", "bedrooms": 2, "bathrooms": 1, "guests_max": 4,
                "price_per_night": 225.0, "cleaning_fee": 65.0, "images": "loft_nyc",
                "amenity_ids": [1, 2, 3, 4, 5, 6, 10, 12, 15],
            },
            {
                "host_id": 1, "title": "Luxury Upper East Side One-Bedroom",
                "description": "Elegant one-bedroom on the Upper East Side, steps from Museum Mile. Marble bathroom, gourmet kitchen, doorman building. Experience NYC like a local in one of the city's finest neighborhoods.",
                "location": "New York, NY", "latitude": 40.7736, "longitude": -73.9566,
                "property_type": "Apartment", "bedrooms": 1, "bathrooms": 1, "guests_max": 3,
                "price_per_night": 275.0, "cleaning_fee": 60.0, "images": "apartment_nyc",
                "amenity_ids": [1, 2, 3, 4, 5, 10, 11, 12, 13, 15],
            },
            {
                "host_id": 1, "title": "Charming Greenwich Village Apartment",
                "description": "A cozy pre-war apartment in the heart of Greenwich Village. Hardwood floors, exposed brick, and a quiet tree-lined street. Close to Washington Square Park and NYU.",
                "location": "New York, NY", "latitude": 40.7336, "longitude": -73.9991,
                "property_type": "Apartment", "bedrooms": 1, "bathrooms": 1, "guests_max": 2,
                "price_per_night": 195.0, "cleaning_fee": 45.0, "images": "loft_nyc",
                "amenity_ids": [1, 2, 3, 4, 10, 12, 15],
            },
            # Host 2: Marcus Chen (LA) — 4 listings
            {
                "host_id": 2, "title": "Modern Hollywood Hills Home with Pool",
                "description": "Stunning modern home perched in the Hollywood Hills with panoramic views of LA. Infinity pool, open-plan living, gourmet kitchen. The ultimate LA experience.",
                "location": "Los Angeles, CA", "latitude": 34.1341, "longitude": -118.3215,
                "property_type": "Entire home", "bedrooms": 3, "bathrooms": 2, "guests_max": 6,
                "price_per_night": 450.0, "cleaning_fee": 100.0, "images": "modern_la",
                "amenity_ids": [1, 2, 3, 7, 8, 10, 11, 12, 13, 14, 15],
            },
            {
                "host_id": 2, "title": "Beachfront Villa in Malibu",
                "description": "Wake up to the sound of waves in this beautiful Malibu beachfront villa. Direct beach access, spacious deck, and stunning sunset views. A true California dream.",
                "location": "Los Angeles, CA", "latitude": 34.0259, "longitude": -118.7798,
                "property_type": "Villa", "bedrooms": 4, "bathrooms": 3, "guests_max": 8,
                "price_per_night": 420.0, "cleaning_fee": 120.0, "images": "villa_la",
                "amenity_ids": [1, 2, 3, 5, 6, 7, 8, 9, 10, 12, 14],
            },
            {
                "host_id": 2, "title": "Venice Beach Creative Studio",
                "description": "Bright and airy studio in the heart of Venice Beach. Steps from the boardwalk, Abbot Kinney, and world-class restaurants. Perfect for the creative traveler.",
                "location": "Los Angeles, CA", "latitude": 33.9850, "longitude": -118.4695,
                "property_type": "Apartment", "bedrooms": 1, "bathrooms": 1, "guests_max": 2,
                "price_per_night": 175.0, "cleaning_fee": 40.0, "images": "modern_la",
                "amenity_ids": [1, 2, 3, 7, 10, 12, 15],
            },
            {
                "host_id": 2, "title": "Downtown LA Penthouse Loft",
                "description": "Luxurious penthouse loft in the Arts District with floor-to-ceiling windows, rooftop access, and designer furnishings. Walk to galleries, restaurants, and nightlife.",
                "location": "Los Angeles, CA", "latitude": 34.0407, "longitude": -118.2355,
                "property_type": "Loft", "bedrooms": 2, "bathrooms": 2, "guests_max": 4,
                "price_per_night": 320.0, "cleaning_fee": 75.0, "images": "loft_sf",
                "amenity_ids": [1, 2, 3, 5, 6, 7, 10, 11, 12, 15],
            },
            # Host 3: Elena Martinez (Miami) — 4 listings
            {
                "host_id": 3, "title": "South Beach Oceanfront Condo",
                "description": "Luxurious condo directly on South Beach with floor-to-ceiling ocean views. Resort-style amenities including pool, spa, and gym. Walk to Ocean Drive dining and nightlife.",
                "location": "Miami, FL", "latitude": 25.7826, "longitude": -80.1341,
                "property_type": "Apartment", "bedrooms": 2, "bathrooms": 2, "guests_max": 4,
                "price_per_night": 350.0, "cleaning_fee": 80.0, "images": "beach_miami",
                "amenity_ids": [1, 2, 3, 5, 8, 9, 10, 11, 12, 15],
            },
            {
                "host_id": 3, "title": "Art Deco Studio in Miami Beach",
                "description": "Beautifully restored Art Deco studio in a historic Miami Beach building. Steps from the beach, Lincoln Road, and the best restaurants in South Florida.",
                "location": "Miami, FL", "latitude": 25.7907, "longitude": -80.1300,
                "property_type": "Apartment", "bedrooms": 1, "bathrooms": 1, "guests_max": 2,
                "price_per_night": 165.0, "cleaning_fee": 45.0, "images": "condo_miami",
                "amenity_ids": [1, 2, 3, 8, 10, 12, 15],
            },
            {
                "host_id": 3, "title": "Brickell Luxury High-Rise",
                "description": "Modern luxury apartment in Brickell with bay views. Full amenities including infinity pool, fitness center, and concierge. In the heart of Miami's financial district.",
                "location": "Miami, FL", "latitude": 25.7617, "longitude": -80.1918,
                "property_type": "Apartment", "bedrooms": 2, "bathrooms": 2, "guests_max": 4,
                "price_per_night": 280.0, "cleaning_fee": 70.0, "images": "condo_miami",
                "amenity_ids": [1, 2, 3, 5, 6, 7, 8, 10, 11, 12, 15],
            },
            {
                "host_id": 3, "title": "Coconut Grove Tropical Villa",
                "description": "Lush tropical villa in quiet Coconut Grove with private garden, pool, and outdoor dining area. A serene retreat just minutes from downtown Miami.",
                "location": "Miami, FL", "latitude": 25.7126, "longitude": -80.2590,
                "property_type": "Villa", "bedrooms": 3, "bathrooms": 2, "guests_max": 6,
                "price_per_night": 395.0, "cleaning_fee": 90.0, "images": "villa_la",
                "amenity_ids": [1, 2, 3, 5, 6, 7, 8, 9, 10, 12, 14],
            },
            # Host 4: James Wilson (San Francisco) — 4 listings
            {
                "host_id": 4, "title": "SoMa Tech Loft with Rooftop",
                "description": "Converted warehouse loft in SoMa with soaring ceilings, exposed brick, and access to a stunning rooftop terrace. Walk to SFMOMA and the best of downtown SF.",
                "location": "San Francisco, CA", "latitude": 37.7749, "longitude": -122.3964,
                "property_type": "Loft", "bedrooms": 2, "bathrooms": 1, "guests_max": 4,
                "price_per_night": 245.0, "cleaning_fee": 60.0, "images": "loft_sf",
                "amenity_ids": [1, 2, 3, 4, 5, 10, 12, 15],
            },
            {
                "host_id": 4, "title": "Pacific Heights Victorian Flat",
                "description": "Gorgeous Victorian flat in Pacific Heights with bay windows, period details, and views of the Golden Gate Bridge. One of SF's most desirable neighborhoods.",
                "location": "San Francisco, CA", "latitude": 37.7925, "longitude": -122.4356,
                "property_type": "Entire home", "bedrooms": 2, "bathrooms": 1, "guests_max": 4,
                "price_per_night": 310.0, "cleaning_fee": 70.0, "images": "apartment_nyc",
                "amenity_ids": [1, 2, 3, 4, 5, 6, 10, 12, 13, 15],
            },
            {
                "host_id": 4, "title": "Cozy Cabin in Muir Woods",
                "description": "Escape to nature in this charming cabin nestled among the redwoods of Muir Woods. Perfect for hikers and nature lovers seeking peace and quiet.",
                "location": "San Francisco, CA", "latitude": 37.8912, "longitude": -122.5714,
                "property_type": "Cabin", "bedrooms": 1, "bathrooms": 1, "guests_max": 2,
                "price_per_night": 135.0, "cleaning_fee": 40.0, "images": "cabin",
                "amenity_ids": [1, 2, 4, 7, 12, 13, 14],
            },
            {
                "host_id": 4, "title": "Mission District Artist Apartment",
                "description": "Colorful apartment in the vibrant Mission District, surrounded by murals, taquerias, and indie coffee shops. A true San Francisco cultural experience.",
                "location": "San Francisco, CA", "latitude": 37.7599, "longitude": -122.4148,
                "property_type": "Apartment", "bedrooms": 1, "bathrooms": 1, "guests_max": 3,
                "price_per_night": 185.0, "cleaning_fee": 45.0, "images": "loft_sf",
                "amenity_ids": [1, 2, 3, 5, 10, 12, 15],
            },
            # Host 5: Aisha Patel (Chicago + Austin) — 4 listings
            {
                "host_id": 5, "title": "Magnificent Mile Luxury Condo",
                "description": "Stunning condo on Chicago's famous Magnificent Mile. Floor-to-ceiling windows with lake and city views. Steps from world-class shopping, dining, and entertainment.",
                "location": "Chicago, IL", "latitude": 41.8942, "longitude": -87.6245,
                "property_type": "Apartment", "bedrooms": 2, "bathrooms": 2, "guests_max": 4,
                "price_per_night": 240.0, "cleaning_fee": 60.0, "images": "chicago_condo",
                "amenity_ids": [1, 2, 3, 4, 5, 6, 7, 10, 11, 12, 15],
            },
            {
                "host_id": 5, "title": "Wicker Park Bohemian Flat",
                "description": "Eclectic flat in trendy Wicker Park with vintage furnishings and local art. Walk to the best bars, restaurants, and boutiques in Chicago's hippest neighborhood.",
                "location": "Chicago, IL", "latitude": 41.9088, "longitude": -87.6796,
                "property_type": "Apartment", "bedrooms": 1, "bathrooms": 1, "guests_max": 2,
                "price_per_night": 130.0, "cleaning_fee": 40.0, "images": "chicago_condo",
                "amenity_ids": [1, 2, 3, 4, 5, 10, 12, 15],
            },
            {
                "host_id": 5, "title": "Austin Hill Country Treehouse",
                "description": "Unique treehouse retreat in the Texas Hill Country, just 30 minutes from downtown Austin. Surrounded by oak trees with a private deck and stargazing platform.",
                "location": "Austin, TX", "latitude": 30.3515, "longitude": -97.8353,
                "property_type": "Treehouse", "bedrooms": 1, "bathrooms": 1, "guests_max": 2,
                "price_per_night": 175.0, "cleaning_fee": 35.0, "images": "treehouse",
                "amenity_ids": [1, 4, 7, 12, 13, 14],
            },
            {
                "host_id": 5, "title": "Downtown Austin Modern Condo",
                "description": "Sleek modern condo in the heart of Austin's entertainment district. Walk to 6th Street, Rainey Street, and the best live music venues in the world.",
                "location": "Austin, TX", "latitude": 30.2672, "longitude": -97.7431,
                "property_type": "Apartment", "bedrooms": 1, "bathrooms": 1, "guests_max": 3,
                "price_per_night": 155.0, "cleaning_fee": 40.0, "images": "chicago_condo",
                "amenity_ids": [1, 2, 3, 5, 7, 8, 10, 11, 12, 15],
            },
        ]

        for ld in listings_data:
            imgs_key = ld.pop("images")
            amenity_ids = ld.pop("amenity_ids")

            listing = Listing(**ld)
            db.add(listing)
            db.flush()

            # Add images
            for i, url in enumerate(image_sets[imgs_key]):
                db.add(ListingImage(listing_id=listing.id, image_url=url, display_order=i))

            # Add amenities
            for aid in amenity_ids:
                db.add(ListingAmenity(listing_id=listing.id, amenity_id=aid))

        db.flush()
        print(f"  Created {len(listings_data)} listings with images and amenities")

        # ─── BOOKINGS ──────────────────────────────────────────
        today = date.today()
        bookings_data = [
            # Past completed bookings (for reviews)
            {"listing_id": 1, "guest_id": 6, "check_in": today - timedelta(days=60), "check_out": today - timedelta(days=55), "num_guests": 2, "status": "completed"},
            {"listing_id": 2, "guest_id": 7, "check_in": today - timedelta(days=45), "check_out": today - timedelta(days=40), "num_guests": 3, "status": "completed"},
            {"listing_id": 5, "guest_id": 8, "check_in": today - timedelta(days=30), "check_out": today - timedelta(days=25), "num_guests": 4, "status": "completed"},
            {"listing_id": 9, "guest_id": 6, "check_in": today - timedelta(days=20), "check_out": today - timedelta(days=15), "num_guests": 2, "status": "completed"},
            {"listing_id": 13, "guest_id": 7, "check_in": today - timedelta(days=35), "check_out": today - timedelta(days=30), "num_guests": 2, "status": "completed"},
            {"listing_id": 17, "guest_id": 8, "check_in": today - timedelta(days=50), "check_out": today - timedelta(days=46), "num_guests": 2, "status": "completed"},
            {"listing_id": 10, "guest_id": 6, "check_in": today - timedelta(days=25), "check_out": today - timedelta(days=22), "num_guests": 1, "status": "completed"},
            # Future confirmed bookings (for availability testing)
            {"listing_id": 1, "guest_id": 7, "check_in": today + timedelta(days=10), "check_out": today + timedelta(days=15), "num_guests": 2, "status": "confirmed"},
            {"listing_id": 5, "guest_id": 6, "check_in": today + timedelta(days=5), "check_out": today + timedelta(days=12), "num_guests": 5, "status": "confirmed"},
            {"listing_id": 9, "guest_id": 8, "check_in": today + timedelta(days=20), "check_out": today + timedelta(days=25), "num_guests": 3, "status": "confirmed"},
            {"listing_id": 13, "guest_id": 6, "check_in": today + timedelta(days=7), "check_out": today + timedelta(days=10), "num_guests": 2, "status": "confirmed"},
            # One cancelled booking
            {"listing_id": 2, "guest_id": 8, "check_in": today + timedelta(days=15), "check_out": today + timedelta(days=20), "num_guests": 2, "status": "cancelled"},
        ]

        for bd in bookings_data:
            listing = db.query(Listing).get(bd["listing_id"])
            total = calculate_total_price(
                listing.price_per_night, bd["check_in"], bd["check_out"], bd["num_guests"], listing.cleaning_fee
            )
            booking = Booking(
                listing_id=bd["listing_id"],
                guest_id=bd["guest_id"],
                check_in_date=bd["check_in"],
                check_out_date=bd["check_out"],
                num_guests=bd["num_guests"],
                total_price=total,
                status=bd["status"],
            )
            db.add(booking)

        db.flush()
        print(f"  Created {len(bookings_data)} bookings (7 completed, 4 future, 1 cancelled)")

        # ─── REVIEWS ───────────────────────────────────────────
        reviews_data = [
            {"booking_id": 1, "guest_id": 6, "listing_id": 1, "rating": 5,
             "comment": "Amazing apartment! So close to Central Park and everything was exactly as described. Sarah was a wonderful host."},
            {"booking_id": 2, "guest_id": 7, "listing_id": 2, "rating": 4,
             "comment": "Beautiful loft with incredible views. The space is huge and the location in Williamsburg is perfect. Only wish the AC was a bit stronger in summer."},
            {"booking_id": 3, "guest_id": 8, "listing_id": 5, "rating": 5,
             "comment": "This place is absolutely stunning! The pool, the views, everything was perfect. Marcus is an incredible host. Will definitely be back."},
            {"booking_id": 4, "guest_id": 6, "listing_id": 9, "rating": 4,
             "comment": "Great location on South Beach. The condo is modern and clean, and the ocean views are breathtaking. Elena was very responsive."},
            {"booking_id": 5, "guest_id": 7, "listing_id": 13, "rating": 5,
             "comment": "The SoMa loft exceeded all expectations. The rooftop terrace is amazing and the neighborhood is so vibrant. James was super helpful."},
            {"booking_id": 6, "guest_id": 8, "listing_id": 17, "rating": 4,
             "comment": "Love the Magnificent Mile location! The condo is beautiful and well-equipped. Great for exploring Chicago."},
            {"booking_id": 7, "guest_id": 6, "listing_id": 10, "rating": 5,
             "comment": "Such a charming Art Deco studio! The location in Miami Beach is unbeatable. Elena's recommendations were spot-on."},
        ]

        for rd in reviews_data:
            db.add(Review(**rd))

        db.flush()
        print(f"  Created {len(reviews_data)} reviews")

        # ─── UPDATE CACHED RATINGS ─────────────────────────────
        # Recalculate rating + review_count on each reviewed listing
        reviewed_listing_ids = set(r["listing_id"] for r in reviews_data)
        for lid in reviewed_listing_ids:
            reviews = db.query(Review).filter(Review.listing_id == lid).all()
            listing = db.query(Listing).get(lid)
            listing.review_count = len(reviews)
            listing.rating = round(sum(r.rating for r in reviews) / len(reviews), 2)

        db.flush()
        print("  Updated cached ratings on reviewed listings")

        # ─── FAVORITES ─────────────────────────────────────────
        favorites_data = [
            {"user_id": 6, "listing_id": 1},
            {"user_id": 6, "listing_id": 5},
            {"user_id": 6, "listing_id": 13},
            {"user_id": 7, "listing_id": 2},
            {"user_id": 7, "listing_id": 9},
            {"user_id": 7, "listing_id": 19},
            {"user_id": 8, "listing_id": 6},
            {"user_id": 8, "listing_id": 17},
        ]

        for fd in favorites_data:
            db.add(Favorite(**fd))

        db.flush()
        print(f"  Created {len(favorites_data)} favorites")

        # ─── COMMIT ────────────────────────────────────────────
        db.commit()
        print("\nDatabase seeded successfully!")
        print(f"   Users: {db.query(User).count()}")
        print(f"   Listings: {db.query(Listing).count()}")
        print(f"   Images: {db.query(ListingImage).count()}")
        print(f"   Amenities: {db.query(Amenity).count()}")
        print(f"   Bookings: {db.query(Booking).count()}")
        print(f"   Reviews: {db.query(Review).count()}")
        print(f"   Favorites: {db.query(Favorite).count()}")

    except Exception as e:
        db.rollback()
        print(f"\nSeeding failed: {e}")
        raise
    finally:
        db.close()


if __name__ == "__main__":
    seed()
