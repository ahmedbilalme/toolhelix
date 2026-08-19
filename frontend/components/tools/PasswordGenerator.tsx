"use client";
import { useState, useCallback } from "react";
import { copyToClipboard } from "@/lib/api";
import { useToast } from "@/components/ui/Toast";

const CHARSET = {
  upper: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  lower: "abcdefghijklmnopqrstuvwxyz",
  digits: "0123456789",
  symbols: "!@#$%^&*()-_=+[]{}|;:,.<>?",
};

function generatePassword(
  length: number,
  opts: { upper: boolean; lower: boolean; digits: boolean; symbols: boolean }
): string {
  let chars = "";
  if (opts.upper)   chars += CHARSET.upper;
  if (opts.lower)   chars += CHARSET.lower;
  if (opts.digits)  chars += CHARSET.digits;
  if (opts.symbols) chars += CHARSET.symbols;
  if (!chars) chars = CHARSET.lower + CHARSET.digits;

  const arr = new Uint32Array(length);
  crypto.getRandomValues(arr);
  return Array.from(arr).map((n) => chars[n % chars.length]).join("");
}

function getStrength(pwd: string): { score: number; label: string; color: string } {
  let score = 0;
  if (pwd.length >= 8)  score++;
  if (pwd.length >= 12) score++;
  if (pwd.length >= 16) score++;
  if (/[A-Z]/.test(pwd)) score++;
  if (/[a-z]/.test(pwd)) score++;
  if (/[0-9]/.test(pwd)) score++;
  if (/[^A-Za-z0-9]/.test(pwd)) score++;
  if (score <= 2) return { score, label: "Weak",   color: "#EF4444" };
  if (score <= 4) return { score, label: "Fair",   color: "#F59E0B" };
  if (score <= 5) return { score, label: "Good",   color: "#3B82F6" };
  return            { score, label: "Strong", color: "#10B981" };
}

export default function PasswordGenerator() {
  const [length, setLength] = useState(16);
  const [opts, setOpts]     = useState({ upper: true, lower: true, digits: true, symbols: true });
  const [count, setCount]   = useState(1);
  const [passwords, setPasswords] = useState<string[]>([]);
  const { toast, ToastContainer } = useToast();

  const generate = useCallback(() => {
    setPasswords(Array.from({ length: count }, () => generatePassword(length, opts)));
  }, [length, opts, count]);

  return (
    <div style={{ maxWidth: "640px", margin: "0 auto" }}>
      <ToastContainer />
      <div className="card" style={{ marginBottom: "16px" }}>
        <div style={{ marginBottom: "24px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
            <label style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "0.85rem" }}>Length</label>
            <span style={{ fontFamily: "var(--font-mono)", color: "var(--color-accent)", fontWeight: 700 }}>{length}</span>
          </div>
          <input type="range" min={4} max={64} value={length} onChange={(e) => setLength(Number(e.target.value))} />
        </div>
        <div style={{ marginBottom: "24px" }}>
          <label style={{ display: "block", fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "0.85rem", marginBottom: "12px" }}>Include</label>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
            {(Object.entries(opts) as [keyof typeof opts, boolean][]).map(([key, val]) => (
              <label key={key} style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer", padding: "10px 12px", background: val ? "var(--color-accent-subtle)" : "var(--color-base)", border: `1px solid ${val ? "var(--color-accent)" : "var(--color-border)"}`, borderRadius: "var(--radius-md)", transition: "all 150ms" }}>
                <input type="checkbox" checked={val} onChange={(e) => setOpts((o) => ({ ...o, [key]: e.target.checked }))} style={{ accentColor: "var(--color-accent)", width: "16px", height: "16px" }} />
                <span style={{ fontFamily: "var(--font-display)", fontSize: "0.85rem", fontWeight: 500 }}>
                  {key === "upper" ? "A–Z (uppercase)" : key === "lower" ? "a–z (lowercase)" : key === "digits" ? "0–9 (numbers)" : "!@# (symbols)"}
                </span>
              </label>
            ))}
          </div>
        </div>
        <div style={{ marginBottom: "24px" }}>
          <label style={{ display: "block", fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "0.85rem", marginBottom: "8px" }}>Generate {count} password{count > 1 ? "s" : ""}</label>
          <input type="range" min={1} max={10} value={count} onChange={(e) => setCount(Number(e.target.value))} />
        </div>
        <button onClick={generate} className="btn btn-primary btn-md" style={{ width: "100%" }}>
          🔐 Generate Password{count > 1 ? "s" : ""}
        </button>
      </div>
      {passwords.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {passwords.map((pwd, i) => {
            const s = getStrength(pwd);
            return (
              <div key={i} className="result-panel animate-scale-in" style={{ animationDelay: `${i * 50}ms` }}>
                <div className="result-panel-header">
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: s.color, display: "inline-block" }} />
                    <span style={{ fontFamily: "var(--font-display)", fontSize: "0.82rem", color: s.color }}>{s.label}</span>
                    <div style={{ display: "flex", gap: "2px" }}>
                      {Array.from({ length: 7 }).map((_, j) => (
                        <div key={j} style={{ width: "16px", height: "4px", borderRadius: "2px", background: j < s.score ? s.color : "var(--color-border)" }} />
                      ))}
                    </div>
                  </div>
                  <button onClick={async () => { await copyToClipboard(pwd); toast("Copied!", "success"); }} className="btn btn-secondary btn-sm">📋 Copy</button>
                </div>
                <div style={{ padding: "16px", fontFamily: "var(--font-mono)", fontSize: "0.95rem", letterSpacing: "0.02em", wordBreak: "break-all", color: "var(--color-text)" }}>
                  {pwd}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
