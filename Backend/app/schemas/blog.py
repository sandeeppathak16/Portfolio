from typing import Optional

from pydantic import BaseModel
from datetime import datetime


class BlogBase(BaseModel):
    title: str
    slug: str
    tags: Optional[str] = None


class BlogCreate(BlogBase):
    content: str


class BlogUpdate(BlogBase):
    content: str


class BlogOut(BlogBase):
    id: int
    created_at: datetime

    class Config:
        orm_mode = True
