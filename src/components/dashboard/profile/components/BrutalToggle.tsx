import { useState } from "react";

/* ── Brutal Toggle Switch ──────────────────────────── */
function BrutalToggle({
  defaultOn = false,
  label,
}: {
  defaultOn?: boolean;
  label: string;
}) {
  const [on, setOn] = useState(defaultOn);
  return (
    <div className="flex items-center justify-between py-3" style={{ borderBottom: "3px solid #e7f0f1" }}>
      <span className="text-sm font-bold" style={{ color: "#151d1e", fontFamily: "var(--font-display)" }}>
        {label}
      </span>
      <button
        onClick={() => setOn(!on)}
        style={{
          width: "48px", height: "24px",
          background: on ? "#d32f2f" : "#dbe4e5",
          border: "3px solid #0d0d0d", borderRadius: 0,
          position: "relative", transition: "background 0.2s", cursor: "pointer",
        }}
      >
        <span
          style={{
            position: "absolute", top: "2px",
            left: on ? "22px" : "2px",
            width: "14px", height: "14px",
            background: "white", border: "2px solid #0d0d0d", transition: "left 0.2s",
          }}
        />
      </button>
    </div>
  );
}

export default BrutalToggle;
