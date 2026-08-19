"use client";
import { useState, useCallback } from "react";
import { copyToClipboard } from "@/lib/api";
import { useToast } from "@/components/ui/Toast";

function hslToHex(h: number, s: number, l: number): string {
  l /= 100; s /= 100;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, "0");
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

function hexToHsl(hex: string): [number, number, number] {
  let r = 0, g = 0, b = 0;
  if (hex.length === 7) {
    r = parseInt(hex.slice(1, 3), 16) / 255;
    g = parseInt(hex.slice(3, 5), 16) / 255;
    b = parseInt(hex.slice(5, 7), 16) / 255;
  }
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
}

type HarmonyType = "complementary" | "analogous" | "triadic" | "tetradic" | "monochromatic";

function generatePalette(baseHex: string, harmony: HarmonyType): string[] {
  const [h, s, l] = hexToHsl(baseHex);
  switch (harmony) {
    case "complementary":
      return [
        hslToHex(h, s, l),
        hslToHex(h, s * 0.7, Math.min(l + 20, 90)),
        hslToHex((h + 180) % 360, s, l),
        hslToHex((h + 180) % 360, s * 0.7, Math.min(l + 20, 90)),
        hslToHex(h, s * 0.3, Math.min(l + 35, 95)),
      ];
    case "analogous":
      return [-40, -20, 0, 20, 40].map((off) => hslToHex((h + off + 360) % 360, s, l));
    case "triadic":
      return [0, 120, 240].flatMap((off, i) => i < 2
        ? [hslToHex((h + off) % 360, s, l), hslToHex((h + off) % 360, s * 0.6, Math.min(l + 15, 90))]
        : [hslToHex((h + off) % 360, s, l)]
      );
    case "tetradic":
      return [0, 90, 180, 270].map((off) => hslToHex((h + off) % 360, s, l))
        .concat([hslToHex(h, s * 0.4, Math.min(l + 30, 95))]);
    case "monochromatic":
      return [20, 35, 50, 65, 80].map((li) => hslToHex(h, s, li));
  }
}

const HARMONIES: { id: HarmonyType; label: string }[] = [
  { id: "complementary", label: "Complementary" },
  { id: "analogous", label: "Analogous" },
  { id: "triadic", label: "Triadic" },
  { id: "tetradic", label: "Tetradic" },
  { id: "monochromatic", label: "Monochromatic" },
];

export default function ColorPaletteGenerator() {
  const [baseColor, setBaseColor] = useState("#6E56CF");
  const [harmony, setHarmony] = useState<HarmonyType>("complementary");
  const [palette, setPalette] = useState<string[]>([]);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const { toast, ToastContainer } = useToast();

  const generate = useCallback(() => {
    setPalette(generatePalette(baseColor, harmony));
  }, [baseColor, harmony]);

  const copyColor = async (hex: string, idx: number) => {
    await copyToClipboard(hex);
    setCopiedIdx(idx);
    toast(`Copied ${hex}`, "success");
    setTimeout(() => setCopiedIdx(null), 1500);
  };

  return (
    <div style={{ maxWidth: "720px", margin: "0 auto" }}>
      <ToastContainer />

      <div className="card" style={{ marginBottom: "16px" }}>
        <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", marginBottom: "20px", alignItems: "flex-end" }}>
          {/* Color picker */}
          <div>
            <label style={{ display: "block", marginBottom: "8px", fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "0.85rem" }}>Base Color</label>
            <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
              <input
                type="color"
                value={baseColor}
                onChange={(e) => setBaseColor(e.target.value)}
                style={{ width: "56px", height: "44px", borderRadius: "var(--radius-md)", border: "1px solid var(--color-border)", cursor: "pointer", padding: "2px" }}
              />
              <input
                className="input"
                value={baseColor}
                onChange={(e) => { if (/^#[0-9A-Fa-f]{0,6}$/.test(e.target.value)) setBaseColor(e.target.value); }}
                style={{ width: "110px", fontFamily: "var(--font-mono)" }}
              />
            </div>
          </div>

          {/* Harmony type */}
          <div style={{ flex: 1 }}>
            <label style={{ display: "block", marginBottom: "8px", fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "0.85rem" }}>Harmony</label>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {HARMONIES.map((h) => (
                <button key={h.id} onClick={() => setHarmony(h.id)} className={`btn ${harmony === h.id ? "btn-primary" : "btn-secondary"} btn-sm`}>
                  {h.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <button onClick={generate} className="btn btn-primary btn-md" style={{ width: "100%" }}>
          🎨 Generate Palette
        </button>
      </div>

      {/* Palette display */}
      {palette.length > 0 && (
        <div className="animate-scale-in">
          {/* Large swatches */}
          <div style={{ display: "flex", height: "160px", borderRadius: "var(--radius-lg)", overflow: "hidden", marginBottom: "16px", border: "1px solid var(--color-border)" }}>
            {palette.map((hex, i) => (
              <div
                key={i}
                style={{ flex: 1, background: hex, cursor: "pointer", transition: "flex 250ms var(--ease-spring)", display: "flex", alignItems: "flex-end", padding: "8px" }}
                onClick={() => copyColor(hex, i)}
                title={`Click to copy ${hex}`}
              >
              </div>
            ))}
          </div>

          {/* Hex values */}
          <div style={{ display: "grid", gridTemplateColumns: `repeat(${palette.length}, 1fr)`, gap: "8px" }}>
            {palette.map((hex, i) => (
              <div
                key={i}
                onClick={() => copyColor(hex, i)}
                style={{
                  background: "var(--color-surface)",
                  border: `1px solid ${copiedIdx === i ? "var(--color-success)" : "var(--color-border)"}`,
                  borderRadius: "var(--radius-md)",
                  padding: "10px 8px",
                  cursor: "pointer",
                  textAlign: "center",
                  transition: "border-color 250ms",
                }}
              >
                <div style={{ width: "24px", height: "24px", borderRadius: "50%", background: hex, margin: "0 auto 8px", border: "1px solid rgba(255,255,255,0.1)" }} />
                <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", color: copiedIdx === i ? "var(--color-success)" : "var(--color-text)" }}>
                  {copiedIdx === i ? "✓ Copied" : hex.toUpperCase()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
