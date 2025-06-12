import os
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles

from Backend.app.api import blog, auth, upload, contact
from Backend.app.db.base import Base
from Backend.app.db.session import engine

Base.metadata.create_all(bind=engine)

os.makedirs("media", exist_ok=True)

app = FastAPI(title="Sandeep Bhardwaj Portfolio api")

# Routers
app.include_router(blog.router)
app.include_router(auth.router)
app.include_router(upload.router)
app.include_router(contact.router)

app.mount("/static", StaticFiles(directory="app/static"), name="static")
app.mount("/media", StaticFiles(directory="media"), name="media")
