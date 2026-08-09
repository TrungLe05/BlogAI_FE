// src/components/dashboard/AIResultPanel.tsx
import { useEffect, useState } from "react";
import { Sparkles, Check, X, ArrowDown, Loader2 } from "lucide-react";

// ── Types ─────────────────────────────────────────────────────────
interface Props {
  originalText: string;
  resultText: string | null;
  isLoading: boolean;
  onAccept: () => void;
  onDiscard: () => void;
}

// ── Component ─────────────────────────────────────────────────────
export function AIResultPanel({
  originalText,
  resultText,
  isLoading,
  onAccept,
  onDiscard,
}: Props) {
  const [visible, setVisible] = useState(false);

  // Slide-in animation
  useEffect(() => {
    if (isLoading || resultText) {
      requestAnimationFrame(() => setVisible(true));
    } else {
      setVisible(false);
    }
  }, [isLoading, resultText]);

  if (!isLoading && !resultText) return null;

  return (
    <div
      className="ai-result-panel"
      data-ai-result-panel
      style={{
        transition: "transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
        background: "white",
        border: "2px solid #0d0d0d",
        borderRadius: "4px",
        zIndex: 9998,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        fontFamily: "var(--font-sans)",
      }}
      data-visible={visible}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "12px 16px",
          background: "#0d0d0d",
          flexShrink: 0,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Sparkles size={14} color="#d32f2f" />
          <span
            style={{
              color: "white",
              fontSize: 11,
              fontWeight: 800,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
            }}
          >
            AI Suggestion
          </span>
          {isLoading && (
            <Loader2
              size={12}
              color="rgba(255,255,255,0.5)"
              className="animate-spin"
            />
          )}
        </div>
        <button
          onClick={onDiscard}
          style={{
            background: "transparent",
            border: "none",
            color: "rgba(255,255,255,0.5)",
            cursor: "pointer",
            padding: "2px",
            display: "flex",
            borderRadius: "4px",
            transition: "color 0.1s",
          }}
          onMouseEnter={(e) =>
            ((e.currentTarget as HTMLButtonElement).style.color = "white")
          }
          onMouseLeave={(e) =>
            ((e.currentTarget as HTMLButtonElement).style.color =
              "rgba(255,255,255,0.5)")
          }
        >
          <X size={14} />
        </button>
      </div>

      {/* Body */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "16px",
          display: "flex",
          flexDirection: "column",
          gap: 12,
        }}
      >
        {/* Original */}
        <div>
          <p
            style={{
              fontSize: 10,
              fontWeight: 800,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              color: "#8f6f6c",
              marginBottom: 6,
            }}
          >
            Original
          </p>
          <div
            style={{
              padding: "10px 12px",
              background: "#f9f3f0",
              borderRadius: "4px",
              border: "1px solid #e8d5cc",
              fontSize: 13,
              lineHeight: 1.6,
              color: "#666",
            }}
          >
            {originalText}
          </div>
        </div>

        {/* Arrow */}
        <div style={{ display: "flex", justifyContent: "center" }}>
          <ArrowDown size={16} color="#ccc" />
        </div>

        {/* Suggestion */}
        <div>
          <p
            style={{
              fontSize: 10,
              fontWeight: 800,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              color: "#d32f2f",
              marginBottom: 6,
            }}
          >
            Suggested
          </p>
          {isLoading ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {[100, 85, 70].map((w, i) => (
                <div
                  key={i}
                  style={{
                    height: 14,
                    width: `${w}%`,
                    background:
                      "linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)",
                    backgroundSize: "200% 100%",
                    animation: "shimmer 1.5s infinite",
                    borderRadius: 4,
                  }}
                />
              ))}
              <style>{`
                @keyframes shimmer {
                  0% { background-position: -200% 0; }
                  100% { background-position: 200% 0; }
                }
              `}</style>
            </div>
          ) : (
            <div
              style={{
                padding: "10px 12px",
                background: "#fef8f8",
                borderRadius: "4px",
                border: "2px solid #d32f2f",
                fontSize: 13,
                lineHeight: 1.6,
                color: "#151d1e",
                fontWeight: 500,
              }}
            >
              {resultText}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      {!isLoading && resultText && (
        <div
          style={{
            display: "flex",
            gap: 8,
            padding: "12px 16px",
            borderTop: "2px solid #f0f0f0",
            flexShrink: 0,
          }}
        >
          <button
            onClick={onAccept}
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
              padding: "8px 0",
              background: "#d32f2f",
              color: "white",
              border: "2px solid #0d0d0d",
              borderRadius: "3px",
              fontSize: 12,
              fontWeight: 800,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              cursor: "pointer",
              boxShadow: "3px 3px 0 #0d0d0d",
              transition: "transform 0.1s, box-shadow 0.1s",
            }}
            onMouseDown={(e) => {
              (e.currentTarget as HTMLButtonElement).style.transform =
                "translate(2px, 2px)";
              (e.currentTarget as HTMLButtonElement).style.boxShadow =
                "1px 1px 0 #0d0d0d";
            }}
            onMouseUp={(e) => {
              (e.currentTarget as HTMLButtonElement).style.transform = "";
              (e.currentTarget as HTMLButtonElement).style.boxShadow =
                "3px 3px 0 #0d0d0d";
            }}
          >
            <Check size={13} /> Accept
          </button>
          <button
            onClick={onDiscard}
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
              padding: "8px 0",
              background: "white",
              color: "#0d0d0d",
              border: "2px solid #0d0d0d",
              borderRadius: "3px",
              fontSize: 12,
              fontWeight: 800,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              cursor: "pointer",
              boxShadow: "3px 3px 0 #0d0d0d",
              transition: "transform 0.1s, box-shadow 0.1s",
            }}
            onMouseDown={(e) => {
              (e.currentTarget as HTMLButtonElement).style.transform =
                "translate(2px, 2px)";
              (e.currentTarget as HTMLButtonElement).style.boxShadow =
                "1px 1px 0 #0d0d0d";
            }}
            onMouseUp={(e) => {
              (e.currentTarget as HTMLButtonElement).style.transform = "";
              (e.currentTarget as HTMLButtonElement).style.boxShadow =
                "3px 3px 0 #0d0d0d";
            }}
          >
            <X size={13} /> Discard
          </button>
        </div>
      )}
    </div>
  );
}
