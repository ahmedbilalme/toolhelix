"use client";
import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import type { ToolMeta } from "@/lib/tools";
import { CATEGORIES } from "@/lib/tools";
import { toggleFavorite, isFavorite } from "@/lib/storage";

interface ToolCardProps {
  tool: ToolMeta;
  index?: number;
  showFavorite?: boolean;
}

export default function ToolCard({ tool, index = 0, showFavorite = true }: ToolCardProps) {
  const cat = CATEGORIES.find((c) => c.id === tool.category);
  const delay = Math.min(index * 50, 400);
  const [favorited, setFavorited] = useState(false);
  const [heartPop, setHeartPop] = useState(false);

  useEffect(() => {
    setFavorited(isFavorite(tool.id));
  }, [tool.id]);

  const handleFavorite = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      const nowFav = toggleFavorite(tool.id);
      setFavorited(nowFav);
      setHeartPop(true);
      setTimeout(() => setHeartPop(false), 400);
    },
    [tool.id]
  );

  return (
    <Link href={`/tools/${tool.category}/${tool.slug}`} style={{ textDecoration: "none" }}>
      <article
        className="card tool-card animate-slide-up"
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "14px",
          cursor: "pointer",
          animationDelay: `${delay}ms`,
          height: "100%",
          position: "relative",
          overflow: "hidden",
          transition: "border-color 250ms, box-shadow 250ms, transform 200ms",
        }}
      >
        {/* Top accent gradient line */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "2px",
            background: `linear-gradient(90deg, ${cat?.color ?? "var(--color-accent)"}, transparent)`,
            opacity: 0,
            transition: "opacity 250ms",
          }}
          className="tool-card-accent"
        />

        {/* Subtle glow behind icon on hover */}
        <div
          style={{
            position: "absolute",
            top: "-40px",
            left: "-40px",
            width: "120px",
            height: "120px",
            borderRadius: "50%",
            background: `radial-gradient(circle, ${cat?.color ?? "var(--color-accent)"}18 0%, transparent 70%)`,
            opacity: 0,
            transition: "opacity 350ms",
            pointerEvents: "none",
          }}
          className="tool-card-glow"
        />

        {/* Icon + badges row */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
          <div
            style={{
              width: "48px",
              height: "48px",
              background: `${cat?.color ?? "var(--color-accent)"}12`,
              border: `1px solid ${cat?.color ?? "var(--color-accent)"}30`,
              borderRadius: "var(--radius-md)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.4rem",
              transition: "border-color 250ms, box-shadow 250ms, transform 200ms",
              flexShrink: 0,
            }}
            className="tool-card-icon"
          >
            {tool.icon}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            {tool.isNew && <span className="badge badge-blue">New</span>}
            {tool.isFeatured && <span className="badge badge-violet">Popular</span>}

            {/* Favorite button */}
            {showFavorite && (
              <button
                onClick={handleFavorite}
                title={favorited ? "Remove from favorites" : "Add to favorites"}
                aria-label={favorited ? "Remove from favorites" : "Add to favorites"}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: "4px",
                  fontSize: "1rem",
                  lineHeight: 1,
                  color: favorited ? "#f472b6" : "var(--color-text-faint)",
                  transition: "color 200ms, transform 200ms",
                  transform: heartPop ? "scale(1.4)" : "scale(1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                className="fav-btn"
              >
                {favorited ? "♥" : "♡"}
              </button>
            )}
          </div>
        </div>

        {/* Name + description */}
        <div style={{ flex: 1 }}>
          <h3
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 600,
              fontSize: "0.96rem",
              margin: "0 0 6px",
              color: "var(--color-text)",
              transition: "color 200ms",
            }}
            className="tool-card-title"
          >
            {tool.name}
          </h3>
          <p
            style={{
              color: "var(--color-text-muted)",
              fontSize: "0.82rem",
              lineHeight: 1.55,
              margin: 0,
            }}
          >
            {tool.description}
          </p>
        </div>

        {/* Footer: category badge + arrow */}
        {cat && (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span className={`badge ${cat.badgeClass}`}>
              {cat.icon} {cat.name}
            </span>
            <span
              style={{
                color: cat.color,
                fontSize: "0.88rem",
                fontFamily: "var(--font-display)",
                fontWeight: 600,
                transition: "transform 200ms",
              }}
              className="tool-card-arrow"
            >
              →
            </span>
          </div>
        )}

        <style>{`
          .tool-card:hover {
            border-color: ${cat?.color ?? "var(--color-accent)"}80 !important;
            box-shadow: 0 0 0 1px ${cat?.color ?? "var(--color-accent)"}40, 0 8px 32px rgba(0,0,0,0.5) !important;
            transform: translateY(-2px);
          }
          .tool-card:hover .tool-card-accent { opacity: 1 !important; }
          .tool-card:hover .tool-card-glow  { opacity: 1 !important; }
          .tool-card:hover .tool-card-arrow { transform: translateX(4px) !important; }
          .tool-card:hover .tool-card-icon  {
            border-color: ${cat?.color ?? "var(--color-accent)"}60 !important;
            box-shadow: 0 0 12px ${cat?.color ?? "var(--color-accent)"}20 !important;
            transform: scale(1.05) !important;
          }
          .tool-card:hover .tool-card-title { color: ${cat?.color ?? "var(--color-accent)"} !important; }
          .fav-btn:hover { color: #f472b6 !important; transform: scale(1.2) !important; }
        `}</style>
      </article>
    </Link>
  );
}
