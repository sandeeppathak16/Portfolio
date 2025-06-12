from sqlalchemy.orm import Session
from Backend.app.models.user import User
from Backend.app.schemas.user import UserCreate
from Backend.app.core.security import get_password_hash


def get_user_by_username(db: Session, username: str):
    return db.query(User).filter(User.username == username).first()


def create_user(db: Session, user: UserCreate, is_superuser=False):
    db_user = User(
        username=user.username,
        hashed_password=get_password_hash(user.password),
        is_superuser=is_superuser
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user
