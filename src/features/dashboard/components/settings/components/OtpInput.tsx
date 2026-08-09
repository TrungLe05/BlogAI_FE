export default function OtpInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <input
      type="text"
      inputMode="numeric"
      maxLength={6}
      placeholder="000000"
      value={value}
      onChange={(e) => onChange(e.target.value.replace(/\D/g, ""))}
      style={{ width: "100%",
        padding: "14px",
        
        fontWeight: 900,
        fontSize: "1.5rem",
        letterSpacing: "0.5em",
        textAlign: "center" as const,
        color: "#0d0d0d",
        background: "#ffffff",
        border: "3px solid #0d0d0d",
        borderRadius: 0,
        outline: "none",
        boxSizing: "border-box" as const,
        transition: "box-shadow 0.15s" }}
      onFocus={(e) => (e.currentTarget.style.boxShadow = "4px 4px 0 #af101a")}
      onBlur={(e) => (e.currentTarget.style.boxShadow = "none")}
    />
  );
}
