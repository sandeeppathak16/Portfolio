from __future__ import annotations

from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session

from Backend.app.models.feedback import Feedback
from Backend.app.schemas.blog import BlogCreate, BlogOut, BlogUpdate, FeedbackIn
from Backend.app.crud import blog as crud_blog
from Backend.app.db.session import SessionLocal
from Backend.app.api.deps import get_current_superuser

router = APIRouter(prefix="/api/blogs", tags=["Blogs"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("/", response_model=list[BlogOut])
def read_blogs(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    return crud_blog.get_blogs(db, skip=skip, limit=limit, include_counts=True)


@router.get("/{slug}/", response_model=BlogOut)
def get_blog(slug: str, request: Request, db: Session = Depends(get_db)):
    client_ip = request.client.host
    blog = crud_blog.get_blog(db, slug, include_counts=True, ip_address=client_ip)
    if not blog:
        raise HTTPException(status_code=404, detail="Blog not found")
    return blog


@router.post("/", response_model=BlogOut)
def create_blog(
    blog: BlogCreate,
    db: Session = Depends(get_db),
    user=Depends(get_current_superuser)
):
    return crud_blog.create_blog(db, blog)


@router.put("/{slug}/", response_model=BlogOut)
def update_blog(
    slug: str,
    blog_data: BlogUpdate,
    db: Session = Depends(get_db),
    user=Depends(get_current_superuser)
):
    db_blog = crud_blog.get_blog(db, slug)
    if not db_blog:
        raise HTTPException(status_code=404, detail="Blog not found")
    return crud_blog.update_blog(db, db_blog, blog_data)


@router.delete("/{slug}/")
def delete_blog(
    slug: str,
    db: Session = Depends(get_db),
    user=Depends(get_current_superuser)
):
    db_blog = crud_blog.get_blog(db, slug)
    if not db_blog:
        raise HTTPException(status_code=404, detail="Blog not found")
    crud_blog.delete_blog(db, db_blog)
    return {"msg": "Blog deleted successfully"}


@router.post("/{slug}/vote")
def vote_feedback(
    slug: str,
    payload: FeedbackIn,
    request: Request,
    db: Session = Depends(get_db)
):
    client_ip = request.client.host
    blog = crud_blog.get_blog(db, slug)
    if not blog:
        raise HTTPException(status_code=404, detail="Blog not found")

    existing_feedback = db.query(Feedback).filter_by(blog_id=blog.id, ip_address=client_ip).first()

    vote_type = payload.vote_type

    if vote_type is None:
        if existing_feedback:
            db.delete(existing_feedback)
            db.commit()
        return {"message": "Feedback removed."}

    if existing_feedback:
        if existing_feedback.vote_type == vote_type:
            return {"message": "No change"}
        existing_feedback.vote_type = vote_type
    else:
        feedback = Feedback(blog_id=blog.id, vote_type=vote_type, ip_address=client_ip)
        db.add(feedback)

    db.commit()
    return {"message": "Feedback recorded."}

