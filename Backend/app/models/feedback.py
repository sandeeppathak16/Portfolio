from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, func, UniqueConstraint
from Backend.app.db.base import Base


class Feedback(Base):
    __tablename__ = "feedback"

    id = Column(Integer, primary_key=True, index=True)
    blog_id = Column(Integer, ForeignKey("blogs.id"), nullable=False)
    vote_type = Column(String, nullable=False)  # "like" or "dislike"
    ip_address = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    __table_args__ = (
        UniqueConstraint("blog_id", "ip_address", name="unique_vote_per_ip"),
    )
