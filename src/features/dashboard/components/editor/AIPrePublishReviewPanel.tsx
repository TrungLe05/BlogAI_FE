// src/components/dashboard/AIPrePublishReviewPanel.tsx
import { PrePublishReviewResult } from "@/features/blog/types/blog.types";
import { Sparkles, X, Loader2 } from "lucide-react";

interface CriteriaRow {
  label: string;
  score: number;
  suggestion: string;
}

interface Props {
  open: boolean;
  isLoading: boolean;
  result: PrePublishReviewResult | null;
  onPublishAnyway: () => void;
  onEditMore: () => void;
}

function scoreColor(score: number) {
  if (score >= 80) return "#16a34a";
  if (score >= 60) return "#f59e0b";
  return "#d32f2f";
}

export function AIPrePublishReviewPanel({
  open,
  isLoading,
  result,
  onPublishAnyway,
  onEditMore,
}: Props) {
  if (!open) return null;

  const rows: CriteriaRow[] | null = result
    ? [
        {
          label: "Readability",
          score: result.readability.score,
          suggestion: result.readability.suggestion,
        },
        {
          label: "SEO Score",
          score: result.seo.score,
          suggestion: result.seo.suggestion,
        },
        {
          label: "Engagement",
          score: result.engagement.score,
          suggestion: result.engagement.suggestion,
        },
        {
          label: "Summary Quality",
          score: result.summaryQuality.score,
          suggestion: result.summaryQuality.suggestion,
        },
      ]
    : null;

  const overallScore = rows
    ? Math.round(rows.reduce((sum, r) => sum + r.score, 0) / rows.length)
    : null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.35)",
        zIndex: 10000,
        display: "flex",
        justifyContent: "flex-end",
      }}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onEditMore();
      }}
    >
      <div
        style={{
          width: 420,
          maxWidth: "90vw",
          height: "100%",
          background: "white",
          borderLeft: "3px solid #0d0d0d",
          boxShadow: "-6px 0 0 #d32f2f",
          display: "flex",
          flexDirection: "column",
          animation: "slideIn 0.25s ease-out",
        }}
      >
        <style>{`
          @keyframes slideIn {
            from { transform: translateX(100%); }
            to { transform: translateX(0); }
          }
        `}</style>

        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "18px 20px",
            background: "#0d0d0d",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Sparkles size={16} color="#d32f2f" />
            <span
              style={{
                color: "white",
                fontSize: 13,
                fontWeight: 800,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
              }}
            >
              AI Pre-publish Review
            </span>
          </div>
          <button
            onClick={onEditMore}
            style={{
              background: "transparent",
              border: "none",
              color: "rgba(255,255,255,0.6)",
              cursor: "pointer",
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflowY: "auto", padding: 20 }}>
          {isLoading ? (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
                gap: 12,
                color: "#8f6f6c",
              }}
            >
              <Loader2 size={28} className="animate-spin" />
              <p style={{ fontSize: 13, fontWeight: 700 }}>
                Analyzing your post...
              </p>
            </div>
          ) : rows ? (
            <>
              {overallScore !== null && (
                <div
                  style={{
                    textAlign: "center",
                    padding: "16px 0 24px",
                    borderBottom: "2px solid #f0f0f0",
                    marginBottom: 20,
                  }}
                >
                  <div
                    className="font-display" style={{ fontSize: 42,
                      fontWeight: 900,
                      color: scoreColor(overallScore) }}
                  >
                    {overallScore}
                  </div>
                  <div
                    style={{
                      fontSize: 11,
                      fontWeight: 800,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      color: "#8f6f6c",
                    }}
                  >
                    Overall Score
                  </div>
                </div>
              )}

              <div
                style={{ display: "flex", flexDirection: "column", gap: 16 }}
              >
                {rows.map((row) => (
                  <div
                    key={row.label}
                    style={{
                      border: "2px solid #0d0d0d",
                      borderRadius: 4,
                      padding: "12px 14px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: 6,
                      }}
                    >
                      <span
                        style={{
                          fontSize: 12,
                          fontWeight: 800,
                          textTransform: "uppercase",
                          letterSpacing: "0.05em",
                        }}
                      >
                        {row.label}
                      </span>
                      <span
                        style={{
                          fontSize: 14,
                          fontWeight: 900,
                          color: scoreColor(row.score),
                        }}
                      >
                        {row.score}/100
                      </span>
                    </div>
                    <p
                      style={{
                        fontSize: 12.5,
                        color: "#5b403d",
                        lineHeight: 1.5,
                        margin: 0,
                      }}
                    >
                      {row.suggestion}
                    </p>
                  </div>
                ))}
              </div>
            </>
          ) : null}
        </div>

        {/* Footer */}
        {!isLoading && rows && (
          <div
            style={{
              display: "flex",
              gap: 10,
              padding: "16px 20px",
              borderTop: "2px solid #f0f0f0",
            }}
          >
            <button
              onClick={onEditMore}
              style={{
                flex: 1,
                padding: "10px 0",
                background: "white",
                border: "2px solid #0d0d0d",
                borderRadius: 3,
                fontSize: 12,
                fontWeight: 800,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                cursor: "pointer",
              }}
            >
              Fix More
            </button>
            <button
              onClick={onPublishAnyway}
              style={{
                flex: 1,
                padding: "10px 0",
                background: "#af101a",
                color: "white",
                border: "2px solid #0d0d0d",
                borderRadius: 3,
                fontSize: 12,
                fontWeight: 800,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                cursor: "pointer",
              }}
            >
              Publish anyway
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
