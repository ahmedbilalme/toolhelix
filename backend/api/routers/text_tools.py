"""
Text Tools router — text comparison (diff)
"""
import difflib
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

router = APIRouter()


class CompareRequest(BaseModel):
    original: str
    modified: str
    context_lines: int = 3


@router.post("/compare")
async def compare_text(req: CompareRequest):
    """Return a unified diff between two texts."""
    orig_lines = req.original.splitlines(keepends=True)
    mod_lines = req.modified.splitlines(keepends=True)

    diff = list(
        difflib.unified_diff(
            orig_lines,
            mod_lines,
            fromfile="Original",
            tofile="Modified",
            n=max(0, min(req.context_lines, 10)),
        )
    )

    # Build structured hunks for the frontend
    added = sum(1 for l in diff if l.startswith("+") and not l.startswith("+++"))
    removed = sum(1 for l in diff if l.startswith("-") and not l.startswith("---"))

    return {
        "success": True,
        "diff": "".join(diff),
        "added": added,
        "removed": removed,
        "identical": len(diff) == 0,
    }
