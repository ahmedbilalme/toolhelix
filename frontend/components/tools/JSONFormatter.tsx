"use client";
import { useState, useCallback } from "react";
import { formatJSON, copyToClipboard } from "@/lib/api";
import { useToast } from "@/components/ui/Toast";

export default function JSONFormatter() {
  const [input, setInput] = useState("");
  const [indent, setIndent] = useState(2);
  const [sortKeys, setSortKeys] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ formatted?: string; valid: boolean; error?: string; line?: number; column?: number; type?: string } | null>(null);
  const { toast, ToastContainer } = useToast();

  // Also validate in real-time via browser (no network request)
  const isValidLocal = (() => {
    if (!input.trim()) return null;
    try { JSON.parse(input); return true; } catch { return false; }
  })();

  const handleFormat = useCallback(async () => {
    if (!input.trim()) { toast("Paste some JSON first", "error"); return; }
    setLoading(true);
    try {
      const res = await formatJSON(input, indent, sortKeys);
      setResult(res);
      if (res.valid) toast("JSON is valid ✓", "success");
      else toast(`JSON error: ${res.error}`, "error");
    } catch {
      // Fallback to browser-only formatting
      try {
        const parsed = JSON.parse(input);
        const formatted = JSON.stringify(parsed, sortKeys ? (_, v) => v : undefined, indent);
        setResult({ valid: true, formatted, type: typeof parsed });
        toast("JSON formatted!", "success");
      } catch (e: any) {
        setResult({ valid: false, error: e.message });
        toast("Invalid JSON", "error");
      }
    } finally {
      setLoading(false);
    }
  }, [input, indent, sortKeys, toast]);

  const handleMinify = () => {
    try {
      const parsed = JSON.parse(input);
      setInput(JSON.stringify(parsed));
      toast("Minified!", "success");
    } catch {
      toast("Invalid JSON — fix errors first", "error");
    }
  };

  return (
    <div style={{ maxWidth: "900px", margin: "0 auto" }}>
      <ToastContainer />

      {/* Options bar */}
      <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginBottom: "16px", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <label style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "0.82rem" }}>Indent:</label>
          {[2, 4].map((n) => (
            <button key={n} onClick={() => setIndent(n)} className={`btn ${indent === n ? "btn-primary" : "btn-secondary"} btn-sm`}>{n}</button>
          ))}
        </div>
        <label style={{ display: "flex", alignItems: "center", gap: "6px", cursor: "pointer", fontSize: "0.82rem", fontFamily: "var(--font-display)" }}>
          <input type="checkbox" checked={sortKeys} onChange={(e) => setSortKeys(e.target.checked)} style={{ accentColor: "var(--color-accent)" }} />
          Sort keys
        </label>
        {isValidLocal !== null && (
          <span className={`badge ${isValidLocal ? "badge-green" : "badge-orange"}`}>
            {isValidLocal ? "✓ Valid JSON" : "⚠ Invalid JSON"}
          </span>
        )}
        <div style={{ marginLeft: "auto", display: "flex", gap: "8px" }}>
          <button onClick={handleMinify} className="btn btn-secondary btn-sm">Minify</button>
          <button onClick={() => { setInput(""); setResult(null); }} className="btn btn-ghost btn-sm">Clear</button>
        </div>
      </div>

      {/* Editor area */}
      <div style={{ display: "grid", gridTemplateColumns: result?.valid ? "1fr 1fr" : "1fr", gap: "16px", marginBottom: "16px" }}>
        <div>
          <div style={{ marginBottom: "6px", fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "0.82rem", color: "var(--color-text-muted)" }}>Input</div>
          <textarea
            className="input textarea"
            value={input}
            onChange={(e) => { setInput(e.target.value); setResult(null); }}
            placeholder={'Paste your JSON here…\n\n{"name": "ToolHelix", "tools": 20}'}
            style={{ height: "360px", fontFamily: "var(--font-mono)", fontSize: "0.82rem", resize: "vertical" }}
          />
        </div>

        {result?.valid && result.formatted && (
          <div>
            <div style={{ marginBottom: "6px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "0.82rem", color: "var(--color-text-muted)" }}>Formatted</span>
              <button onClick={async () => { await copyToClipboard(result.formatted!); toast("Copied!", "success"); }} className="btn btn-secondary btn-sm">📋 Copy</button>
            </div>
            <pre className="code-block" style={{ height: "360px", overflow: "auto", margin: 0 }}>
              {result.formatted}
            </pre>
          </div>
        )}
      </div>

      {/* Error message */}
      {result && !result.valid && (
        <div className="error-banner animate-slide-down" style={{ marginBottom: "16px" }}>
          <span className="error-banner-icon">⚠</span>
          <div>
            <strong>Invalid JSON</strong>
            {result.error && (
              <div style={{ fontFamily: "var(--font-mono)", marginTop: "4px", fontSize: "0.82rem" }}>
                {result.error}
                {result.line && (
                  <span style={{ marginLeft: "8px", opacity: 0.7 }}>
                    — line {result.line}, col {result.column}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
        <button onClick={handleFormat} disabled={loading || !input.trim()} className="btn btn-primary btn-md" style={{ minWidth: "160px" }}>
          {loading ? (
            <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span className="spinner" /> Formatting…
            </span>
          ) : "{ } Format JSON"}
        </button>
        {result?.valid && result.type && (
          <span className="size-pill">
            Type: {result.type}
          </span>
        )}
        {result?.valid && result.formatted && (
          <span className="size-pill">
            {result.formatted.length.toLocaleString()} chars
          </span>
        )}
      </div>
    </div>
  );
}
