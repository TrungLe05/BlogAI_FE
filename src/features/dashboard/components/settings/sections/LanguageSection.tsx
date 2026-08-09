import { useState } from "react";
import { Check } from "lucide-react";
import { toast } from "sonner";
import SaveButton from "../components/SaveButton";

type Language = "en" | "vi";

// ── LanguageSection ────────────────────────────────────────────────
const LANGUAGES: { code: Language; label: string; flag: string }[] = [
  { code: "en", label: "English", flag: "🇺🇸" },
  { code: "vi", label: "Tiếng Việt", flag: "🇻🇳" },
];

export default function LanguageSection() {
  const [selected, setSelected] = useState<Language>("en");
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      {LANGUAGES.map((lang) => (
        <button
          key={lang.code}
          onClick={() => setSelected(lang.code)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "12px 14px",
            background: selected === lang.code ? "#af101a" : "#ffffff",
            border:
              selected === lang.code
                ? "3px solid #0d0d0d"
                : "2px solid #0d0d0d",
            boxShadow: selected === lang.code ? "4px 4px 0 #0d0d0d" : "none",
            cursor: "pointer",
            textAlign: "left" as const,
            width: "100%",
            transition: "all 0.12s",
          }}
        >
          <span style={{ fontSize: "1.3rem", lineHeight: 1 }}>{lang.flag}</span>
          <div>
            <p
              className="font-display" style={{ fontWeight: 700,
                fontSize: "0.85rem",
                color: selected === lang.code ? "#ffffff" : "#0d0d0d",
                margin: 0 }}
            >
              {lang.label}
            </p>
            <p
              className="font-sans" style={{ fontSize: "0.68rem",
                color:
                  selected === lang.code ? "rgba(255,255,255,0.65)" : "#5b403d",
                margin: 0 }}
            >
              {lang.code.toUpperCase()}
            </p>
          </div>
          {selected === lang.code && (
            <Check size={15} style={{ marginLeft: "auto", color: "#ffffff" }} />
          )}
        </button>
      ))}
      <div style={{ marginTop: 8 }}>
        <SaveButton
          onClick={() =>
            toast.success(
              `Language set to ${LANGUAGES.find((l) => l.code === selected)?.label}`,
            )
          }
          label="Apply Language"
        />
      </div>
    </div>
  );
}
