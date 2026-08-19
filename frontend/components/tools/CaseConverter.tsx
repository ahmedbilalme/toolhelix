"use client";
import { useState } from "react";
import { copyToClipboard } from "@/lib/api";
import { useToast } from "@/components/ui/Toast";

type CaseType = "upper" | "lower" | "title" | "sentence" | "camel" | "pascal" | "snake" | "kebab";

function convertCase(text: string, type: CaseType): string {
  switch (type) {
    case "upper": return text.toUpperCase();
    case "lower": return text.toLowerCase();
    case "title": return text.toLowerCase().replace(/(^|\s)\S/g, (c) => c.toUpperCase());
    case "sentence": return text.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, (c) => c.toUpperCase());
    case "camel": {
      const w = text.toLowerCase().split(/[\s_\-]+/).filter(Boolean);
      return w[0] + w.slice(1).map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join("");
    }
    case "pascal": return text.toLowerCase().split(/[\s_\-]+/).filter(Boolean).map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join("");
    case "snake": return text.toLowerCase().replace(/\s+/g, "_").replace(/[^a-z0-9_]/g, "");
    case "kebab": return text.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
  }
}

const CASES: { id: CaseType; label: string; example: string }[] = [
  { id: "upper",    label: "UPPERCASE",      example: "HELLO WORLD" },
  { id: "lower",    label: "lowercase",      example: "hello world" },
  { id: "title",    label: "Title Case",     example: "Hello World" },
  { id: "sentence", label: "Sentence case",  example: "Hello world" },
  { id: "camel",    label: "camelCase",      example: "helloWorld" },
  { id: "pascal",   label: "PascalCase",     example: "HelloWorld" },
  { id: "snake",    label: "snake_case",     example: "hello_world" },
  { id: "kebab",    label: "kebab-case",     example: "hello-world" },
];

export default function CaseConverter() {
  const [input, setInput] = useState("");
  const { toast, ToastContainer } = useToast();

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto" }}>
      <ToastContainer />

      <textarea
        className="input textarea"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Enter your text here and all conversions will appear below instantly…"
        style={{ height: "160px", marginBottom: "24px", fontSize: "0.95rem" }}
      />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "12px" }}>
        {CASES.map((c, i) => {
          const converted = input ? convertCase(input, c.id) : c.example;
          const isPlaceholder = !input;
          return (
            <div
              key={c.id}
              className="card animate-slide-up"
              style={{ animationDelay: `${i * 40}ms`, cursor: input ? "pointer" : "default" }}
              onClick={async () => {
                if (!input) return;
                await copyToClipboard(converted);
                toast(`${c.label} copied!`, "success");
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                <span style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "0.82rem", color: "var(--color-text-muted)" }}>{c.label}</span>
                {input && <span style={{ fontSize: "0.72rem", color: "var(--color-text-faint)" }}>click to copy</span>}
              </div>
              <div style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.88rem",
                color: isPlaceholder ? "var(--color-text-faint)" : "var(--color-text)",
                wordBreak: "break-all",
                lineHeight: 1.5,
                maxHeight: "80px",
                overflow: "hidden",
              }}>
                {converted}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
