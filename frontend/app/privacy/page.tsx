import type { Metadata } from "next";
import Breadcrumb from "@/components/ui/Breadcrumb";

export const metadata: Metadata = {
  title: "Privacy Policy — ToolHelix",
  description: "ToolHelix privacy policy — how we handle your data (spoiler: we don't store it).",
};

export default function PrivacyPage() {
  return (
    <section style={{ padding: "48px 0 80px" }}>
      <div className="container" style={{ maxWidth: "720px" }}>
        <Breadcrumb crumbs={[{ label: "Home", href: "/" }, { label: "Privacy Policy" }]} />
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: "2rem", marginBottom: "8px" }}>Privacy Policy</h1>
        <p style={{ color: "var(--color-text-faint)", marginBottom: "40px", fontFamily: "var(--font-mono)", fontSize: "0.82rem" }}>Last updated: December 2024</p>

        <div className="card" style={{ lineHeight: 1.9, color: "var(--color-text-muted)", display: "flex", flexDirection: "column", gap: "24px" }}>
          {[
            { title: "What we collect", body: "ToolHelix collects no personally identifiable information. We do not require accounts or registration. Anonymous usage data (page views, tool interactions) may be collected via Vercel Analytics, which is GDPR-compliant and privacy-respecting." },
            { title: "Your files & inputs", body: "Files uploaded to image tools (compressor, resizer, converter) are processed server-side and immediately discarded. They are never stored on disk, logged, or shared with third parties. Text inputs for all tools run entirely in your browser — nothing is sent to our servers." },
            { title: "Cookies & local storage", body: "We use browser localStorage to save your recently used tools and favorites. No tracking cookies are placed. No third-party advertising networks are used." },
            { title: "Third-party services", body: "Currency rates are fetched from open.er-api.com (no API key, no tracking). No other third-party data services are used." },
            { title: "Contact", body: "Questions? Use the contact form on our Contact page." },
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
