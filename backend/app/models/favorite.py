from sqlalchemy import Column, Integer, DateTime, ForeignKey, UniqueConstraint
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from app.database import Base


class Favorite(Base):
    __tablename__ = "favorites"

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    listing_id = Column(Integer, ForeignKey("listings.id"), nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    # Relationships
    user = relationship("User", back_populates="favorites")
    listing = relationship("Listing", back_populates="favorites")

    __table_args__ = (
        UniqueConstraint("user_id", "listing_id", name="uq_user_listing_favorite"),
    )

    def __repr__(self):
        return f"<Favorite(id={self.id}, user={self.user_id}, listing={self.listing_id})>"
