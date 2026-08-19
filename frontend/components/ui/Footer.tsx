import Link from "next/link";
import { CATEGORIES, TOOLS } from "@/lib/tools";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer style={{
      background: "var(--color-surface)",
      borderTop: "1px solid var(--color-border)",
      marginTop: "auto",
    }}>
      <div className="container" style={{ padding: "48px 24px 32px" }}>

        {/* Top: logo + tagline */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr auto",
          gap: "32px",
          marginBottom: "48px",
          alignItems: "start",
        }}>
          <div>
            <Link href="/" style={{ textDecoration: "none" }}>
              <span style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: "1.4rem",
                background: "linear-gradient(135deg, #a78bfa 0%, #6E56CF 60%, #3B82F6 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}>
                ToolHelix
              </span>
            </Link>
            <p style={{ color: "var(--color-text-muted)", marginTop: "8px", maxWidth: "320px", fontSize: "0.9rem", lineHeight: 1.6 }}>
              One destination for fast, free, well-designed tools. No clutter, no bloat, instant results.
            </p>
          </div>
          <div style={{ display: "flex", gap: "12px" }}>
            <Link href="/tools" className="btn btn-primary btn-sm">Browse All Tools →</Link>
          </div>
        </div>

        {/* Category sitemap grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
          gap: "32px",
          marginBottom: "48px",
        }}>
          {CATEGORIES.map((cat) => {
            const catTools = TOOLS.filter((t) => t.category === cat.id);
            return (
              <div key={cat.id}>
                <Link
                  href={`/tools/${cat.id}`}
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 600,
                    fontSize: "0.85rem",
                    color: cat.color,
                    textDecoration: "none",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    marginBottom: "12px",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  {cat.icon} {cat.name}
                </Link>
                <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "6px" }}>
                  {catTools.map((tool) => (
                    <li key={tool.id}>
                      <Link
                        href={`/tools/${cat.id}/${tool.slug}`}
                        style={{
                          color: "var(--color-text-muted)",
                          textDecoration: "none",
                          fontSize: "0.85rem",
                          transition: "color 150ms",
                        }}
                        className="footer-link"
                      >
                        {tool.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}

          {/* Extra column: Pages */}
          <div>
            <span style={{
              fontFamily: "var(--font-display)",
              fontWeight: 600,
              fontSize: "0.85rem",
              color: "var(--color-text-muted)",
              display: "block",
              marginBottom: "12px",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}>
              Pages
            </span>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "6px" }}>
              {[
                { label: "Blog", href: "/blog" },
                { label: "About", href: "/about" },
                { label: "Changelog", href: "/changelog" },
                { label: "Contact", href: "/contact" },
                { label: "Privacy Policy", href: "/privacy" },
                { label: "Terms of Use", href: "/terms" },
              ].map(({ label, href }) => (
                <li key={href}>
                  <Link href={href} style={{ color: "var(--color-text-muted)", textDecoration: "none", fontSize: "0.85rem" }} className="footer-link">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{
          borderTop: "1px solid var(--color-border)",
          paddingTop: "24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "12px",
        }}>
          <p style={{ color: "var(--color-text-faint)", fontSize: "0.8rem" }}>
            © {year} ToolHelix. All tools are free to use.
          </p>
          <p style={{ color: "var(--color-text-faint)", fontSize: "0.8rem" }}>
            Built with ❤️ — no ads, no tracking, no sign-up required.
          </p>
        </div>
      </div>

      <style>{`
        .footer-link:hover { color: var(--color-text) !important; }
      `}</style>
    </footer>
  );
}
