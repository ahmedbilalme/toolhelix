import type { Metadata } from "next";
import Link from "next/link";
import ToolCard from "@/components/ui/ToolCard";
import SearchTriggerBtn from "@/components/ui/SearchTriggerBtn";
import {
  TOOLS,
  CATEGORIES,
  getFeaturedTools,
  getNewTools,
} from "@/lib/tools";

export const metadata: Metadata = {
  title: "ToolHelix — Free Online Tools for Developers & Everyone",
  description:
    "20+ free, instant online tools: image converters, password generators, JSON formatters, calculators, and more. No signup. No clutter. Just results.",
};

const featuredTools = getFeaturedTools();
const newTools = getNewTools(4);

export default function HomePage() {
  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section
        style={{
          position: "relative",
          overflow: "hidden",
          paddingTop: "96px",
          paddingBottom: "96px",
        }}
      >
        {/* Background grid */}
        <div
          className="grid-bg"
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.18,
            pointerEvents: "none",
          }}
        />

        {/* Large center glow */}
        <div
          style={{
            position: "absolute",
            top: "-80px",
            left: "50%",
            transform: "translateX(-50%)",
            width: "700px",
            height: "500px",
            background:
              "radial-gradient(ellipse, rgba(110,86,207,0.22) 0%, rgba(59,130,246,0.08) 50%, transparent 75%)",
            pointerEvents: "none",
            animation: "pulse-glow 5s ease-in-out infinite",
          }}
        />
        {/* Right accent orb */}
        <div
          style={{
            position: "absolute",
            top: "60px",
            right: "-120px",
            width: "440px",
            height: "440px",
            background:
              "radial-gradient(ellipse, rgba(59,130,246,0.14) 0%, transparent 70%)",
            pointerEvents: "none",
            borderRadius: "50%",
          }}
        />
        {/* Left accent orb */}
        <div
          style={{
            position: "absolute",
            bottom: "-40px",
            left: "-80px",
            width: "360px",
            height: "360px",
            background:
              "radial-gradient(ellipse, rgba(110,86,207,0.1) 0%, transparent 70%)",
            pointerEvents: "none",
            borderRadius: "50%",
          }}
        />

        <div className="container" style={{ position: "relative", textAlign: "center" }}>
          {/* Eyebrow badge */}
          <div className="animate-slide-up" style={{ marginBottom: "24px" }}>
            <span
              className="badge badge-violet"
              style={{
                fontSize: "0.75rem",
                padding: "6px 16px",
                boxShadow: "0 0 16px rgba(110,86,207,0.3)",
              }}
            >
              ✦ {TOOLS.length}+ Free Tools — No Signup Required
            </span>
          </div>

          {/* H1 */}
          <h1
            className="animate-slide-up stagger-1"
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: "clamp(2.6rem, 6.5vw, 5rem)",
              lineHeight: 1.08,
              letterSpacing: "-0.03em",
              margin: "0 auto 28px",
              maxWidth: "820px",
            }}
          >
            Every tool you need,{" "}
            <span
              className="gradient-text"
              style={{
                display: "inline-block",
                paddingBottom: "0.05em",
              }}
            >
              woven into one.
            </span>
          </h1>

          <p
            className="animate-slide-up stagger-2"
            style={{
              color: "var(--color-text-muted)",
              fontSize: "clamp(1rem, 2.5vw, 1.2rem)",
              maxWidth: "540px",
              margin: "0 auto 40px",
              lineHeight: 1.7,
            }}
          >
            Fast, free, well-designed utilities for developers, designers, and
            everyone in between. No bloat. Instant results.
          </p>

          {/* CTA buttons */}
          <div
            className="animate-slide-up stagger-3"
            style={{
              display: "flex",
              gap: "12px",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <Link href="/tools" className="btn btn-primary btn-lg">
              Browse All Tools →
            </Link>
            <SearchTriggerBtn />
          </div>

          {/* Quick stats */}
          <div
            className="animate-slide-up stagger-4"
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "0",
              marginTop: "64px",
              flexWrap: "wrap",
              borderTop: "1px solid var(--color-border)",
              paddingTop: "40px",
            }}
          >
            {[
              { value: `${TOOLS.length}+`, label: "Free Tools" },
              { value: `${CATEGORIES.length}`, label: "Categories" },
              { value: "0",  label: "Sign-ups needed" },
              { value: "∞",  label: "Uses per tool" },
            ].map(({ value, label }, i) => (
              <div
                key={label}
                style={{
                  textAlign: "center",
                  padding: "0 32px",
                  borderRight:
                    i < 3 ? "1px solid var(--color-border)" : "none",
                }}
              >
                <div
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 700,
                    fontSize: "2.2rem",
                    background: "linear-gradient(135deg, #a78bfa, #6E56CF 50%, #3B82F6)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                    lineHeight: 1.2,
                  }}
                >
                  {value}
                </div>
                <div
                  style={{
                    color: "var(--color-text-faint)",
                    fontSize: "0.78rem",
                    marginTop: "4px",
                    fontFamily: "var(--font-display)",
                    fontWeight: 500,
                    letterSpacing: "0.03em",
                    textTransform: "uppercase",
                  }}
                >
                  {label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Tools ───────────────────────────────────────────────── */}
      <section style={{ padding: "72px 0" }}>
        <div className="container">
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-between",
              marginBottom: "36px",
              flexWrap: "wrap",
              gap: "12px",
            }}
          >
            <div>
              <span className="badge badge-violet" style={{ marginBottom: "8px" }}>
                ⭐ Popular
              </span>
              <h2
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "1.8rem",
                  margin: 0,
                }}
              >
                Most-used tools
              </h2>
            </div>
            <Link
              href="/tools"
              style={{
                color: "var(--color-accent)",
                textDecoration: "none",
                fontFamily: "var(--font-display)",
                fontWeight: 600,
                fontSize: "0.9rem",
                display: "flex",
                alignItems: "center",
                gap: "4px",
              }}
            >
              View all →
            </Link>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: "16px",
            }}
          >
            {featuredTools.map((tool, i) => (
              <ToolCard key={tool.id} tool={tool} index={i} />
            ))}
          </div>
        </div>
      </section>

      <div className="helix-divider" style={{ margin: 0 }} />

      {/* ── Categories ───────────────────────────────────────────────────── */}
      <section style={{ padding: "72px 0" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: "52px" }}>
            <span className="badge badge-blue" style={{ marginBottom: "12px" }}>
              📦 Browse by category
            </span>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "1.8rem",
                margin: 0,
              }}
            >
              Find the right tool, fast
            </h2>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
              gap: "16px",
            }}
          >
            {CATEGORIES.map((cat, i) => {
              const count = TOOLS.filter((t) => t.category === cat.id).length;
              return (
                <Link
                  key={cat.id}
                  href={`/tools/${cat.id}`}
                  style={{ textDecoration: "none" }}
                >
                  <div
                    className="card cat-card animate-slide-up"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "18px",
                      cursor: "pointer",
                      animationDelay: `${i * 60}ms`,
                      borderLeft: `3px solid ${cat.color}`,
                      transition: "border-color 250ms, box-shadow 250ms, transform 200ms, background 200ms",
                      position: "relative",
                      overflow: "hidden",
                    }}
                  >
                    {/* Background glow on hover */}
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        background: `linear-gradient(135deg, ${cat.color}08 0%, transparent 60%)`,
                        opacity: 0,
                        transition: "opacity 250ms",
                      }}
                      className="cat-card-bg"
                    />
                    <div
                      style={{
                        width: "52px",
                        height: "52px",
                        background: `${cat.color}18`,
                        border: `1px solid ${cat.color}40`,
                        borderRadius: "var(--radius-md)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "1.6rem",
                        flexShrink: 0,
                        transition: "transform 200ms",
                        position: "relative",
                      }}
                      className="cat-icon"
                    >
                      {cat.icon}
                    </div>
                    <div style={{ flex: 1, minWidth: 0, position: "relative" }}>
                      <div
                        style={{
                          fontFamily: "var(--font-display)",
                          fontWeight: 600,
                          fontSize: "0.95rem",
                          color: "var(--color-text)",
                          marginBottom: "3px",
                        }}
                      >
                        {cat.name}
                      </div>
                      <div
                        style={{
                          color: "var(--color-text-muted)",
                          fontSize: "0.78rem",
                        }}
                      >
                        {count} tool{count !== 1 ? "s" : ""}
                      </div>
                    </div>
                    <span
                      style={{
                        color: cat.color,
                        fontSize: "1rem",
                        transition: "transform 200ms",
                        position: "relative",
                      }}
                      className="cat-arrow"
                    >
                      →
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <div className="helix-divider" style={{ margin: 0 }} />

      {/* ── New Tools ────────────────────────────────────────────────────── */}
      {newTools.length > 0 && (
        <section style={{ padding: "72px 0" }}>
          <div className="container">
            <div
              style={{
                display: "flex",
                alignItems: "flex-end",
                justifyContent: "space-between",
                marginBottom: "36px",
                flexWrap: "wrap",
                gap: "12px",
              }}
            >
              <div>
                <span className="badge badge-blue" style={{ marginBottom: "8px" }}>
                  🆕 Just shipped
                </span>
                <h2
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "1.8rem",
                    margin: 0,
                  }}
                >
                  New tools
                </h2>
              </div>
              <Link
                href="/changelog"
                style={{
                  color: "var(--color-accent)",
                  textDecoration: "none",
                  fontFamily: "var(--font-display)",
                  fontWeight: 600,
                  fontSize: "0.9rem",
                }}
              >
                Full changelog →
              </Link>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                gap: "16px",
              }}
            >
              {newTools.map((tool, i) => (
                <ToolCard key={tool.id} tool={tool} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Value props ───────────────────────────────────────────────────── */}
      <section
        style={{
          padding: "72px 0",
          background: "var(--color-surface)",
          borderTop: "1px solid var(--color-border)",
          borderBottom: "1px solid var(--color-border)",
        }}
      >
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: "52px" }}>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "1.8rem",
                margin: 0,
              }}
            >
              Why ToolHelix?
            </h2>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
              gap: "24px",
            }}
          >
            {[
              {
                icon: "⚡",
                title: "Instant results",
                desc: "No waiting, no spinning wheels. Most tools run directly in your browser.",
                color: "#F59E0B",
              },
              {
                icon: "🔒",
                title: "Private by design",
                desc: "Files processed server-side are never stored. Most tools run entirely in-browser.",
                color: "#6E56CF",
              },
              {
                icon: "🚫",
                title: "Zero sign-ups",
                desc: "Every tool is free and fully accessible without creating an account.",
                color: "#10B981",
              },
              {
                icon: "📱",
                title: "Works everywhere",
                desc: "Designed for phones, tablets, and desktops — 375px to 4K.",
                color: "#3B82F6",
              },
              {
                icon: "🎯",
                title: "One tool, one page",
                desc: "Each tool has its own URL. Bookmark exactly what you need.",
                color: "#EC4899",
              },
              {
                icon: "♿",
                title: "Accessible",
                desc: "WCAG AA compliant. Keyboard navigable. Screen-reader tested.",
                color: "#06B6D4",
              },
            ].map(({ icon, title, desc, color }, i) => (
              <div
                key={title}
                className="why-card animate-slide-up"
                style={{
                  textAlign: "center",
                  padding: "28px 20px",
                  animationDelay: `${i * 50}ms`,
                  borderRadius: "var(--radius-lg)",
                  border: "1px solid transparent",
                  transition: "border-color 250ms, background 250ms",
                }}
              >
                <div
                  style={{
                    width: "56px",
                    height: "56px",
                    background: `${color}15`,
                    border: `1px solid ${color}30`,
                    borderRadius: "var(--radius-md)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "1.5rem",
                    margin: "0 auto 16px",
                  }}
                >
                  {icon}
                </div>
                <h3
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 600,
                    fontSize: "0.95rem",
                    margin: "0 0 8px",
                    color: "var(--color-text)",
                  }}
                >
                  {title}
                </h3>
                <p
                  style={{
                    color: "var(--color-text-muted)",
                    fontSize: "0.82rem",
                    margin: 0,
                    lineHeight: 1.6,
                  }}
                >
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <section
        style={{
          padding: "96px 0",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Subtle center glow */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse 60% 80% at 50% 50%, rgba(110,86,207,0.08) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />
        <div className="container" style={{ textAlign: "center", position: "relative" }}>
          <span className="badge badge-violet" style={{ marginBottom: "16px" }}>
            Ready to get started?
          </span>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
              marginBottom: "16px",
              letterSpacing: "-0.02em",
            }}
          >
            Pick a tool.{" "}
            <span className="gradient-text">Get it done.</span>
          </h2>
          <p
            style={{
              color: "var(--color-text-muted)",
              marginBottom: "36px",
              fontSize: "1rem",
              maxWidth: "400px",
              margin: "0 auto 36px",
              lineHeight: 1.6,
            }}
          >
            {TOOLS.length}+ tools and counting. All free. All fast. Zero friction.
          </p>
          <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/tools" className="btn btn-primary btn-lg">
              Browse All Tools →
            </Link>
            <Link href="/about" className="btn btn-secondary btn-lg">
              Our mission
            </Link>
          </div>
        </div>
      </section>

      <style>{`
        .cat-card:hover {
          transform: translateY(-2px) !important;
          box-shadow: var(--shadow-md) !important;
        }
        .cat-card:hover .cat-card-bg { opacity: 1 !important; }
        .cat-card:hover .cat-arrow   { transform: translateX(4px) !important; }
        .cat-card:hover .cat-icon    { transform: scale(1.08) !important; }
        .why-card:hover {
          border-color: var(--color-border-light) !important;
          background: var(--color-surface-2) !important;
        }
      `}</style>
    </>
  );
}
