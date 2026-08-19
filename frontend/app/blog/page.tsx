import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumb from "@/components/ui/Breadcrumb";
import ToolCard from "@/components/ui/ToolCard";
import { TOOLS } from "@/lib/tools";

export const metadata: Metadata = {
  title: "Blog — Guides, Tips & Tool Comparisons",
  description: "In-depth guides, tool comparisons, and productivity tips from the ToolHelix team.",
};

const POSTS = [
  {
    slug: "best-developer-tools-2024",
    title: "The Best Free Developer Tools in 2024",
    excerpt: "A curated breakdown of the most useful browser-based dev utilities — from JSON formatters to regex testers — and when to reach for each one.",
    date: "2024-12-10",
    readTime: "6 min",
    category: "Developer Tools",
    tools: ["json-formatter", "regex-tester", "base64"],
  },
  {
    slug: "image-format-guide",
    title: "JPEG vs PNG vs WEBP: Which Format Should You Use?",
    excerpt: "A no-fluff comparison of the three most common image formats — when each shines, when it fails, and how to convert between them for free.",
    date: "2024-12-05",
    readTime: "5 min",
    category: "Image Tools",
    tools: ["image-format-converter", "image-compressor"],
  },
  {
    slug: "password-security-guide",
    title: "Password Security: How Strong is Strong Enough?",
    excerpt: "What actually makes a password hard to crack — length, character sets, or randomness? Plus: how to generate and manage them without losing your mind.",
    date: "2024-11-28",
    readTime: "7 min",
    category: "Security",
    tools: ["password-generator"],
  },
];

export default function BlogPage() {
  return (
    <>
      <section style={{ padding: "48px 0 40px", borderBottom: "1px solid var(--color-border)" }}>
        <div className="container">
          <Breadcrumb crumbs={[{ label: "Home", href: "/" }, { label: "Blog" }]} />
          <span className="badge badge-blue" style={{ marginBottom: "12px" }}>📝 Blog</span>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.8rem, 4vw, 2.8rem)", marginBottom: "12px" }}>
            Guides & insights
          </h1>
          <p style={{ color: "var(--color-text-muted)", fontSize: "1rem", maxWidth: "560px" }}>
            Practical guides on productivity, development, and getting more out of digital tools. Written by humans, for humans.
          </p>
        </div>
      </section>

      <section style={{ padding: "48px 0 80px" }}>
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "24px" }}>
            {POSTS.map((post, i) => {
              const relatedTools = post.tools.map((id) => TOOLS.find((t) => t.id === id)).filter(Boolean);
              return (
                <article
                  key={post.slug}
                  className="card animate-slide-up"
                  style={{ display: "flex", flexDirection: "column", gap: "12px", animationDelay: `${i * 80}ms` }}
                >
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span className="badge badge-blue">{post.category}</span>
                    <span style={{ fontSize: "0.75rem", color: "var(--color-text-faint)" }}>
                      {new Date(post.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })} · {post.readTime} read
                    </span>
                  </div>
                  <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.1rem", margin: 0 }}>
                    <Link href={`/blog/${post.slug}`} style={{ color: "inherit", textDecoration: "none" }}>
                      {post.title}
                    </Link>
                  </h2>
                  <p style={{ color: "var(--color-text-muted)", fontSize: "0.875rem", margin: 0, lineHeight: 1.6, flex: 1 }}>
                    {post.excerpt}
                  </p>
                  {relatedTools.length > 0 && (
                    <div style={{ borderTop: "1px solid var(--color-border)", paddingTop: "12px" }}>
                      <div style={{ fontSize: "0.72rem", color: "var(--color-text-faint)", marginBottom: "6px" }}>TOOLS IN THIS POST</div>
                      <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                        {relatedTools.map((t) => t && (
                          <Link key={t.id} href={`/tools/${t.category}/${t.slug}`} style={{
                            fontSize: "0.75rem",
                            color: "var(--color-accent)",
                            textDecoration: "none",
                            background: "var(--color-accent-subtle)",
                            border: "1px solid rgba(110,86,207,0.2)",
                            borderRadius: "var(--radius-full)",
                            padding: "2px 10px",
                          }}>
                            {t.icon} {t.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                  <Link href={`/blog/${post.slug}`} className="btn btn-secondary btn-sm" style={{ alignSelf: "flex-start" }}>
                    Read article →
                  </Link>
                </article>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
