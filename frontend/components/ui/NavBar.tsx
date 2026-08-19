"use client";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { CATEGORIES } from "@/lib/tools";

const NAV_LINKS = [
  { label: "All Tools", href: "/tools" },
  { label: "Blog",      href: "/blog" },
  { label: "About",     href: "/about" },
];

export default function NavBar() {
  const [scrolled,    setScrolled]    = useState(false);
  const [mobileOpen,  setMobileOpen]  = useState(false);
  const [catMenuOpen, setCatMenuOpen] = useState(false);
  const pathname = usePathname();
  const catRef   = useRef<HTMLDivElement>(null);

  /* ── scroll shadow ──────────────────────────────────────────────────── */
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  /* ── close mobile menu on route change ─────────────────────────────── */
  useEffect(() => {
    setMobileOpen(false);
    setCatMenuOpen(false);
  }, [pathname]);

  /* ── close category dropdown on outside click ───────────────────────── */
  useEffect(() => {
    if (!catMenuOpen) return;
    const handler = (e: MouseEvent) => {
      if (catRef.current && !catRef.current.contains(e.target as Node)) {
        setCatMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [catMenuOpen]);

  /* ── helpers ─────────────────────────────────────────────────────────── */
  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const openSearch = () => {
    window.dispatchEvent(
      new KeyboardEvent("keydown", { key: "k", ctrlKey: true, bubbles: true })
    );
  };

  return (
    <>
      {/* ── Main header bar ─────────────────────────────────────────────── */}
      <header
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          height: "64px",
          display: "flex",
          alignItems: "center",
          transition: "background 300ms, border-color 300ms, box-shadow 300ms",
          background: scrolled ? "rgba(10,10,15,0.88)" : "transparent",
          backdropFilter: scrolled ? "blur(20px)" : "none",
          WebkitBackdropFilter: scrolled ? "blur(20px)" : "none",
          borderBottom: scrolled
            ? "1px solid var(--color-border)"
            : "1px solid transparent",
          boxShadow: scrolled ? "0 2px 24px rgba(0,0,0,0.45)" : "none",
        }}
      >
        <div
          className="container"
          style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}
        >
          {/* ── Logo ────────────────────────────────────────────────────── */}
          <Link
            href="/"
            style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "10px" }}
          >
            <HelixLogo />
            <span
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: "1.25rem",
                background: "linear-gradient(135deg, #a78bfa 0%, #6E56CF 60%, #3B82F6 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              ToolHelix
            </span>
          </Link>

          {/* ── Desktop nav ─────────────────────────────────────────────── */}
          <nav
            className="desktop-nav"
            style={{ display: "flex", alignItems: "center", gap: "2px" }}
          >
            <Link href="/tools" className={`nav-link ${isActive("/tools") ? "active" : ""}`}>
              All Tools
            </Link>

            {/* Categories dropdown */}
            <div ref={catRef} style={{ position: "relative" }}>
              <button
                onClick={() => setCatMenuOpen(!catMenuOpen)}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "4px",
                  fontFamily: "var(--font-display)",
                  fontWeight: 500,
                  fontSize: "0.9rem",
                  color: pathname.startsWith("/tools/") && pathname !== "/tools"
                    ? "var(--color-accent)"
                    : "var(--color-text-muted)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: "var(--space-2) var(--space-3)",
                  borderRadius: "var(--radius-sm)",
                  transition: "color 150ms, background 150ms",
                }}
                className="cat-dropdown-btn"
              >
                Categories
                <span
                  style={{
                    fontSize: "0.65rem",
                    transition: "transform 200ms",
                    transform: catMenuOpen ? "rotate(180deg)" : "rotate(0deg)",
                    display: "inline-block",
                  }}
                >
                  ▾
                </span>
              </button>

              {/* Dropdown panel */}
              {catMenuOpen && (
                <div
                  style={{
                    position: "absolute",
                    top: "calc(100% + 8px)",
                    left: "50%",
                    transform: "translateX(-50%)",
                    background: "var(--color-surface-2)",
                    border: "1px solid var(--color-border-light)",
                    borderRadius: "var(--radius-lg)",
                    boxShadow: "var(--shadow-lg), var(--shadow-glow)",
                    padding: "8px",
                    minWidth: "220px",
                    zIndex: 200,
                    animation: "scale-in 150ms var(--ease-spring)",
                  }}
                >
                  {CATEGORIES.map((cat) => (
                    <Link
                      key={cat.id}
                      href={`/tools/${cat.id}`}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        padding: "10px 12px",
                        borderRadius: "var(--radius-md)",
                        textDecoration: "none",
                        color: pathname.startsWith(`/tools/${cat.id}`)
                          ? cat.color
                          : "var(--color-text-muted)",
                        background: pathname.startsWith(`/tools/${cat.id}`)
                          ? `${cat.color}12`
                          : "transparent",
                        transition: "background 150ms, color 150ms",
                        fontFamily: "var(--font-display)",
                        fontWeight: 500,
                        fontSize: "0.88rem",
                      }}
                      className="cat-item"
                    >
                      <span
                        style={{
                          width: "30px",
                          height: "30px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          background: `${cat.color}18`,
                          borderRadius: "var(--radius-sm)",
                          fontSize: "1rem",
                          flexShrink: 0,
                        }}
                      >
                        {cat.icon}
                      </span>
                      <div>
                        <div>{cat.name}</div>
                        <div style={{ fontSize: "0.72rem", color: "var(--color-text-faint)", fontWeight: 400 }}>
                          {cat.description.slice(0, 40)}…
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link href="/blog" className={`nav-link ${isActive("/blog") ? "active" : ""}`}>
              Blog
            </Link>
            <Link href="/about" className={`nav-link ${isActive("/about") ? "active" : ""}`}>
              About
            </Link>
          </nav>

          {/* ── Right: search + mobile toggle ──────────────────────────── */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            {/* Search pill */}
            <button
              onClick={openSearch}
              className="search-btn"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                background: "var(--color-surface-2)",
                border: "1px solid var(--color-border)",
                borderRadius: "var(--radius-md)",
                padding: "6px 12px",
                cursor: "pointer",
                color: "var(--color-text-muted)",
                fontSize: "0.82rem",
                fontFamily: "var(--font-display)",
                transition: "border-color 200ms, box-shadow 200ms, color 200ms",
              }}
              aria-label="Open search (Ctrl+K)"
            >
              <span style={{ fontSize: "0.9rem" }}>⌕</span>
              <span className="search-label">Search</span>
              <kbd
                style={{
                  background: "var(--color-border)",
                  padding: "1px 5px",
                  borderRadius: "3px",
                  fontSize: "0.68rem",
                  fontFamily: "var(--font-mono)",
                  color: "var(--color-text-faint)",
                }}
              >
                ⌘K
              </kbd>
            </button>

            {/* Mobile hamburger */}
            <button
              className="mobile-menu-btn"
              onClick={() => setMobileOpen(!mobileOpen)}
              style={{
                background: "var(--color-surface-2)",
                border: "1px solid var(--color-border)",
                borderRadius: "var(--radius-md)",
                cursor: "pointer",
                color: "var(--color-text)",
                padding: "7px 10px",
                fontSize: "1rem",
                lineHeight: 1,
                transition: "background 200ms",
              }}
              aria-label="Toggle menu"
              aria-expanded={mobileOpen}
            >
              <span
                style={{
                  display: "block",
                  transition: "transform 200ms, opacity 200ms",
                }}
              >
                {mobileOpen ? "✕" : "☰"}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* ── Mobile drawer ────────────────────────────────────────────────── */}
      <div
        style={{
          position: "fixed",
          top: "64px",
          left: 0,
          right: 0,
          background: "rgba(17,17,24,0.97)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderBottom: "1px solid var(--color-border)",
          zIndex: 99,
          overflow: "hidden",
          maxHeight: mobileOpen ? "90vh" : "0",
          transition: "max-height 350ms cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        <div style={{ padding: "16px", display: "flex", flexDirection: "column", gap: "4px" }}>
          {/* Primary links */}
          <div
            style={{
              paddingBottom: "12px",
              borderBottom: "1px solid var(--color-border)",
              marginBottom: "8px",
            }}
          >
            <Link
              href="/tools"
              className="nav-link"
              style={{ display: "flex", padding: "12px 16px", fontSize: "1rem" }}
            >
              🛠 All Tools
            </Link>
            <Link
              href="/blog"
              className="nav-link"
              style={{ display: "flex", padding: "12px 16px", fontSize: "1rem" }}
            >
              📝 Blog
            </Link>
            <Link
              href="/about"
              className="nav-link"
              style={{ display: "flex", padding: "12px 16px", fontSize: "1rem" }}
            >
              ℹ️ About
            </Link>
          </div>

          {/* Categories */}
          <div
            style={{
              fontSize: "0.72rem",
              fontWeight: 600,
              color: "var(--color-text-faint)",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              padding: "0 16px 8px",
            }}
          >
            Categories
          </div>
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.id}
              href={`/tools/${cat.id}`}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "10px 16px",
                borderRadius: "var(--radius-md)",
                textDecoration: "none",
                color: "var(--color-text-muted)",
                fontFamily: "var(--font-display)",
                fontWeight: 500,
                fontSize: "0.9rem",
                transition: "background 150ms, color 150ms",
              }}
              className="mobile-cat-item"
            >
              <span
                style={{
                  width: "28px",
                  height: "28px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: `${cat.color}18`,
                  borderRadius: "var(--radius-sm)",
                  fontSize: "0.95rem",
                }}
              >
                {cat.icon}
              </span>
              {cat.name}
            </Link>
          ))}

          {/* Search shortcut */}
          <button
            onClick={() => { setMobileOpen(false); openSearch(); }}
            style={{
              marginTop: "12px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "12px 16px",
              background: "var(--color-surface-2)",
              border: "1px solid var(--color-border)",
              borderRadius: "var(--radius-md)",
              cursor: "pointer",
              color: "var(--color-text-muted)",
              fontFamily: "var(--font-display)",
              fontSize: "0.9rem",
              width: "100%",
            }}
          >
            <span>⌕</span>
            <span>Search all tools…</span>
          </button>
        </div>
      </div>

      {/* ── Backdrop (mobile) ────────────────────────────────────────────── */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            top: "64px",
            background: "rgba(0,0,0,0.5)",
            zIndex: 98,
            animation: "fade-in 200ms ease",
          }}
        />
      )}

      {/* ── Spacer ──────────────────────────────────────────────────────── */}
      <div style={{ height: "64px" }} />

      <style>{`
        @media (max-width: 900px) {
          .desktop-nav { display: none !important; }
          .search-label { display: none !important; }
        }
        @media (min-width: 901px) {
          .mobile-menu-btn { display: none !important; }
        }
        .search-btn:hover {
          border-color: var(--color-accent) !important;
          color: var(--color-text) !important;
          box-shadow: 0 0 0 3px var(--color-accent-subtle) !important;
        }
        .cat-dropdown-btn:hover { background: var(--color-surface-2) !important; color: var(--color-text) !important; }
        .cat-item:hover { background: var(--color-accent-subtle) !important; color: var(--color-accent) !important; }
        .mobile-cat-item:hover { background: var(--color-surface-2) !important; color: var(--color-text) !important; }
      `}</style>
    </>
  );
}

function HelixLogo() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="hg" x1="0" y1="0" x2="28" y2="28" gradientUnits="userSpaceOnUse">
          <stop offset="0%"   stopColor="#a78bfa" />
          <stop offset="50%"  stopColor="#6E56CF" />
          <stop offset="100%" stopColor="#3B82F6" />
        </linearGradient>
      </defs>
      <path d="M7 4 C7 4, 21 8, 21 14 C21 20, 7 24, 7 24"   stroke="url(#hg)" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <path d="M21 4 C21 4, 7 8, 7 14 C7 20, 21 24, 21 24"  stroke="url(#hg)" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.6" />
      <line x1="10" y1="9.5"  x2="18" y2="10.5" stroke="url(#hg)" strokeWidth="1.5" strokeLinecap="round" opacity="0.8" />
      <line x1="10" y1="14"   x2="18" y2="14"   stroke="url(#hg)" strokeWidth="1.5" strokeLinecap="round" opacity="0.8" />
      <line x1="10" y1="18.5" x2="18" y2="17.5" stroke="url(#hg)" strokeWidth="1.5" strokeLinecap="round" opacity="0.8" />
    </svg>
  );
}
