"use client";
import Link from "next/link";

export default function NotFound() {
  return (
    <div style={{
      minHeight: "70vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      textAlign: "center",
      padding: "48px 24px",
    }}>
      {/* Helix animation */}
      <div style={{ position: "relative", marginBottom: "32px" }}>
        <div style={{
          width: "120px",
          height: "120px",
          borderRadius: "50%",
          background: "var(--color-accent-subtle)",
          border: "2px solid var(--color-accent)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "3.5rem",
          animation: "pulse-glow 2s ease-in-out infinite",
        }}>
          🔀
        </div>
      </div>

      <div style={{
        fontFamily: "var(--font-mono)",
        fontSize: "5rem",
        fontWeight: 700,
        lineHeight: 1,
        marginBottom: "8px",
        background: "linear-gradient(135deg, #a78bfa, #6E56CF, #3B82F6)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
      }}>
        404
      </div>

      <h1 style={{ fontFamily: "var(--font-display)", fontSize: "1.6rem", marginBottom: "12px" }}>
        This strand of the helix is missing
      </h1>

      <p style={{ color: "var(--color-text-muted)", maxWidth: "400px", marginBottom: "32px", lineHeight: 1.6 }}>
        The page you&apos;re looking for doesn&apos;t exist — or maybe it was renamed or moved. 
        Either way, we&apos;ve got {`>`}20 tools waiting for you.
      </p>

      <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", justifyContent: "center" }}>
        <Link href="/" className="btn btn-primary btn-md">← Go home</Link>
        <Link href="/tools" className="btn btn-secondary btn-md">Browse all tools</Link>
      </div>

      <p style={{ marginTop: "48px", color: "var(--color-text-faint)", fontSize: "0.8rem" }}>
        Lost? Try the search:{" "}
        <button
          onClick={() => {
            const evt = new KeyboardEvent("keydown", { key: "k", ctrlKey: true, bubbles: true });
            window.dispatchEvent(evt);
          }}
          style={{ background: "none", border: "none", color: "var(--color-accent)", cursor: "pointer", fontFamily: "var(--font-mono)", fontSize: "0.8rem" }}
        >
          ⌘K
        </button>
      </p>
    </div>
  );
}
