import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { TOOLS } from "@/lib/tools";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ slug: string }>;
}

const POSTS: Record<string, {
  title: string;
  description: string;
  date: string;
  readTime: string;
  category: string;
  content: React.ReactNode;
  relatedTools: string[];
}> = {
  "best-developer-tools-2024": {
    title: "The Best Free Developer Tools in 2024",
    description: "A curated breakdown of the most useful browser-based dev utilities — from JSON formatters to regex testers — and when to reach for each one.",
    date: "2024-12-10",
    readTime: "6 min",
    category: "Developer Tools",
    relatedTools: ["json-formatter", "regex-tester", "base64", "code-diff"],
    content: (
      <>
        <p>The best developer tools are the ones that disappear. You paste some JSON, it formats instantly, and you move on. No account, no loading screen, no 12-step wizard.</p>
        <p>Here are the tools we reach for most — and the specific scenarios where each one earns its keep.</p>
        <h2>JSON Formatter & Validator</h2>
        <p>When an API returns a wall of minified JSON, your first instinct is to paste it somewhere readable. A good formatter handles malformed JSON gracefully — telling you exactly which line and column has the error, not just "invalid JSON."</p>
        <p>Our JSON Formatter also lets you sort keys alphabetically (useful when comparing two responses) and minify back to one line when you need to copy a payload into a curl command.</p>
        <h2>Regex Tester</h2>
        <p>Regular expressions are one of those things that look simple until you actually need to write one. A live tester that highlights matches as you type — with support for capture groups and all flags — cuts the feedback loop from minutes to seconds.</p>
        <h2>Base64 Encoder / Decoder</h2>
        <p>More common than you'd think: auth headers, data URIs, JWT payloads. Being able to decode a Base64 string without leaving the browser is a small thing that saves real time.</p>
        <h2>Code Diff Checker</h2>
        <p>Paste two versions of a config file or function and see exactly what changed — line by line, color-coded. Particularly useful when reviewing changes in environments without git access.</p>
      </>
    ),
  },
  "image-format-guide": {
    title: "JPEG vs PNG vs WEBP: Which Format Should You Use?",
    description: "A no-fluff comparison of the three most common image formats — when each shines, when it fails, and how to convert between them for free.",
    date: "2024-12-05",
    readTime: "5 min",
    category: "Image Tools",
    relatedTools: ["image-format-converter", "image-compressor", "image-resizer"],
    content: (
      <>
        <p>Choosing the wrong image format is one of the easiest ways to make a fast site slow. Here's the quick version of what you need to know.</p>
        <h2>JPEG — for photos</h2>
        <p>JPEG uses lossy compression, which means it throws away data you're unlikely to notice. This makes it excellent for photographs with smooth color gradients. Terrible for screenshots, logos, or anything with sharp edges — those get blocky artifacts fast.</p>
        <p>Use JPEG when: photos, product images, anything with rich color and no transparency needed.</p>
        <h2>PNG — for graphics</h2>
        <p>PNG is lossless and supports full transparency (alpha channel). It's larger than JPEG for photos, but smaller and sharper for logos, icons, screenshots, and any image with text.</p>
        <p>Use PNG when: logos, icons, screenshots, images that need transparency.</p>
        <h2>WEBP — for web</h2>
        <p>WEBP is Google's format designed to replace both JPEG and PNG. It produces files roughly 25–35% smaller than JPEG at equivalent quality, and it supports transparency. Browser support is now near-universal.</p>
        <p>Use WEBP when: you're optimizing for web performance and can control the serving environment.</p>
        <h2>How to convert</h2>
        <p>Our Image Format Converter handles all three (plus GIF, BMP, and TIFF). Upload, pick your target format, download. No quality slider needed — we handle the sensible defaults.</p>
      </>
    ),
  },
  "password-security-guide": {
    title: "Password Security: How Strong is Strong Enough?",
    description: "What actually makes a password hard to crack — length, character sets, or randomness? Plus: how to generate and manage them without losing your mind.",
    date: "2024-11-28",
    readTime: "7 min",
    category: "Security",
    relatedTools: ["password-generator", "base64"],
    content: (
      <>
        <p>Most password advice is either too vague ("use a strong password") or too paranoid ("change it every 90 days"). Here's what the math actually says.</p>
        <h2>Length matters more than complexity</h2>
        <p>A 20-character lowercase-only password has more entropy than a 10-character password with uppercase, numbers, and symbols. The math: 26^20 = ~2 × 10^28 vs 94^10 = ~5 × 10^19. Length wins by an order of magnitude.</p>
        <p>The practical rule: aim for 16+ characters. Beyond that, you're firmly into "will never be cracked by brute force in the lifetime of the universe" territory.</p>
        <h2>Randomness is non-negotiable</h2>
        <p>The flaw in most human-chosen passwords isn't length — it's predictability. People pick words, dates, and names. Attackers use dictionaries. Our Password Generator uses the Web Crypto API, which is the same randomness source used in cryptographic applications. Nothing about the output is predictable.</p>
        <h2>Character sets: add them, but don't obsess</h2>
        <p>Adding symbols and numbers to a password does increase its entropy — but if you're already at 20+ random characters, the marginal gain is small. Symbols matter more for shorter passwords where every bit of entropy counts.</p>
        <h2>What this means in practice</h2>
        <ul>
          <li>Use a password manager. This solves the "can't remember 50 unique passwords" problem.</li>
          <li>Generate random passwords. Never compose them yourself.</li>
          <li>Use 16+ characters for anything that matters.</li>
          <li>Enable 2FA wherever possible — it's the single biggest security upgrade available.</li>
        </ul>
      </>
    ),
  },
};

export async function generateStaticParams() {
  return Object.keys(POSTS).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = POSTS[slug];
  if (!post) return {};
  return {
    title: post.title,
    description: post.description,
    openGraph: { title: post.title, description: post.description, type: "article" },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = POSTS[slug];
  if (!post) notFound();

  const relatedTools = post.relatedTools
    .map((id) => TOOLS.find((t) => t.id === id))
    .filter(Boolean);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    publisher: { "@type": "Organization", name: "ToolHelix", url: "https://toolhelix.com" },
    url: `https://toolhelix.com/blog/${slug}`,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <section style={{ padding: "48px 0 40px", borderBottom: "1px solid var(--color-border)" }}>
        <div className="container" style={{ maxWidth: "720px" }}>
          <Breadcrumb crumbs={[
            { label: "Home", href: "/" },
            { label: "Blog", href: "/blog" },
            { label: post.title },
          ]} />
          <span className="badge badge-blue" style={{ marginBottom: "12px" }}>{post.category}</span>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.6rem, 4vw, 2.4rem)", marginBottom: "12px", lineHeight: 1.2 }}>
            {post.title}
          </h1>
          <p style={{ color: "var(--color-text-muted)", fontSize: "0.85rem" }}>
            {new Date(post.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })} · {post.readTime} read
          </p>
        </div>
      </section>

      <section style={{ padding: "48px 0 80px" }}>
        <div className="container" style={{ maxWidth: "720px" }}>
          {/* Article body */}
          <div style={{
            lineHeight: 1.9,
            fontSize: "0.95rem",
            color: "var(--color-text-muted)",
          }}>
            <style>{`
              .article-body h2 { font-family: var(--font-display); font-size: 1.3rem; font-weight: 700; color: var(--color-text); margin: 40px 0 12px; }
              .article-body p { margin: 0 0 20px; }
              .article-body ul { padding-left: 20px; margin-bottom: 20px; }
              .article-body li { margin-bottom: 8px; }
              .article-body strong { color: var(--color-text); }
            `}</style>
            <div className="article-body">
              {post.content}
            </div>
          </div>

          {/* Related tools */}
          {relatedTools.length > 0 && (
            <div style={{ marginTop: "48px", padding: "24px", background: "var(--color-surface)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-lg)" }}>
              <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1rem", marginTop: 0, marginBottom: "16px" }}>
                Tools mentioned in this article
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {relatedTools.map((tool) => tool && (
                  <Link
                    key={tool.id}
                    href={`/tools/${tool.category}/${tool.slug}`}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      padding: "12px",
                      background: "var(--color-base)",
                      border: "1px solid var(--color-border)",
                      borderRadius: "var(--radius-md)",
                      textDecoration: "none",
                      color: "inherit",
                      transition: "border-color 150ms",
                    }}
                    className="tool-ref-link"
                  >
                    <span style={{ fontSize: "1.4rem" }}>{tool.icon}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "0.88rem" }}>{tool.name}</div>
                      <div style={{ color: "var(--color-text-muted)", fontSize: "0.78rem" }}>{tool.description}</div>
                    </div>
                    <span style={{ color: "var(--color-accent)" }}>→</span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          <style>{`.tool-ref-link:hover { border-color: var(--color-accent) !important; }`}</style>

          <div style={{ marginTop: "32px", textAlign: "center" }}>
            <Link href="/blog" className="btn btn-secondary btn-md">← Back to Blog</Link>
          </div>
        </div>
      </section>
    </>
  );
}
