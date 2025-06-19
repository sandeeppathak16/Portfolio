from typing import Optional, Literal

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
    like_count: int
    dislike_count: int
    user_feedback: Optional[Literal['like', 'dislike']] = None

    class Config:
        orm_mode = True


class FeedbackIn(BaseModel):
    vote_type: Optional[str]
