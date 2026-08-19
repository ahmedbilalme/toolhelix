"use client";
import { useState } from "react";
import { generateQRCode, downloadBase64, errorMessage } from "@/lib/api";
import { useToast } from "@/components/ui/Toast";

export default function QRCodeGenerator() {
  const [content, setContent] = useState("");
  const [fgColor, setFgColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("#ffffff");
  const [size, setSize] = useState(10);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ data: string; filename: string; mime_type: string } | null>(null);
  const { toast, ToastContainer } = useToast();

  const generate = async () => {
    if (!content.trim()) { toast("Enter some content first", "error"); return; }
    setLoading(true);
    try {
      const res = await generateQRCode({ content, fg_color: fgColor, bg_color: bgColor, size });
      setResult(res);
      toast("QR code generated!", "success");
    } catch (e: unknown) {
      toast(errorMessage(e, "Generation failed"), "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "720px", margin: "0 auto" }}>
      <ToastContainer />

      <div className="qr-layout" style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: "32px", alignItems: "start" }}>
        {/* Controls */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div>
            <label style={{ display: "block", marginBottom: "8px", fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "0.85rem" }}>Content / URL</label>
            <textarea
              className="input textarea"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="https://toolhelix.com or any text…"
              rows={4}
              maxLength={2000}
            />
            <div style={{ textAlign: "right", fontSize: "0.75rem", color: "var(--color-text-faint)", marginTop: "4px" }}>{content.length}/2000</div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div>
              <label style={{ display: "block", marginBottom: "8px", fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "0.85rem" }}>Foreground</label>
              <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                <input type="color" value={fgColor} onChange={(e) => setFgColor(e.target.value)} style={{ width: "40px", height: "40px", borderRadius: "8px", border: "1px solid var(--color-border)", cursor: "pointer", background: "none" }} />
                <input className="input" value={fgColor} onChange={(e) => setFgColor(e.target.value)} style={{ fontFamily: "var(--font-mono)", fontSize: "0.85rem" }} />
              </div>
            </div>
            <div>
              <label style={{ display: "block", marginBottom: "8px", fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "0.85rem" }}>Background</label>
              <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} style={{ width: "40px", height: "40px", borderRadius: "8px", border: "1px solid var(--color-border)", cursor: "pointer", background: "none" }} />
                <input className="input" value={bgColor} onChange={(e) => setBgColor(e.target.value)} style={{ fontFamily: "var(--font-mono)", fontSize: "0.85rem" }} />
              </div>
            </div>
          </div>

          <div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
              <label style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "0.85rem" }}>Size</label>
              <span style={{ fontFamily: "var(--font-mono)", color: "var(--color-accent)" }}>{size * 30}px</span>
            </div>
            <input type="range" min={5} max={20} value={size} onChange={(e) => setSize(Number(e.target.value))} />
          </div>

          <button onClick={generate} disabled={loading || !content.trim()} className="btn btn-primary btn-md">
            {loading ? "Generating…" : "📱 Generate QR Code"}
          </button>
        </div>

        {/* Preview */}
        <div className="qr-preview" style={{ width: "220px", flexShrink: 0 }}>
          <div className="qr-preview-box" style={{
            width: "220px",
            height: "220px",
            background: result ? "transparent" : "var(--color-surface)",
            border: "1px solid var(--color-border)",
            borderRadius: "var(--radius-lg)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
          }}>
            {result ? (
              <img src={`data:${result.mime_type};base64,${result.data}`} alt="QR Code" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
            ) : (
              <div style={{ textAlign: "center", color: "var(--color-text-faint)" }}>
                <div style={{ fontSize: "2.5rem", marginBottom: "8px" }}>📱</div>
                <div style={{ fontSize: "0.8rem" }}>QR preview</div>
              </div>
            )}
          </div>

          {result && (
            <button
              onClick={() => downloadBase64(result.data, result.filename, result.mime_type)}
              className="btn btn-primary btn-md"
              style={{ width: "100%", marginTop: "12px" }}
            >
              ⬇ Download PNG
            </button>
          )}
        </div>
      </div>

      <style>{`
        @media (max-width: 600px) {
          .qr-layout { grid-template-columns: 1fr !important; }
          .qr-preview { width: 100% !important; }
          .qr-preview-box { width: 100% !important; height: auto !important; aspect-ratio: 1 / 1; }
        }
      `}</style>
    </div>
  );
}
