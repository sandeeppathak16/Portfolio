from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from Backend.app.schemas.blog import BlogCreate, BlogOut, BlogUpdate
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
    return crud_blog.get_blogs(db, skip=skip, limit=limit)


@router.get("/{slug}", response_model=BlogOut)
def get_blog(slug: str, db: Session = Depends(get_db)):
    blog = crud_blog.get_blog(db, slug)
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


@router.put("/{slug}", response_model=BlogOut)
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


@router.delete("/{slug}")
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