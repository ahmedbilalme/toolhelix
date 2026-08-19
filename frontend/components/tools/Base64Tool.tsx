"use client";
import { useState, useRef } from "react";
import { copyToClipboard } from "@/lib/api";
import { useToast } from "@/components/ui/Toast";

type Mode = "encode" | "decode";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB — base64 strings get ~33% bigger than the source

export default function Base64Tool() {
  const [mode, setMode] = useState<Mode>("encode");
  const [input, setInput] = useState("");
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileBase64, setFileBase64] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast, ToastContainer } = useToast();

  const clearFile = () => {
    setFileBase64(null);
    setFileName(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const switchMode = (m: Mode) => {
    setMode(m);
    setInput("");
    clearFile();
  };

  const handleFileUpload = (f: File) => {
    if (f.size > MAX_FILE_SIZE) {
      toast(`File is too large (max ${(MAX_FILE_SIZE / (1024 * 1024)).toFixed(0)} MB)`, "error");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.split(",")[1] ?? "";
      setFileBase64(base64);
      setFileName(f.name);
      setInput("");
    };
    reader.onerror = () => toast("Failed to read file", "error");
    reader.readAsDataURL(f);
  };

  const output = (() => {
    if (mode === "encode" && fileBase64 !== null) return fileBase64;
    if (!input.trim()) return "";
    try {
      if (mode === "encode") return btoa(unescape(encodeURIComponent(input)));
      else return decodeURIComponent(escape(atob(input.replace(/\s/g, ""))));
    } catch {
      return "Invalid input — cannot decode";
    }
  })();

  const isError = output.startsWith("Invalid input");

  const downloadDecodedFile = () => {
    try {
      const clean = input.replace(/\s/g, "");
      const binary = atob(clean);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
      const blob = new Blob([bytes]);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "decoded-file";
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      toast("Cannot decode — invalid Base64 input", "error");
    }
  };

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto" }}>
      <ToastContainer />

      {/* Mode toggle */}
      <div style={{ display: "flex", marginBottom: "20px", width: "fit-content" }}>
        {(["encode", "decode"] as Mode[]).map((m) => (
          <button
            key={m}
            onClick={() => switchMode(m)}
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
            {mode === "encode" ? "Plain text or file" : "Base64 string"}
          </div>

          {mode === "encode" && fileBase64 !== null ? (
            <div className="input" style={{ height: "280px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "12px", textAlign: "center" }}>
              <div style={{ fontSize: "2rem" }}>📎</div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.85rem", wordBreak: "break-all" }}>{fileName}</div>
              <button onClick={clearFile} className="btn btn-ghost btn-sm">✕ Remove file, type text instead</button>
            </div>
          ) : (
            <textarea
              className="input textarea"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={mode === "encode" ? "Enter text to encode…" : "Paste Base64 to decode…"}
              style={{ height: "280px", fontFamily: "var(--font-mono)", fontSize: "0.85rem" }}
            />
          )}

          <div style={{ marginTop: "8px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            {mode === "encode" ? (
              <>
                <input
                  ref={fileInputRef}
                  type="file"
                  style={{ display: "none" }}
                  onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
                />
                <button onClick={() => fileInputRef.current?.click()} className="btn btn-ghost btn-sm">📎 Or upload a file</button>
              </>
            ) : (
              <span style={{ fontSize: "0.75rem", color: "var(--color-text-faint)" }}>{input.length} chars</span>
            )}
            <button onClick={() => { setInput(""); clearFile(); }} className="btn btn-ghost btn-sm">Clear</button>
          </div>
        </div>

        {/* Output */}
        <div>
          <div style={{ marginBottom: "6px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "0.82rem", color: "var(--color-text-muted)" }}>
              {mode === "encode" ? "Base64 encoded" : "Decoded text"}
            </span>
            {output && !isError && (
              <div style={{ display: "flex", gap: "6px" }}>
                {mode === "decode" && (
                  <button onClick={downloadDecodedFile} className="btn btn-secondary btn-sm" title="Download the decoded bytes as a file — useful when the Base64 represents binary data, not text">
                    ⬇ Download as file
                  </button>
                )}
                <button onClick={async () => { await copyToClipboard(output); toast("Copied!", "success"); }} className="btn btn-secondary btn-sm">
                  📋 Copy
                </button>
              </div>
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
