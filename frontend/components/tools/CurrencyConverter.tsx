"use client";
import { useState, useEffect, useCallback } from "react";
import { copyToClipboard } from "@/lib/api";
import { useToast } from "@/components/ui/Toast";

// Major currencies with symbols
const CURRENCIES = [
  { code: "USD", name: "US Dollar", symbol: "$" },
  { code: "EUR", name: "Euro", symbol: "€" },
  { code: "GBP", name: "British Pound", symbol: "£" },
  { code: "JPY", name: "Japanese Yen", symbol: "¥" },
  { code: "CAD", name: "Canadian Dollar", symbol: "C$" },
  { code: "AUD", name: "Australian Dollar", symbol: "A$" },
  { code: "CHF", name: "Swiss Franc", symbol: "Fr" },
  { code: "CNY", name: "Chinese Yuan", symbol: "¥" },
  { code: "INR", name: "Indian Rupee", symbol: "₹" },
  { code: "MXN", name: "Mexican Peso", symbol: "$" },
  { code: "BRL", name: "Brazilian Real", symbol: "R$" },
  { code: "KRW", name: "South Korean Won", symbol: "₩" },
  { code: "SGD", name: "Singapore Dollar", symbol: "S$" },
  { code: "HKD", name: "Hong Kong Dollar", symbol: "HK$" },
  { code: "SEK", name: "Swedish Krona", symbol: "kr" },
  { code: "NOK", name: "Norwegian Krone", symbol: "kr" },
  { code: "DKK", name: "Danish Krone", symbol: "kr" },
  { code: "NZD", name: "New Zealand Dollar", symbol: "NZ$" },
  { code: "ZAR", name: "South African Rand", symbol: "R" },
  { code: "AED", name: "UAE Dirham", symbol: "د.إ" },
  { code: "SAR", name: "Saudi Riyal", symbol: "﷼" },
  { code: "TRY", name: "Turkish Lira", symbol: "₺" },
  { code: "PKR", name: "Pakistani Rupee", symbol: "₨" },
];

// Fallback static rates (relative to USD) — used when API is unavailable
const FALLBACK_RATES: Record<string, number> = {
  USD:1, EUR:0.92, GBP:0.79, JPY:149.5, CAD:1.36, AUD:1.52, CHF:0.89,
  CNY:7.24, INR:83.1, MXN:17.2, BRL:4.97, KRW:1325, SGD:1.34, HKD:7.82,
  SEK:10.4, NOK:10.6, DKK:6.88, NZD:1.63, ZAR:18.7, AED:3.67, SAR:3.75,
  TRY:30.5, PKR:279,
};

export default function CurrencyConverter() {
  const [amount, setAmount] = useState("100");
  const [from, setFrom] = useState("USD");
  const [to, setTo] = useState("EUR");
  const [rates, setRates] = useState<Record<string, number>>(FALLBACK_RATES);
  const [ratesSource, setRatesSource] = useState<"live" | "fallback">("fallback");
  const [loading, setLoading] = useState(true);
  const { toast, ToastContainer } = useToast();

  // Try to fetch live rates from a public free API
  useEffect(() => {
    const controller = new AbortController();
    fetch("https://open.er-api.com/v6/latest/USD", { signal: controller.signal })
      .then((r) => r.json())
      .then((data) => {
        if (data.rates) {
          setRates(data.rates);
          setRatesSource("live");
        }
      })
      .catch(() => { /* Use fallback */ })
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, []);

  const numAmount = parseFloat(amount) || 0;
  const result = numAmount * (rates[to] / rates[from]);
  const rate = rates[to] / rates[from];

  const swap = () => { setFrom(to); setTo(from); };

  const fromCur = CURRENCIES.find((c) => c.code === from);
  const toCur   = CURRENCIES.find((c) => c.code === to);

  return (
    <div style={{ maxWidth: "640px", margin: "0 auto" }}>
      <ToastContainer />

      {/* Source indicator */}
      <div style={{ marginBottom: "16px", display: "flex", justifyContent: "flex-end" }}>
        <span
          className={`badge ${ratesSource === "live" ? "badge-green" : "badge-orange"}`}
          style={{ fontSize: "0.7rem" }}
        >
          {ratesSource === "live" ? "🟢 Live rates" : "⚠️ Indicative rates"}
        </span>
      </div>

      <div className="card">
        {/* Amount + From */}
        <div style={{ marginBottom: "16px" }}>
          <label style={{ display: "block", marginBottom: "8px", fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "0.85rem" }}>Amount</label>
          <div style={{ display: "flex", gap: "12px" }}>
            <input
              type="number"
              min="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="input"
              style={{ flex: 1, fontFamily: "var(--font-mono)", fontSize: "1.1rem" }}
              placeholder="100"
            />
            <select value={from} onChange={(e) => setFrom(e.target.value)} className="input" style={{ flex: 1, cursor: "pointer" }}>
              {CURRENCIES.map((c) => <option key={c.code} value={c.code}>{c.code} — {c.name}</option>)}
            </select>
          </div>
        </div>

        {/* Swap */}
        <div style={{ textAlign: "center", marginBottom: "16px" }}>
          <button onClick={swap} className="btn btn-ghost btn-sm">⇅ Swap</button>
        </div>

        {/* Result + To */}
        <div style={{ marginBottom: "24px" }}>
          <label style={{ display: "block", marginBottom: "8px", fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "0.85rem" }}>Result</label>
          <div style={{ display: "flex", gap: "12px" }}>
            <div className="input" style={{
              flex: 1,
              background: "var(--color-base)",
              fontFamily: "var(--font-mono)",
              fontSize: "1.1rem",
              color: "var(--color-accent)",
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
            }}>
              {loading ? "…" : result.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 4 })}
            </div>
            <select value={to} onChange={(e) => setTo(e.target.value)} className="input" style={{ flex: 1, cursor: "pointer" }}>
              {CURRENCIES.map((c) => <option key={c.code} value={c.code}>{c.code} — {c.name}</option>)}
            </select>
          </div>
        </div>

        <button
          onClick={async () => {
            await copyToClipboard(result.toFixed(4));
            toast("Copied!", "success");
          }}
          className="btn btn-secondary btn-sm"
          style={{ alignSelf: "flex-end" }}
        >
          📋 Copy
        </button>
      </div>

      {/* Exchange rate display */}
      {!loading && (
        <div style={{ marginTop: "16px", padding: "16px", background: "var(--color-surface)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-md)" }}>
          <p style={{ margin: "0 0 4px", fontFamily: "var(--font-mono)", fontSize: "0.85rem", color: "var(--color-text-muted)" }}>
            1 {from} = <strong style={{ color: "var(--color-accent)" }}>{rate.toFixed(6)} {to}</strong>
          </p>
          <p style={{ margin: 0, fontFamily: "var(--font-mono)", fontSize: "0.85rem", color: "var(--color-text-muted)" }}>
            1 {to} = <strong style={{ color: "var(--color-text)" }}>{(1 / rate).toFixed(6)} {from}</strong>
          </p>
        </div>
      )}
    </div>
  );
}
