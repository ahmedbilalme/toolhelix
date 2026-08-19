"use client";
import { useState } from "react";
import { compareText, copyToClipboard } from "@/lib/api";
import { useToast } from "@/components/ui/Toast";

export default function CodeDiff() {
  const [original, setOriginal] = useState("");
  const [modified, setModified] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ diff: string; added: number; removed: number; identical: boolean } | null>(null);
  const { toast, ToastContainer } = useToast();

  const handleDiff = async () => {
    if (!original && !modified) { toast("Enter text in both panels", "error"); return; }
    setLoading(true);
    try {
      const res = await compareText(original, modified, 3);
      setResult(res);
      if (res.identical) toast("Files are identical", "info");
      else toast(`${res.added} additions, ${res.removed} deletions`, "success");
    } catch {
      // Fallback: pure browser diff
      const origLines = original.split("\n");
      const modLines = modified.split("\n");
      let diff = `--- Original\n+++ Modified\n`;
      let added = 0, removed = 0;
      // Simple line diff
      const maxLen = Math.max(origLines.length, modLines.length);
      for (let i = 0; i < maxLen; i++) {
        const o = origLines[i], m = modLines[i];
        if (o === m) diff += ` ${o ?? ""}\n`;
        else {
          if (o !== undefined) { diff += `-${o}\n`; removed++; }
          if (m !== undefined) { diff += `+${m}\n`; added++; }
        }
      }
      setResult({ diff, added, removed, identical: added === 0 && removed === 0 });
    } finally {
      setLoading(false);
    }
  };

  const renderDiff = (diff: string) => {
    return diff.split("\n").map((line, i) => {
      let bg = "transparent", color = "var(--color-text-muted)";
      if (line.startsWith("+") && !line.startsWith("+++")) { bg = "rgba(16,185,129,0.12)"; color = "#34d399"; }
      if (line.startsWith("-") && !line.startsWith("---")) { bg = "rgba(239,68,68,0.12)"; color = "#f87171"; }
      if (line.startsWith("@@")) { bg = "rgba(59,130,246,0.12)"; color = "#60a5fa"; }
      return (
        <div key={i} style={{ background: bg, color, padding: "1px 8px", fontFamily: "var(--font-mono)", fontSize: "0.8rem", lineHeight: 1.6, whiteSpace: "pre-wrap", wordBreak: "break-all" }}>
          {line || " "}
        </div>
      );
    });
  };

  return (
    <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
      <ToastContainer />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
        <div>
          <div style={{ marginBottom: "6px", fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "0.82rem", color: "var(--color-text-muted)" }}>Original</div>
          <textarea className="input textarea" value={original} onChange={(e) => { setOriginal(e.target.value); setResult(null); }} placeholder="Paste original code/text…" style={{ height: "280px", fontFamily: "var(--font-mono)", fontSize: "0.82rem" }} />
        </div>
        <div>
          <div style={{ marginBottom: "6px", fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "0.82rem", color: "var(--color-text-muted)" }}>Modified</div>
          <textarea className="input textarea" value={modified} onChange={(e) => { setModified(e.target.value); setResult(null); }} placeholder="Paste modified code/text…" style={{ height: "280px", fontFamily: "var(--font-mono)", fontSize: "0.82rem" }} />
        </div>
      </div>

      <button onClick={handleDiff} disabled={loading} className="btn btn-primary btn-md" style={{ marginBottom: "24px" }}>
        {loading ? "Computing diff…" : "↔ Compare"}
      </button>

      {result && (
        <div className="result-panel animate-scale-in">
          <div className="result-panel-header">
            <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
              {result.identical ? (
                <span className="badge badge-green">✓ Identical</span>
              ) : (
                <>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.82rem", color: "#34d399" }}>+{result.added}</span>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.82rem", color: "#f87171" }}>-{result.removed}</span>
                </>
              )}
            </div>
            <button onClick={async () => { await copyToClipboard(result.diff); toast("Diff copied!", "success"); }} className="btn btn-secondary btn-sm">📋 Copy diff</button>
          </div>
          <div style={{ maxHeight: "400px", overflow: "auto" }}>
            {renderDiff(result.diff)}
          </div>
        </div>
      )}
    </div>
  );
}
