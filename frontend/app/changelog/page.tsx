import type { Metadata } from "next";
import Breadcrumb from "@/components/ui/Breadcrumb";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Changelog — New Tools & Updates",
  description: "See what's new on ToolHelix — new tools, improvements, and bug fixes.",
};

const ENTRIES = [
  {
    version: "v1.2",
    date: "2024-12-10",
    items: [
      { type: "new", text: "QR Code Generator — custom colors, size, and error correction" },
      { type: "new", text: "Color Palette Generator — 5 harmony modes" },
      { type: "new", text: "Image Resizer — with aspect ratio lock and quick presets" },
      { type: "new", text: "Code Diff Checker — side-by-side unified diff" },
    ],
  },
  {
    version: "v1.1",
    date: "2024-11-20",
    items: [
      { type: "new", text: "BMI Calculator — metric & imperial, visual scale indicator" },
      { type: "new", text: "Text Comparer — word-by-word diff highlighting" },
      { type: "improve", text: "JSON Formatter — added key sorting and minify button" },
      { type: "fix", text: "Image Compressor — fixed RGBA→RGB conversion for JPEG output" },
    ],
  },
  {
    version: "v1.0",
    date: "2024-11-01",
    items: [
      { type: "new", text: "Launch! 16 tools across 6 categories" },
      { type: "new", text: "Command palette (⌘K) for fast tool search" },
      { type: "new", text: "Dark-mode-first design with violet accent" },
    ],
  },
];

const TYPE_STYLES: Record<string, { label: string; class: string }> = {
  new:     { label: "New",     class: "badge-green"  },
  improve: { label: "Improved", class: "badge-blue"  },
  fix:     { label: "Fix",     class: "badge-orange" },
};

export default function ChangelogPage() {
  return (
    <>
      <section style={{ padding: "48px 0 40px", borderBottom: "1px solid var(--color-border)" }}>
        <div className="container" style={{ maxWidth: "720px" }}>
          <Breadcrumb crumbs={[{ label: "Home", href: "/" }, { label: "Changelog" }]} />
          <span className="badge badge-green" style={{ marginBottom: "12px" }}>📋 Changelog</span>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.8rem, 4vw, 2.8rem)", marginBottom: "12px" }}>
            What&apos;s new in ToolHelix
          </h1>
          <p style={{ color: "var(--color-text-muted)", fontSize: "1rem" }}>
            We ship tools and improvements regularly. This is the full log.
          </p>
        </div>
      </section>

      <section style={{ padding: "48px 0 80px" }}>
        <div className="container" style={{ maxWidth: "720px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "40px" }}>
            {ENTRIES.map((entry) => (
              <div key={entry.version}>
                <div style={{ display: "flex", alignItems: "baseline", gap: "16px", marginBottom: "16px" }}>
                  <span style={{ fontFamily: "var(--font-mono)", fontWeight: 700, color: "var(--color-accent)", fontSize: "1rem" }}>{entry.version}</span>
                  <span style={{ color: "var(--color-text-faint)", fontSize: "0.82rem" }}>
                    {new Date(entry.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                  </span>
                </div>
                <div style={{ borderLeft: "2px solid var(--color-border)", paddingLeft: "20px", display: "flex", flexDirection: "column", gap: "10px" }}>
                  {entry.items.map((item, i) => (
                    <div key={i} style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
                      <span className={`badge ${TYPE_STYLES[item.type].class}`} style={{ flexShrink: 0, marginTop: "1px" }}>
                        {TYPE_STYLES[item.type].label}
                      </span>
                      <span style={{ fontSize: "0.9rem", color: "var(--color-text-muted)", lineHeight: 1.5 }}>{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: "48px", padding: "24px", background: "var(--color-surface)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-lg)", textAlign: "center" }}>
            <p style={{ margin: "0 0 8px", fontFamily: "var(--font-display)", fontWeight: 600, color: "var(--color-text)" }}>
              Want to suggest a tool?
            </p>
            <p style={{ color: "var(--color-text-muted)", fontSize: "0.88rem", marginBottom: "16px" }}>We&apos;re always looking for what to build next.</p>
            <Link href="/contact" className="btn btn-primary btn-md">Send a suggestion →</Link>
          </div>
        </div>
      </section>
    </>
  );
}
