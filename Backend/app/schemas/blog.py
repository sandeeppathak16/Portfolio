from typing import Optional

from pydantic import BaseModel
from datetime import datetime


class BlogBase(BaseModel):
    title: str
    slug: str
    content: str
    tags: Optional[str] = None


class BlogCreate(BlogBase):
    pass


class BlogUpdate(BlogBase):
    pass


class BlogOut(BlogBase):
    id: int
    created_at: datetime

    class Config:
        orm_mode = True
