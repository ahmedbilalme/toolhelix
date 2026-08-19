"""
Converters router — image format conversion, unit conversion, currency rates
"""
import io
import base64
from fastapi import APIRouter, HTTPException, UploadFile, File, Form
from fastapi.responses import JSONResponse
from PIL import Image

router = APIRouter()


@router.post("/image-format")
async def convert_image_format(
    file: UploadFile = File(...),
    target_format: str = Form(...),
):
    """
    Convert an uploaded image to a different format.
    target_format: JPEG | PNG | WEBP | GIF | BMP | TIFF
    """
    allowed = {"JPEG", "PNG", "WEBP", "GIF", "BMP", "TIFF"}
    fmt = target_format.upper()
    if fmt not in allowed:
        raise HTTPException(status_code=400, detail=f"Unsupported format. Choose from: {', '.join(allowed)}")

    try:
        contents = await file.read()
        img = Image.open(io.BytesIO(contents))

        # Convert RGBA → RGB for JPEG (no alpha channel)
        if fmt == "JPEG" and img.mode in ("RGBA", "P"):
            img = img.convert("RGB")

        buf = io.BytesIO()
        save_fmt = "JPEG" if fmt == "JPEG" else fmt
        img.save(buf, format=save_fmt)
        buf.seek(0)

        encoded = base64.b64encode(buf.read()).decode("utf-8")
        ext = "jpg" if fmt == "JPEG" else fmt.lower()
        original_name = file.filename or "image"
        stem = original_name.rsplit(".", 1)[0]

        return {
            "success": True,
            "filename": f"{stem}.{ext}",
            "format": fmt,
            "data": encoded,
            "mime_type": f"image/{ext}",
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Conversion failed: {str(e)}")
