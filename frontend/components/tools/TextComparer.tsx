"use client";
import { useState } from "react";
import { compareText, copyToClipboard } from "@/lib/api";
import { useToast } from "@/components/ui/Toast";

export default function TextComparer() {
  const [original, setOriginal] = useState("");
  const [modified, setModified] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ diff: string; added: number; removed: number; identical: boolean } | null>(null);
  const { toast, ToastContainer } = useToast();

  const handleCompare = async () => {
    setLoading(true);
    try {
      const res = await compareText(original, modified);
      setResult(res);
      if (res.identical) toast("The texts are identical", "info");
      else toast(`Found ${res.added + res.removed} difference(s)`, "success");
    } catch {
      toast("Comparison failed — check if the API is running", "error");
    } finally {
      setLoading(false);
    }
  };

  const renderDiff = (diff: string) =>
    diff.split("\n").map((line, i) => {
      let bg = "transparent", color = "var(--color-text-muted)";
      if (line.startsWith("+") && !line.startsWith("+++")) { bg = "rgba(16,185,129,0.12)"; color = "#34d399"; }
      if (line.startsWith("-") && !line.startsWith("---")) { bg = "rgba(239,68,68,0.12)"; color = "#f87171"; }
      if (line.startsWith("@@")) { bg = "rgba(59,130,246,0.12)"; color = "#60a5fa"; }
      return (
        <div key={i} style={{ background: bg, color, padding: "2px 8px", fontFamily: "var(--font-mono)", fontSize: "0.8rem", lineHeight: 1.7, whiteSpace: "pre-wrap", wordBreak: "break-all" }}>
          {line || " "}
        </div>
      );
    });

  return (
    <div style={{ maxWidth: "960px", margin: "0 auto" }}>
      <ToastContainer />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
        {[
          { label: "Original text", value: original, setter: setOriginal, placeholder: "Paste the first text here…" },
          { label: "Modified text", value: modified, setter: setModified, placeholder: "Paste the second text here…" },
        ].map(({ label, value, setter, placeholder }) => (
          <div key={label}>
            <div style={{ marginBottom: "6px", fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "0.82rem", color: "var(--color-text-muted)" }}>{label}</div>
            <textarea className="input textarea" value={value} onChange={(e) => { setter(e.target.value); setResult(null); }} placeholder={placeholder} style={{ height: "240px", fontSize: "0.88rem" }} />
          </div>
        ))}
      </div>

      <button onClick={handleCompare} disabled={loading || (!original && !modified)} className="btn btn-primary btn-md" style={{ marginBottom: "24px" }}>
        {loading ? "Comparing…" : "🔀 Compare texts"}
      </button>

      {result && (
        <div className="result-panel animate-scale-in">
          <div className="result-panel-header">
            <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
              {result.identical ? (
                <span className="badge badge-green">✓ Identical</span>
              ) : (
                <>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.82rem", color: "#34d399" }}>+{result.added} added</span>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.82rem", color: "#f87171" }}>−{result.removed} removed</span>
                </>
              )}
            </div>
            <button onClick={async () => { await copyToClipboard(result.diff); toast("Copied!", "success"); }} className="btn btn-secondary btn-sm">📋 Copy diff</button>
          </div>
          <div style={{ maxHeight: "400px", overflowY: "auto" }}>
            {renderDiff(result.diff)}
          </div>
        </div>
      )}
    </div>
  );
}
