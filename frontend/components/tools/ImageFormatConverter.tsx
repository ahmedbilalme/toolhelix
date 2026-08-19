"use client";
import { useState, useCallback } from "react";
import { convertImageFormat, downloadBase64, type ImageConvertResponse } from "@/lib/api";
import { useToast } from "@/components/ui/Toast";

const FORMATS = ["JPEG", "PNG", "WEBP", "GIF", "BMP", "TIFF"];

export default function ImageFormatConverter() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [targetFormat, setTargetFormat] = useState("WEBP");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ImageConvertResponse | null>(null);
  const [dragging, setDragging] = useState(false);
  const { toast, ToastContainer } = useToast();

  const handleFile = useCallback((f: File) => {
    if (!f.type.startsWith("image/")) {
      toast("Please upload an image file", "error");
      return;
    }
    setFile(f);
    setResult(null);
    const url = URL.createObjectURL(f);
    setPreview(url);
  }, [toast]);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  };

  const handleConvert = async () => {
    if (!file) return;
    setLoading(true);
    try {
      const res = await convertImageFormat(file, targetFormat);
      setResult(res);
      toast("Image converted successfully!", "success");
    } catch (e: any) {
      toast(e.message ?? "Conversion failed", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!result) return;
    downloadBase64(result.data, result.filename, result.mime_type);
  };

  return (
    <div style={{ maxWidth: "720px", margin: "0 auto" }}>
      <ToastContainer />

      {/* Drop zone */}
      <div
        className={`drop-zone ${dragging ? "dragging" : ""}`}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => document.getElementById("img-file-input")?.click()}
        style={{ marginBottom: "24px" }}
      >
        <input
          id="img-file-input"
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
        />
        {preview ? (
          <div>
            <img src={preview} alt="Preview" style={{ maxHeight: "200px", maxWidth: "100%", borderRadius: "8px", marginBottom: "12px" }} />
            <p style={{ color: "var(--color-text-muted)", fontSize: "0.85rem" }}>
              {file?.name} — {((file?.size ?? 0) / 1024).toFixed(1)} KB
            </p>
            <p style={{ color: "var(--color-accent)", fontSize: "0.82rem" }}>Click or drag to replace</p>
          </div>
        ) : (
          <div>
            <div style={{ fontSize: "3rem", marginBottom: "12px" }}>🖼️</div>
            <p style={{ fontFamily: "var(--font-display)", fontWeight: 600, marginBottom: "4px" }}>
              Drop an image here
            </p>
            <p style={{ color: "var(--color-text-muted)", fontSize: "0.85rem" }}>
              or click to browse — JPEG, PNG, WEBP, GIF, BMP, TIFF
            </p>
          </div>
        )}
      </div>

      {/* Controls */}
      <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginBottom: "24px", alignItems: "flex-end" }}>
        <div style={{ flex: 1, minWidth: "180px" }}>
          <label style={{ display: "block", marginBottom: "8px", fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "0.85rem" }}>
            Convert to
          </label>
          <select
            value={targetFormat}
            onChange={(e) => setTargetFormat(e.target.value)}
            className="input"
            style={{ cursor: "pointer" }}
          >
            {FORMATS.map((f) => (
              <option key={f} value={f}>{f}</option>
            ))}
          </select>
        </div>
        <button
          onClick={handleConvert}
          disabled={!file || loading}
          className="btn btn-primary btn-md"
          style={{ minWidth: "160px" }}
        >
          {loading ? (
            <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span className="spinner" />
              Converting…
            </span>
          ) : (
            `Convert to ${targetFormat}`
          )}
        </button>
      </div>

      {/* Result */}
      {result && (
        <div className="result-panel success animate-scale-in">
          <div className="result-panel-header">
            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              <span className="badge badge-green">✓ Converted</span>
              <span className="size-pill">{result.format}</span>
            </div>
            <button onClick={handleDownload} className="btn btn-primary btn-sm">
              ⬇ Download {result.filename}
            </button>
          </div>
          <div style={{ padding: "24px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "0.72rem", color: "var(--color-text-faint)", marginBottom: "8px", fontFamily: "var(--font-display)", textTransform: "uppercase", letterSpacing: "0.06em" }}>Before</div>
              {preview && <img src={preview} alt="Original" style={{ maxHeight: "200px", maxWidth: "100%", borderRadius: "var(--radius-md)", border: "1px solid var(--color-border)" }} />}
              <div style={{ marginTop: "6px", fontFamily: "var(--font-mono)", fontSize: "0.75rem", color: "var(--color-text-muted)" }}>
                {file?.name?.split(".").pop()?.toUpperCase()}
              </div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "0.72rem", color: "var(--color-text-faint)", marginBottom: "8px", fontFamily: "var(--font-display)", textTransform: "uppercase", letterSpacing: "0.06em" }}>After</div>
              <img
                src={`data:${result.mime_type};base64,${result.data}`}
                alt="Converted"
                style={{ maxHeight: "200px", maxWidth: "100%", borderRadius: "var(--radius-md)", border: "1px solid rgba(16,185,129,0.4)" }}
              />
              <div style={{ marginTop: "6px", fontFamily: "var(--font-mono)", fontSize: "0.75rem", color: "var(--color-success)" }}>
                {result.format}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
