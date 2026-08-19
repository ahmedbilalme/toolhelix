# Deploying ToolHelix

ToolHelix has two independently deployable pieces:

- **`frontend/`** — Next.js 16 app. This is what you deploy to Vercel.
- **`backend/`** — FastAPI service. Vercel does **not** run this; it needs to be hosted separately (or not at all — see "Running without a backend" below).

## 1. Frontend on Vercel

The repo root already has a `vercel.json` that points Vercel at the `frontend/` subdirectory, so you can import the repo as-is with the default "Root Directory" (repo root):

```json
{
  "framework": "nextjs",
  "buildCommand": "cd frontend && npm run build",
  "outputDirectory": "frontend/.next",
  "installCommand": "cd frontend && npm install"
}
```

Steps:

1. Import the GitHub repo into Vercel.
2. Leave the Vercel project's **Root Directory** at the repo root (the default) — `vercel.json` handles the `cd frontend`.
   - Alternative: if you'd rather set Vercel's **Root Directory** to `frontend` in the project settings, simplify `vercel.json`'s commands to `npm run build` / `npm install` and `outputDirectory` to `.next` (or delete `vercel.json` entirely and let Vercel auto-detect Next.js).
3. Set environment variables (Project Settings → Environment Variables):
   - `NEXT_PUBLIC_API_URL` — the public URL of your deployed backend (see §2), e.g. `https://api.toolhelix.com`. **Optional** — if unset or unreachable, every tool that would normally call the backend automatically falls back to an equivalent client-side (in-browser) implementation, so the site is fully functional without a backend. Setting this just enables the server-side path (used for slightly more consistent image compression/format conversion, and required for GIF/BMP/TIFF conversion, which the browser's Canvas API can't encode on its own).
4. Deploy. No other configuration is required — there are no server-side secrets the frontend needs.

Build verified locally: `npm run build` (frontend) completes with 0 type errors and 0 lint errors.

## 2. Backend (FastAPI) — run this somewhere that isn't Vercel

Vercel's serverless functions don't support a long-running ASGI app the way this backend is structured, so host it on a normal server/container platform: Render, Railway, Fly.io, a VPS, AWS/GCP/Azure, etc. Any host that can run "clone repo, `pip install`, `uvicorn`" works.

**Requirements**
- Python **3.11** (matches `backend/requirements.txt`'s pinned dependency versions; 3.10–3.12 should also work)
- Dependencies: `pip install -r backend/requirements.txt`

**Start command** (production, no `--reload`):
```bash
cd backend
uvicorn main:app --host 0.0.0.0 --port $PORT
```
Replace `$PORT` with whatever port your host assigns (most platforms inject this as an env var already).

**Environment variables** (`backend/.env` locally — copy from `backend/.env.example`; set as real env vars on your host):
- `FRONTEND_URL` — your deployed frontend's origin, e.g. `https://toolhelix.com`. Used for CORS (`main.py` allows `localhost:3000` plus this value).
- `OPEN_EXCHANGE_RATES_APP_ID` — **not currently used by any endpoint** (currency conversion runs entirely client-side against a free public API — see `components/tools/CurrencyConverter.tsx`). Leave blank; it's a placeholder for a future server-side rate provider.

**Health check**: `GET /api/health` → `{"status": "ok", "service": "ToolHelix API"}`. Point your host's health-check probe at this.

**API docs**: `/api/docs` (Swagger) and `/api/redoc` once running.

### Running without a backend at all

This is a supported configuration, not a degraded one. Every backend-backed tool (image format conversion, compression, resizing, QR generation, JSON formatting, text diff) has a client-side fallback in `frontend/lib/api.ts` that activates automatically whenever the backend call fails or `NEXT_PUBLIC_API_URL` isn't set. The only capability you lose without a backend: converting images to **GIF, BMP, or TIFF** (the browser's Canvas API can only encode JPEG/PNG/WEBP) — the UI shows a clear error explaining this rather than silently producing a wrong file, and JPEG/PNG/WEBP conversion still works fully client-side.

## 3. What's already handled

- `frontend/app/sitemap.ts` and `frontend/app/robots.ts` generate `/sitemap.xml` and `/robots.txt` automatically at build time, covering every static page, category, tool, and blog post.
- `frontend/app/opengraph-image.tsx` generates the social-share preview image dynamically — no static asset to keep in sync.
- No secrets are committed. `backend/.env` (local-only, placeholder values) was removed from git tracking; `backend/.gitignore` now excludes `.env*`.
