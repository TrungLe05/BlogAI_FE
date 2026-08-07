import { Check, Laptop, Moon, Sun } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";

// ── AppearanceSection ──────────────────────────────────────────────
type Theme = "light" | "dark" | "system";
const THEMES: {
  key: Theme;
  icon: React.ReactNode;
  label: string;
  desc: string;
}[] = [
  {
    key: "light",
    icon: <Sun size={26} />,
    label: "Light",
    desc: "Always light",
  },
  { key: "dark", icon: <Moon size={26} />, label: "Dark", desc: "Always dark" },
  {
    key: "system",
    icon: <Laptop size={26} />,
    label: "System",
    desc: "Follow OS",
  },
];

export function AppearanceSection() {
  const { theme, changeTheme } = useTheme();
  return (
    <div className="dark:bg-black">
      <p className="dark:text-white text-[#5b403d] font-sans"
        style={{ fontSize: "0.82rem",
          // color: "#5b403d",
          marginBottom: 16 }}
      >
        Choose how BlogAI looks. Saved locally on this device.
      </p>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 10,
          marginBottom: 20,
        }}
      >
        {THEMES.map((t) => (
          <button
            key={t.key}
            onClick={() => changeTheme(t.key)}
            style={{
              padding: "20px 10px",
              background: theme === t.key ? "#0d0d0d" : "#ffffff",
              border:
                theme === t.key ? "3px solid #af101a" : "3px solid #0d0d0d",
              boxShadow:
                theme === t.key ? "4px 4px 0 #af101a" : "3px 3px 0 #0d0d0d",
              cursor: "pointer",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 6,
              transition: "all 0.12s",
            }}
          >
            <span style={{ color: theme === t.key ? "#ffffff" : "#0d0d0d" }}>
              {t.icon}
            </span>
            <p
              className="font-display" style={{ fontWeight: 900,
                fontSize: "0.78rem",
                letterSpacing: "0.05em",
                color: theme === t.key ? "#ffffff" : "#0d0d0d",
                margin: 0 }}
            >
              {t.label}
            </p>
            <p
              className="font-sans" style={{ fontSize: "0.65rem",
                color: theme === t.key ? "rgba(255,255,255,0.55)" : "#5b403d",
                margin: 0,
                textAlign: "center" as const }}
            >
              {t.desc}
            </p>
            {theme === t.key && (
              <span
                style={{
                  background: "#af101a",
                  color: "white",
                  width: 18,
                  height: 18,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "2px solid white",
                  marginTop: 2,
                }}
              >
                <Check size={10} />
              </span>
            )}
          </button>
        ))}
      </div>
      {/* <SaveButton
        onClick={() => toast.success(`Theme set to "${theme}"`)}
        label="Apply Theme"
      /> */}
    </div>
  );
}
