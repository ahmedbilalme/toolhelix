"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { TOOLS, CATEGORIES, searchTools, type ToolMeta } from "@/lib/tools";

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIdx, setActiveIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const results = query ? searchTools(query).slice(0, 8) : TOOLS.slice(0, 8);

  const close = useCallback(() => {
    setOpen(false);
    setQuery("");
    setActiveIdx(0);
  }, []);

  // Global ⌘K / Ctrl+K listener
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [close]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 50);
  }, [open]);

  useEffect(() => {
    setActiveIdx(0);
  }, [query]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIdx((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIdx((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && results[activeIdx]) {
      const t = results[activeIdx];
      router.push(`/tools/${t.category}/${t.slug}`);
      close();
    }
  };

  if (!open) return null;

  return (
    <div className="cmd-overlay" onClick={close}>
      <div className="cmd-panel" onClick={(e) => e.stopPropagation()} onKeyDown={handleKeyDown}>
        <div style={{ display: "flex", alignItems: "center", padding: "0 24px", borderBottom: "1px solid var(--color-border)" }}>
          <span style={{ color: "var(--color-text-muted)", fontSize: "1.2rem", marginRight: "12px" }}>⌕</span>
          <input
            ref={inputRef}
            className="cmd-input"
            placeholder="Search tools…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{ padding: "20px 0" }}
          />
          <kbd style={{
            background: "var(--color-border)",
            color: "var(--color-text-muted)",
            padding: "2px 8px",
            borderRadius: "4px",
            fontSize: "0.75rem",
            fontFamily: "var(--font-mono)",
            flexShrink: 0,
          }}>ESC</kbd>
        </div>

        <div className="cmd-results">
          {results.length === 0 ? (
            <div style={{ padding: "32px", textAlign: "center", color: "var(--color-text-muted)" }}>
              No tools found for &quot;{query}&quot;
            </div>
          ) : (
            results.map((tool, i) => (
              <Link
                key={tool.id}
                href={`/tools/${tool.category}/${tool.slug}`}
                onClick={close}
              >
                <div className={`cmd-item ${i === activeIdx ? "active" : ""}`}>
                  <div className="cmd-item-icon">{tool.icon}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "0.9rem" }}>
                      {tool.name}
                    </div>
                    <div style={{ color: "var(--color-text-muted)", fontSize: "0.78rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {tool.description}
                    </div>
                  </div>
                  <span style={{ fontSize: "0.7rem", color: "var(--color-text-faint)", textTransform: "capitalize", flexShrink: 0 }}>
                    {tool.category.replace("-", " ")}
                  </span>
                </div>
              </Link>
            ))
          )}
        </div>

        <div style={{
          padding: "8px 16px",
          borderTop: "1px solid var(--color-border)",
          display: "flex",
          gap: "16px",
          fontSize: "0.72rem",
          color: "var(--color-text-faint)",
        }}>
          <span>↑↓ navigate</span>
          <span>↵ open</span>
          <span>ESC close</span>
        </div>
      </div>
    </div>
  );
}
