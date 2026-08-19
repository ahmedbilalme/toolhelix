import { ImageResponse } from "next/og";
import { TOOLS } from "@/lib/tools";

export const runtime = "edge";
export const alt = "ToolHelix — Free Online Tools for Developers & Everyone";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#0A0A0F",
          backgroundImage:
            "radial-gradient(ellipse 60% 60% at 50% 0%, rgba(110,86,207,0.35) 0%, transparent 70%)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 20,
            marginBottom: 28,
          }}
        >
          <div
            style={{
              display: "flex",
              width: 88,
              height: 88,
              borderRadius: 22,
              alignItems: "center",
              justifyContent: "center",
              fontSize: 52,
              background: "rgba(110,86,207,0.18)",
              border: "2px solid rgba(110,86,207,0.5)",
            }}
          >
            🧬
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 84,
              fontWeight: 700,
              background: "linear-gradient(135deg, #a78bfa 0%, #6E56CF 60%, #3B82F6 100%)",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            ToolHelix
          </div>
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 34,
            color: "#94A3B8",
            textAlign: "center",
          }}
        >
          {TOOLS.length}+ free online tools — no signup, no clutter
        </div>
      </div>
    ),
    { ...size }
  );
}
