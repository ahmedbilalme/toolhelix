"use client";
import { useState, useMemo } from "react";

type Unit = "metric" | "imperial";

const BMI_CATEGORIES = [
  { label: "Severely Underweight", range: [0, 16], color: "#60a5fa" },
  { label: "Underweight", range: [16, 18.5], color: "#93c5fd" },
  { label: "Normal weight", range: [18.5, 25], color: "#10B981" },
  { label: "Overweight", range: [25, 30], color: "#F59E0B" },
  { label: "Obese Class I", range: [30, 35], color: "#f97316" },
  { label: "Obese Class II", range: [35, 40], color: "#EF4444" },
  { label: "Obese Class III", range: [40, 100], color: "#7f1d1d" },
];

function getCategory(bmi: number) {
  return BMI_CATEGORIES.find((c) => bmi >= c.range[0] && bmi < c.range[1]) ?? BMI_CATEGORIES[BMI_CATEGORIES.length - 1];
}

export default function BMICalculator() {
  const [unit, setUnit] = useState<Unit>("metric");
  const [height, setHeight] = useState("");
  const [heightIn, setHeightIn] = useState(""); // inches part for imperial
  const [weight, setWeight] = useState("");

  const bmi = useMemo(() => {
    if (unit === "metric") {
      const h = parseFloat(height) / 100; // cm to m
      const w = parseFloat(weight);
      if (!h || !w || h <= 0 || w <= 0) return null;
      return w / (h * h);
    } else {
      const totalInches = parseFloat(height) * 12 + (parseFloat(heightIn) || 0);
      const lbs = parseFloat(weight);
      if (!totalInches || !lbs) return null;
      return (lbs / (totalInches * totalInches)) * 703;
    }
  }, [unit, height, heightIn, weight]);

  const cat = bmi !== null ? getCategory(bmi) : null;
  const pct = bmi !== null ? Math.min(100, (bmi / 45) * 100) : 0;

  return (
    <div style={{ maxWidth: "560px", margin: "0 auto" }}>
      {/* Unit toggle */}
      <div style={{ display: "flex", marginBottom: "24px" }}>
        {(["metric", "imperial"] as Unit[]).map((u) => (
          <button
            key={u}
            onClick={() => { setUnit(u); setHeight(""); setHeightIn(""); setWeight(""); }}
            className={`btn ${unit === u ? "btn-primary" : "btn-secondary"} btn-md`}
            style={{ flex: 1, borderRadius: u === "metric" ? "10px 0 0 10px" : "0 10px 10px 0", textTransform: "capitalize" }}
          >
            {u === "metric" ? "Metric (cm/kg)" : "Imperial (ft/lbs)"}
          </button>
        ))}
      </div>

      <div className="card" style={{ marginBottom: "24px" }}>
        {/* Height */}
        <div style={{ marginBottom: "16px" }}>
          <label style={{ display: "block", marginBottom: "8px", fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "0.85rem" }}>
            Height {unit === "metric" ? "(cm)" : "(ft / in)"}
          </label>
          {unit === "metric" ? (
            <input type="number" min="50" max="280" value={height} onChange={(e) => setHeight(e.target.value)} className="input" placeholder="175" />
          ) : (
            <div style={{ display: "flex", gap: "8px" }}>
              <input type="number" min="1" max="9" value={height} onChange={(e) => setHeight(e.target.value)} className="input" placeholder="5 ft" />
              <input type="number" min="0" max="11" value={heightIn} onChange={(e) => setHeightIn(e.target.value)} className="input" placeholder="10 in" />
            </div>
          )}
        </div>

        {/* Weight */}
        <div>
          <label style={{ display: "block", marginBottom: "8px", fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "0.85rem" }}>
            Weight {unit === "metric" ? "(kg)" : "(lbs)"}
          </label>
          <input type="number" min="1" max="700" value={weight} onChange={(e) => setWeight(e.target.value)} className="input" placeholder={unit === "metric" ? "70" : "154"} />
        </div>
      </div>

      {/* Result */}
      {bmi !== null && cat && (
        <div className="card animate-scale-in">
          <div style={{ textAlign: "center", marginBottom: "24px" }}>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: "3.5rem", fontWeight: 700, color: cat.color, lineHeight: 1 }}>
              {bmi.toFixed(1)}
            </div>
            <div style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "1.1rem", color: cat.color, marginTop: "8px" }}>
              {cat.label}
            </div>
          </div>

          {/* Scale bar */}
          <div style={{ marginBottom: "20px" }}>
            <div style={{ height: "12px", borderRadius: "6px", background: "linear-gradient(90deg, #60a5fa, #10B981, #F59E0B, #EF4444, #7f1d1d)", marginBottom: "8px", position: "relative" }}>
              <div style={{
                position: "absolute",
                top: "-4px",
                left: `${pct}%`,
                transform: "translateX(-50%)",
                width: "20px",
                height: "20px",
                borderRadius: "50%",
                background: cat.color,
                border: "3px solid var(--color-base)",
                boxShadow: `0 0 8px ${cat.color}`,
                transition: "left 500ms var(--ease-spring)",
              }} />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.7rem", color: "var(--color-text-faint)", fontFamily: "var(--font-mono)" }}>
              <span>0</span><span>18.5</span><span>25</span><span>30</span><span>40+</span>
            </div>
          </div>

          {/* Healthy range tip */}
          <div style={{ padding: "12px", background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.2)", borderRadius: "var(--radius-md)", fontSize: "0.82rem", color: "var(--color-text-muted)" }}>
            💡 Healthy BMI range: <strong style={{ color: "#10B981" }}>18.5 – 24.9</strong>. BMI is a general indicator — consult a healthcare professional for personalized advice.
          </div>
        </div>
      )}
    </div>
  );
}
