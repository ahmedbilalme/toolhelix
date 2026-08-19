import Link from "next/link";

interface Crumb {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  crumbs: Crumb[];
}

export default function Breadcrumb({ crumbs }: BreadcrumbProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((crumb, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: crumb.label,
      ...(crumb.href ? { item: `https://toolhelix.com${crumb.href}` } : {}),
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <nav aria-label="Breadcrumb" style={{ marginBottom: "24px" }}>
        <ol style={{
          display: "flex",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "4px",
          listStyle: "none",
          padding: 0,
          margin: 0,
        }}>
          {crumbs.map((crumb, idx) => {
            const isLast = idx === crumbs.length - 1;
            return (
              <li key={idx} style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                {idx > 0 && (
                  <span style={{ color: "var(--color-text-faint)", fontSize: "0.8rem" }}>/</span>
                )}
                {crumb.href && !isLast ? (
                  <Link
                    href={crumb.href}
                    style={{
                      color: "var(--color-text-muted)",
                      textDecoration: "none",
                      fontSize: "0.82rem",
                      fontFamily: "var(--font-display)",
                      transition: "color 150ms",
                    }}
                    className="breadcrumb-link"
                  >
                    {crumb.label}
                  </Link>
                ) : (
                  <span
                    style={{
                      color: isLast ? "var(--color-text)" : "var(--color-text-muted)",
                      fontSize: "0.82rem",
                      fontFamily: "var(--font-display)",
                      fontWeight: isLast ? 500 : 400,
                    }}
                    aria-current={isLast ? "page" : undefined}
                  >
                    {crumb.label}
                  </span>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
      <style>{`.breadcrumb-link:hover { color: var(--color-text) !important; }`}</style>
    </>
  );
}
