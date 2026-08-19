"""
ToolHelix FastAPI Backend
Entry point — mounts all tool routers under /api
"""
import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from api.routers import converters, generators, dev_tools, text_tools, image_tools

load_dotenv()

app = FastAPI(
    title="ToolHelix API",
    description="Backend tool-logic API for ToolHelix.com",
    version="1.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
)

# CORS — allow Next.js dev server and production Vercel URL
origins = [
    "http://localhost:3000",
    "https://localhost:3000",
    os.getenv("FRONTEND_URL", "https://toolhelix.com"),
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount routers
app.include_router(converters.router, prefix="/api/converters", tags=["converters"])
app.include_router(generators.router, prefix="/api/generators", tags=["generators"])
app.include_router(dev_tools.router, prefix="/api/dev", tags=["developer-tools"])
app.include_router(text_tools.router, prefix="/api/text", tags=["text-tools"])
app.include_router(image_tools.router, prefix="/api/image", tags=["image-tools"])


@app.get("/")
async def root():
    return {
        "status": "online",
        "service": "ToolHelix API",
        "docs": "/api/docs",
        "health": "/api/health",
    }


@app.get("/api/health")
async def health_check():
    return {"status": "ok", "service": "ToolHelix API"}

