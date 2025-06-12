import os
import shutil
from uuid import uuid4

from fastapi import APIRouter, File, UploadFile, Depends, HTTPException

from Backend.app.api.deps import get_current_superuser

router = APIRouter(prefix="/upload", tags=["Upload"])

MEDIA_DIR = "media"


@router.post("/")
def upload_file(
    file: UploadFile = File(...),
    user=Depends(get_current_superuser)
):
    ext = file.filename.split(".")[-1].lower()
    if ext not in ["jpg", "jpeg", "png", "gif", "mp4", "webm"]:
        raise HTTPException(status_code=400, detail="Unsupported file type")

    filename = f"{uuid4().hex}.{ext}"
    filepath = os.path.join(MEDIA_DIR, filename)

    with open(filepath, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    url = f"/media/{filename}"
    return {"filename": filename, "url": url}
