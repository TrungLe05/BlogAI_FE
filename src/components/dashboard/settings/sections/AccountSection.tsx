import {
  Lock,
  Bell,
  Globe,
  Monitor,
  ShieldCheck,
  ChevronRight,
} from "lucide-react";

type SettingsSection =
  | "password"
  | "notifications"
  | "appearance"
  | "language"
  | "2fa";

export function AccountSection({
  onNavigate,
}: {
  onNavigate: (s: SettingsSection) => void;
}) {
  const items: {
    section: SettingsSection;
    icon: React.ReactNode;
    label: string;
    sub: string;
  }[] = [
    {
      section: "password",
      icon: <Lock size={13} />,
      label: "Password & Security",
      sub: "Change your login password",
    },
    {
      section: "notifications",
      icon: <Bell size={13} />,
      label: "Notifications",
      sub: "Control what alerts you receive",
    },
    {
      section: "appearance",
      icon: <Monitor size={13} />,
      label: "Appearance",
      sub: "Light, dark or system theme",
    },
    {
      section: "language",
      icon: <Globe size={13} />,
      label: "Language & Region",
      sub: "Change display language",
    },
    {
      section: "2fa",
      icon: <ShieldCheck size={13} />,
      label: "Two-Factor Auth",
      sub: "Add extra login protection",
    },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <p
      className="dark:text-white text-[#5b403d] mb-2 text-[0.82rem]"
        style={{
          fontFamily: "var(--font-sans)",
        }}
      >
        Manage your account preferences, security, and display options.
      </p>
      {items.map((item) => (
        <button
          key={item.section}
          onClick={() => onNavigate(item.section)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "12px 14px",
            background: "#ffffff",
            border: "2px solid #0d0d0d",
            cursor: "pointer",
            textAlign: "left" as const,
            width: "100%",
            transition: "background 0.12s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "#e7f0f1")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "#ffffff")}
        >
          <span
            style={{
              width: 28,
              height: 28,
              background: "#0d0d0d",
              color: "#ffffff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            {item.icon}
          </span>
          <div style={{ flex: 1 }}>
            <p
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: "0.82rem",
                color: "#0d0d0d",
                margin: 0,
              }}
            >
              {item.label}
            </p>
            <p
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "0.72rem",
                color: "#5b403d",
                margin: 0,
              }}
            >
              {item.sub}
            </p>
          </div>
          <ChevronRight size={14} style={{ color: "#af101a", flexShrink: 0 }} />
        </button>
      ))}
    </div>
  );
}
