import { useState, useEffect } from "react";
import {
  Lock,
  Bell,
  Globe,
  Monitor,
  ShieldCheck,
  ShieldOff,
  User,
  Eye,
  EyeOff,
  Check,
  Sun,
  Moon,
  Laptop,
  ChevronRight,
  Loader2,
  Heart,
  MessageSquare,
  AtSign,
  Newspaper,
  Megaphone,
  Copy,
  CheckCircle,
  AlertTriangle,
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
type TwoFAStep = "idle" | "setup" | "confirm" | "disable_confirm";

interface SetupData {
  qrCodeBase64: string;
  totpSecret: string;
}

/* ─────────────────────────────────────────────────────────────────────────────
   SHARED PRIMITIVES
───────────────────────────────────────────────────────────────────────────── */

function SectionHeading({
  icon,
  children,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        borderBottom: "3px solid #0d0d0d",
        paddingBottom: 14,
        marginBottom: 24,
      }}
    >
      <span
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: 30,
          height: 30,
          background: "#af101a",
          color: "white",
          flexShrink: 0,
        }}
      >
        {icon}
      </span>
      <h2
        style={{
          fontFamily: "var(--font-display)",
          fontWeight: 900,
          fontSize: "1rem",
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
        fontSize: "0.68rem",
        letterSpacing: "0.1em",
        textTransform: "uppercase" as const,
        color: "#5b403d",
        marginBottom: 6,
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
          padding: suffix ? "10px 44px 10px 12px" : "10px 12px",
          fontFamily: "var(--font-sans)",
          fontSize: "0.875rem",
          color: "#0d0d0d",
          background: focused ? "#dbe4e5" : "#ffffff",
          border: "3px solid #0d0d0d",
          borderRadius: 0,
          outline: "none",
          boxShadow: focused ? "3px 3px 0 #0d0d0d" : "none",
          transition: "background 0.15s, box-shadow 0.15s",
          boxSizing: "border-box" as const,
        }}
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

function SaveButton({
  onClick,
  loading,
  label = "Save Changes",
}: {
  onClick: () => void;
  loading?: boolean;
  label?: string;
}) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onClick}
      disabled={loading}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        padding: "11px 22px",
        fontFamily: "var(--font-display)",
        fontWeight: 900,
        fontSize: "0.75rem",
        letterSpacing: "0.1em",
        textTransform: "uppercase" as const,
        color: "#ffffff",
        background: loading ? "#888" : "#af101a",
        border: "3px solid #0d0d0d",
        boxShadow: hov && !loading ? "6px 6px 0 #0d0d0d" : "4px 4px 0 #0d0d0d",
        transform: hov && !loading ? "translate(-2px,-2px)" : "translate(0,0)",
        cursor: loading ? "not-allowed" : "pointer",
        width: "100%",
        transition: "transform 0.15s, box-shadow 0.15s",
      }}
    >
      {loading ? (
        <Loader2 size={14} className="animate-spin" />
      ) : (
        <Check size={14} />
      )}
      {loading ? "Saving..." : label}
    </button>
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

/* ─────────────────────────────────────────────────────────────────────────────
   PASSWORD SECTION
───────────────────────────────────────────────────────────────────────────── */

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
  const strengthColors = ["", "#af101a", "#f59e0b", "#16a34a"];
  const strengthLabels = ["", "Weak", "Fair", "Strong"];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div>
        <FieldLabel>Current Password</FieldLabel>
        <BrutalInput
          type={showCurrent ? "text" : "password"}
          placeholder="Enter current password"
          value={current}
          onChange={setCurrent}
          suffix={
            <span onClick={() => setShowCurrent((v) => !v)}>
              {showCurrent ? <EyeOff size={14} /> : <Eye size={14} />}
            </span>
          }
        />
      </div>
      <div>
        <FieldLabel>New Password</FieldLabel>
        <BrutalInput
          type={showNew ? "text" : "password"}
          placeholder="Min. 8 characters"
          value={newPwd}
          onChange={setNewPwd}
          suffix={
            <span onClick={() => setShowNew((v) => !v)}>
              {showNew ? <EyeOff size={14} /> : <Eye size={14} />}
            </span>
          }
        />
        {newPwd.length > 0 && (
          <div style={{ marginTop: 8 }}>
            <div style={{ display: "flex", gap: 4, marginBottom: 4 }}>
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  style={{
                    flex: 1,
                    height: 5,
                    background:
                      i <= strength ? strengthColors[strength] : "#e7f0f1",
                    border: "1px solid #0d0d0d",
                    transition: "background 0.2s",
                  }}
                />
              ))}
            </div>
            <p
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "0.68rem",
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
              {showConfirm ? <EyeOff size={14} /> : <Eye size={14} />}
            </span>
          }
        />
        {confirm.length > 0 && newPwd !== confirm && (
          <p
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "0.72rem",
              color: "#af101a",
              marginTop: 4,
            }}
          >
            Passwords do not match.
          </p>
        )}
      </div>
      <SaveButton onClick={handleSave} loading={loading} />
      <div
        style={{
          background: "#e7f0f1",
          border: "2px solid #0d0d0d",
          padding: "14px 16px",
        }}
      >
        <p
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 700,
            fontSize: "0.65rem",
            letterSpacing: "0.1em",
            textTransform: "uppercase" as const,
            color: "#0d0d0d",
            margin: "0 0 8px",
          }}
        >
          💡 Security Tips
        </p>
        {[
          "Use 8+ characters with symbols",
          "Never reuse passwords",
          "Enable Two-Factor Auth below",
        ].map((tip) => (
          <p
            key={tip}
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "0.78rem",
              color: "#5b403d",
              margin: "0 0 4px",
              paddingLeft: 10,
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

/* ─────────────────────────────────────────────────────────────────────────────
   NOTIFICATIONS SECTION
───────────────────────────────────────────────────────────────────────────── */

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
      icon: <User size={13} />,
      label: "New Followers",
      sub: "When someone starts following you",
    },
    {
      key: "postLikes",
      icon: <Heart size={13} />,
      label: "Post Likes",
      sub: "When someone likes your article",
    },
    {
      key: "comments",
      icon: <MessageSquare size={13} />,
      label: "Comments",
      sub: "When someone comments on your post",
    },
    {
      key: "mentions",
      icon: <AtSign size={13} />,
      label: "Mentions",
      sub: "When you are mentioned in a post",
    },
    {
      key: "emailDigest",
      icon: <Newspaper size={13} />,
      label: "Weekly Email Digest",
      sub: "Top stories and performance stats",
    },
    {
      key: "marketing",
      icon: <Megaphone size={13} />,
      label: "Marketing Emails",
      sub: "Product updates and announcements",
    },
  ];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {rows.map((r) => (
        <div
          key={r.key}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "12px 14px",
            background: "#ffffff",
            border: "2px solid #0d0d0d",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span
              style={{
                width: 28,
                height: 28,
                background: "#e7f0f1",
                border: "2px solid #0d0d0d",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              {r.icon}
            </span>
            <div>
              <p
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 700,
                  fontSize: "0.82rem",
                  color: "#0d0d0d",
                  margin: 0,
                }}
              >
                {r.label}
              </p>
              <p
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: "0.72rem",
                  color: "#5b403d",
                  margin: 0,
                }}
              >
                {r.sub}
              </p>
            </div>
          </div>
          <BrutalToggle
            enabled={notifs[r.key]}
            onChange={() => toggle(r.key)}
          />
        </div>
      ))}
      <div style={{ marginTop: 8 }}>
        <SaveButton
          onClick={() => toast.success("Notification preferences saved.")}
          label="Save Preferences"
        />
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   LANGUAGE SECTION
───────────────────────────────────────────────────────────────────────────── */

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
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: "0.85rem",
                color: selected === lang.code ? "#ffffff" : "#0d0d0d",
                margin: 0,
              }}
            >
              {lang.label}
            </p>
            <p
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "0.68rem",
                color:
                  selected === lang.code ? "rgba(255,255,255,0.65)" : "#5b403d",
                margin: 0,
              }}
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

/* ─────────────────────────────────────────────────────────────────────────────
   APPEARANCE SECTION
───────────────────────────────────────────────────────────────────────────── */

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
      icon: <Sun size={26} />,
      label: "Light",
      desc: "Always light",
    },
    {
      key: "dark",
      icon: <Moon size={26} />,
      label: "Dark",
      desc: "Always dark",
    },
    {
      key: "system",
      icon: <Laptop size={26} />,
      label: "System",
      desc: "Follow OS",
    },
  ];
  return (
    <div>
      <p
        style={{
          fontFamily: "var(--font-sans)",
          fontSize: "0.82rem",
          color: "#5b403d",
          marginBottom: 16,
        }}
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
        {themes.map((t) => (
          <button
            key={t.key}
            onClick={() => setTheme(t.key)}
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
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 900,
                fontSize: "0.78rem",
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
                fontSize: "0.65rem",
                color: theme === t.key ? "rgba(255,255,255,0.55)" : "#5b403d",
                margin: 0,
                textAlign: "center" as const,
              }}
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
      <SaveButton
        onClick={() => toast.success(`Theme set to "${theme}"`)}
        label="Apply Theme"
      />
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   2FA SECTION  ← phần được chỉnh sửa chính
───────────────────────────────────────────────────────────────────────────── */

function OtpInput({
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
      style={{
        width: "100%",
        padding: "14px",
        fontFamily: "var(--font-display)",
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
        transition: "box-shadow 0.15s",
      }}
      onFocus={(e) => (e.currentTarget.style.boxShadow = "4px 4px 0 #af101a")}
      onBlur={(e) => (e.currentTarget.style.boxShadow = "none")}
    />
  );
}

function SecretCopyRow({ secret }: { secret: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(secret);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "10px 12px",
        background: "#f2fbfc",
        border: "2px solid #0d0d0d",
        marginTop: 10,
      }}
    >
      <code
        style={{
          flex: 1,
          fontFamily: "monospace",
          fontSize: "0.78rem",
          fontWeight: 700,
          color: "#0d0d0d",
          letterSpacing: "0.1em",
          wordBreak: "break-all" as const,
        }}
      >
        {secret}
      </code>
      <button
        onClick={handleCopy}
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          padding: 4,
          color: copied ? "#16a34a" : "#5b403d",
          flexShrink: 0,
          display: "flex",
        }}
      >
        {copied ? <CheckCircle size={15} /> : <Copy size={15} />}
      </button>
    </div>
  );
}

type DisableMode = "otp" | "recovery";

function TwoFASection() {
  const [enabled, setEnabled] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [step, setStep] = useState<TwoFAStep>("idle");
  const [setupData, setSetupData] = useState<SetupData | null>(null);
  const [otpCode, setOtpCode] = useState("");
  const [loading, setLoading] = useState(false);

  const [recoveryCodes, setRecoveryCodes] = useState<string[]>([]);
  const [showRecovery, setShowRecovery] = useState(false);

  const [disableMode, setDisableMode] = useState<DisableMode>("otp");
  // ── Kiểm tra trạng thái 2FA khi vào tab ────────────────────────
  useEffect(() => {
    const checkStatus = async () => {
      try {
        const { data } = await authApi.get2FAStatus();
        setEnabled(data.result);
      } catch {
        // nếu API chưa có, mặc định false
      } finally {
        setInitialLoading(false);
      }
    };
    checkStatus();
  }, []);

  const handleToggle = () => {
    if (loading || initialLoading) return;
    if (!enabled) {
      startSetup();
    } else {
      setStep("disable_confirm");
      setOtpCode("");
    }
  };

  const startSetup = async () => {
    setLoading(true);
    try {
      const { data } = await authApi.enable2FA();
      setSetupData({
        qrCodeBase64: data.result.qrCodeBase64,
        totpSecret: data.result.totpSecret,
      });
      setStep("setup");
      setOtpCode("");
    } catch (e) {
      toast.error(extractApiError(e));
    } finally {
      setLoading(false);
    }
  };

  // Sau khi confirm thành công
  const handleConfirmEnable = async () => {
    if (otpCode.length !== 6) return;
    setLoading(true);
    try {
      const { data } = await authApi.confirm2FA({ otpCode });
      setRecoveryCodes(data.result.recoveryCodes); // nhận từ backend
      setShowRecovery(true); // hiện màn hình recovery codes
      setEnabled(true);
      setStep("idle");
      setSetupData(null);
      setOtpCode("");
    } catch (e) {
      toast.error(extractApiError(e));
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmDisable = async () => {
    setLoading(true);
    try {
      if (disableMode === "otp") {
        if (otpCode.length !== 6) {
          toast.error("Please enter a 6-digit code.");
          return;
        }
        await authApi.disable2FA({ otpCode });
      } else {
        if (!otpCode.trim()) {
          toast.error("Please enter your recovery code.");
          return;
        }
        await authApi.disableWithRecovery({ recoveryCode: otpCode });
      }
      setEnabled(false);
      setStep("idle");
      setOtpCode("");
      setDisableMode("otp");
      toast.success("Two-Factor Authentication disabled.");
    } catch (e) {
      toast.error(extractApiError(e) ?? "Invalid code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setStep("idle");
    setSetupData(null);
    setOtpCode("");
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* ── Status card + toggle ── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
          padding: "16px 18px",
          background: enabled ? "#f0faf0" : "#ffffff",
          border: `3px solid ${enabled ? "#16a34a" : "#0d0d0d"}`,
          boxShadow: `5px 5px 0 ${enabled ? "#16a34a" : "#0d0d0d"}`,
          transition: "all 0.2s",
        }}
      >
        {/* Left */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span
            style={{
              width: 40,
              height: 40,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: enabled ? "#16a34a" : "#0d0d0d",
              color: "white",
              flexShrink: 0,
              transition: "background 0.2s",
            }}
          >
            {initialLoading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : enabled ? (
              <ShieldCheck size={20} />
            ) : (
              <ShieldOff size={20} />
            )}
          </span>
          <div>
            <p
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 900,
                fontSize: "0.9rem",
                color: "#0d0d0d",
                margin: 0,
              }}
            >
              Two-Factor Authentication
            </p>
            <p
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "0.72rem",
                color: "#5b403d",
                margin: 0,
              }}
            >
              {initialLoading
                ? "Checking status..."
                : enabled
                  ? "Your account has an extra layer of protection."
                  : "Add an extra layer of security to your account."}
            </p>
          </div>
        </div>

        {/* Right: toggle */}
        <button
          onClick={handleToggle}
          disabled={loading || initialLoading}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            background: "none",
            border: "none",
            cursor: loading || initialLoading ? "not-allowed" : "pointer",
            padding: 0,
            flexShrink: 0,
          }}
        >
          {/* Track */}
          <div
            style={{
              width: 52,
              height: 27,
              background: enabled ? "#16a34a" : "#dbe4e5",
              border: "3px solid #0d0d0d",
              position: "relative",
              transition: "background 0.2s",
              flexShrink: 0,
            }}
          >
            <span
              style={{
                position: "absolute",
                top: "50%",
                left: enabled ? 24 : 2,
                transform: "translateY(-50%)",
                width: 15,
                height: 15,
                background: "white",
                border: "2px solid #0d0d0d",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "left 0.2s",
              }}
            >
              {loading && step === "idle" && (
                <Loader2
                  size={8}
                  className="animate-spin"
                  style={{ color: "#0d0d0d" }}
                />
              )}
            </span>
          </div>
          <div style={{ textAlign: "left" as const }}>
            <p
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 900,
                fontSize: "0.78rem",
                color: "#0d0d0d",
                margin: 0,
                lineHeight: 1.2,
              }}
            >
              {initialLoading ? "Loading..." : enabled ? "Enabled" : "Disabled"}
            </p>
            <p
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "0.65rem",
                color: "#888",
                margin: 0,
              }}
            >
              {enabled ? "Click to disable" : "Click to enable"}
            </p>
          </div>
        </button>
      </div>

      {/* ── Setup: scan QR ── */}
      {step === "setup" && setupData && (
        <div
          style={{
            background: "#ffffff",
            border: "3px solid #0d0d0d",
            boxShadow: "5px 5px 0 #0d0d0d",
            padding: 24,
          }}
        >
          {/* Step bar */}
          <div style={{ display: "flex", gap: 4, marginBottom: 22 }}>
            {["Scan QR Code", "Verify Code"].map((label, i) => (
              <div key={i} style={{ flex: 1 }}>
                <div
                  style={{
                    height: 4,
                    background: i === 0 ? "#af101a" : "#e7f0f1",
                    border: "2px solid #0d0d0d",
                    marginBottom: 4,
                  }}
                />
                <p
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 700,
                    fontSize: "0.58rem",
                    letterSpacing: "0.07em",
                    textTransform: "uppercase" as const,
                    color: i === 0 ? "#af101a" : "#aaa",
                    margin: 0,
                  }}
                >
                  {label}
                </p>
              </div>
            ))}
          </div>

          <p
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 900,
              fontSize: "0.875rem",
              color: "#0d0d0d",
              margin: "0 0 6px",
            }}
          >
            Scan with your authenticator app
          </p>
          <p
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "0.78rem",
              color: "#5b403d",
              margin: "0 0 18px",
              lineHeight: 1.6,
            }}
          >
            Open <strong>Google Authenticator</strong> or <strong>Authy</strong>
            , tap the <strong>+</strong> button, then scan this QR code.
          </p>

          <div
            style={{
              display: "flex",
              gap: 20,
              alignItems: "flex-start",
              flexWrap: "wrap" as const,
            }}
          >
            {/* QR image từ backend base64 */}
            <div
              style={{
                border: "3px solid #0d0d0d",
                boxShadow: "4px 4px 0 #0d0d0d",
                padding: 10,
                background: "#fff",
                flexShrink: 0,
              }}
            >
              <img
                src={`data:image/png;base64,${setupData.qrCodeBase64}`}
                alt="2FA QR Code"
                width={160}
                height={160}
                style={{ display: "block" }}
              />
            </div>
            <div style={{ flex: 1, minWidth: 180 }}>
              <p
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 700,
                  fontSize: "0.65rem",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase" as const,
                  color: "#5b403d",
                  margin: "0 0 4px",
                }}
              >
                Can't scan? Enter manually:
              </p>
              <SecretCopyRow secret={setupData.totpSecret} />
              <p
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: "0.66rem",
                  color: "#aaa",
                  margin: "8px 0 0",
                  lineHeight: 1.5,
                }}
              >
                Save this secret somewhere safe — you'll need it to recover
                access if you lose your device.
              </p>
            </div>
          </div>

          <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
            <button
              onClick={handleCancel}
              style={{
                padding: "10px 16px",
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: "0.72rem",
                letterSpacing: "0.08em",
                textTransform: "uppercase" as const,
                color: "#0d0d0d",
                background: "#ffffff",
                border: "3px solid #0d0d0d",
                boxShadow: "3px 3px 0 #0d0d0d",
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
            <button
              onClick={() => {
                setStep("confirm");
                setOtpCode("");
              }}
              style={{
                flex: 1,
                padding: "11px 16px",
                fontFamily: "var(--font-display)",
                fontWeight: 900,
                fontSize: "0.72rem",
                letterSpacing: "0.1em",
                textTransform: "uppercase" as const,
                color: "#ffffff",
                background: "#af101a",
                border: "3px solid #0d0d0d",
                boxShadow: "4px 4px 0 #0d0d0d",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
              }}
            >
              I've scanned it <ChevronRight size={13} />
            </button>
          </div>
        </div>
      )}

      {/* ── Confirm OTP ── */}
      {step === "confirm" && (
        <div
          style={{
            background: "#ffffff",
            border: "3px solid #0d0d0d",
            boxShadow: "5px 5px 0 #0d0d0d",
            padding: 24,
          }}
        >
          {/* Step bar */}
          <div style={{ display: "flex", gap: 4, marginBottom: 22 }}>
            {["Scan QR Code", "Verify Code"].map((label, i) => (
              <div key={i} style={{ flex: 1 }}>
                <div
                  style={{
                    height: 4,
                    background: "#af101a",
                    border: "2px solid #0d0d0d",
                    marginBottom: 4,
                  }}
                />
                <p
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 700,
                    fontSize: "0.58rem",
                    letterSpacing: "0.07em",
                    textTransform: "uppercase" as const,
                    color: "#af101a",
                    margin: 0,
                  }}
                >
                  {label}
                </p>
              </div>
            ))}
          </div>

          <p
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 900,
              fontSize: "0.875rem",
              color: "#0d0d0d",
              margin: "0 0 6px",
            }}
          >
            Enter verification code
          </p>
          <p
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "0.78rem",
              color: "#5b403d",
              margin: "0 0 14px",
            }}
          >
            Enter the 6-digit code currently shown in your authenticator app.
          </p>

          <OtpInput value={otpCode} onChange={setOtpCode} />

          <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
            <button
              onClick={() => setStep("setup")}
              style={{
                padding: "10px 16px",
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: "0.72rem",
                letterSpacing: "0.08em",
                textTransform: "uppercase" as const,
                color: "#0d0d0d",
                background: "#ffffff",
                border: "3px solid #0d0d0d",
                boxShadow: "3px 3px 0 #0d0d0d",
                cursor: "pointer",
              }}
            >
              Back
            </button>
            <button
              onClick={handleConfirmEnable}
              disabled={loading || otpCode.length !== 6}
              style={{
                flex: 1,
                padding: "11px 16px",
                fontFamily: "var(--font-display)",
                fontWeight: 900,
                fontSize: "0.72rem",
                letterSpacing: "0.1em",
                textTransform: "uppercase" as const,
                color: "#ffffff",
                background:
                  loading || otpCode.length !== 6 ? "#aaa" : "#af101a",
                border: "3px solid #0d0d0d",
                boxShadow: "4px 4px 0 #0d0d0d",
                cursor:
                  loading || otpCode.length !== 6 ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
              }}
            >
              {loading ? (
                <Loader2 size={13} className="animate-spin" />
              ) : (
                <ShieldCheck size={13} />
              )}
              Enable 2FA
            </button>
          </div>
        </div>
      )}

      {/* ── Disable confirm ── */}
      {step === "disable_confirm" && (
        <div
          style={{
            background: "#fff8f8",
            border: "3px solid #7f0d12",
            boxShadow: "5px 5px 0 #7f0d12",
            padding: 24,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 10,
            }}
          >
            <AlertTriangle
              size={15}
              style={{ color: "#af101a", flexShrink: 0 }}
            />
            <p
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 900,
                fontSize: "0.875rem",
                color: "#7f0d12",
                margin: 0,
              }}
            >
              Disable Two-Factor Authentication
            </p>
          </div>

          {/* Toggle giữa OTP và Recovery */}
          <div style={{ display: "flex", gap: 6, marginBottom: 16 }}>
            {(["otp", "recovery"] as DisableMode[]).map((m) => (
              <button
                key={m}
                onClick={() => {
                  setDisableMode(m);
                  setOtpCode("");
                }}
                style={{
                  flex: 1,
                  padding: "8px",
                  fontFamily: "var(--font-display)",
                  fontWeight: 700,
                  fontSize: "0.65rem",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  background: disableMode === m ? "#7f0d12" : "#ffffff",
                  color: disableMode === m ? "#ffffff" : "#7f0d12",
                  border: "2px solid #7f0d12",
                  cursor: "pointer",
                }}
              >
                {m === "otp" ? "🔐 Authenticator Code" : "🗝️ Recovery Code"}
              </button>
            ))}
          </div>

          <p
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "0.78rem",
              color: "#5b403d",
              margin: "0 0 14px",
              lineHeight: 1.6,
            }}
          >
            {disableMode === "otp"
              ? "Enter the 6-digit code from your authenticator app to confirm."
              : "Enter one of your saved recovery codes. It will be marked as used."}
          </p>

          {/* Input */}
          {disableMode === "otp" ? (
            <OtpInput value={otpCode} onChange={setOtpCode} />
          ) : (
            <input
              type="text"
              placeholder="XXXX-XXXX-XXXX"
              value={otpCode}
              onChange={(e) => setOtpCode(e.target.value.toUpperCase())}
              autoFocus
              style={{
                width: "100%",
                padding: "14px",
                fontFamily: "monospace",
                fontWeight: 700,
                fontSize: "1rem",
                letterSpacing: "0.1em",
                textAlign: "center",
                color: "#0d0d0d",
                background: "#ffffff",
                border: "3px solid #7f0d12",
                borderRadius: 0,
                outline: "none",
                boxSizing: "border-box" as const,
              }}
              onFocus={(e) =>
                (e.currentTarget.style.boxShadow = "4px 4px 0 #7f0d12")
              }
              onBlur={(e) => (e.currentTarget.style.boxShadow = "none")}
            />
          )}

          <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
            <button
              onClick={handleCancel}
              style={{
                padding: "10px 16px",
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: "0.72rem",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "#0d0d0d",
                background: "#ffffff",
                border: "3px solid #0d0d0d",
                boxShadow: "3px 3px 0 #0d0d0d",
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmDisable}
              disabled={
                loading ||
                (disableMode === "otp" ? otpCode.length !== 6 : !otpCode.trim())
              }
              style={{
                flex: 1,
                padding: "11px 16px",
                fontFamily: "var(--font-display)",
                fontWeight: 900,
                fontSize: "0.72rem",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "#ffffff",
                background: loading ? "#aaa" : "#7f0d12",
                border: "3px solid #7f0d12",
                boxShadow: "4px 4px 0 #7f0d12",
                cursor: loading ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
              }}
            >
              {loading ? (
                <>
                  <Loader2 size={13} className="animate-spin" /> Disabling...
                </>
              ) : (
                <>
                  <ShieldOff size={13} /> Disable 2FA
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* ── Info box (chỉ idle) ── */}
      {step === "idle" && (
        <div
          style={{
            background: "#e7f0f1",
            border: "2px solid #0d0d0d",
            padding: "14px 16px",
          }}
        >
          <p
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: "0.65rem",
              letterSpacing: "0.1em",
              textTransform: "uppercase" as const,
              color: "#0d0d0d",
              margin: "0 0 8px",
            }}
          >
            How it works
          </p>
          {[
            "After enabling, you'll need a 6-digit code on every login",
            "The code changes every 30 seconds in your authenticator app",
            "Works with Google Authenticator, Authy, and 1Password",
            "You can disable 2FA with recovery code when lose device",
          ].map((tip) => (
            <p
              key={tip}
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "0.75rem",
                color: "#5b403d",
                margin: "0 0 4px",
                paddingLeft: 10,
                borderLeft: "3px solid #af101a",
                lineHeight: 1.5,
              }}
            >
              {tip}
            </p>
          ))}
        </div>
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

/* ─────────────────────────────────────────────────────────────────────────────
   ACCOUNT SECTION
───────────────────────────────────────────────────────────────────────────── */

function AccountSection({
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
        style={{
          fontFamily: "var(--font-sans)",
          fontSize: "0.82rem",
          color: "#5b403d",
          marginBottom: 8,
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

/* ─────────────────────────────────────────────────────────────────────────────
   NAV + MAIN EXPORT
───────────────────────────────────────────────────────────────────────────── */

const NAV_ITEMS: {
  key: SettingsSection;
  icon: React.ReactNode;
  label: string;
}[] = [
  { key: "account", icon: <User size={14} />, label: "Account" },
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
  account: { icon: <User size={14} />, label: "Account Overview" },
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
  const [active, setActive] = useState<SettingsSection>("account");

  const content: Record<SettingsSection, React.ReactNode> = {
    account: <AccountSection onNavigate={setActive} />,
    password: <PasswordSection />,
    notifications: <NotificationsSection />,
    language: <LanguageSection />,
    appearance: <AppearanceSection />,
    "2fa": <TwoFASection />,
  };

  const sec = SECTION_TITLES[active];

  return (
    <div
      style={{
        display: "flex",
        height: "100%",
        overflow: "hidden",
        background: "#f2fbfc",
      }}
    >
      {/* ── Left Nav ── */}
      <div
        style={{
          width: 200,
          flexShrink: 0,
          background: "#ffffff",
          borderRight: "3px solid #0d0d0d",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
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
              fontSize: "0.6rem",
              letterSpacing: "0.15em",
              textTransform: "uppercase" as const,
              color: "rgba(255,255,255,0.55)",
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
              gap: 10,
              padding: "12px 14px",
              width: "100%",
              textAlign: "left" as const,
              background: active === item.key ? "#af101a" : "transparent",
              borderBottom:
                idx < NAV_ITEMS.length - 1 ? "1px solid #e7f0f1" : "none",
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
                fontSize: "0.78rem",
                color: active === item.key ? "#ffffff" : "#0d0d0d",
                flex: 1,
              }}
            >
              {item.label}
            </span>
            {active === item.key && (
              <ChevronRight
                size={12}
                style={{ color: "rgba(255,255,255,0.65)" }}
              />
            )}
          </button>
        ))}
      </div>

      {/* ── Right Content ── */}
      <div
        style={{
          flex: 1,
          overflow: "auto",
          padding: "28px 32px",
          background: "#f2fbfc",
        }}
      >
        <SectionHeading icon={sec.icon}>{sec.label}</SectionHeading>
        {content[active]}
      </div>
    </div>
  );
}
