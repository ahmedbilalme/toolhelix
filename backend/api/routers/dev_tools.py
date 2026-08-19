"""
Developer Tools router — JSON formatting/validation, text diff
"""
import json
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

router = APIRouter()


class JSONFormatRequest(BaseModel):
    content: str
    indent: int = 2
    sort_keys: bool = False


class DiffRequest(BaseModel):
    original: str
    modified: str


@router.post("/json-format")
async def format_json(req: JSONFormatRequest):
    """Parse, validate, and pretty-print JSON."""
    if not req.content.strip():
        raise HTTPException(status_code=400, detail="Input cannot be empty")

    try:
        parsed = json.loads(req.content)
        formatted = json.dumps(
            parsed,
            indent=max(0, min(req.indent, 8)),
            sort_keys=req.sort_keys,
            ensure_ascii=False,
        )
        return {
            "success": True,
            "formatted": formatted,
            "valid": True,
            "type": type(parsed).__name__,
            "size": len(req.content),
        }
    except json.JSONDecodeError as e:
        return {
            "success": False,
            "valid": False,
            "error": str(e),
            "line": e.lineno,
            "column": e.colno,
        }
