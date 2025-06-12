from sqlalchemy.orm import Session
from Backend.app.models.blog import Blog
from Backend.app.schemas.blog import BlogCreate, BlogUpdate


def get_blog(db: Session, slug: str):
    return db.query(Blog).filter(Blog.slug == slug).first()


def get_blogs(db: Session, skip: int = 0, limit: int = 10):
    return db.query(Blog).offset(skip).limit(limit).all()


def create_blog(db: Session, blog: BlogCreate):
    db_blog = Blog(**blog.dict())
    db.add(db_blog)
    db.commit()
    db.refresh(db_blog)
    return db_blog


def update_blog(db: Session, db_blog: Blog, blog: BlogUpdate):
    for field, value in blog.dict().items():
        setattr(db_blog, field, value)
    db.commit()
    db.refresh(db_blog)
    return db_blog


def delete_blog(db: Session, db_blog: Blog):
    db.delete(db_blog)
    db.commit()
