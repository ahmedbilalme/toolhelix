"use client";
import { useState, useCallback } from "react";
import { compressImage, downloadBase64, formatBytes } from "@/lib/api";
import { useToast } from "@/components/ui/Toast";

export default function ImageCompressor() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [quality, setQuality] = useState(80);
  const [format, setFormat] = useState("WEBP");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [dragging, setDragging] = useState(false);
  const { toast, ToastContainer } = useToast();

  const handleFile = useCallback((f: File) => {
    if (!f.type.startsWith("image/")) { toast("Upload an image file", "error"); return; }
    setFile(f);
    setResult(null);
    setPreview(URL.createObjectURL(f));
  }, [toast]);

  const handleCompress = async () => {
    if (!file) return;
    setLoading(true);
    try {
      const res = await compressImage(file, quality, format);
      setResult(res);
      toast(`Saved ${res.savings_percent}% — ${formatBytes(res.compressed_size)}`, "success");
    } catch (e: any) {
      toast(e.message, "error");
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
        onClick={() => document.getElementById("compress-input")?.click()}
        style={{ marginBottom: "24px" }}
      >
        <input id="compress-input" type="file" accept="image/*" style={{ display: "none" }} onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />
        {preview ? (
          <div>
            <img src={preview} alt="Preview" style={{ maxHeight: "180px", maxWidth: "100%", borderRadius: "8px", marginBottom: "8px" }} />
            <p style={{ color: "var(--color-text-muted)", fontSize: "0.85rem", margin: "4px 0" }}>{file?.name} — {formatBytes(file?.size ?? 0)}</p>
            <p style={{ color: "var(--color-accent)", fontSize: "0.8rem", margin: 0 }}>Click or drag to replace</p>
          </div>
        ) : (
          <div>
            <div style={{ fontSize: "3rem", marginBottom: "12px" }}>📦</div>
            <p style={{ fontFamily: "var(--font-display)", fontWeight: 600, margin: "0 0 4px" }}>Drop image to compress</p>
            <p style={{ color: "var(--color-text-muted)", fontSize: "0.85rem", margin: 0 }}>JPEG, PNG, WEBP supported</p>
          </div>
        )}
      </div>

      {/* Settings */}
      <div className="card" style={{ marginBottom: "16px", display: "flex", gap: "16px", flexWrap: "wrap", alignItems: "flex-end" }}>
        <div style={{ flex: 1, minWidth: "200px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
            <label style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "0.85rem" }}>Quality</label>
            <span style={{ fontFamily: "var(--font-mono)", color: "var(--color-accent)" }}>{quality}%</span>
          </div>
          <input type="range" min={10} max={95} value={quality} onChange={(e) => setQuality(Number(e.target.value))} />
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.72rem", color: "var(--color-text-faint)", marginTop: "4px" }}>
            <span>Smaller file</span><span>Higher quality</span>
          </div>
        </div>
        <div>
          <label style={{ display: "block", marginBottom: "8px", fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "0.85rem" }}>Output format</label>
          <div style={{ display: "flex", gap: "4px" }}>
            {["WEBP", "JPEG", "PNG"].map((f) => (
              <button key={f} onClick={() => setFormat(f)} className={`btn ${format === f ? "btn-primary" : "btn-secondary"} btn-sm`}>{f}</button>
            ))}
          </div>
        </div>
        <button onClick={handleCompress} disabled={!file || loading} className="btn btn-primary btn-md">
          {loading ? "Compressing…" : "📦 Compress"}
        </button>
      </div>

      {/* Result */}
      {result && (
        <div className="result-panel success animate-scale-in">
          <div className="result-panel-header">
            <div style={{ display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap" }}>
              <span className="badge badge-green">✓ {result.savings_percent}% smaller</span>
              <span className="size-pill">{formatBytes(result.original_size)} → {formatBytes(result.compressed_size)}</span>
            </div>
            <button
              onClick={() => downloadBase64(result.data, result.filename, result.mime_type)}
              className="btn btn-primary btn-sm"
            >
              ⬇ Download
            </button>
          </div>

          {/* Savings bar */}
          <div style={{ padding: "12px 20px", borderBottom: "1px solid var(--color-border)", background: "var(--color-surface)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px", fontSize: "0.75rem", color: "var(--color-text-faint)", fontFamily: "var(--font-mono)" }}>
              <span>0</span>
              <span>Original: {formatBytes(result.original_size)}</span>
            </div>
            <div style={{ height: "6px", background: "var(--color-border)", borderRadius: "var(--radius-full)", overflow: "hidden" }}>
              <div
                style={{
                  height: "100%",
                  width: `${100 - result.savings_percent}%`,
                  background: "linear-gradient(90deg, var(--color-success), #34d399)",
                  borderRadius: "var(--radius-full)",
                  transition: "width 600ms var(--ease-spring)",
                }}
              />
            </div>
            <div style={{ marginTop: "6px", fontSize: "0.78rem", color: "var(--color-text-muted)" }}>
              Compressed to <strong style={{ color: "var(--color-success)" }}>{100 - result.savings_percent}%</strong> of original size
            </div>
          </div>

          <div style={{ padding: "24px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "0.72rem", color: "var(--color-text-faint)", marginBottom: "8px", fontFamily: "var(--font-display)", textTransform: "uppercase", letterSpacing: "0.06em" }}>Before</div>
              {preview && <img src={preview} alt="Original" style={{ maxHeight: "200px", maxWidth: "100%", borderRadius: "var(--radius-md)", border: "1px solid var(--color-border)" }} />}
              <div style={{ marginTop: "6px", fontFamily: "var(--font-mono)", fontSize: "0.75rem", color: "var(--color-text-muted)" }}>{formatBytes(result.original_size)}</div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "0.72rem", color: "var(--color-text-faint)", marginBottom: "8px", fontFamily: "var(--font-display)", textTransform: "uppercase", letterSpacing: "0.06em" }}>After</div>
              <img src={`data:${result.mime_type};base64,${result.data}`} alt="Compressed" style={{ maxHeight: "200px", maxWidth: "100%", borderRadius: "var(--radius-md)", border: "1px solid rgba(16,185,129,0.4)" }} />
              <div style={{ marginTop: "6px", fontFamily: "var(--font-mono)", fontSize: "0.75rem", color: "var(--color-success)" }}>{formatBytes(result.compressed_size)}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

