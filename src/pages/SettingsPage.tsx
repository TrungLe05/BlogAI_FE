import { useEffect, useState } from "react";
import {
  Lock,
  Bell,
  Globe,
  Monitor,
  ShieldCheck,
  User,
  Eye,
  EyeOff,
  Check,
  Sun,
  Moon,
  Laptop,
  ChevronRight,
  Loader2,
  Mail,
  MessageSquare,
  Heart,
  AtSign,
  Newspaper,
  Megaphone,
} from "lucide-react";
import { toast } from "sonner";
import { authApi } from "@/api/authApi";
import { extractApiError } from "@/utils/apiError";

/* ── Types ── */
type SettingsSection =
  | "account"
  | "password"
  | "notifications"
  | "language"
  | "appearance"
  | "2fa";

type Theme = "light" | "dark" | "system";
type Language = "en" | "vi" | "ja" | "fr" | "de";

/* ── Shared sub-components ── */

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        borderBottom: "3px solid #0d0d0d",
        paddingBottom: "12px",
        marginBottom: "24px",
        display: "flex",
        alignItems: "center",
        gap: "10px",
      }}
    >
      <h2
        style={{
          fontFamily: "var(--font-display)",
          fontWeight: 900,
          fontSize: "1.1rem",
          color: "#0d0d0d",
          margin: 0,
          letterSpacing: "-0.01em",
        }}
      >
        {children}
      </h2>
    </div>
  );
}

function FieldLabel({ children }: { children: string }) {
  return (
    <label
      style={{
        display: "block",
        fontFamily: "var(--font-display)",
        fontWeight: 700,
        fontSize: "0.7rem",
        letterSpacing: "0.1em",
        textTransform: "uppercase",
        color: "#0d0d0d",
        marginBottom: "6px",
      }}
    >
      {children}
    </label>
  );
}

function BrutalInput({
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
        style={{
          width: "100%",
          padding: suffix ? "11px 44px 11px 14px" : "11px 14px",
          fontFamily: "var(--font-sans)",
          fontSize: "0.9rem",
          color: "#0d0d0d",
          background: focused ? "#dbe4e5" : "#ffffff",
          border: "3px solid #0d0d0d",
          borderRadius: 0,
          outline: "none",
          boxShadow: focused ? "3px 3px 0 #0d0d0d" : "none",
          transition: "background 0.15s, box-shadow 0.15s",
          boxSizing: "border-box",
        }}
      />
      {suffix && (
        <div
          style={{
            position: "absolute",
            right: "12px",
            top: "50%",
            transform: "translateY(-50%)",
            color: "#5b403d",
            cursor: "pointer",
          }}
        >
          {suffix}
        </div>
      )}
    </div>
  );
}

function BrutalToggle({
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
        width: "48px",
        height: "26px",
        background: enabled ? "#af101a" : "#e7f0f1",
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
          left: enabled ? "22px" : "2px",
          top: "50%",
          transform: "translateY(-50%)",
          width: "14px",
          height: "14px",
          background: "white",
          border: "2px solid #0d0d0d",
          transition: "left 0.15s",
          display: "block",
        }}
      />
    </button>
  );
}

function ToggleRow({
  icon,
  label,
  sub,
  enabled,
  onChange,
}: {
  icon: React.ReactNode;
  label: string;
  sub: string;
  enabled: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "14px 16px",
        background: "#ffffff",
        border: "2px solid #0d0d0d",
        marginBottom: "8px",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <span
          style={{
            width: "32px",
            height: "32px",
            background: "#e7f0f1",
            border: "2px solid #0d0d0d",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          {icon}
        </span>
        <div>
          <p
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: "0.85rem",
              color: "#0d0d0d",
              margin: 0,
            }}
          >
            {label}
          </p>
          <p
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "0.75rem",
              color: "#5b403d",
              margin: 0,
            }}
          >
            {sub}
          </p>
        </div>
      </div>
      <BrutalToggle enabled={enabled} onChange={onChange} />
    </div>
  );
}

/* ── Section: Password ── */
function PasswordSection() {
  const [current, setCurrent] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!current || !newPwd || !confirm) {
      toast.error("Please fill in all fields.");
      return;
    }
    if (newPwd !== confirm) {
      toast.error("New passwords do not match.");
      return;
    }
    if (newPwd.length < 8) {
      toast.error("Password must be at least 8 characters.");
      return;
    }
    setLoading(true);
    try {
      await authApi.changePassword({
        currentPassword: current,
        newPassword: newPwd,
        confirmPassword: confirm,
      });
      toast.success("Password changed successfully!");
      setCurrent("");
      setNewPwd("");
      setConfirm("");
    } catch (e) {
      toast.error(extractApiError(e));
    } finally {
      setLoading(false);
    }
  };

  const strength =
    newPwd.length === 0
      ? 0
      : newPwd.length < 6
        ? 1
        : newPwd.length < 10
          ? 2
          : 3;
  const strengthLabels = ["", "Weak", "Fair", "Strong"];
  const strengthColors = ["", "#af101a", "#f59e0b", "#16a34a"];

  return (
    <div>
      <SectionTitle>
        <Lock size={17} style={{ color: "#af101a" }} />
        Password &amp; Security
      </SectionTitle>

      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <div>
          <FieldLabel>Current Password</FieldLabel>
          <BrutalInput
            type={showCurrent ? "text" : "password"}
            placeholder="Enter current password"
            value={current}
            onChange={setCurrent}
            suffix={
              <span onClick={() => setShowCurrent((v) => !v)}>
                {showCurrent ? <EyeOff size={15} /> : <Eye size={15} />}
              </span>
            }
          />
        </div>

        <div>
          <FieldLabel>New Password</FieldLabel>
          <BrutalInput
            type={showNew ? "text" : "password"}
            placeholder="Enter new password"
            value={newPwd}
            onChange={setNewPwd}
            suffix={
              <span onClick={() => setShowNew((v) => !v)}>
                {showNew ? <EyeOff size={15} /> : <Eye size={15} />}
              </span>
            }
          />
          {/* Strength bar */}
          {newPwd.length > 0 && (
            <div style={{ marginTop: "8px" }}>
              <div
                style={{
                  display: "flex",
                  gap: "4px",
                  marginBottom: "4px",
                }}
              >
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    style={{
                      flex: 1,
                      height: "6px",
                      background:
                        i <= strength ? strengthColors[strength] : "#dbe4e5",
                      border: "1px solid #0d0d0d",
                      transition: "background 0.2s",
                    }}
                  />
                ))}
              </div>
              <p
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "0.7rem",
                  fontWeight: 700,
                  color: strengthColors[strength],
                  margin: 0,
                }}
              >
                {strengthLabels[strength]}
              </p>
            </div>
          )}
        </div>

        <div>
          <FieldLabel>Confirm New Password</FieldLabel>
          <BrutalInput
            type={showConfirm ? "text" : "password"}
            placeholder="Repeat new password"
            value={confirm}
            onChange={setConfirm}
            suffix={
              <span onClick={() => setShowConfirm((v) => !v)}>
                {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
              </span>
            }
          />
          {confirm.length > 0 && newPwd !== confirm && (
            <p
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "0.75rem",
                color: "#af101a",
                marginTop: "4px",
              }}
            >
              Passwords do not match.
            </p>
          )}
        </div>

        <button
          onClick={handleSave}
          disabled={loading}
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            padding: "12px 24px",
            fontFamily: "var(--font-display)",
            fontWeight: 900,
            fontSize: "0.8rem",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "#ffffff",
            background: loading ? "#888" : "#af101a",
            border: "3px solid #0d0d0d",
            boxShadow: "4px 4px 0 #0d0d0d",
            cursor: loading ? "not-allowed" : "pointer",
            width: "100%",
            transition: "transform 0.15s, box-shadow 0.15s",
          }}
          onMouseEnter={(e) => {
            if (!loading) {
              e.currentTarget.style.transform = "translate(-2px,-2px)";
              e.currentTarget.style.boxShadow = "6px 6px 0 #0d0d0d";
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translate(0,0)";
            e.currentTarget.style.boxShadow = "4px 4px 0 #0d0d0d";
          }}
        >
          {loading ? (
            <Loader2 size={15} className="animate-spin" />
          ) : (
            <Check size={15} />
          )}
          {loading ? "Saving..." : "Save Password"}
        </button>
      </div>

      {/* Security Tips */}
      <div
        style={{
          marginTop: "24px",
          background: "#e7f0f1",
          border: "2px solid #0d0d0d",
          padding: "16px",
        }}
      >
        <p
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 700,
            fontSize: "0.7rem",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "#0d0d0d",
            margin: "0 0 10px 0",
          }}
        >
          💡 Security Tips
        </p>
        {[
          "Use at least 8 characters with symbols",
          "Never reuse passwords across websites",
          "Consider enabling Two-Factor Auth below",
        ].map((tip) => (
          <p
            key={tip}
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "0.8rem",
              color: "#5b403d",
              margin: "0 0 5px 0",
              paddingLeft: "12px",
              borderLeft: "3px solid #af101a",
            }}
          >
            {tip}
          </p>
        ))}
      </div>
    </div>
  );
}

/* ── Section: Notifications ── */
function NotificationsSection() {
  const [notifs, setNotifs] = useState({
    followers: true,
    postLikes: true,
    comments: true,
    mentions: true,
    emailDigest: false,
    marketing: false,
  });

  const toggle = (key: keyof typeof notifs) =>
    setNotifs((p) => ({ ...p, [key]: !p[key] }));

  const rows: {
    key: keyof typeof notifs;
    icon: React.ReactNode;
    label: string;
    sub: string;
  }[] = [
    {
      key: "followers",
      icon: <User size={14} />,
      label: "New Followers",
      sub: "When someone starts following you",
    },
    {
      key: "postLikes",
      icon: <Heart size={14} />,
      label: "Post Likes",
      sub: "When someone likes your article",
    },
    {
      key: "comments",
      icon: <MessageSquare size={14} />,
      label: "Comments",
      sub: "When someone comments on your post",
    },
    {
      key: "mentions",
      icon: <AtSign size={14} />,
      label: "Mentions",
      sub: "When someone mentions you in a post",
    },
    {
      key: "emailDigest",
      icon: <Newspaper size={14} />,
      label: "Weekly Email Digest",
      sub: "Top stories and your performance stats",
    },
    {
      key: "marketing",
      icon: <Megaphone size={14} />,
      label: "Marketing Emails",
      sub: "Product updates and announcements",
    },
  ];

  return (
    <div>
      <SectionTitle>
        <Bell size={17} style={{ color: "#af101a" }} />
        Notification Preferences
      </SectionTitle>

      <div
        style={{
          background: "#e7f0f1",
          border: "3px solid #0d0d0d",
          padding: "16px",
          marginBottom: "16px",
        }}
      >
        <p
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 700,
            fontSize: "0.7rem",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "#0d0d0d",
            margin: "0 0 4px 0",
          }}
        >
          In-App Notifications
        </p>
        <p
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "0.78rem",
            color: "#5b403d",
            margin: 0,
          }}
        >
          Control which activities trigger notifications in the platform.
        </p>
      </div>

      {rows.map((r) => (
        <ToggleRow
          key={r.key}
          icon={r.icon}
          label={r.label}
          sub={r.sub}
          enabled={notifs[r.key]}
          onChange={() => toggle(r.key)}
        />
      ))}

      <button
        onClick={() => toast.success("Notification preferences saved.")}
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",
          padding: "12px 24px",
          fontFamily: "var(--font-display)",
          fontWeight: 900,
          fontSize: "0.8rem",
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: "#ffffff",
          background: "#0d0d0d",
          border: "3px solid #0d0d0d",
          boxShadow: "4px 4px 0 #af101a",
          cursor: "pointer",
          width: "100%",
          marginTop: "16px",
          transition: "transform 0.15s, box-shadow 0.15s",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translate(-2px,-2px)";
          e.currentTarget.style.boxShadow = "6px 6px 0 #af101a";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translate(0,0)";
          e.currentTarget.style.boxShadow = "4px 4px 0 #af101a";
        }}
      >
        <Check size={15} />
        Save Preferences
      </button>
    </div>
  );
}

/* ── Section: Language ── */
const LANGUAGES: { code: Language; label: string; flag: string }[] = [
  { code: "en", label: "English", flag: "🇺🇸" },
  { code: "vi", label: "Tiếng Việt", flag: "🇻🇳" },
  { code: "ja", label: "日本語", flag: "🇯🇵" },
  { code: "fr", label: "Français", flag: "🇫🇷" },
  { code: "de", label: "Deutsch", flag: "🇩🇪" },
];

function LanguageSection() {
  const [selected, setSelected] = useState<Language>("en");

  return (
    <div>
      <SectionTitle>
        <Globe size={17} style={{ color: "#af101a" }} />
        Language &amp; Region
      </SectionTitle>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "8px",
          marginBottom: "24px",
        }}
      >
        {LANGUAGES.map((lang) => (
          <button
            key={lang.code}
            onClick={() => setSelected(lang.code)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "14px",
              padding: "14px 16px",
              background: selected === lang.code ? "#af101a" : "#ffffff",
              border:
                selected === lang.code
                  ? "3px solid #0d0d0d"
                  : "2px solid #0d0d0d",
              boxShadow: selected === lang.code ? "4px 4px 0 #0d0d0d" : "none",
              cursor: "pointer",
              textAlign: "left",
              width: "100%",
              transition: "all 0.15s",
            }}
          >
            <span style={{ fontSize: "1.4rem", lineHeight: 1 }}>
              {lang.flag}
            </span>
            <div>
              <p
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 700,
                  fontSize: "0.9rem",
                  color: selected === lang.code ? "#ffffff" : "#0d0d0d",
                  margin: 0,
                }}
              >
                {lang.label}
              </p>
              <p
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: "0.72rem",
                  color:
                    selected === lang.code
                      ? "rgba(255,255,255,0.7)"
                      : "#5b403d",
                  margin: 0,
                }}
              >
                {lang.code.toUpperCase()}
              </p>
            </div>
            {selected === lang.code && (
              <Check
                size={16}
                style={{ marginLeft: "auto", color: "#ffffff" }}
              />
            )}
          </button>
        ))}
      </div>

      <button
        onClick={() =>
          toast.success(
            `Language changed to ${LANGUAGES.find((l) => l.code === selected)?.label}`,
          )
        }
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",
          padding: "12px 24px",
          fontFamily: "var(--font-display)",
          fontWeight: 900,
          fontSize: "0.8rem",
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: "#ffffff",
          background: "#af101a",
          border: "3px solid #0d0d0d",
          boxShadow: "4px 4px 0 #0d0d0d",
          cursor: "pointer",
          width: "100%",
          transition: "transform 0.15s, box-shadow 0.15s",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translate(-2px,-2px)";
          e.currentTarget.style.boxShadow = "6px 6px 0 #0d0d0d";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translate(0,0)";
          e.currentTarget.style.boxShadow = "4px 4px 0 #0d0d0d";
        }}
      >
        <Check size={15} />
        Apply Language
      </button>
    </div>
  );
}

/* ── Section: Appearance ── */
function AppearanceSection() {
  const [theme, setTheme] = useState<Theme>("system");

  const themes: {
    key: Theme;
    icon: React.ReactNode;
    label: string;
    desc: string;
  }[] = [
    {
      key: "light",
      icon: <Sun size={28} />,
      label: "Light",
      desc: "Always use the light theme",
    },
    {
      key: "dark",
      icon: <Moon size={28} />,
      label: "Dark",
      desc: "Always use the dark theme",
    },
    {
      key: "system",
      icon: <Laptop size={28} />,
      label: "System",
      desc: "Follow OS preference",
    },
  ];

  return (
    <div>
      <SectionTitle>
        <Monitor size={17} style={{ color: "#af101a" }} />
        Appearance
      </SectionTitle>

      <p
        style={{
          fontFamily: "var(--font-sans)",
          fontSize: "0.85rem",
          color: "#5b403d",
          marginBottom: "20px",
        }}
      >
        Choose how BlogAI looks. This setting is saved locally on this device.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "12px",
          marginBottom: "28px",
        }}
      >
        {themes.map((t) => (
          <button
            key={t.key}
            onClick={() => setTheme(t.key)}
            style={{
              padding: "24px 12px",
              background: theme === t.key ? "#0d0d0d" : "#ffffff",
              border:
                theme === t.key ? "3px solid #af101a" : "3px solid #0d0d0d",
              boxShadow:
                theme === t.key ? "4px 4px 0 #af101a" : "4px 4px 0 #0d0d0d",
              cursor: "pointer",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "8px",
              transition: "all 0.15s",
            }}
          >
            <span style={{ color: theme === t.key ? "#ffffff" : "#0d0d0d" }}>
              {t.icon}
            </span>
            <p
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 900,
                fontSize: "0.8rem",
                letterSpacing: "0.05em",
                color: theme === t.key ? "#ffffff" : "#0d0d0d",
                margin: 0,
              }}
            >
              {t.label}
            </p>
            <p
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "0.68rem",
                color: theme === t.key ? "rgba(255,255,255,0.6)" : "#5b403d",
                margin: 0,
                textAlign: "center",
              }}
            >
              {t.desc}
            </p>
            {theme === t.key && (
              <span
                style={{
                  background: "#af101a",
                  color: "white",
                  width: "20px",
                  height: "20px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "2px solid white",
                }}
              >
                <Check size={11} />
              </span>
            )}
          </button>
        ))}
      </div>

      <button
        onClick={() =>
          toast.success(`Theme set to "${theme}" — full dark mode coming soon!`)
        }
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",
          padding: "12px 24px",
          fontFamily: "var(--font-display)",
          fontWeight: 900,
          fontSize: "0.8rem",
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: "#ffffff",
          background: "#0d0d0d",
          border: "3px solid #0d0d0d",
          boxShadow: "4px 4px 0 #af101a",
          cursor: "pointer",
          width: "100%",
          transition: "transform 0.15s, box-shadow 0.15s",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translate(-2px,-2px)";
          e.currentTarget.style.boxShadow = "6px 6px 0 #af101a";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translate(0,0)";
          e.currentTarget.style.boxShadow = "4px 4px 0 #af101a";
        }}
      >
        <Check size={15} />
        Apply Theme
      </button>
    </div>
  );
}

/* ── Section: 2FA ── */
function TwoFASection() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [otpCode, setOtpCode] = useState("");
  const [enabled, setEnabled] = useState(false);
  const [recoveryCodes, setRecoveryCodes] = useState<string[]>([]);
  const [showRecovery, setShowRecovery] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleConfirmEnable = async () => {
    if (otpCode.length !== 6) return;
    setLoading(true);
    try {
      const { data } = await authApi.confirm2FA({ otpCode });
      console.log(data.result.recoveryCodes);
      setRecoveryCodes(data.result.recoveryCodes); // nhận từ backend
      setShowRecovery(true); // hiện màn hình recovery codes
      setEnabled(true);
      setStep(1);
      // setSetupData(null);
      setOtpCode("");
    } catch (e) {
      toast.error(extractApiError(e));
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    const get2FAStatus = async () => {
      const { data } = await authApi.get2FAStatus();
      setEnabled(data.result);
    };
    get2FAStatus();
  }, []);

  return (
    <div>
      <SectionTitle>
        <ShieldCheck size={17} style={{ color: "#af101a" }} />
        Two-Factor Authentication
      </SectionTitle>

      {/* Status badge */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          padding: "14px 16px",
          background: enabled ? "#e7f0f1" : "#fff",
          border: `3px solid ${enabled ? "#16a34a" : "#0d0d0d"}`,
          boxShadow: `4px 4px 0 ${enabled ? "#16a34a" : "#0d0d0d"}`,
          marginBottom: "24px",
        }}
      >
        <span
          style={{
            width: "12px",
            height: "12px",
            borderRadius: "50%",
            background: enabled ? "#16a34a" : "#af101a",
            display: "block",
            flexShrink: 0,
          }}
        />
        <div>
          <p
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 900,
              fontSize: "0.85rem",
              color: "#0d0d0d",
              margin: 0,
            }}
          >
            2FA is currently{" "}
            <span style={{ color: enabled ? "#16a34a" : "#af101a" }}>
              {enabled ? "ENABLED" : "DISABLED"}
            </span>
          </p>
          <p
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "0.75rem",
              color: "#5b403d",
              margin: 0,
            }}
          >
            {enabled
              ? "Your account is protected with an authenticator app."
              : "We recommend enabling 2FA for extra security."}
          </p>
        </div>
      </div>

      {!enabled && (
        <>
          {/* Progress bar */}
          <div
            style={{
              display: "flex",
              gap: "4px",
              marginBottom: "24px",
            }}
          >
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                style={{
                  flex: 1,
                  height: "6px",
                  border: "2px solid #0d0d0d",
                  background: s <= step ? "#af101a" : "#e7f0f1",
                  transition: "background 0.2s",
                }}
              />
            ))}
          </div>

          {step === 1 && (
            <div>
              <p
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 700,
                  fontSize: "0.9rem",
                  color: "#0d0d0d",
                  marginBottom: "8px",
                }}
              >
                Step 1: Install an Authenticator App
              </p>
              <p
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: "0.82rem",
                  color: "#5b403d",
                  marginBottom: "16px",
                  lineHeight: 1.6,
                }}
              >
                Download <strong>Google Authenticator</strong> or{" "}
                <strong>Authy</strong> on your mobile device, then click
                Continue.
              </p>
              <div
                style={{
                  display: "flex",
                  gap: "12px",
                  flexWrap: "wrap",
                }}
              >
                {["Google Authenticator", "Authy", "1Password"].map((app) => (
                  <span
                    key={app}
                    style={{
                      padding: "6px 14px",
                      background: "#0d0d0d",
                      color: "#ffffff",
                      fontFamily: "var(--font-display)",
                      fontWeight: 700,
                      fontSize: "0.75rem",
                      letterSpacing: "0.05em",
                      border: "2px solid #0d0d0d",
                    }}
                  >
                    {app}
                  </span>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <p
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 700,
                  fontSize: "0.9rem",
                  color: "#0d0d0d",
                  marginBottom: "8px",
                }}
              >
                Step 2: Scan QR Code
              </p>
              <p
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: "0.82rem",
                  color: "#5b403d",
                  marginBottom: "16px",
                }}
              >
                Open your authenticator app and scan this QR code.
              </p>
              {/* QR Placeholder */}
              <div
                style={{
                  width: "160px",
                  height: "160px",
                  border: "3px solid #0d0d0d",
                  boxShadow: "4px 4px 0 #0d0d0d",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "#ffffff",
                  marginBottom: "16px",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                {/* Simulated QR grid pattern */}
                <svg width="120" height="120" viewBox="0 0 120 120">
                  {Array.from({ length: 10 }).map((_, row) =>
                    Array.from({ length: 10 }).map((_, col) => (
                      <rect
                        key={`${row}-${col}`}
                        x={col * 12}
                        y={row * 12}
                        width={11}
                        height={11}
                        fill={Math.random() > 0.5 ? "#0d0d0d" : "#ffffff"}
                      />
                    )),
                  )}
                </svg>
                <span
                  style={{
                    position: "absolute",
                    bottom: "6px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    fontFamily: "var(--font-display)",
                    fontSize: "0.6rem",
                    fontWeight: 700,
                    color: "#af101a",
                    letterSpacing: "0.05em",
                    whiteSpace: "nowrap",
                  }}
                >
                  BLOGAI-2FA
                </span>
              </div>
              <p
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: "0.75rem",
                  color: "#5b403d",
                }}
              >
                Can't scan?{" "}
                <span
                  style={{
                    color: "#af101a",
                    fontWeight: 700,
                    cursor: "pointer",
                    textDecoration: "underline",
                  }}
                >
                  Enter code manually
                </span>
              </p>
            </div>
          )}

          {step === 3 && (
            <div>
              <p
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 700,
                  fontSize: "0.9rem",
                  color: "#0d0d0d",
                  marginBottom: "8px",
                }}
              >
                Step 3: Verify Code
              </p>
              <p
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: "0.82rem",
                  color: "#5b403d",
                  marginBottom: "16px",
                }}
              >
                Enter the 6-digit code from your authenticator app.
              </p>
              <BrutalInput
                placeholder="000000"
                value={otpCode}
                onChange={setOtpCode}
              />
            </div>
          )}

          <div
            style={{
              display: "flex",
              gap: "12px",
              marginTop: "20px",
            }}
          >
            {step > 1 && (
              <button
                onClick={() => setStep((s) => (s - 1) as 1 | 2 | 3)}
                style={{
                  padding: "11px 20px",
                  fontFamily: "var(--font-display)",
                  fontWeight: 700,
                  fontSize: "0.8rem",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "#0d0d0d",
                  background: "#ffffff",
                  border: "3px solid #0d0d0d",
                  boxShadow: "3px 3px 0 #0d0d0d",
                  cursor: "pointer",
                }}
              >
                Back
              </button>
            )}
            <button
              onClick={() => {
                if (step < 3) {
                  setStep((s) => (s + 1) as 2 | 3);
                } else {
                  if (otpCode.length !== 6) {
                    toast.error("Please enter a 6-digit code.");
                    return;
                  }
                  handleConfirmEnable();
                  // setEnabled(true);
                  toast.success("Two-Factor Authentication enabled!");
                }
              }}
              style={{
                flex: 1,
                padding: "12px 20px",
                fontFamily: "var(--font-display)",
                fontWeight: 900,
                fontSize: "0.8rem",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "#ffffff",
                background: "#af101a",
                border: "3px solid #0d0d0d",
                boxShadow: "4px 4px 0 #0d0d0d",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                transition: "transform 0.15s, box-shadow 0.15s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translate(-2px,-2px)";
                e.currentTarget.style.boxShadow = "6px 6px 0 #0d0d0d";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translate(0,0)";
                e.currentTarget.style.boxShadow = "4px 4px 0 #0d0d0d";
              }}
            >
              {step === 3 ? (
                <>
                  <ShieldCheck size={15} /> Enable 2FA
                </>
              ) : (
                <>
                  Continue <ChevronRight size={15} />
                </>
              )}
            </button>
          </div>
        </>
      )}

      {enabled && (
        <button
          onClick={() => {
            setEnabled(false);
            setStep(1);
            setOtpCode("");
            toast.success("2FA has been disabled.");
          }}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            padding: "11px 20px",
            fontFamily: "var(--font-display)",
            fontWeight: 700,
            fontSize: "0.8rem",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "#af101a",
            background: "#ffffff",
            border: "3px solid #af101a",
            boxShadow: "4px 4px 0 #af101a",
            cursor: "pointer",
          }}
        >
          Disable 2FA
        </button>
      )}
      {showRecovery && (
        <div
          style={{
            background: "#fff8f8",
            border: "3px solid #0d0d0d",
            boxShadow: "5px 5px 0 #0d0d0d",
            padding: 24,
          }}
        >
          <p
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 900,
              fontSize: "0.9rem",
              color: "#0d0d0d",
              margin: "0 0 6px",
            }}
          >
            ⚠️ Save your recovery codes
          </p>
          <p
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "0.78rem",
              color: "#5b403d",
              margin: "0 0 16px",
              lineHeight: 1.6,
            }}
          >
            Store these codes somewhere safe. Each can only be used once if you
            lose access to your authenticator app.
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 8,
              marginBottom: 16,
            }}
          >
            {recoveryCodes.map((code) => (
              <code
                key={code}
                style={{
                  padding: "8px 12px",
                  background: "#f2fbfc",
                  border: "2px solid #0d0d0d",
                  fontFamily: "monospace",
                  fontSize: "0.85rem",
                  fontWeight: 700,
                  letterSpacing: "0.05em",
                  textAlign: "center",
                }}
              >
                {code}
              </code>
            ))}
          </div>

          <div style={{ display: "flex", gap: 10 }}>
            <button
              onClick={() => {
                navigator.clipboard.writeText(recoveryCodes.join("\n"));
                toast.success("Copied to clipboard!");
              }}
              style={{
                flex: 1,
                padding: "10px",
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: "0.72rem",
                textTransform: "uppercase",
                color: "#0d0d0d",
                background: "#ffffff",
                border: "3px solid #0d0d0d",
                boxShadow: "3px 3px 0 #0d0d0d",
                cursor: "pointer",
              }}
            >
              Copy All
            </button>
            <button
              onClick={() => setShowRecovery(false)}
              style={{
                flex: 1,
                padding: "10px",
                fontFamily: "var(--font-display)",
                fontWeight: 900,
                fontSize: "0.72rem",
                textTransform: "uppercase",
                color: "#ffffff",
                background: "#16a34a",
                border: "3px solid #0d0d0d",
                boxShadow: "3px 3px 0 #0d0d0d",
                cursor: "pointer",
              }}
            >
              I've saved them ✓
            </button>
          </div>
        </div>
      )}
    </div>
    
  );
}

/* ── Account Section placeholder ── */
function AccountSection() {
  return (
    <div>
      <SectionTitle>
        <User size={17} style={{ color: "#af101a" }} />
        Account Overview
      </SectionTitle>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
        }}
      >
        {[
          {
            icon: <Mail size={14} />,
            label: "Change Email",
            sub: "Update your login email address",
          },
          {
            icon: <Lock size={14} />,
            label: "Change Password",
            sub: "Go to Password & Security →",
          },
          {
            icon: <ShieldCheck size={14} />,
            label: "Two-Factor Auth",
            sub: "Add an extra layer of protection",
          },
        ].map((item) => (
          <button
            key={item.label}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "14px",
              padding: "14px 16px",
              background: "#ffffff",
              border: "2px solid #0d0d0d",
              cursor: "pointer",
              textAlign: "left",
              width: "100%",
              transition: "background 0.15s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#e7f0f1")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "#ffffff")}
          >
            <span
              style={{
                width: "32px",
                height: "32px",
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
                  fontSize: "0.875rem",
                  color: "#0d0d0d",
                  margin: 0,
                }}
              >
                {item.label}
              </p>
              <p
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: "0.75rem",
                  color: "#5b403d",
                  margin: 0,
                }}
              >
                {item.sub}
              </p>
            </div>
            <ChevronRight
              size={16}
              style={{ color: "#af101a", flexShrink: 0 }}
            />
          </button>
        ))}
      </div>
    </div>
  );
}

/* ── Main Settings Page ── */
const NAV_ITEMS: {
  key: SettingsSection;
  icon: React.ReactNode;
  label: string;
}[] = [
  { key: "account", icon: <User size={16} />, label: "Account" },
  { key: "password", icon: <Lock size={16} />, label: "Password & Security" },
  { key: "notifications", icon: <Bell size={16} />, label: "Notifications" },
  { key: "language", icon: <Globe size={16} />, label: "Language & Region" },
  { key: "appearance", icon: <Monitor size={16} />, label: "Appearance" },
  { key: "2fa", icon: <ShieldCheck size={16} />, label: "Two-Factor Auth" },
];

function SettingsPage() {
  const [active, setActive] = useState<SettingsSection>("account");

  const sectionMap: Record<SettingsSection, React.ReactNode> = {
    account: <AccountSection />,
    password: <PasswordSection />,
    notifications: <NotificationsSection />,
    language: <LanguageSection />,
    appearance: <AppearanceSection />,
    "2fa": <TwoFASection />,
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f2fbfc",
        fontFamily: "var(--font-sans)",
      }}
    >
      {/* ── Page Header ── */}
      <div
        style={{
          background: "#0d0d0d",
          borderBottom: "4px solid #af101a",
        }}
      >
        <div
          style={{
            maxWidth: "1280px",
            margin: "0 auto",
            padding: "1.5rem 2rem",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div
              style={{
                background: "#af101a",
                border: "3px solid rgba(255,255,255,0.3)",
                width: "36px",
                height: "36px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Lock size={18} color="white" />
            </div>
            <div>
              <h1
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 900,
                  fontSize: "1.5rem",
                  color: "#ffffff",
                  margin: 0,
                  letterSpacing: "-0.02em",
                }}
              >
                Settings
              </h1>
              <p
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: "0.78rem",
                  color: "rgba(255,255,255,0.5)",
                  margin: 0,
                }}
              >
                Manage your account preferences and security
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Body ── */}
      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "2rem",
          display: "grid",
          gridTemplateColumns: "240px 1fr",
          gap: "2rem",
          alignItems: "start",
        }}
      >
        {/* LEFT: Nav Sidebar */}
        <div
          style={{
            background: "#ffffff",
            border: "3px solid #0d0d0d",
            boxShadow: "4px 4px 0 #0d0d0d",
          }}
        >
          {/* Sidebar header */}
          <div
            style={{
              padding: "14px 16px",
              background: "#0d0d0d",
              borderBottom: "3px solid #0d0d0d",
            }}
          >
            <p
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 900,
                fontSize: "0.7rem",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.6)",
                margin: 0,
              }}
            >
              Preferences
            </p>
          </div>

          {NAV_ITEMS.map((item, idx) => (
            <button
              key={item.key}
              onClick={() => setActive(item.key)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "13px 16px",
                width: "100%",
                textAlign: "left",
                background: active === item.key ? "#af101a" : "transparent",
                borderBottom:
                  idx < NAV_ITEMS.length - 1 ? "2px solid #e7f0f1" : "none",
                cursor: "pointer",
                transition: "background 0.12s",
              }}
              onMouseEnter={(e) => {
                if (active !== item.key)
                  e.currentTarget.style.background = "#e7f0f1";
              }}
              onMouseLeave={(e) => {
                if (active !== item.key)
                  e.currentTarget.style.background = "transparent";
              }}
            >
              <span
                style={{
                  color: active === item.key ? "#ffffff" : "#5b403d",
                  flexShrink: 0,
                }}
              >
                {item.icon}
              </span>
              <span
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 700,
                  fontSize: "0.82rem",
                  color: active === item.key ? "#ffffff" : "#0d0d0d",
                  flex: 1,
                }}
              >
                {item.label}
              </span>
              {active === item.key && (
                <ChevronRight
                  size={14}
                  style={{ color: "rgba(255,255,255,0.7)" }}
                />
              )}
            </button>
          ))}
        </div>

        {/* RIGHT: Content */}
        <div
          style={{
            background: "#ffffff",
            border: "3px solid #0d0d0d",
            boxShadow: "4px 4px 0 #0d0d0d",
            padding: "2rem",
          }}
        >
          {sectionMap[active]}
        </div>
      </div>
    </div>
  );
}

export default SettingsPage;
