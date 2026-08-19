"use client";
import { useState, useMemo } from "react";
import { copyToClipboard } from "@/lib/api";
import { useToast } from "@/components/ui/Toast";

export default function LoanCalculator() {
  const [principal, setPrincipal] = useState("500000");
  const [rate, setRate] = useState("8.5");
  const [tenure, setTenure] = useState("20");
  const [tenureType, setTenureType] = useState<"years" | "months">("years");
  const { toast, ToastContainer } = useToast();

  const result = useMemo(() => {
    const P = parseFloat(principal) || 0;
    const r = (parseFloat(rate) || 0) / 100 / 12;
    const n = (parseFloat(tenure) || 0) * (tenureType === "years" ? 12 : 1);

    if (P <= 0 || r <= 0 || n <= 0) return null;

    const emi = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const totalPayment = emi * n;
    const totalInterest = totalPayment - P;

    // Amortization schedule (first 12 + last row)
    const schedule: { month: number; emi: number; principal: number; interest: number; balance: number }[] = [];
    let balance = P;
    for (let i = 1; i <= n; i++) {
      const interestPart = balance * r;
      const principalPart = emi - interestPart;
      balance -= principalPart;
      schedule.push({ month: i, emi, principal: principalPart, interest: interestPart, balance: Math.max(0, balance) });
    }

    return { emi, totalPayment, totalInterest, schedule: schedule.slice(0, 12) };
  }, [principal, rate, tenure, tenureType]);

  const fmt = (n: number) => n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <div style={{ maxWidth: "720px", margin: "0 auto" }}>
      <ToastContainer />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "24px" }}>
        <div>
          <label style={{ display: "block", marginBottom: "8px", fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "0.85rem" }}>Loan Amount</label>
          <input type="number" min="0" value={principal} onChange={(e) => setPrincipal(e.target.value)} className="input" placeholder="500000" />
        </div>
        <div>
          <label style={{ display: "block", marginBottom: "8px", fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "0.85rem" }}>Annual Interest Rate (%)</label>
          <input type="number" min="0" max="50" step="0.1" value={rate} onChange={(e) => setRate(e.target.value)} className="input" placeholder="8.5" />
        </div>
        <div>
          <label style={{ display: "block", marginBottom: "8px", fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "0.85rem" }}>Loan Tenure</label>
          <div style={{ display: "flex", gap: "8px" }}>
            <input type="number" min="1" value={tenure} onChange={(e) => setTenure(e.target.value)} className="input" style={{ flex: 1 }} />
            <div style={{ display: "flex" }}>
              {(["years", "months"] as const).map((t) => (
                <button key={t} onClick={() => setTenureType(t)} className={`btn ${tenureType === t ? "btn-primary" : "btn-secondary"} btn-sm`} style={{ borderRadius: t === "years" ? "8px 0 0 8px" : "0 8px 8px 0", textTransform: "capitalize" }}>
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {result && (
        <>
          {/* Summary cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px", marginBottom: "24px" }}>
            {[
              { label: "Monthly EMI", value: `$${fmt(result.emi)}`, color: "var(--color-accent)", note: "per month" },
              { label: "Total Interest", value: `$${fmt(result.totalInterest)}`, color: "#EF4444", note: `${((result.totalInterest / parseFloat(principal)) * 100).toFixed(1)}% of principal` },
              { label: "Total Payment", value: `$${fmt(result.totalPayment)}`, color: "#10B981", note: "principal + interest" },
            ].map(({ label, value, color, note }) => (
              <div key={label} className="card" style={{ textAlign: "center", cursor: "pointer" }} onClick={async () => { await copyToClipboard(value); toast(`Copied ${label}`, "success"); }}>
                <div style={{ fontFamily: "var(--font-display)", fontSize: "0.75rem", color: "var(--color-text-muted)", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</div>
                <div style={{ fontFamily: "var(--font-mono)", fontWeight: 700, fontSize: "1.1rem", color }}>{value}</div>
                <div style={{ fontSize: "0.72rem", color: "var(--color-text-faint)", marginTop: "4px" }}>{note}</div>
              </div>
            ))}
          </div>

          {/* Pie chart approximation using conic-gradient */}
          <div className="card" style={{ marginBottom: "24px" }}>
            <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1rem", marginBottom: "16px" }}>Payment breakdown</h3>
            <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
              <div style={{
                width: "120px",
                height: "120px",
                borderRadius: "50%",
                flexShrink: 0,
                background: (() => {
                  const principalPct = (parseFloat(principal) / result.totalPayment) * 100;
                  return `conic-gradient(var(--color-accent) 0% ${principalPct}%, #EF4444 ${principalPct}% 100%)`;
                })(),
              }} />
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {[
                  { label: "Principal", color: "var(--color-accent)", value: parseFloat(principal) },
                  { label: "Interest", color: "#EF4444", value: result.totalInterest },
                ].map(({ label, color, value }) => (
                  <div key={label} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <div style={{ width: "12px", height: "12px", borderRadius: "3px", background: color, flexShrink: 0 }} />
                    <span style={{ fontFamily: "var(--font-display)", fontSize: "0.85rem" }}>{label}</span>
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.85rem", color, marginLeft: "auto" }}>${fmt(value)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Amortization table */}
          <div className="result-panel">
            <div className="result-panel-header">
              <span style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "0.85rem" }}>Amortization schedule (first 12 months)</span>
            </div>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.82rem", fontFamily: "var(--font-mono)" }}>
                <thead>
                  <tr style={{ background: "var(--color-surface)" }}>
                    {["Month", "EMI", "Principal", "Interest", "Balance"].map((h) => (
                      <th key={h} style={{ padding: "10px 12px", textAlign: "right", color: "var(--color-text-muted)", fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "0.78rem", borderBottom: "1px solid var(--color-border)" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {result.schedule.map((row) => (
                    <tr key={row.month} style={{ borderBottom: "1px solid var(--color-border)" }}>
                      <td style={{ padding: "8px 12px", textAlign: "right", color: "var(--color-text-muted)" }}>{row.month}</td>
                      <td style={{ padding: "8px 12px", textAlign: "right" }}>${fmt(row.emi)}</td>
                      <td style={{ padding: "8px 12px", textAlign: "right", color: "var(--color-accent)" }}>${fmt(row.principal)}</td>
                      <td style={{ padding: "8px 12px", textAlign: "right", color: "#EF4444" }}>${fmt(row.interest)}</td>
                      <td style={{ padding: "8px 12px", textAlign: "right", color: "var(--color-text-muted)" }}>${fmt(row.balance)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
