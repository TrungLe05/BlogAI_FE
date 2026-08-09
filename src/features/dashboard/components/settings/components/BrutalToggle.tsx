export default function BrutalToggle({
  enabled,
  onChange,
}: {
  enabled: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      onClick={() => onChange(!enabled)}
      style={{
        width: 46,
        height: 24,
        background: enabled ? "#af101a" : "#dbe4e5",
        border: "3px solid #0d0d0d",
        borderRadius: 0,
        position: "relative",
        cursor: "pointer",
        transition: "background 0.15s",
        flexShrink: 0,
      }}
    >
      <span
        style={{
          position: "absolute",
          left: enabled ? 20 : 2,
          top: "50%",
          transform: "translateY(-50%)",
          width: 13,
          height: 13,
          background: "white",
          border: "2px solid #0d0d0d",
          transition: "left 0.15s",
          display: "block",
        }}
      />
    </button>
  );
}
