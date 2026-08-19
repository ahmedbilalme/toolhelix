import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import ToolCard from "@/components/ui/ToolCard";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { CATEGORIES, TOOLS, getCategoryById, getToolsByCategory, type CategoryId } from "@/lib/tools";

interface Props {
  params: Promise<{ category: string }>;
}

export async function generateStaticParams() {
  return CATEGORIES.map((cat) => ({ category: cat.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  const cat = getCategoryById(category as CategoryId);
  if (!cat) return {};
  return {
    title: `${cat.name} Tools — Free Online ${cat.name}`,
    description: `${cat.description} Browse ${TOOLS.filter((t) => t.category === cat.id).length} free ${cat.name.toLowerCase()} tools — no signup required.`,
    openGraph: { title: `${cat.name} Tools | ToolHelix`, description: cat.description },
  };
}

export default async function CategoryPage({ params }: Props) {
  const { category } = await params;
  const cat = getCategoryById(category as CategoryId);
  if (!cat) notFound();

  const tools = getToolsByCategory(category as CategoryId);

  return (
    <>
      {/* Header */}
      <section style={{ padding: "48px 0 40px", borderBottom: "1px solid var(--color-border)" }}>
        <div className="container">
          <Breadcrumb crumbs={[
            { label: "Home", href: "/" },
            { label: "Tools", href: "/tools" },
            { label: cat.name },
          ]} />

          <div style={{ display: "flex", alignItems: "flex-start", gap: "24px", flexWrap: "wrap" }}>
            <div style={{
              width: "72px",
              height: "72px",
              background: `${cat.color}18`,
              border: `1px solid ${cat.color}40`,
              borderRadius: "var(--radius-lg)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "2rem",
              flexShrink: 0,
            }}>
              {cat.icon}
            </div>
            <div>
              <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.6rem, 4vw, 2.4rem)", marginBottom: "8px" }}>
                {cat.name} Tools
              </h1>
              <p style={{ color: "var(--color-text-muted)", fontSize: "1rem", margin: 0 }}>
                {cat.description} Browse all {tools.length} free {cat.name.toLowerCase()} tools below.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Tool grid */}
      <section style={{ padding: "48px 0 80px" }}>
        <div className="container">
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "16px",
          }}>
            {tools.map((tool, i) => (
              <ToolCard key={tool.id} tool={tool} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Other categories */}
      <section style={{ padding: "48px 0 64px", background: "var(--color-surface)", borderTop: "1px solid var(--color-border)" }}>
        <div className="container">
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.3rem", marginBottom: "24px" }}>
            Explore other categories
          </h2>
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            {CATEGORIES.filter((c) => c.id !== category).map((c) => (
              <Link
                key={c.id}
                href={`/tools/${c.id}`}
                className="btn btn-secondary btn-sm"
              >
                {c.icon} {c.name}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
