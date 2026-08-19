"""
Image Tools router — compression and resizing
"""
import io
import base64
from fastapi import APIRouter, HTTPException, UploadFile, File, Form
from PIL import Image

router = APIRouter()


@router.post("/compress")
async def compress_image(
    file: UploadFile = File(...),
    quality: int = Form(80),
    format: str = Form("WEBP"),
):
    """
    Compress an image.
    quality: 1–95 (JPEG/WEBP)
    format: JPEG | WEBP | PNG
    """
    fmt = format.upper()
    if fmt not in {"JPEG", "WEBP", "PNG"}:
        raise HTTPException(status_code=400, detail="Format must be JPEG, WEBP, or PNG")

    quality = max(1, min(quality, 95))

    try:
        contents = await file.read()
        original_size = len(contents)
        img = Image.open(io.BytesIO(contents))

        if fmt == "JPEG" and img.mode in ("RGBA", "P"):
            img = img.convert("RGB")

        buf = io.BytesIO()
        if fmt == "PNG":
            img.save(buf, format="PNG", optimize=True)
        else:
            img.save(buf, format=fmt, quality=quality, optimize=True)

        buf.seek(0)
        compressed = buf.read()
        encoded = base64.b64encode(compressed).decode("utf-8")
        ext = "jpg" if fmt == "JPEG" else fmt.lower()

        stem = (file.filename or "image").rsplit(".", 1)[0]
        savings = round((1 - len(compressed) / original_size) * 100, 1)

        return {
            "success": True,
            "data": encoded,
            "mime_type": f"image/{ext}",
            "filename": f"{stem}_compressed.{ext}",
            "original_size": original_size,
            "compressed_size": len(compressed),
            "savings_percent": max(0, savings),
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Compression failed: {str(e)}")


@router.post("/resize")
async def resize_image(
    file: UploadFile = File(...),
    width: int = Form(...),
    height: int = Form(0),
    maintain_aspect: bool = Form(True),
    format: str = Form("WEBP"),
):
    """
    Resize an image to given dimensions.
    If maintain_aspect=True and height=0, height is auto-calculated.
    """
    fmt = format.upper()
    if fmt not in {"JPEG", "WEBP", "PNG"}:
        raise HTTPException(status_code=400, detail="Format must be JPEG, WEBP, or PNG")
    if width <= 0 or width > 8000:
        raise HTTPException(status_code=400, detail="Width must be between 1 and 8000")

    try:
        contents = await file.read()
        img = Image.open(io.BytesIO(contents))
        orig_w, orig_h = img.size

        if maintain_aspect or height == 0:
            ratio = width / orig_w
            new_height = round(orig_h * ratio)
            new_size = (width, new_height)
        else:
            if height <= 0 or height > 8000:
                raise HTTPException(status_code=400, detail="Height must be between 1 and 8000")
            new_size = (width, height)

        img = img.resize(new_size, Image.LANCZOS)

        if fmt == "JPEG" and img.mode in ("RGBA", "P"):
            img = img.convert("RGB")

        buf = io.BytesIO()
        if fmt == "PNG":
            img.save(buf, format="PNG", optimize=True)
        else:
            img.save(buf, format=fmt, quality=85, optimize=True)

        buf.seek(0)
        encoded = base64.b64encode(buf.read()).decode("utf-8")
        ext = "jpg" if fmt == "JPEG" else fmt.lower()
        stem = (file.filename or "image").rsplit(".", 1)[0]

        return {
            "success": True,
            "data": encoded,
            "mime_type": f"image/{ext}",
            "filename": f"{stem}_{new_size[0]}x{new_size[1]}.{ext}",
            "original_dimensions": {"width": orig_w, "height": orig_h},
            "new_dimensions": {"width": new_size[0], "height": new_size[1]},
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Resize failed: {str(e)}")
