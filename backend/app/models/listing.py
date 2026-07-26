from sqlalchemy import (
    Column,
    Integer,
    String,
    Float,
    Boolean,
    Text,
    DateTime,
    ForeignKey,
)
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from app.database import Base


class Listing(Base):
    __tablename__ = "listings"

    id = Column(Integer, primary_key=True, autoincrement=True)
    host_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    location = Column(String(255), nullable=False, index=True)
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    property_type = Column(String(100), nullable=True, index=True)
    bedrooms = Column(Integer, nullable=True)
    bathrooms = Column(Integer, nullable=True)
    guests_max = Column(Integer, nullable=True)
    price_per_night = Column(Float, nullable=False)
    cleaning_fee = Column(Float, default=50.0)
    rating = Column(Float, default=0.0)
    review_count = Column(Integer, default=0)
    is_active = Column(Boolean, default=True, index=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(
        DateTime,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )

    # Relationships
    host = relationship("User", back_populates="listings")
    images = relationship(
        "ListingImage", back_populates="listing", cascade="all, delete-orphan",
        order_by="ListingImage.display_order",
    )
    amenities = relationship(
        "Amenity", secondary="listing_amenities", back_populates="listings",
    )
    bookings = relationship("Booking", back_populates="listing", cascade="all, delete-orphan")
    reviews = relationship("Review", back_populates="listing", cascade="all, delete-orphan")
    favorites = relationship("Favorite", back_populates="listing", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<Listing(id={self.id}, title='{self.title}', location='{self.location}')>"


class ListingImage(Base):
    __tablename__ = "listing_images"

    id = Column(Integer, primary_key=True, autoincrement=True)
    listing_id = Column(
        Integer, ForeignKey("listings.id", ondelete="CASCADE"), nullable=False,
    )
    image_url = Column(Text, nullable=False)
    display_order = Column(Integer, default=0)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    # Relationships
    listing = relationship("Listing", back_populates="images")

    def __repr__(self):
        return f"<ListingImage(id={self.id}, listing_id={self.listing_id}, order={self.display_order})>"


class Amenity(Base):
    __tablename__ = "amenities"

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(100), unique=True, nullable=False)
    icon_name = Column(String(50), nullable=True)

    # Relationships
    listings = relationship(
        "Listing", secondary="listing_amenities", back_populates="amenities",
    )

    def __repr__(self):
        return f"<Amenity(id={self.id}, name='{self.name}')>"


class ListingAmenity(Base):
    __tablename__ = "listing_amenities"

    listing_id = Column(
        Integer,
        ForeignKey("listings.id", ondelete="CASCADE"),
        primary_key=True,
    )
    amenity_id = Column(
        Integer,
        ForeignKey("amenities.id"),
        primary_key=True,
    )
