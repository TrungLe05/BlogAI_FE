import { useState } from "react";
import {
  User,
  Lock,
  Bell,
  Globe,
  Monitor,
  ShieldCheck,
  ChevronRight,
} from "lucide-react";
// import { AccountSection } from "./sections/AccountSection";
import { PasswordSection } from "./sections/PasswordSection";
import { NotificationsSection } from "./sections/NotificationsSection";
import { LanguageSection } from "./sections/LanguageSection";
import { AppearanceSection } from "./sections/AppearanceSection";
import { TwoFASection } from "./sections/TwoFASection";

type SettingsSection =
  | "password"
  | "notifications"
  | "language"
  | "appearance"
  | "2fa";

const NAV_ITEMS: {
  key: SettingsSection;
  icon: React.ReactNode;
  label: string;
}[] = [
  { key: "password", icon: <Lock size={14} />, label: "Password" },
  { key: "notifications", icon: <Bell size={14} />, label: "Notifications" },
  { key: "language", icon: <Globe size={14} />, label: "Language" },
  { key: "appearance", icon: <Monitor size={14} />, label: "Appearance" },
  { key: "2fa", icon: <ShieldCheck size={14} />, label: "2FA" },
];

const SECTION_TITLES: Record<
  SettingsSection,
  { icon: React.ReactNode; label: string }
> = {
  password: { icon: <Lock size={14} />, label: "Password & Security" },
  notifications: {
    icon: <Bell size={14} />,
    label: "Notification Preferences",
  },
  language: { icon: <Globe size={14} />, label: "Language & Region" },
  appearance: { icon: <Monitor size={14} />, label: "Appearance" },
  "2fa": {
    icon: <ShieldCheck size={14} />,
    label: "Two-Factor Authentication",
  },
};

export function SettingsContent() {
  const [active, setActive] = useState<SettingsSection>("password");
  const sec = SECTION_TITLES[active];

  const content: Record<SettingsSection, React.ReactNode> = {
    // account: <AccountSection onNavigate={setActive} />,
    password: <PasswordSection />,
    notifications: <NotificationsSection />,
    language: <LanguageSection />,
    appearance: <AppearanceSection />,
    "2fa": <TwoFASection />,
  };

  return (
    <div className="flex h-full overflow-hidden bg-[#f2fbfc] dark:bg-zinc-950">
      {/* ── Left Nav ── */}
      <div className="w-50 shrink-0 flex flex-col overflow-hidden border-r-[3px] border-[#0d0d0d] dark:border-zinc-700 bg-white dark:bg-zinc-900">
        {/* Nav header */}
        <div className="px-4 py-3.5 bg-[#0d0d0d] dark:bg-zinc-800 border-b-[3px] border-[#0d0d0d] dark:border-zinc-700">
          <p
            className="font-black text-[0.6rem] uppercase tracking-[0.15em] text-white/55 m-0 font-display"
            
          >
            Preferences
          </p>
        </div>

        {/* Nav items */}
        {NAV_ITEMS.map((item, idx) => {
          const isActive = active === item.key;
          return (
            <button
              key={item.key}
              onClick={() => setActive(item.key)}
              className={[
                "flex items-center gap-2.5 px-3.5 py-3 w-full text-left cursor-pointer transition-colors border-none",
                idx < NAV_ITEMS.length - 1
                  ? "border-b border-[#e7f0f1] dark:border-zinc-800"
                  : "",
                isActive
                  ? "bg-[#af101a] text-white"
                  : "bg-transparent text-[#0d0d0d] dark:text-zinc-300 hover:bg-[#e7f0f1] dark:hover:bg-zinc-800",
              ].join(" ")}
            >
              <span
                className={
                  isActive ? "text-white" : "text-[#5b403d] dark:text-zinc-400"
                }
              >
                {item.icon}
              </span>
              <span
                className={`flex-1 font-bold text-[0.78rem] ${isActive ? "text-white" : "text-[#0d0d0d] dark:text-zinc-200"}`}
              >
                {item.label}
              </span>
              {isActive && <ChevronRight size={12} className="text-white/65" />}
            </button>
          );
        })}
      </div>

      {/* ── Right Content ── */}
      <div className="flex-1 flex flex-col overflow-hidden bg-[#f2fbfc] dark:bg-zinc-950">
        {/* Section header */}
        <div className="flex items-center gap-3.5 px-7 py-5 bg-white dark:bg-zinc-900 border-b-[3px] border-[#0d0d0d] dark:border-zinc-700 shrink-0">
          <span className="flex items-center justify-center w-9 h-9 shrink-0 bg-[#af101a] dark:bg-zinc-800 dark:border-2 dark:border-zinc-600 text-white">
            {sec.icon}
          </span>
          <h2
            className="font-black text-base text-[#0d0d0d] dark:text-white m-0 font-display"
            style={{ letterSpacing: "-0.01em" }}
          >
            {sec.label}
          </h2>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-auto p-7">{content[active]}</div>
      </div>
    </div>
  );
}
