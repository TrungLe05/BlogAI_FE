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
      className="text-center px-5 sm:px-8 py-3 sm:py-4 flex-1 sm:flex-none min-w-[88px] transition-all"
      onClick={onClick}
      style={{
        border: "3px solid rgba(255,255,255,0.3)",
        background: "rgba(255,255,255,0.06)",
        cursor: onClick ? "pointer" : "default",
      }}
      onMouseEnter={(e) => {
        if (onClick)
          e.currentTarget.style.background = "rgba(255,255,255,0.15)";
      }}
      onMouseLeave={(e) => {
        if (onClick)
          e.currentTarget.style.background = "rgba(255,255,255,0.06)";
      }}
    >
      <p className="font-black text-xl sm:text-2xl text-white font-display">
        {value}
      </p>
      <p className="text-[10px] sm:text-xs text-white/50 uppercase tracking-[0.15em] mt-1 font-display">
        {label}
      </p>
    </div>
  );
}

export default StatBox;
