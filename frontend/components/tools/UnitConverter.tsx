"use client";
import { useState } from "react";
import { copyToClipboard } from "@/lib/api";
import { useToast } from "@/components/ui/Toast";

type Category = "length" | "weight" | "temperature" | "area" | "volume" | "speed" | "time" | "digital";

const UNITS: Record<Category, { label: string; factor?: number; toCelsius?: (v: number) => number; fromCelsius?: (v: number) => number }[]> = {
  length: [
    { label: "Millimeter (mm)", factor: 0.001 },
    { label: "Centimeter (cm)", factor: 0.01 },
    { label: "Meter (m)", factor: 1 },
    { label: "Kilometer (km)", factor: 1000 },
    { label: "Inch (in)", factor: 0.0254 },
    { label: "Foot (ft)", factor: 0.3048 },
    { label: "Yard (yd)", factor: 0.9144 },
    { label: "Mile (mi)", factor: 1609.344 },
  ],
  weight: [
    { label: "Milligram (mg)", factor: 0.000001 },
    { label: "Gram (g)", factor: 0.001 },
    { label: "Kilogram (kg)", factor: 1 },
    { label: "Tonne (t)", factor: 1000 },
    { label: "Ounce (oz)", factor: 0.028349 },
    { label: "Pound (lb)", factor: 0.453592 },
  ],
  temperature: [
    { label: "Celsius (°C)", toCelsius: (v) => v, fromCelsius: (v) => v },
    { label: "Fahrenheit (°F)", toCelsius: (v) => (v - 32) * 5/9, fromCelsius: (v) => v * 9/5 + 32 },
    { label: "Kelvin (K)", toCelsius: (v) => v - 273.15, fromCelsius: (v) => v + 273.15 },
  ],
  area: [
    { label: "Square meter (m²)", factor: 1 },
    { label: "Square kilometer (km²)", factor: 1e6 },
    { label: "Square foot (ft²)", factor: 0.092903 },
    { label: "Square yard (yd²)", factor: 0.836127 },
    { label: "Acre", factor: 4046.86 },
    { label: "Hectare (ha)", factor: 10000 },
  ],
  volume: [
    { label: "Milliliter (mL)", factor: 0.001 },
    { label: "Liter (L)", factor: 1 },
    { label: "Cubic meter (m³)", factor: 1000 },
    { label: "Fluid ounce (fl oz)", factor: 0.029574 },
    { label: "Cup (US)", factor: 0.236588 },
    { label: "Pint (US)", factor: 0.473176 },
    { label: "Gallon (US)", factor: 3.78541 },
  ],
  speed: [
    { label: "m/s", factor: 1 },
    { label: "km/h", factor: 1/3.6 },
    { label: "mph", factor: 0.44704 },
    { label: "knot", factor: 0.514444 },
    { label: "ft/s", factor: 0.3048 },
  ],
  time: [
    { label: "Second (s)", factor: 1 },
    { label: "Minute (min)", factor: 60 },
    { label: "Hour (hr)", factor: 3600 },
    { label: "Day", factor: 86400 },
    { label: "Week", factor: 604800 },
    { label: "Month (avg)", factor: 2629800 },
    { label: "Year", factor: 31557600 },
  ],
  digital: [
    { label: "Bit (b)", factor: 1 },
    { label: "Byte (B)", factor: 8 },
    { label: "Kilobyte (KB)", factor: 8192 },
    { label: "Megabyte (MB)", factor: 8388608 },
    { label: "Gigabyte (GB)", factor: 8589934592 },
    { label: "Terabyte (TB)", factor: 8796093022208 },
  ],
};

const CATEGORIES: { id: Category; label: string; icon: string }[] = [
  { id: "length", label: "Length", icon: "📏" },
  { id: "weight", label: "Weight", icon: "⚖️" },
  { id: "temperature", label: "Temperature", icon: "🌡️" },
  { id: "area", label: "Area", icon: "⬜" },
  { id: "volume", label: "Volume", icon: "🧪" },
  { id: "speed", label: "Speed", icon: "⚡" },
  { id: "time", label: "Time", icon: "⏱️" },
  { id: "digital", label: "Digital", icon: "💾" },
];

function convert(value: number, fromIdx: number, toIdx: number, cat: Category): number {
  const units = UNITS[cat];
  const from = units[fromIdx];
  const to   = units[toIdx];
  if (cat === "temperature") {
    const celsius = from.toCelsius!(value);
    return to.fromCelsius!(celsius);
  }
  return (value * from.factor!) / to.factor!;
}

export default function UnitConverter() {
  const [cat, setCat] = useState<Category>("length");
  const [value, setValue] = useState("1");
  const [fromIdx, setFromIdx] = useState(2); // meter
  const [toIdx, setToIdx] = useState(5);     // foot
  const { toast, ToastContainer } = useToast();

  const units = UNITS[cat];
  const numVal = parseFloat(value);
  const result = !isNaN(numVal) && numVal !== undefined
    ? convert(numVal, fromIdx, toIdx, cat)
    : null;

  const handleCatChange = (newCat: Category) => {
    setCat(newCat);
    setFromIdx(0);
    setToIdx(Math.min(1, UNITS[newCat].length - 1));
  };

  const swap = () => {
    setFromIdx(toIdx);
    setToIdx(fromIdx);
  };

  return (
    <div style={{ maxWidth: "640px", margin: "0 auto" }}>
      <ToastContainer />

      {/* Category pills */}
      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "24px" }}>
        {CATEGORIES.map((c) => (
          <button
            key={c.id}
            onClick={() => handleCatChange(c.id)}
            className={`btn ${cat === c.id ? "btn-primary" : "btn-secondary"} btn-sm`}
          >
            {c.icon} {c.label}
          </button>
        ))}
      </div>

      <div className="card">
        {/* From */}
        <div style={{ marginBottom: "16px" }}>
          <label style={{ display: "block", marginBottom: "8px", fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "0.85rem" }}>From</label>
          <div style={{ display: "flex", gap: "12px" }}>
            <input
              type="number"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="input"
              style={{ flex: 1 }}
              placeholder="Enter value"
            />
            <select
              value={fromIdx}
              onChange={(e) => setFromIdx(Number(e.target.value))}
              className="input"
              style={{ flex: 1, cursor: "pointer" }}
            >
              {units.map((u, i) => <option key={i} value={i}>{u.label}</option>)}
            </select>
          </div>
        </div>

        {/* Swap */}
        <div style={{ textAlign: "center", marginBottom: "16px" }}>
          <button onClick={swap} className="btn btn-ghost btn-sm" title="Swap units">
            ⇅ Swap
          </button>
        </div>

        {/* To */}
        <div style={{ marginBottom: "24px" }}>
          <label style={{ display: "block", marginBottom: "8px", fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "0.85rem" }}>To</label>
          <div style={{ display: "flex", gap: "12px" }}>
            <div
              className="input"
              style={{
                flex: 1,
                background: "var(--color-base)",
                fontFamily: "var(--font-mono)",
                color: "var(--color-accent)",
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
              }}
            >
              {result !== null ? result.toPrecision(8).replace(/\.?0+$/, "") : "—"}
            </div>
            <select
              value={toIdx}
              onChange={(e) => setToIdx(Number(e.target.value))}
              className="input"
              style={{ flex: 1, cursor: "pointer" }}
            >
              {units.map((u, i) => <option key={i} value={i}>{u.label}</option>)}
            </select>
          </div>
        </div>

        {/* Copy result */}
        {result !== null && (
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button
              onClick={async () => {
                await copyToClipboard(result.toString());
                toast("Result copied!", "success");
              }}
              className="btn btn-secondary btn-sm"
            >
              📋 Copy result
            </button>
          </div>
        )}
      </div>

      {/* Quick reference */}
      {result !== null && (
        <div style={{ marginTop: "16px", padding: "16px", background: "var(--color-surface)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-md)" }}>
          <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.9rem", margin: 0, color: "var(--color-text-muted)" }}>
            <strong style={{ color: "var(--color-text)" }}>{numVal} {units[fromIdx].label.split(" (")[0]}</strong>
            {" "} = {" "}
            <strong style={{ color: "var(--color-accent)" }}>{result.toPrecision(8).replace(/\.?0+$/, "")} {units[toIdx].label.split(" (")[0]}</strong>
          </p>
        </div>
      )}
    </div>
  );
}
