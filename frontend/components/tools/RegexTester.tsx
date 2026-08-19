"use client";
import { useState, useMemo } from "react";
import { copyToClipboard, errorMessage } from "@/lib/api";
import { useToast } from "@/components/ui/Toast";

const MAX_MATCHES = 1000;

function escapeHtml(str: string): string {
  return str.replace(/[&<>"']/g, (c) => {
    switch (c) {
      case "&": return "&amp;";
      case "<": return "&lt;";
      case ">": return "&gt;";
      case '"': return "&quot;";
      case "'": return "&#39;";
      default: return c;
    }
  });
}

export default function RegexTester() {
  const [pattern, setPattern] = useState("");
  const [flags, setFlags] = useState({ g: true, i: false, m: false, s: false });
  const [testString, setTestString] = useState("");
  const { toast, ToastContainer } = useToast();

  const { matches, error, highlighted } = useMemo(() => {
    if (!pattern || !testString) return { matches: [], error: null, highlighted: escapeHtml(testString) };
    try {
      const flagStr = Object.entries(flags).filter(([, v]) => v).map(([k]) => k).join("");
      const re = new RegExp(pattern, flagStr);
      const matches: { match: string; index: number; groups: string[] }[] = [];

      if (flags.g) {
        let m: RegExpExecArray | null;
        let guard = 0;
        while ((m = re.exec(testString)) !== null && guard < MAX_MATCHES) {
          matches.push({ match: m[0], index: m.index, groups: m.slice(1) });
          // Force forward progress even on zero-width matches (e.g. `\b`, lookaheads)
          // so this can never spin forever.
          re.lastIndex = m.index + (m[0].length || 1);
          guard++;
        }
      } else {
        const m = re.exec(testString);
        if (m) matches.push({ match: m[0], index: m.index, groups: m.slice(1) });
      }

      // Build highlighted HTML from the matches we already found, escaping every
      // segment so test-string content is always rendered as text, never as HTML.
      let cursor = 0;
      let html = "";
      for (const m of matches) {
        if (m.index < cursor) continue;
        html += escapeHtml(testString.slice(cursor, m.index));
        html += `<mark style="background:rgba(110,86,207,0.35);color:#a78bfa;border-radius:3px;padding:1px 2px;">${escapeHtml(m.match)}</mark>`;
        cursor = m.index + m.match.length;
      }
      html += escapeHtml(testString.slice(cursor));

      return { matches, error: null, highlighted: html };
    } catch (e: unknown) {
      return { matches: [], error: errorMessage(e, "Invalid regex"), highlighted: escapeHtml(testString) };
    }
  }, [pattern, flags, testString]);

  return (
    <div style={{ maxWidth: "900px", margin: "0 auto" }}>
      <ToastContainer />

      {/* Pattern input */}
      <div className="card" style={{ marginBottom: "16px" }}>
        <div style={{ display: "flex", gap: "8px", alignItems: "stretch" }}>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: "1.2rem", color: "var(--color-text-muted)", display: "flex", alignItems: "center", padding: "0 8px 0 4px", borderRight: "1px solid var(--color-border)", marginRight: "4px" }}>/</span>
          <input
            type="text"
            className="input"
            value={pattern}
            onChange={(e) => setPattern(e.target.value)}
            placeholder="your pattern here"
            style={{ flex: 1, fontFamily: "var(--font-mono)", background: "transparent", border: "none", boxShadow: "none", padding: "12px 8px" }}
          />
          <span style={{ fontFamily: "var(--font-mono)", fontSize: "1.2rem", color: "var(--color-text-muted)", display: "flex", alignItems: "center", padding: "0 4px", borderLeft: "1px solid var(--color-border)", marginLeft: "4px" }}>/</span>
          {/* Flags */}
          {(Object.keys(flags) as (keyof typeof flags)[]).map((f) => (
            <button
              key={f}
              onClick={() => setFlags((fl) => ({ ...fl, [f]: !fl[f] }))}
              className={`btn ${flags[f] ? "btn-primary" : "btn-ghost"} btn-sm`}
              style={{ fontFamily: "var(--font-mono)", fontSize: "1rem", width: "36px", padding: 0 }}
              title={f === "g" ? "Global" : f === "i" ? "Case insensitive" : f === "m" ? "Multiline" : "Dot matches newline"}
            >
              {f}
            </button>
          ))}
        </div>

        {error && (
          <div style={{ marginTop: "8px", fontSize: "0.82rem", color: "#f87171", fontFamily: "var(--font-mono)" }}>
            ✕ Invalid regex: {error}
          </div>
        )}
      </div>

      {/* Test string */}
      <div style={{ marginBottom: "16px" }}>
        <div style={{ marginBottom: "6px", display: "flex", justifyContent: "space-between" }}>
          <span style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "0.82rem", color: "var(--color-text-muted)" }}>Test string</span>
          {matches.length > 0 && (
            <span className="badge badge-violet">{matches.length} match{matches.length !== 1 ? "es" : ""}</span>
          )}
        </div>
        <textarea
          className="input textarea"
          value={testString}
          onChange={(e) => setTestString(e.target.value)}
          placeholder="Enter test string here…"
          style={{ height: "200px", fontFamily: "var(--font-mono)", fontSize: "0.85rem" }}
        />
      </div>

      {/* Highlighted result */}
      {testString && !error && (
        <div className="result-panel" style={{ marginBottom: "16px" }}>
          <div className="result-panel-header">
            <span style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "0.85rem" }}>Match highlights</span>
          </div>
          <div
            style={{ padding: "16px", fontFamily: "var(--font-mono)", fontSize: "0.85rem", lineHeight: 2, whiteSpace: "pre-wrap", wordBreak: "break-all" }}
            dangerouslySetInnerHTML={{ __html: highlighted }}
          />
        </div>
      )}

      {/* Matches detail */}
      {matches.length > 0 && (
        <div className="card">
          <h3 style={{ fontFamily: "var(--font-display)", fontSize: "0.9rem", marginBottom: "12px", marginTop: 0 }}>
            Matches ({matches.length})
          </h3>
          {matches.slice(0, 20).map((m, i) => (
            <div key={i} style={{ display: "flex", gap: "12px", padding: "8px", background: i % 2 === 0 ? "var(--color-base)" : "transparent", borderRadius: "var(--radius-sm)", fontSize: "0.82rem", fontFamily: "var(--font-mono)", alignItems: "center" }}>
              <span style={{ color: "var(--color-text-faint)", width: "24px", textAlign: "right" }}>{i + 1}</span>
              <span style={{ background: "rgba(110,86,207,0.2)", color: "#a78bfa", padding: "2px 8px", borderRadius: "4px" }}>{m.match}</span>
              <span style={{ color: "var(--color-text-faint)" }}>index {m.index}</span>
              {m.groups.length > 0 && <span style={{ color: "var(--color-text-muted)" }}>groups: [{m.groups.join(", ")}]</span>}
              <button onClick={async () => { await copyToClipboard(m.match); toast("Copied!", "success"); }} className="btn btn-ghost btn-sm" style={{ marginLeft: "auto", padding: "2px 8px" }}>📋</button>
            </div>
          ))}
        </div>
      )}
      <ToastContainer />
    </div>
  );
}
