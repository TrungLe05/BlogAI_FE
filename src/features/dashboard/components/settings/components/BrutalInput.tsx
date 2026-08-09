import { useState } from "react";

export default function BrutalInput({
  type = "text",
  placeholder,
  value,
  onChange,
  suffix,
}: {
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (v: string) => void;
  suffix?: React.ReactNode;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ position: "relative" }}>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{ width: "100%",
          padding: suffix ? "10px 44px 10px 12px" : "10px 12px",
          
          fontSize: "0.875rem",
          color: "#0d0d0d",
          background: focused ? "#dbe4e5" : "#ffffff",
          border: "3px solid #0d0d0d",
          borderRadius: 0,
          outline: "none",
          boxShadow: focused ? "3px 3px 0 #0d0d0d" : "none",
          transition: "background 0.15s, box-shadow 0.15s",
          boxSizing: "border-box" as const }}
      />
      {suffix && (
        <div
          style={{
            position: "absolute",
            right: 12,
            top: "50%",
            transform: "translateY(-50%)",
            color: "#5b403d",
            cursor: "pointer",
            display: "flex",
          }}
        >
          {suffix}
        </div>
      )}
    </div>
  );
}
