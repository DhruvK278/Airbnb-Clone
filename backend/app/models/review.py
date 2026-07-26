from sqlalchemy import Column, Integer, Text, DateTime, ForeignKey, CheckConstraint
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from app.database import Base


class Review(Base):
    __tablename__ = "reviews"

    id = Column(Integer, primary_key=True, autoincrement=True)
    booking_id = Column(
        Integer, ForeignKey("bookings.id"), nullable=False, unique=True
    )  # one review per booking
    guest_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    listing_id = Column(Integer, ForeignKey("listings.id"), nullable=False)
    rating = Column(Integer, nullable=False)
    comment = Column(Text, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    # Relationships
    booking = relationship("Booking", back_populates="review")
    guest = relationship("User", back_populates="reviews")
    listing = relationship("Listing", back_populates="reviews")

    __table_args__ = (
        CheckConstraint("rating >= 1 AND rating <= 5", name="ck_reviews_rating"),
    )

    def __repr__(self):
        return f"<Review(id={self.id}, booking={self.booking_id}, rating={self.rating})>"
