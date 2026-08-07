import { useState, useEffect } from "react";
import {
  ShieldCheck,
  ShieldOff,
  ChevronRight,
  Loader2,
  AlertTriangle,
  Copy,
  CheckCircle,
  Lock,
  Key,
} from "lucide-react";
import { toast } from "sonner";
import { authApi } from "@/api/authApi";
import { extractApiError } from "@/utils/apiError";
import { OtpInput } from "../components/OtpInput";

type TwoFAStep = "idle" | "setup" | "confirm" | "disable_confirm";
type DisableMode = "otp" | "recovery";
interface SetupData {
  qrCodeBase64: string;
  totpSecret: string;
}

// ── SecretCopyRow ──────────────────────────────────────────────────
function SecretCopyRow({ secret }: { secret: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(secret);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div className="flex items-center gap-2.5 px-3 py-2.5 mt-2.5 bg-[#f2fbfc] dark:bg-zinc-800 border-2 border-[#0d0d0d] dark:border-zinc-600">
      <code className="flex-1 font-mono text-[0.78rem] font-bold text-[#0d0d0d] dark:text-zinc-200 tracking-widest break-all">
        {secret}
      </code>
      <button
        onClick={handleCopy}
        className={`shrink-0 flex p-1 border-none bg-transparent cursor-pointer ${copied ? "text-green-600" : "text-[#5b403d] dark:text-zinc-400"}`}
      >
        {copied ? <CheckCircle size={15} /> : <Copy size={15} />}
      </button>
    </div>
  );
}

// ── StepBar ────────────────────────────────────────────────────────
function StepBar({ current }: { current: number }) {
  const labels = ["Scan QR Code", "Verify Code"];
  return (
    <div className="flex gap-1 mb-5">
      {labels.map((label, i) => (
        <div key={i} className="flex-1">
          <div
            className={`h-1 border-2 border-[#0d0d0d] dark:border-zinc-600 mb-1 ${i <= current ? "bg-[#af101a]" : "bg-[#e7f0f1] dark:bg-zinc-700"}`}
          />
          <p
            className={`font-black text-[0.58rem] uppercase tracking-[0.07em] m-0 ${i <= current ? "text-[#af101a]" : "text-[#aaa] dark:text-zinc-500"}`}
          >
            {label}
          </p>
        </div>
      ))}
    </div>
  );
}

// ── Btn ────────────────────────────────────────────────────────────
function Btn({
  variant,
  onClick,
  children,
  loading,
  disabled,
  flex,
}: {
  variant: "primary" | "ghost" | "danger" | "success";
  onClick: () => void;
  children: React.ReactNode;
  loading?: boolean;
  disabled?: boolean;
  flex?: boolean;
}) {
  const styles = {
    primary:
      "bg-[#af101a] dark:bg-[#af101a] text-white border-[3px] border-[#0d0d0d] dark:border-[#af101a] shadow-[3px_3px_0_#af101a]",
    ghost:
      "bg-white dark:bg-zinc-800 text-[#0d0d0d] dark:text-zinc-200 border-[3px] border-[#0d0d0d] dark:border-zinc-600 shadow-[3px_3px_0_#0d0d0d] dark:shadow-[3px_3px_0_#52525b]",
    danger:
      "bg-[#7f0d12] text-white border-[3px] border-[#7f0d12] shadow-[3px_3px_0_#7f0d12]",
    success:
      "bg-[#16a34a] text-white border-[3px] border-[#16a34a] shadow-[3px_3px_0_#16a34a]",
  }[variant];

  return (
    <button
      onClick={onClick}
      disabled={loading || disabled}
      className={[
        "flex items-center justify-center gap-1.5 px-4 py-2.5 font-black text-[0.72rem] uppercase tracking-widest transition-all",
        flex ? "flex-1" : "",
        loading || disabled
          ? "bg-[#aaa] dark:bg-zinc-600 cursor-not-allowed border-[3px] border-[#aaa] dark:border-zinc-600 text-white shadow-none"
          : `${styles} cursor-pointer`,
      ].join(" ")}
    >
      {loading && <Loader2 size={13} className="animate-spin" />}
      {children}
    </button>
  );
}

// ── TwoFASection ───────────────────────────────────────────────────
export function TwoFASection() {
  const [enabled, setEnabled] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [step, setStep] = useState<TwoFAStep>("idle");
  const [setupData, setSetupData] = useState<SetupData | null>(null);
  const [otpCode, setOtpCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [recoveryCodes, setRecoveryCodes] = useState<string[]>([]);
  const [showRecovery, setShowRecovery] = useState(false);
  const [disableMode, setDisableMode] = useState<DisableMode>("otp");

  useEffect(() => {
    authApi
      .get2FAStatus()
      .then(({ data }) => setEnabled(data.result))
      .catch(() => {})
      .finally(() => setInitialLoading(false));
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

  const handleConfirmEnable = async () => {
    if (otpCode.length !== 6) return;
    setLoading(true);
    try {
      const { data } = await authApi.confirm2FA({ otpCode });
      setRecoveryCodes(data.result.recoveryCodes);
      setShowRecovery(true);
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

  // shared card classes
  const card =
    "border-[3px] border-[#0d0d0d] dark:border-zinc-600 shadow-[5px_5px_0_#0d0d0d] dark:shadow-[5px_5px_0_#52525b] p-6";
  const dangerCard =
    "border-[3px] border-[#7f0d12] shadow-[5px_5px_0_#7f0d12] p-6";

  return (
    <div className="flex flex-col gap-5">
      {/* ── Status + toggle ── */}
      <div
        className={`flex items-center justify-between gap-4 px-4 py-4 border-[3px] transition-all ${
          enabled
            ? "bg-green-50 dark:bg-green-950/30 border-green-600 shadow-[5px_5px_0_#16a34a]"
            : "bg-white dark:bg-zinc-900 border-[#0d0d0d] dark:border-zinc-600 shadow-[5px_5px_0_#0d0d0d] dark:shadow-[5px_5px_0_#52525b]"
        }`}
      >
        {/* Left */}
        <div className="flex items-center gap-3">
          <span
            className={`w-10 h-10 flex items-center justify-center shrink-0 text-white transition-colors ${enabled ? "bg-green-600" : "bg-[#0d0d0d] dark:bg-zinc-700"}`}
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
            <p className="font-black text-[0.9rem] text-[#0d0d0d] dark:text-white m-0 font-display">
              Two-Factor Authentication
            </p>
            <p className="text-[0.72rem] text-[#5b403d] dark:text-zinc-400 m-0">
              {initialLoading
                ? "Checking status..."
                : enabled
                  ? "Your account has an extra layer of protection."
                  : "Add an extra layer of security to your account."}
            </p>
          </div>
        </div>

        {/* Toggle */}
        <button
          onClick={handleToggle}
          disabled={loading || initialLoading}
          className="flex items-center gap-2.5 bg-transparent border-none p-0 shrink-0"
          style={{
            cursor: loading || initialLoading ? "not-allowed" : "pointer",
          }}
        >
          <div
            className={`w-13 h-6.75 relative shrink-0 border-[3px] border-[#0d0d0d] dark:border-zinc-600 transition-colors ${enabled ? "bg-green-600" : "bg-[#dbe4e5] dark:bg-zinc-700"}`}
          >
            <span
              className={`absolute top-1/2 -translate-y-1/2 w-3.75 h-3.75 bg-white border-2 border-[#0d0d0d] dark:border-zinc-500 flex items-center justify-center transition-all ${enabled ? "left-6" : "left-0.5"}`}
            >
              {loading && step === "idle" && (
                <Loader2 size={8} className="animate-spin text-[#0d0d0d]" />
              )}
            </span>
          </div>
          <div className="text-left">
            <p className="font-black text-[0.78rem] text-[#0d0d0d] dark:text-zinc-200 m-0 leading-tight font-display">
              {initialLoading ? "Loading..." : enabled ? "Enabled" : "Disabled"}
            </p>
            <p className="text-[0.65rem] text-[#888] dark:text-zinc-500 m-0">
              {enabled ? "Click to disable" : "Click to enable"}
            </p>
          </div>
        </button>
      </div>

      {/* ── Setup: QR scan ── */}
      {step === "setup" && setupData && (
        <div className={`bg-white dark:bg-zinc-900 ${card}`}>
          <StepBar current={0} />
          <p className="font-black text-[0.875rem] text-[#0d0d0d] dark:text-white m-0 mb-1.5 font-display">
            Scan with your authenticator app
          </p>
          <p className="text-[0.78rem] text-[#5b403d] dark:text-zinc-400 m-0 mb-4 leading-relaxed">
            Open <strong>Google Authenticator</strong> or <strong>Authy</strong>
            , tap the <strong>+</strong> button, then scan this QR code.
          </p>
          <div className="flex gap-5 items-start flex-wrap">
            <div className="border-[3px] border-[#0d0d0d] dark:border-zinc-600 shadow-[4px_4px_0_#0d0d0d] dark:shadow-[4px_4px_0_#52525b] p-2.5 bg-white shrink-0">
              <img
                src={`data:image/png;base64,${setupData.qrCodeBase64}`}
                alt="2FA QR Code"
                width={160}
                height={160}
                className="block"
              />
            </div>
            <div className="flex-1 min-w-45">
              <p className="font-bold text-[0.65rem] uppercase tracking-widest text-[#5b403d] dark:text-zinc-400 m-0 mb-1 font-display">
                Can't scan? Enter manually:
              </p>
              <SecretCopyRow secret={setupData.totpSecret} />
              <p className="text-[0.66rem] text-[#aaa] dark:text-zinc-500 mt-2 leading-relaxed m-0">
                Save this secret somewhere safe — you'll need it to recover
                access if you lose your device.
              </p>
            </div>
          </div>
          <div className="flex gap-2.5 mt-5">
            <Btn variant="ghost" onClick={handleCancel}>
              Cancel
            </Btn>
            <Btn
              variant="primary"
              onClick={() => {
                setStep("confirm");
                setOtpCode("");
              }}
              flex
            >
              I've scanned it <ChevronRight size={13} />
            </Btn>
          </div>
        </div>
      )}

      {/* ── Confirm OTP ── */}
      {step === "confirm" && (
        <div className={`bg-white dark:bg-zinc-900 ${card}`}>
          <StepBar current={1} />
          <p className="font-black text-[0.875rem] text-[#0d0d0d] dark:text-white m-0 mb-1.5 font-display">
            Enter verification code
          </p>
          <p className="text-[0.78rem] text-[#5b403d] dark:text-zinc-400 m-0 mb-3.5">
            Enter the 6-digit code currently shown in your authenticator app.
          </p>
          <OtpInput value={otpCode} onChange={setOtpCode} />
          <div className="flex gap-2.5 mt-3.5">
            <Btn variant="ghost" onClick={() => setStep("setup")}>
              Back
            </Btn>
            <Btn
              variant="primary"
              onClick={handleConfirmEnable}
              loading={loading}
              disabled={otpCode.length !== 6}
              flex
            >
              <ShieldCheck size={13} /> Enable 2FA
            </Btn>
          </div>
        </div>
      )}

      {/* ── Disable confirm ── */}
      {step === "disable_confirm" && (
        <div className={`bg-red-50 dark:bg-red-950/20 ${dangerCard}`}>
          <div className="flex items-center gap-2 mb-2.5">
            <AlertTriangle size={16} className="text-[#af101a] shrink-0" />
            <p className="font-black text-[0.875rem] text-[#7f0d12] dark:text-red-400 m-0 font-display">
              Disable Two-Factor Authentication
            </p>
          </div>
          {/* Mode toggle */}
          <div className="flex gap-1.5 mb-4">
            {(["otp", "recovery"] as DisableMode[]).map((m) => (
              <button
                key={m}
                onClick={() => {
                  setDisableMode(m);
                  setOtpCode("");
                }}
                className={`flex-1 py-2 font-bold text-[0.75rem] uppercase tracking-[0.08em] border-2 border-[#7f0d12] cursor-pointer transition-colors ${disableMode === m ? "bg-[#7f0d12] text-white" : "bg-white dark:bg-zinc-800 text-[#7f0d12] dark:text-red-400"}`}
              >
                {m === "otp" ? (
                  <div className="py-2 flex justify-center items-center gap-3">
                    <Lock size={16} /> <span>Authenticator Code </span>{" "}
                  </div>
                ) : (
                  <div className="py-2 flex justify-center items-center gap-3">
                    <Key size={16} /> <span>Recovery Code </span>{" "}
                  </div>
                )}
              </button>
            ))}
          </div>
          <p className="text-[0.78rem] text-[#5b403d] dark:text-zinc-400 m-0 mb-3.5 leading-relaxed">
            {disableMode === "otp"
              ? "Enter the 6-digit code from your authenticator app to confirm."
              : "Enter one of your saved recovery codes. It will be marked as used."}
          </p>
          {disableMode === "otp" ? (
            <OtpInput value={otpCode} onChange={setOtpCode} />
          ) : (
            <input
              type="text"
              placeholder="XXXX-XXXX-XXXX"
              value={otpCode}
              onChange={(e) => setOtpCode(e.target.value.toUpperCase())}
              autoFocus
              className="w-full py-3.5 px-4 font-mono font-bold text-base tracking-widest text-center text-[#0d0d0d] dark:text-white bg-white dark:bg-zinc-800 border-[3px] border-[#7f0d12] outline-none box-border"
              onFocus={(e) =>
                (e.currentTarget.style.boxShadow = "4px 4px 0 #7f0d12")
              }
              onBlur={(e) => (e.currentTarget.style.boxShadow = "none")}
            />
          )}
          <div className="flex gap-2.5 mt-3.5">
            <Btn variant="ghost" onClick={handleCancel}>
              Cancel
            </Btn>
            <Btn
              variant="danger"
              onClick={handleConfirmDisable}
              loading={loading}
              disabled={
                disableMode === "otp" ? otpCode.length !== 6 : !otpCode.trim()
              }
              flex
            >
              <ShieldOff size={13} /> Disable 2FA
            </Btn>
          </div>
        </div>
      )}

      {/* ── Info box ── */}
      {step === "idle" && !initialLoading && (
        <div className="bg-[#e7f0f1] dark:bg-zinc-800/50 border-2 border-[#0d0d0d] dark:border-zinc-600 p-4">
          <p className="font-bold text-[0.65rem] uppercase tracking-widest text-[#0d0d0d] dark:text-zinc-200 m-0 mb-2 font-display">
            How it works
          </p>
          {[
            "After enabling, you'll need a 6-digit code on every login",
            "The code changes every 30 seconds in your authenticator app",
            "Works with Google Authenticator, Authy, and 1Password",
            "You can disable 2FA with recovery code when you lose your device",
          ].map((tip) => (
            <p
              key={tip}
              className="text-[0.75rem] text-[#5b403d] dark:text-zinc-400 m-0 mb-1 pl-2.5 border-l-[3px] border-[#af101a] leading-relaxed"
            >
              {tip}
            </p>
          ))}
        </div>
      )}

      {/* ── Recovery codes ── */}
      {showRecovery && (
        <div className={`bg-red-50 dark:bg-zinc-900 ${card}`}>
          <p className="font-black text-[0.9rem] text-[#0d0d0d] dark:text-white m-0 mb-1.5 font-display">
            ⚠️ Save your recovery codes
          </p>
          <p className="text-[0.78rem] text-[#5b403d] dark:text-zinc-400 m-0 mb-4 leading-relaxed">
            Store these codes somewhere safe. Each can only be used once if you
            lose access to your authenticator app.
          </p>
          <div className="grid grid-cols-2 gap-2 mb-4">
            {recoveryCodes.map((code) => (
              <code
                key={code}
                className="py-2 px-3 bg-[#f2fbfc] dark:bg-zinc-800 border-2 border-[#0d0d0d] dark:border-zinc-600 font-mono text-[0.85rem] font-bold tracking-[0.05em] text-center text-[#0d0d0d] dark:text-zinc-200"
              >
                {code}
              </code>
            ))}
          </div>
          <div className="flex gap-2.5">
            <Btn
              variant="ghost"
              onClick={() => {
                navigator.clipboard.writeText(recoveryCodes.join("\n"));
                toast.success("Copied to clipboard!");
              }}
              flex
            >
              Copy All
            </Btn>
            <Btn variant="success" onClick={() => setShowRecovery(false)} flex>
              I've saved them ✓
            </Btn>
          </div>
        </div>
      )}
    </div>
  );
}
