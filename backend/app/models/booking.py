from sqlalchemy import (
    Column,
    Integer,
    Float,
    String,
    Date,
    DateTime,
    ForeignKey,
    Index,
)
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from app.database import Base


class Booking(Base):
    __tablename__ = "bookings"

    id = Column(Integer, primary_key=True, autoincrement=True)
    listing_id = Column(Integer, ForeignKey("listings.id"), nullable=False)
    guest_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    check_in_date = Column(Date, nullable=False, index=True)
    check_out_date = Column(Date, nullable=False, index=True)
    num_guests = Column(Integer, nullable=False)
    total_price = Column(Float, nullable=False)
    status = Column(String(50), default="confirmed", nullable=False)  # confirmed | cancelled | completed
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(
        DateTime,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )

    # Relationships
    listing = relationship("Listing", back_populates="bookings")
    guest = relationship("User", back_populates="bookings")
    review = relationship("Review", back_populates="booking", uselist=False)

    # Composite index for overlap queries
    __table_args__ = (
        Index("ix_bookings_listing_dates", "listing_id", "check_in_date", "check_out_date"),
    )

    def __repr__(self):
        return f"<Booking(id={self.id}, listing={self.listing_id}, guest={self.guest_id}, {self.check_in_date}→{self.check_out_date})>"
