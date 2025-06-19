from __future__ import annotations

from typing import Optional

from sqlalchemy import func
from sqlalchemy.orm import Session
from Backend.app.models.blog import Blog
from Backend.app.models.feedback import Feedback
from Backend.app.schemas.blog import BlogCreate, BlogUpdate


def get_blog(db: Session, slug: str, include_counts=False, ip_address: Optional[str] = None):
    blog = db.query(Blog).filter_by(slug=slug).first()
    if not blog:
        return None

    if not include_counts:
        return blog

    like_count = (
        db.query(func.count())
        .select_from(Feedback)
        .filter_by(blog_id=blog.id, vote_type="like")
        .scalar()
    )

    dislike_count = (
        db.query(func.count())
        .select_from(Feedback)
        .filter_by(blog_id=blog.id, vote_type="dislike")
        .scalar()
    )

    user_feedback = None
    if ip_address:
        feedback = (
            db.query(Feedback)
            .filter_by(blog_id=blog.id, ip_address=ip_address)
            .first()
        )
        if feedback:
            user_feedback = feedback.vote_type

    blog_dict = blog.__dict__.copy()
    blog_dict["like_count"] = like_count
    blog_dict["dislike_count"] = dislike_count
    blog_dict["user_feedback"] = user_feedback

    return blog_dict


def get_blogs(db: Session, skip: int = 0, limit: int = 10, include_counts=False):
    results = (
        db.query(
            Blog,
            func.count(func.nullif(Feedback.vote_type != 'like', True)).label("like_count"),
            func.count(func.nullif(Feedback.vote_type != 'dislike', True)).label("dislike_count")
        )
        .outerjoin(Feedback, Blog.id == Feedback.blog_id)
        .group_by(Blog.id)
        .offset(skip)
        .limit(limit)
        .all()
    )

    if not include_counts:
        return results

    blog_list = []
    for blog, like_count, dislike_count in results:
        blog_dict = blog.__dict__.copy()
        blog_dict["like_count"] = like_count
        blog_dict["dislike_count"] = dislike_count
        blog_list.append(blog_dict)

    return blog_list


def create_blog(db: Session, blog: BlogCreate):
    db_blog = Blog(**blog.dict())
    db.add(db_blog)
    db.commit()
    db.refresh(db_blog)

    blog_dict = db_blog.__dict__.copy()
    blog_dict["like_count"] = 0
    blog_dict["dislike_count"] = 0
    return blog_dict


def update_blog(db: Session, db_blog: Blog, blog: BlogUpdate):
    for field, value in blog.dict().items():
        setattr(db_blog, field, value)
    db.commit()
    db.refresh(db_blog)

    like_count = db.query(func.count()).select_from(Feedback).filter_by(blog_id=db_blog.id, vote_type="like").scalar()
    dislike_count = db.query(func.count()).select_from(Feedback).filter_by(blog_id=db_blog.id, vote_type="dislike").scalar()

    blog_dict = db_blog.__dict__.copy()
    blog_dict["like_count"] = like_count
    blog_dict["dislike_count"] = dislike_count
    return blog_dict


def delete_blog(db: Session, db_blog: Blog):
    db.delete(db_blog)
    db.commit()
