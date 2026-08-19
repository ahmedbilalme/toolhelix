"use client";
import { useState, useMemo } from "react";
import { copyToClipboard } from "@/lib/api";
import { useToast } from "@/components/ui/Toast";

function analyzeText(text: string) {
  if (!text.trim()) return null;
  const words = text.trim().split(/\s+/).filter(Boolean);
  const sentences = text.split(/[.!?]+/).filter((s) => s.trim());
  const paragraphs = text.split(/\n\n+/).filter((p) => p.trim());
  const readingTime = Math.ceil(words.length / 200); // avg 200 wpm

  // Top words
  const freq: Record<string, number> = {};
  words.forEach((w) => {
    const clean = w.toLowerCase().replace(/[^a-z0-9]/g, "");
    if (clean.length > 2) freq[clean] = (freq[clean] ?? 0) + 1;
  });
  const topWords = Object.entries(freq).sort(([, a], [, b]) => b - a).slice(0, 5);

  return {
    words: words.length,
    characters: text.length,
    charactersNoSpaces: text.replace(/\s/g, "").length,
    sentences: sentences.length,
    paragraphs: paragraphs.length,
    readingTime,
    topWords,
  };
}

export default function WordCounter() {
  const [text, setText] = useState("");
  const { toast, ToastContainer } = useToast();
  const stats = useMemo(() => analyzeText(text), [text]);

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto" }}>
      <ToastContainer />

      <textarea
        className="input textarea"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Start typing or paste your text here…"
        style={{ height: "280px", marginBottom: "24px", fontSize: "0.95rem" }}
      />

      {stats ? (
        <div className="animate-scale-in">
          {/* Stats grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: "12px", marginBottom: "24px" }}>
            {[
              { label: "Words", value: stats.words.toLocaleString(), color: "var(--color-accent)" },
              { label: "Characters", value: stats.characters.toLocaleString(), color: "#3B82F6" },
              { label: "No spaces", value: stats.charactersNoSpaces.toLocaleString(), color: "#10B981" },
              { label: "Sentences", value: stats.sentences.toLocaleString(), color: "#F59E0B" },
              { label: "Paragraphs", value: stats.paragraphs.toLocaleString(), color: "#EC4899" },
              { label: "Reading time", value: `~${stats.readingTime} min`, color: "#06B6D4" },
            ].map(({ label, value, color }) => (
              <div
                key={label}
                className="card"
                style={{ textAlign: "center", cursor: "pointer" }}
                onClick={async () => { await copyToClipboard(value); toast(`Copied ${label}`, "success"); }}
              >
                <div style={{ fontFamily: "var(--font-mono)", fontSize: "1.6rem", fontWeight: 700, color, lineHeight: 1, marginBottom: "6px" }}>{value}</div>
                <div style={{ fontFamily: "var(--font-display)", fontSize: "0.75rem", color: "var(--color-text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</div>
              </div>
            ))}
          </div>

          {/* Top words */}
          {stats.topWords.length > 0 && (
            <div className="card">
              <h3 style={{ fontFamily: "var(--font-display)", fontSize: "0.9rem", marginTop: 0, marginBottom: "12px" }}>Top words</h3>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                {stats.topWords.map(([word, count]) => (
                  <div key={word} style={{ display: "flex", alignItems: "center", gap: "6px", background: "var(--color-base)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-full)", padding: "4px 12px 4px 8px" }}>
                    <span style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "0.85rem" }}>{word}</span>
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", color: "var(--color-accent)" }}>{count}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div style={{ textAlign: "center", color: "var(--color-text-faint)", padding: "32px" }}>
          Start typing to see statistics
        </div>
      )}
    </div>
  );
}
