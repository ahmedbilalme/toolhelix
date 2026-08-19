"""
Generators router — QR code generation
"""
import io
import base64
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, HttpUrl
import qrcode
from qrcode.image.pure import PyPNGImage

router = APIRouter()


class QRRequest(BaseModel):
    content: str
    size: int = 10          # box size in pixels
    border: int = 4         # quiet zone border
    fg_color: str = "#000000"
    bg_color: str = "#ffffff"


@router.post("/qr-code")
async def generate_qr_code(req: QRRequest):
    """Generate a QR code image from arbitrary text/URL content."""
    if not req.content.strip():
        raise HTTPException(status_code=400, detail="Content cannot be empty")
    if len(req.content) > 2000:
        raise HTTPException(status_code=400, detail="Content too long (max 2000 chars)")

    try:
        qr = qrcode.QRCode(
            version=None,
            error_correction=qrcode.constants.ERROR_CORRECT_M,
            box_size=max(1, min(req.size, 30)),
            border=max(0, min(req.border, 10)),
        )
        qr.add_data(req.content)
        qr.make(fit=True)

        img = qr.make_image(fill_color=req.fg_color, back_color=req.bg_color)
        buf = io.BytesIO()
        img.save(buf, format="PNG")
        buf.seek(0)
        encoded = base64.b64encode(buf.read()).decode("utf-8")

        return {
            "success": True,
            "data": encoded,
            "mime_type": "image/png",
            "filename": "qrcode.png",
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"QR generation failed: {str(e)}")
