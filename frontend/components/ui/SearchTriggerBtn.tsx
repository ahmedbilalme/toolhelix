"use client";

/** Triggers the command palette (Ctrl/Cmd + K) */
export default function SearchTriggerBtn() {
  return (
    <button
      onClick={() => {
        const evt = new KeyboardEvent("keydown", {
          key: "k",
          ctrlKey: true,
          bubbles: true,
        });
        window.dispatchEvent(evt);
      }}
      className="btn btn-secondary btn-lg"
    >
      <span style={{ fontSize: "1rem" }}>⌕</span> Search Tools
      <kbd
        style={{
          background: "var(--color-border)",
          padding: "2px 8px",
          borderRadius: "4px",
          fontSize: "0.7rem",
          fontFamily: "var(--font-mono)",
        }}
      >
        ⌘K
      </kbd>
    </button>
  );
}
