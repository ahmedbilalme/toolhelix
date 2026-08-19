import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumb from "@/components/ui/Breadcrumb";

export const metadata: Metadata = {
  title: "About ToolHelix — Our Mission",
  description: "ToolHelix is a free collection of web tools built for developers, designers, and everyone who values their time. Learn about our mission.",
};

export default function AboutPage() {
  return (
    <>
      <section style={{ padding: "48px 0 40px", borderBottom: "1px solid var(--color-border)" }}>
        <div className="container" style={{ maxWidth: "800px" }}>
          <Breadcrumb crumbs={[{ label: "Home", href: "/" }, { label: "About" }]} />
          <span className="badge badge-violet" style={{ marginBottom: "12px" }}>About</span>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.8rem, 4vw, 2.8rem)", marginBottom: "12px" }}>
            Many tools, one platform.
          </h1>
        </div>
      </section>

      <section style={{ padding: "48px 0 80px" }}>
        <div className="container" style={{ maxWidth: "800px" }}>
          <div className="card" style={{ lineHeight: 1.9, fontSize: "0.95rem", color: "var(--color-text-muted)" }}>
            <p>
              <strong style={{ color: "var(--color-text)" }}>ToolHelix started with a simple frustration:</strong> every time we needed a quick tool, we'd land on a page cluttered with ads, forced sign-ups, or broken features. We built ToolHelix to be everything those sites aren't.
            </p>
            <p>
              A helix is individual strands woven into one stronger structure. That's the idea — many different tools, one cohesive platform. Whether you're a developer formatting JSON at midnight or a marketer compressing images before a deadline, ToolHelix is built to get out of your way and get the job done.
            </p>
            <h2 style={{ fontFamily: "var(--font-display)", color: "var(--color-text)", fontSize: "1.3rem", marginTop: "32px" }}>What we stand for</h2>
            <ul style={{ paddingLeft: "20px", display: "flex", flexDirection: "column", gap: "10px" }}>
              <li><strong style={{ color: "var(--color-text)" }}>Zero friction.</strong> No account required. No paywalls on core features. Every tool, every time.</li>
              <li><strong style={{ color: "var(--color-text)" }}>Privacy first.</strong> Files processed server-side are never stored. Most tools run entirely in your browser.</li>
              <li><strong style={{ color: "var(--color-text)" }}>Quality over quantity.</strong> We'd rather have 20 excellent tools than 200 mediocre ones.</li>
              <li><strong style={{ color: "var(--color-text)" }}>Constantly improving.</strong> Check the <Link href="/changelog" style={{ color: "var(--color-accent)" }}>changelog</Link> — we ship new tools and improvements regularly.</li>
            </ul>

            <div style={{ marginTop: "40px", padding: "24px", background: "var(--color-surface-2)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-lg)", textAlign: "center" }}>
              <p style={{ margin: "0 0 16px", fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "1rem", color: "var(--color-text)" }}>
                Want to suggest a tool or report a bug?
              </p>
              <Link href="/contact" className="btn btn-primary btn-md">Get in touch →</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
