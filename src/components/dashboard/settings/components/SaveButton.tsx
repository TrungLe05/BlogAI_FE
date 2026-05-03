import { useState } from "react";
import { Check, Loader2 } from "lucide-react";

export function SaveButton({
  onClick,
  loading,
  label = "Save Changes",
}: {
  onClick: () => void;
  loading?: boolean;
  label?: string;
}) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onClick}
      disabled={loading}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        padding: "11px 22px",
        fontFamily: "var(--font-display)",
        fontWeight: 900,
        fontSize: "0.75rem",
        letterSpacing: "0.1em",
        textTransform: "uppercase" as const,
        color: "#ffffff",
        background: loading ? "#888" : "#af101a",
        border: "3px solid #0d0d0d",
        boxShadow: hov && !loading ? "6px 6px 0 #0d0d0d" : "4px 4px 0 #0d0d0d",
        transform: hov && !loading ? "translate(-2px,-2px)" : "translate(0,0)",
        cursor: loading ? "not-allowed" : "pointer",
        width: "100%",
        transition: "transform 0.15s, box-shadow 0.15s",
      }}
    >
      {loading ? (
        <Loader2 size={14} className="animate-spin" />
      ) : (
        <Check size={14} />
      )}
      {loading ? "Saving..." : label}
    </button>
  );
}
