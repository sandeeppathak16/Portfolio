from sqlalchemy.orm import Session
from Backend.app.models.contact import ContactMessage
from Backend.app.schemas.contact import ContactCreate


def create_contact(db: Session, data: ContactCreate):
    contact = ContactMessage(**data.dict())
    db.add(contact)
    db.commit()
    db.refresh(contact)
    return contact
