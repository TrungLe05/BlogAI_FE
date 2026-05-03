/* ── Stat Box (Profile Banner) ─────────────────────── */
function StatBox({
  value,
  label,
  onClick,
}: {
  value: string;
  label: string;
  onClick?: () => void;
}) {
  return (
    <div
      className="text-center px-8 py-4 transition-all"
      onClick={onClick}
      style={{
        border: "3px solid rgba(255,255,255,0.3)",
        background: "rgba(255,255,255,0.06)",
        cursor: onClick ? "pointer" : "default",
      }}
      onMouseEnter={(e) => {
        if (onClick) e.currentTarget.style.background = "rgba(255,255,255,0.15)";
      }}
      onMouseLeave={(e) => {
        if (onClick) e.currentTarget.style.background = "rgba(255,255,255,0.06)";
      }}
    >
      <p className="font-black text-2xl text-white" style={{ fontFamily: "var(--font-display)" }}>
        {value}
      </p>
      <p className="text-xs text-white/50 uppercase tracking-[0.15em] mt-1" style={{ fontFamily: "var(--font-display)" }}>
        {label}
      </p>
    </div>
  );
}

export default StatBox;
