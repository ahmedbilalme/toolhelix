import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Breadcrumb from "@/components/ui/Breadcrumb";
import ToolCard from "@/components/ui/ToolCard";
import {
  TOOLS,
  getToolBySlug,
  getCategoryById,
  getRelatedTools,
  type CategoryId,
} from "@/lib/tools";

// Tool components (lazy-loaded per tool)
import ImageFormatConverter from "@/components/tools/ImageFormatConverter";
import UnitConverter from "@/components/tools/UnitConverter";
import CurrencyConverter from "@/components/tools/CurrencyConverter";
import PasswordGenerator from "@/components/tools/PasswordGenerator";
import QRCodeGenerator from "@/components/tools/QRCodeGenerator";
import LoremIpsumGenerator from "@/components/tools/LoremIpsumGenerator";
import ColorPaletteGenerator from "@/components/tools/ColorPaletteGenerator";
import LoanCalculator from "@/components/tools/LoanCalculator";
import BMICalculator from "@/components/tools/BMICalculator";
import PercentageCalculator from "@/components/tools/PercentageCalculator";
import JSONFormatter from "@/components/tools/JSONFormatter";
import RegexTester from "@/components/tools/RegexTester";
import Base64Tool from "@/components/tools/Base64Tool";
import CodeDiff from "@/components/tools/CodeDiff";
import WordCounter from "@/components/tools/WordCounter";
import CaseConverter from "@/components/tools/CaseConverter";
import TextComparer from "@/components/tools/TextComparer";
import ImageCompressor from "@/components/tools/ImageCompressor";
import ImageResizer from "@/components/tools/ImageResizer";

interface Props {
  params: Promise<{ category: string; tool: string }>;
}

const TOOL_COMPONENTS: Record<string, React.ComponentType> = {
  "image-format-converter": ImageFormatConverter,
  "unit-converter": UnitConverter,
  "currency-converter": CurrencyConverter,
  "password-generator": PasswordGenerator,
  "qr-code-generator": QRCodeGenerator,
  "lorem-ipsum-generator": LoremIpsumGenerator,
  "color-palette-generator": ColorPaletteGenerator,
  "loan-calculator": LoanCalculator,
  "bmi-calculator": BMICalculator,
  "percentage-calculator": PercentageCalculator,
  "json-formatter": JSONFormatter,
  "regex-tester": RegexTester,
  "base64": Base64Tool,
  "code-diff": CodeDiff,
  "word-counter": WordCounter,
  "case-converter": CaseConverter,
  "text-comparer": TextComparer,
  "image-compressor": ImageCompressor,
  "image-resizer": ImageResizer,
};

export async function generateStaticParams() {
  return TOOLS.map((t) => ({ category: t.category, tool: t.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { tool: toolSlug, category } = await params;
  const tool = getToolBySlug(toolSlug);
  if (!tool) return {};
  const cat = getCategoryById(category as CategoryId);

  return {
    title: `${tool.name} — Free Online Tool | ${cat?.name ?? "ToolHelix"}`,
    description: tool.longDescription,
    keywords: tool.keywords,
    openGraph: {
      title: `${tool.name} | ToolHelix`,
      description: tool.description,
      type: "website",
      url: `https://toolhelix.com/tools/${category}/${toolSlug}`,
    },
    alternates: {
      canonical: `https://toolhelix.com/tools/${category}/${toolSlug}`,
    },
  };
}

export default async function ToolPage({ params }: Props) {
  const { tool: toolSlug, category } = await params;
  const tool = getToolBySlug(toolSlug);
  if (!tool || tool.category !== category) notFound();

  const cat = getCategoryById(category as CategoryId);
  const relatedTools = getRelatedTools(tool.id, 4);
  const ToolComponent = TOOL_COMPONENTS[tool.id];

  // JSON-LD: WebApplication schema
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: tool.name,
    description: tool.longDescription,
    url: `https://toolhelix.com/tools/${category}/${toolSlug}`,
    applicationCategory: "UtilityApplication",
    operatingSystem: "Any",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    provider: { "@type": "Organization", name: "ToolHelix", url: "https://toolhelix.com" },
  };

  // JSON-LD: FAQPage schema
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: tool.faq.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {tool.faq.length > 0 && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      )}

      {/* Tool header */}
      <section style={{ padding: "40px 0 32px", borderBottom: "1px solid var(--color-border)" }}>
        <div className="container">
          <Breadcrumb crumbs={[
            { label: "Home", href: "/" },
            { label: "Tools", href: "/tools" },
            { label: cat?.name ?? category, href: `/tools/${category}` },
            { label: tool.name },
          ]} />

          <div style={{ display: "flex", alignItems: "flex-start", gap: "20px", flexWrap: "wrap" }}>
            <div style={{
              width: "60px",
              height: "60px",
              background: `${cat?.color ?? "var(--color-accent)"}18`,
              border: `1px solid ${cat?.color ?? "var(--color-accent)"}40`,
              borderRadius: "var(--radius-lg)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.6rem",
              flexShrink: 0,
            }}>
              {tool.icon}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px", flexWrap: "wrap" }}>
                <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.4rem, 4vw, 2rem)", margin: 0 }}>
                  {tool.name}
                </h1>
                {tool.isNew && <span className="badge badge-blue">New</span>}
                {tool.isFeatured && <span className="badge badge-violet">Popular</span>}
              </div>
              <p style={{ color: "var(--color-text-muted)", margin: 0, fontSize: "0.95rem" }}>
                {tool.description}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Tool component */}
      <section style={{ padding: "40px 0 64px" }}>
        <div className="container">
          {ToolComponent ? (
            <ToolComponent />
          ) : (
            <div className="card" style={{ textAlign: "center", padding: "64px" }}>
              <div style={{ fontSize: "3rem", marginBottom: "16px" }}>🚧</div>
              <h2 style={{ fontFamily: "var(--font-display)" }}>Coming Soon</h2>
              <p style={{ color: "var(--color-text-muted)" }}>
                This tool is in development. Check the{" "}
                <Link href="/changelog" style={{ color: "var(--color-accent)" }}>changelog</Link> for updates.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* How it works */}
      <section style={{ padding: "48px 0", background: "var(--color-surface)", borderTop: "1px solid var(--color-border)" }}>
        <div className="container" style={{ maxWidth: "800px" }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.4rem", marginBottom: "32px" }}>
            How it works
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "24px" }}>
            {[
              { step: "1", title: "Input your data", desc: "Paste text, upload a file, or fill in the fields above." },
              { step: "2", title: "Run the tool", desc: "Hit the button or watch it update in real time — no page reload." },
              { step: "3", title: "Copy or download", desc: "Copy the result to clipboard or download it directly." },
            ].map(({ step, title, desc }) => (
              <div key={step} style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
                <div style={{
                  width: "32px",
                  height: "32px",
                  background: "var(--color-accent-subtle)",
                  border: "1px solid var(--color-accent)",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: "var(--font-display)",
                  fontWeight: 700,
                  fontSize: "0.85rem",
                  color: "var(--color-accent)",
                  flexShrink: 0,
                }}>
                  {step}
                </div>
                <div>
                  <div style={{ fontFamily: "var(--font-display)", fontWeight: 600, marginBottom: "4px" }}>{title}</div>
                  <div style={{ color: "var(--color-text-muted)", fontSize: "0.85rem" }}>{desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About this tool */}
      <section style={{ padding: "48px 0" }}>
        <div className="container" style={{ maxWidth: "800px" }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.4rem", marginBottom: "16px" }}>
            About {tool.name}
          </h2>
          <p style={{ color: "var(--color-text-muted)", lineHeight: 1.8 }}>
            {tool.longDescription}
          </p>
        </div>
      </section>

      {/* FAQ */}
      {tool.faq.length > 0 && (
        <section style={{ padding: "48px 0", borderTop: "1px solid var(--color-border)" }}>
          <div className="container" style={{ maxWidth: "800px" }}>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.4rem", marginBottom: "24px" }}>
              Frequently asked questions
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {tool.faq.map((item) => (
                <div key={item.question} className="card">
                  <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "0.95rem", margin: "0 0 8px", color: "var(--color-text)" }}>
                    {item.question}
                  </h3>
                  <p style={{ color: "var(--color-text-muted)", fontSize: "0.88rem", lineHeight: 1.7, margin: 0 }}>
                    {item.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Related tools */}
      {relatedTools.length > 0 && (
        <section style={{ padding: "48px 0 64px", background: "var(--color-surface)", borderTop: "1px solid var(--color-border)" }}>
          <div className="container">
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.4rem", marginBottom: "24px" }}>
              Related tools
            </h2>
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
              gap: "16px",
            }}>
              {relatedTools.map((t, i) => (
                <ToolCard key={t.id} tool={t} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
