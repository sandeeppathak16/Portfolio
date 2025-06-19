import os
import logging
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles

from Backend.app.api import blog, auth, upload, contact
from Backend.app.db.base import Base
from Backend.app.db.session import engine
from Backend.app.db.session import SessionLocal
from Backend.app.schemas.user import UserCreate
from Backend.app.crud.user import get_user_by_username, create_user

load_dotenv()

Base.metadata.create_all(bind=engine)

os.makedirs("media", exist_ok=True)

app = FastAPI(title="Sandeep Bhardwaj Portfolio api")

admin_username = os.getenv("ADMIN_USERNAME")
admin_password = os.getenv("ADMIN_PASSWORD")


@app.on_event("startup")
def create_initial_superuser():
    db = SessionLocal()
    try:
        superuser = get_user_by_username(db, username=admin_username)
        if not superuser:
            admin_data = UserCreate(username=admin_username, password=admin_password)
            create_user(db, admin_data, is_superuser=True)
            logging.info("✅ Superuser 'admin' created.")
        else:
            logging.info("ℹ️ Superuser 'admin' already exists.")
    except Exception as e:
        logging.error(f"❌ Error creating superuser: {e}")
    finally:
        db.close()


# Routers
app.include_router(blog.router)
app.include_router(auth.router)
app.include_router(upload.router)
app.include_router(contact.router)

# Serve media
app.mount("/media", StaticFiles(directory="media"), name="media")


class SPAStaticFiles(StaticFiles):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

    def lookup_path(self, path: str):
        full_path, stat_result = super().lookup_path(path)
        if not stat_result:
            index_path = os.path.join(self.directory, "index.html")
            return index_path, os.stat(index_path)
        return full_path, stat_result


app.mount("/", SPAStaticFiles(directory="Backend/app/static/dist", html=True), name="frontend")