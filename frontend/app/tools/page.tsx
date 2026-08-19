"use client";
import { useState, useMemo } from "react";
import ToolCard from "@/components/ui/ToolCard";
import { TOOLS, CATEGORIES, type CategoryId } from "@/lib/tools";

const ALL = "all";

export default function ToolsDirectoryPage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<CategoryId | typeof ALL>(ALL);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return TOOLS.filter((t) => {
      const matchCat = activeCategory === ALL || t.category === activeCategory;
      const matchSearch =
        !q ||
        t.name.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.keywords.some((k) => k.includes(q));
      return matchCat && matchSearch;
    });
  }, [search, activeCategory]);

  return (
    <>
      {/* Header */}
      <section style={{ padding: "48px 0 32px", borderBottom: "1px solid var(--color-border)" }}>
        <div className="container">
          <span className="badge badge-violet" style={{ marginBottom: "12px" }}>🧰 All Tools</span>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.8rem, 4vw, 2.8rem)", marginBottom: "12px" }}>
            Every tool in one place
          </h1>
          <p style={{ color: "var(--color-text-muted)", fontSize: "1rem", marginBottom: "24px" }}>
            {TOOLS.length} free tools across {CATEGORIES.length} categories. No signup. Instant results.
          </p>

          {/* Search */}
          <input
            type="search"
            className="input"
            placeholder="Search tools by name or keyword…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ maxWidth: "480px" }}
            aria-label="Search tools"
          />
        </div>
      </section>

      {/* Category filter tabs */}
      <section style={{ padding: "20px 0", borderBottom: "1px solid var(--color-border)", position: "sticky", top: "64px", background: "var(--color-surface)", zIndex: 10 }}>
        <div className="container">
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            <button
              onClick={() => setActiveCategory(ALL)}
              className={`btn ${activeCategory === ALL ? "btn-primary" : "btn-secondary"} btn-sm`}
            >
              All ({TOOLS.length})
            </button>
            {CATEGORIES.map((cat) => {
              const count = TOOLS.filter((t) => t.category === cat.id).length;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`btn ${activeCategory === cat.id ? "btn-primary" : "btn-secondary"} btn-sm`}
                >
                  {cat.icon} {cat.name} ({count})
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Tool grid */}
      <section style={{ padding: "40px 0 80px" }}>
        <div className="container">
          {filtered.length === 0 ? (
            <div style={{ textAlign: "center", padding: "80px 0", color: "var(--color-text-muted)" }}>
              <div style={{ fontSize: "3rem", marginBottom: "16px" }}>🔍</div>
              <h2 style={{ fontFamily: "var(--font-display)", color: "var(--color-text)" }}>No tools found</h2>
              <p>Try a different search term or browse all categories.</p>
              <button
                onClick={() => { setSearch(""); setActiveCategory(ALL); }}
                className="btn btn-secondary btn-md"
                style={{ marginTop: "16px" }}
              >
                Clear filters
              </button>
            </div>
          ) : (
            <>
              <p style={{ color: "var(--color-text-muted)", fontSize: "0.85rem", marginBottom: "24px" }}>
                {filtered.length} tool{filtered.length !== 1 ? "s" : ""}{search ? ` matching "${search}"` : ""}
              </p>
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                gap: "16px",
              }}>
                {filtered.map((tool, i) => (
                  <ToolCard key={tool.id} tool={tool} index={i} />
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
}
