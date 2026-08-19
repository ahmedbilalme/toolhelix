"use client";
import { useState } from "react";
import { copyToClipboard } from "@/lib/api";
import { useToast } from "@/components/ui/Toast";

type Mode = "percent-of" | "percent-change" | "what-percent";

export default function PercentageCalculator() {
  const [mode, setMode] = useState<Mode>("percent-of");
  const [a, setA] = useState("");
  const [b, setB] = useState("");
  const { toast, ToastContainer } = useToast();

  const na = parseFloat(a), nb = parseFloat(b);
  let result: number | null = null;
  let formula = "";
  let explanation = "";

  if (!isNaN(na) && !isNaN(nb)) {
    if (mode === "percent-of") {
      result = (na / 100) * nb;
      formula = `${na}% × ${nb}`;
      explanation = `${na}% of ${nb} is ${result.toFixed(4)}`;
    } else if (mode === "percent-change") {
      if (na !== 0) {
        result = ((nb - na) / Math.abs(na)) * 100;
        formula = `((${nb} - ${na}) / |${na}|) × 100`;
        explanation = `${result >= 0 ? "Increase" : "Decrease"} of ${Math.abs(result).toFixed(2)}% from ${na} to ${nb}`;
      }
    } else {
      if (nb !== 0) {
        result = (na / nb) * 100;
        formula = `(${na} / ${nb}) × 100`;
        explanation = `${na} is ${result.toFixed(4)}% of ${nb}`;
      }
    }
  }

  const MODES: { id: Mode; label: string; aLabel: string; bLabel: string; placeholder: string }[] = [
    { id: "percent-of", label: "X% of Y", aLabel: "Percentage (%)", bLabel: "Number", placeholder: "What is 25% of 200?" },
    { id: "percent-change", label: "% Change", aLabel: "Original value", bLabel: "New value", placeholder: "From 80 to 100 is what % change?" },
    { id: "what-percent", label: "X is what % of Y", aLabel: "Part", bLabel: "Whole", placeholder: "30 is what % of 150?" },
  ];

  const currentMode = MODES.find((m) => m.id === mode)!;

  return (
    <div style={{ maxWidth: "560px", margin: "0 auto" }}>
      <ToastContainer />

      {/* Mode tabs */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "24px", flexWrap: "wrap" }}>
        {MODES.map((m) => (
          <button key={m.id} onClick={() => { setMode(m.id); setA(""); setB(""); }} className={`btn ${mode === m.id ? "btn-primary" : "btn-secondary"} btn-sm`}>
            {m.label}
          </button>
        ))}
      </div>

      <div className="card" style={{ marginBottom: "16px" }}>
        <p style={{ color: "var(--color-text-faint)", fontSize: "0.82rem", marginTop: 0, marginBottom: "20px" }}>
          Example: {currentMode.placeholder}
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
          <div>
            <label style={{ display: "block", marginBottom: "8px", fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "0.85rem" }}>{currentMode.aLabel}</label>
            <input type="number" value={a} onChange={(e) => setA(e.target.value)} className="input" placeholder="e.g. 25" />
          </div>
          <div>
            <label style={{ display: "block", marginBottom: "8px", fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "0.85rem" }}>{currentMode.bLabel}</label>
            <input type="number" value={b} onChange={(e) => setB(e.target.value)} className="input" placeholder="e.g. 200" />
          </div>
        </div>

        {result !== null && (
          <div style={{ padding: "20px", background: "var(--color-base)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-md)", cursor: "pointer" }}
            onClick={async () => { await copyToClipboard(result!.toFixed(4)); toast("Copied!", "success"); }}>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: "2rem", fontWeight: 700, color: "var(--color-accent)", marginBottom: "4px" }}>
              {mode === "percent-change" || mode === "what-percent"
                ? `${result.toFixed(2)}%`
                : result.toFixed(4).replace(/\.?0+$/, "")}
            </div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.78rem", color: "var(--color-text-faint)", marginBottom: "8px" }}>
              = {formula}
            </div>
            <div style={{ fontSize: "0.85rem", color: "var(--color-text-muted)" }}>
              {explanation}
            </div>
            <div style={{ fontSize: "0.72rem", color: "var(--color-text-faint)", marginTop: "8px" }}>
              Click to copy result
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
