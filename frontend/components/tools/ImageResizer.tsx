"use client";
import { useState, useCallback } from "react";
import { resizeImage, downloadBase64, formatBytes, errorMessage, type ImageResizeResponse } from "@/lib/api";
import { useToast } from "@/components/ui/Toast";

const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25MB

export default function ImageResizer() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [origDims, setOrigDims] = useState({ w: 0, h: 0 });
  const [width, setWidth] = useState("1920");
  const [height, setHeight] = useState("1080");
  const [lock, setLock] = useState(true);
  const [format, setFormat] = useState("WEBP");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ImageResizeResponse | null>(null);
  const [dragging, setDragging] = useState(false);
  const { toast, ToastContainer } = useToast();

  const handleFile = useCallback((f: File) => {
    if (!f.type.startsWith("image/")) { toast("Upload an image file", "error"); return; }
    if (f.size > MAX_FILE_SIZE) { toast(`Image is too large (max ${formatBytes(MAX_FILE_SIZE)})`, "error"); return; }
    setFile(f);
    setResult(null);
    const url = URL.createObjectURL(f);
    setPreview(url);
    const img = new Image();
    img.onload = () => {
      setOrigDims({ w: img.width, h: img.height });
      setWidth(String(img.width));
      setHeight(String(img.height));
    };
    img.src = url;
  }, [toast]);

  const handleWidthChange = (val: string) => {
    setWidth(val);
    const n = Number(val);
    if (lock && origDims.w && origDims.h && n > 0) {
      const ratio = origDims.h / origDims.w;
      setHeight(String(Math.round(n * ratio)));
    }
  };

  const handleHeightChange = (val: string) => {
    setHeight(val);
    const n = Number(val);
    if (lock && origDims.w && origDims.h && n > 0) {
      const ratio = origDims.w / origDims.h;
      setWidth(String(Math.round(n * ratio)));
    }
  };

  const handleResize = async () => {
    if (!file) return;
    const w = Number(width);
    const h = Number(height);
    if (!Number.isFinite(w) || w <= 0) { toast("Enter a width greater than 0", "error"); return; }
    if (!lock && (!Number.isFinite(h) || h <= 0)) { toast("Enter a height greater than 0", "error"); return; }
    setLoading(true);
    try {
      const res = await resizeImage(file, Number(width), Number(height), lock, format);
      setResult(res);
      toast(`Resized to ${res.new_dimensions.width}×${res.new_dimensions.height}`, "success");
    } catch (e: unknown) {
      toast(errorMessage(e), "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "720px", margin: "0 auto" }}>
      <ToastContainer />

      {/* Drop zone */}
      <div
        className={`drop-zone ${dragging ? "dragging" : ""}`}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => { e.preventDefault(); setDragging(false); const f = e.dataTransfer.files[0]; if (f) handleFile(f); }}
        onClick={() => document.getElementById("resize-input")?.click()}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); document.getElementById("resize-input")?.click(); } }}
        role="button"
        tabIndex={0}
        aria-label="Upload an image to resize"
        style={{ marginBottom: "24px" }}
      >
        <input id="resize-input" type="file" accept="image/*" style={{ display: "none" }} onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />
        {preview ? (
          <div>
            <img src={preview} alt="Preview" style={{ maxHeight: "180px", maxWidth: "100%", borderRadius: "8px", marginBottom: "8px" }} />
            <p style={{ color: "var(--color-text-muted)", fontSize: "0.85rem", margin: "4px 0" }}>
              {file?.name} — {origDims.w > 0 ? `${origDims.w}×${origDims.h}` : ""} — {formatBytes(file?.size ?? 0)}
            </p>
          </div>
        ) : (
          <div>
            <div style={{ fontSize: "3rem", marginBottom: "12px" }}>📐</div>
            <p style={{ fontFamily: "var(--font-display)", fontWeight: 600, margin: "0 0 4px" }}>Drop image to resize</p>
            <p style={{ color: "var(--color-text-muted)", fontSize: "0.85rem", margin: 0 }}>JPEG, PNG, WEBP supported</p>
          </div>
        )}
      </div>

      {/* Settings */}
      <div className="card" style={{ marginBottom: "16px" }}>
        <div style={{ display: "flex", gap: "12px", alignItems: "flex-end", flexWrap: "wrap", marginBottom: "16px" }}>
          <div>
            <label style={{ display: "block", marginBottom: "8px", fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "0.85rem" }}>Width (px)</label>
            <input type="number" min="1" max="8000" value={width} onChange={(e) => handleWidthChange(e.target.value)} className="input" style={{ width: "120px" }} />
          </div>
          <button
            onClick={() => setLock(!lock)}
            className={`btn ${lock ? "btn-primary" : "btn-secondary"} btn-sm`}
            title="Lock aspect ratio"
            aria-label={lock ? "Aspect ratio locked — click to unlock" : "Aspect ratio unlocked — click to lock"}
            aria-pressed={lock}
            style={{ marginBottom: "1px" }}
          >
            {lock ? "🔒" : "🔓"}
          </button>
          <div>
            <label style={{ display: "block", marginBottom: "8px", fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "0.85rem" }}>Height (px)</label>
            <input type="number" min="1" max="8000" value={height} onChange={(e) => handleHeightChange(e.target.value)} className="input" style={{ width: "120px" }} disabled={lock} />
          </div>
          <div>
            <label style={{ display: "block", marginBottom: "8px", fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "0.85rem" }}>Format</label>
            <div style={{ display: "flex", gap: "4px" }}>
              {["WEBP", "JPEG", "PNG"].map((f) => (
                <button key={f} onClick={() => setFormat(f)} className={`btn ${format === f ? "btn-primary" : "btn-secondary"} btn-sm`}>{f}</button>
              ))}
            </div>
          </div>
        </div>

        {/* Quick presets */}
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "16px" }}>
          {[
            { label: "HD 1280×720", w: "1280", h: "720" },
            { label: "FHD 1920×1080", w: "1920", h: "1080" },
            { label: "4K 3840×2160", w: "3840", h: "2160" },
            { label: "Square 1:1", w: "1080", h: "1080" },
            { label: "Twitter 1200×675", w: "1200", h: "675" },
          ].map(({ label, w, h }) => (
            <button key={label} onClick={() => { setWidth(w); setHeight(h); setLock(false); }} className="btn btn-ghost btn-sm" style={{ fontSize: "0.75rem" }}>
              {label}
            </button>
          ))}
        </div>

        <button onClick={handleResize} disabled={!file || loading} className="btn btn-primary btn-md">
          {loading ? "Resizing…" : "📐 Resize Image"}
        </button>
      </div>

      {/* Result */}
      {result && (
        <div className="result-panel success animate-scale-in">
          <div className="result-panel-header">
            <div style={{ display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap" }}>
              <span className="badge badge-green">✓ Resized</span>
              <span className="size-pill">
                {result.original_dimensions.width}×{result.original_dimensions.height}
                {" → "}
                {result.new_dimensions.width}×{result.new_dimensions.height}
              </span>
            </div>
            <button
              onClick={() => downloadBase64(result.data, result.filename, result.mime_type)}
              className="btn btn-primary btn-sm"
            >
              ⬇ Download
            </button>
          </div>
          <div style={{ padding: "24px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "0.72rem", color: "var(--color-text-faint)", marginBottom: "8px", fontFamily: "var(--font-display)", textTransform: "uppercase", letterSpacing: "0.06em" }}>Before</div>
              {preview && <img src={preview} alt="Original" style={{ maxHeight: "200px", maxWidth: "100%", borderRadius: "var(--radius-md)", border: "1px solid var(--color-border)" }} />}
              <div style={{ marginTop: "6px", fontFamily: "var(--font-mono)", fontSize: "0.75rem", color: "var(--color-text-muted)" }}>
                {result.original_dimensions.width}×{result.original_dimensions.height}
              </div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "0.72rem", color: "var(--color-text-faint)", marginBottom: "8px", fontFamily: "var(--font-display)", textTransform: "uppercase", letterSpacing: "0.06em" }}>After</div>
              <img src={`data:${result.mime_type};base64,${result.data}`} alt="Resized" style={{ maxHeight: "200px", maxWidth: "100%", borderRadius: "var(--radius-md)", border: "1px solid rgba(16,185,129,0.4)" }} />
              <div style={{ marginTop: "6px", fontFamily: "var(--font-mono)", fontSize: "0.75rem", color: "var(--color-success)" }}>
                {result.new_dimensions.width}×{result.new_dimensions.height}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
