"use client";
import { useState } from "react";
import { copyToClipboard } from "@/lib/api";
import { useToast } from "@/components/ui/Toast";

const LOREM_WORDS = "lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur excepteur sint occaecat cupidatat non proident sunt in culpa qui officia deserunt mollit anim id est laborum".split(" ");

function randomWord() { return LOREM_WORDS[Math.floor(Math.random() * LOREM_WORDS.length)]; }

function makeSentence(minW = 6, maxW = 15): string {
  const len = Math.floor(Math.random() * (maxW - minW)) + minW;
  const words = Array.from({ length: len }, randomWord);
  words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1);
  return words.join(" ") + ".";
}

function makeParagraph(minS = 3, maxS = 7): string {
  const len = Math.floor(Math.random() * (maxS - minS)) + minS;
  return Array.from({ length: len }, makeSentence).join(" ");
}

type OutputType = "paragraphs" | "sentences" | "words";

export default function LoremIpsumGenerator() {
  const [type, setType] = useState<OutputType>("paragraphs");
  const [count, setCount] = useState(3);
  const [startWithLorem, setStartWithLorem] = useState(true);
  const [output, setOutput] = useState("");
  const { toast, ToastContainer } = useToast();

  const generate = () => {
    let text = "";
    if (type === "paragraphs") {
      const paras = Array.from({ length: count }, (_, i) => {
        const p = makeParagraph();
        return i === 0 && startWithLorem ? "Lorem ipsum " + p.slice(0, 1).toLowerCase() + p.slice(1) : p;
      });
      text = paras.join("\n\n");
    } else if (type === "sentences") {
      const sents = Array.from({ length: count }, (_, i) => {
        const s = makeSentence();
        return i === 0 && startWithLorem ? "Lorem ipsum " + s.slice(0, 1).toLowerCase() + s.slice(1) : s;
      });
      text = sents.join(" ");
    } else {
      const words = Array.from({ length: count }, randomWord);
      if (startWithLorem && words.length >= 2) { words[0] = "Lorem"; words[1] = "ipsum"; }
      text = words.join(" ");
    }
    setOutput(text);
  };

  return (
    <div style={{ maxWidth: "720px", margin: "0 auto" }}>
      <ToastContainer />

      <div className="card" style={{ marginBottom: "16px" }}>
        {/* Controls */}
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginBottom: "20px", alignItems: "flex-end" }}>
          <div>
            <label style={{ display: "block", marginBottom: "8px", fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "0.85rem" }}>Output type</label>
            <div style={{ display: "flex", gap: "8px" }}>
              {(["paragraphs", "sentences", "words"] as OutputType[]).map((t) => (
                <button key={t} onClick={() => setType(t)} className={`btn ${type === t ? "btn-primary" : "btn-secondary"} btn-sm`} style={{ textTransform: "capitalize" }}>
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label style={{ display: "block", marginBottom: "8px", fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "0.85rem" }}>Count</label>
            <input type="number" min={1} max={50} value={count} onChange={(e) => setCount(Math.max(1, Math.min(50, Number(e.target.value))))} className="input" style={{ width: "80px" }} />
          </div>
          <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", fontSize: "0.85rem", fontFamily: "var(--font-display)" }}>
            <input type="checkbox" checked={startWithLorem} onChange={(e) => setStartWithLorem(e.target.checked)} style={{ accentColor: "var(--color-accent)" }} />
            Start with "Lorem ipsum"
          </label>
        </div>

        <button onClick={generate} className="btn btn-primary btn-md" style={{ width: "100%" }}>
          📄 Generate {count} {type}
        </button>
      </div>

      {output && (
        <div className="result-panel animate-scale-in">
          <div className="result-panel-header">
            <span style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "0.85rem" }}>
              {output.split(/\s+/).length} words · {output.length} chars
            </span>
            <button onClick={async () => { await copyToClipboard(output); toast("Copied!", "success"); }} className="btn btn-secondary btn-sm">
              📋 Copy all
            </button>
          </div>
          <div style={{ padding: "20px", color: "var(--color-text-muted)", lineHeight: 1.8, fontSize: "0.9rem", whiteSpace: "pre-wrap" }}>
            {output}
          </div>
        </div>
      )}
    </div>
  );
}
