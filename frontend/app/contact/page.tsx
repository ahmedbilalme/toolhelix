"use client";
import Link from "next/link";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { useState, FormEvent } from "react";

const CONTACT_OPTIONS = [
  { icon: "🐛", title: "Bug report",      desc: "Something broken? Let us know and we'll fix it fast." },
  { icon: "💡", title: "Tool suggestion", desc: "Have an idea for a tool? We're always building."      },
  { icon: "👋", title: "Just saying hi",  desc: "We appreciate the kind words. Genuinely."            },
];

interface FormState {
  name:    string;
  email:   string;
  subject: string;
  message: string;
}

type Status = "idle" | "loading" | "success" | "error";

export default function ContactPage() {
  const [form, setForm] = useState<FormState>({
    name:    "",
    email:   "",
    subject: "Bug report",
    message: "",
  });
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  function set(field: keyof FormState) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setErrorMsg("Please fill in all required fields.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setErrorMsg("Please enter a valid email address.");
      return;
    }

    setErrorMsg("");
    setStatus("loading");

    // Simulate network request (replace with real endpoint later)
    await new Promise((r) => setTimeout(r, 1400));

    // For now always succeed — replace with actual fetch() to your API
    setStatus("success");
  }

  function handleReset() {
    setForm({ name: "", email: "", subject: "Bug report", message: "" });
    setStatus("idle");
    setErrorMsg("");
  }

  return (
    <>
      <section style={{ padding: "48px 0 40px", borderBottom: "1px solid var(--color-border)" }}>
        <div className="container" style={{ maxWidth: "640px" }}>
          <Breadcrumb crumbs={[{ label: "Home", href: "/" }, { label: "Contact" }]} />
          <span className="badge badge-cyan" style={{ marginBottom: "12px" }}>✉️ Contact</span>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.8rem, 4vw, 2.4rem)", marginBottom: "12px" }}>
            Say hello
          </h1>
          <p style={{ color: "var(--color-text-muted)" }}>
            Found a bug? Have a tool idea? We read every message.
          </p>
        </div>
      </section>

      <section style={{ padding: "48px 0 80px" }}>
        <div className="container" style={{ maxWidth: "640px" }}>

          {/* Reason cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "16px", marginBottom: "40px" }}>
            {CONTACT_OPTIONS.map(({ icon, title, desc }) => (
              <div key={title} className="card" style={{ textAlign: "center" }}>
                <div style={{ fontSize: "2rem", marginBottom: "8px" }}>{icon}</div>
                <div style={{ fontFamily: "var(--font-display)", fontWeight: 600, marginBottom: "4px" }}>{title}</div>
                <div style={{ color: "var(--color-text-muted)", fontSize: "0.82rem" }}>{desc}</div>
              </div>
            ))}
          </div>

          {/* ── Success state ────────────────────────────────────────────── */}
          {status === "success" ? (
            <div
              className="card"
              style={{
                textAlign: "center",
                padding: "56px 32px",
                borderColor: "var(--color-success)",
                boxShadow: "0 0 0 1px var(--color-success), 0 8px 32px rgba(16,185,129,0.15)",
              }}
            >
              <div
                style={{
                  width: "72px",
                  height: "72px",
                  background: "rgba(16,185,129,0.12)",
                  border: "2px solid var(--color-success)",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "2rem",
                  margin: "0 auto 24px",
                  animation: "scale-in 300ms var(--ease-spring)",
                }}
              >
                ✓
              </div>
              <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.4rem", color: "var(--color-success)", marginBottom: "12px" }}>
                Message sent!
              </h2>
              <p style={{ color: "var(--color-text-muted)", marginBottom: "28px", lineHeight: 1.6 }}>
                Thanks for reaching out, <strong style={{ color: "var(--color-text)" }}>{form.name}</strong>.
                We'll get back to you at <strong style={{ color: "var(--color-text)" }}>{form.email}</strong> soon.
              </p>
              <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
                <button onClick={handleReset} className="btn btn-secondary btn-md">
                  Send another →
                </button>
                <Link href="/tools" className="btn btn-primary btn-md">
                  Explore tools →
                </Link>
              </div>
            </div>
          ) : (
            /* ── Form ──────────────────────────────────────────────────── */
            <div className="card">
              <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.2rem", marginTop: 0, marginBottom: "24px" }}>
                Send a message
              </h2>

              {/* Validation error banner */}
              {errorMsg && (
                <div
                  style={{
                    background: "rgba(239,68,68,0.1)",
                    border: "1px solid var(--color-error)",
                    borderRadius: "var(--radius-md)",
                    padding: "10px 16px",
                    color: "#f87171",
                    fontSize: "0.85rem",
                    marginBottom: "20px",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <span>⚠</span> {errorMsg}
                </div>
              )}

              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "18px" }} noValidate>
                {/* Name + Email */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <div>
                    <label style={{ display: "block", marginBottom: "8px", fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "0.85rem" }}>
                      Name <span style={{ color: "var(--color-error)" }}>*</span>
                    </label>
                    <input
                      type="text"
                      className="input"
                      placeholder="Your name"
                      value={form.name}
                      onChange={set("name")}
                      required
                      disabled={status === "loading"}
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", marginBottom: "8px", fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "0.85rem" }}>
                      Email <span style={{ color: "var(--color-error)" }}>*</span>
                    </label>
                    <input
                      type="email"
                      className="input"
                      placeholder="you@example.com"
                      value={form.email}
                      onChange={set("email")}
                      required
                      disabled={status === "loading"}
                    />
                  </div>
                </div>

                {/* Subject */}
                <div>
                  <label style={{ display: "block", marginBottom: "8px", fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "0.85rem" }}>
                    Subject
                  </label>
                  <select
                    className="input"
                    style={{ cursor: "pointer" }}
                    value={form.subject}
                    onChange={set("subject")}
                    disabled={status === "loading"}
                  >
                    <option>Bug report</option>
                    <option>Tool suggestion</option>
                    <option>General feedback</option>
                    <option>Other</option>
                  </select>
                </div>

                {/* Message */}
                <div>
                  <label style={{ display: "block", marginBottom: "8px", fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "0.85rem" }}>
                    Message <span style={{ color: "var(--color-error)" }}>*</span>
                  </label>
                  <textarea
                    className="input textarea"
                    placeholder="Describe your bug, idea, or thought…"
                    style={{ height: "140px" }}
                    value={form.message}
                    onChange={set("message")}
                    required
                    disabled={status === "loading"}
                  />
                  <div style={{ marginTop: "4px", textAlign: "right", fontSize: "0.75rem", color: "var(--color-text-faint)" }}>
                    {form.message.length} chars
                  </div>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  className="btn btn-primary btn-md"
                  disabled={status === "loading"}
                  style={{ position: "relative", overflow: "hidden" }}
                >
                  {status === "loading" ? (
                    <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <Spinner /> Sending…
                    </span>
                  ) : (
                    "Send message →"
                  )}
                </button>
              </form>
            </div>
          )}
        </div>
      </section>
    </>
  );
}

function Spinner() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      style={{ animation: "spin 0.7s linear infinite" }}
    >
      <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
      <path d="M12 2 a10 10 0 0 1 10 10" />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </svg>
  );
}
