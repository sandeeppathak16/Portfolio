from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from Backend.app.db.session import SessionLocal
from Backend.app.schemas.contact import ContactCreate
from Backend.app.crud.contact import create_contact

router = APIRouter(prefix="/contact", tags=["Contact"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/")
def send_contact(data: ContactCreate, db: Session = Depends(get_db)):
    return create_contact(db, data)
