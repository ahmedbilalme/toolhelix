"use client";
import { useState } from "react";
import { copyToClipboard } from "@/lib/api";
import { useToast } from "@/components/ui/Toast";

type Mode = "encode" | "decode";

export default function Base64Tool() {
  const [mode, setMode] = useState<Mode>("encode");
  const [input, setInput] = useState("");
  const { toast, ToastContainer } = useToast();

  const output = (() => {
    if (!input.trim()) return "";
    try {
      if (mode === "encode") return btoa(unescape(encodeURIComponent(input)));
      else return decodeURIComponent(escape(atob(input.replace(/\s/g, ""))));
    } catch {
      return "Invalid input — cannot decode";
    }
  })();

  const isError = output.startsWith("Invalid input");

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto" }}>
      <ToastContainer />

      {/* Mode toggle */}
      <div style={{ display: "flex", marginBottom: "20px", width: "fit-content" }}>
        {(["encode", "decode"] as Mode[]).map((m) => (
          <button
            key={m}
            onClick={() => { setMode(m); setInput(""); }}
            className={`btn ${mode === m ? "btn-primary" : "btn-secondary"} btn-md`}
            style={{ borderRadius: m === "encode" ? "10px 0 0 10px" : "0 10px 10px 0", textTransform: "capitalize", minWidth: "120px" }}
          >
            {m === "encode" ? "Encode →" : "← Decode"}
          </button>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
        {/* Input */}
        <div>
          <div style={{ marginBottom: "6px", fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "0.82rem", color: "var(--color-text-muted)" }}>
            {mode === "encode" ? "Plain text" : "Base64 string"}
          </div>
          <textarea
            className="input textarea"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={mode === "encode" ? "Enter text to encode…" : "Paste Base64 to decode…"}
            style={{ height: "280px", fontFamily: "var(--font-mono)", fontSize: "0.85rem" }}
          />
          <div style={{ marginTop: "8px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "0.75rem", color: "var(--color-text-faint)" }}>{input.length} chars</span>
            <button onClick={() => { setInput(""); }} className="btn btn-ghost btn-sm">Clear</button>
          </div>
        </div>

        {/* Output */}
        <div>
          <div style={{ marginBottom: "6px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "0.82rem", color: "var(--color-text-muted)" }}>
              {mode === "encode" ? "Base64 encoded" : "Decoded text"}
            </span>
            {output && !isError && (
              <button onClick={async () => { await copyToClipboard(output); toast("Copied!", "success"); }} className="btn btn-secondary btn-sm">
                📋 Copy
              </button>
            )}
          </div>
          <div
            className="code-block"
            style={{
              height: "280px",
              overflow: "auto",
              whiteSpace: "pre-wrap",
              wordBreak: "break-all",
              color: isError ? "#f87171" : "#a78bfa",
              fontSize: "0.82rem",
            }}
          >
            {output || <span style={{ color: "var(--color-text-faint)", fontStyle: "italic" }}>Output will appear here…</span>}
          </div>
          {output && !isError && (
            <div style={{ marginTop: "8px" }}>
              <span style={{ fontSize: "0.75rem", color: "var(--color-text-faint)" }}>{output.length} chars</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
