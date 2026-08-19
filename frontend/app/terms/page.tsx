import type { Metadata } from "next";
import Breadcrumb from "@/components/ui/Breadcrumb";

export const metadata: Metadata = {
  title: "Terms of Use — ToolHelix",
  description: "Terms of use for ToolHelix — free tools, fair use.",
};

export default function TermsPage() {
  return (
    <section style={{ padding: "48px 0 80px" }}>
      <div className="container" style={{ maxWidth: "720px" }}>
        <Breadcrumb crumbs={[{ label: "Home", href: "/" }, { label: "Terms of Use" }]} />
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: "2rem", marginBottom: "8px" }}>Terms of Use</h1>
        <p style={{ color: "var(--color-text-faint)", marginBottom: "40px", fontFamily: "var(--font-mono)", fontSize: "0.82rem" }}>Last updated: December 2024</p>

        <div className="card" style={{ lineHeight: 1.9, color: "var(--color-text-muted)", display: "flex", flexDirection: "column", gap: "24px" }}>
          {[
            { title: "Free to use", body: "All tools on ToolHelix are free for personal and commercial use. No attribution required." },
            { title: "Acceptable use", body: "Do not use ToolHelix to process illegal content, attempt to reverse-engineer or overload our servers, or automate requests at a rate that degrades service for other users." },
            { title: "No warranty", body: "Tools are provided 'as is.' We make our best effort to ensure accuracy, but results should be verified for critical use cases (financial calculations, medical data, etc.)." },
            { title: "Availability", body: "We aim for high uptime but do not guarantee it. Scheduled maintenance will be noted in the changelog." },
            { title: "Changes", body: "Terms may be updated. Continued use after changes constitutes acceptance." },
          ].map(({ title, body }) => (
            <div key={title}>
              <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "1rem", color: "var(--color-text)", marginBottom: "8px" }}>{title}</h2>
              <p style={{ margin: 0 }}>{body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
