from sqlalchemy import Column, Integer, String, Text, DateTime
from datetime import datetime

from Backend.app.db.base import Base


class Blog(Base):
    __tablename__ = "blogs"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    slug = Column(String, unique=True, nullable=False)
    content = Column(Text, nullable=False)
    tags = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
