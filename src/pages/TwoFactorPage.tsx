import { authApi } from "@/api/authApi";
import { userApi } from "@/api/userApi";
import useAuthStore from "@/stores/authStore";
import React, { useRef, useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { ShieldCheck, ArrowLeft, Loader2, Key } from "lucide-react";

const TwoFactorPage: React.FC = () => {
  const [mode, setMode] = useState<"otp" | "recovery">("otp");

  // OTP mode
  const [otpValue, setOtpValue] = useState("");
  const [focused, setFocused] = useState(false);
  const hiddenInputRef = useRef<HTMLInputElement>(null);

  // Recovery mode
  const [recoveryCode, setRecoveryCode] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  useEffect(() => {
    if (mode === "otp") {
      setTimeout(() => hiddenInputRef.current?.focus(), 50);
    }
  }, [mode]);

  // ── Shared verify logic ────────────────────────────────────────
  const doVerify = useCallback(
    async (code: string) => {
      if (!code || loading) return;
      setLoading(true);
      setError(false);
      try {
        const tempToken = localStorage.getItem("temp-token") ?? "";
        const res = await authApi.verifyLoginOtp({ otpCode: code, tempToken });
        const { token, refreshToken } = res.data.result;

        localStorage.setItem("refreshToken", refreshToken);
        setAuth(token, null);

        const { data } = await userApi.getMe();
        setAuth(token, data.result);

        toast.success("Xác thực thành công!");
        navigate("/dashboard", { replace: true });
      } catch {
        setError(true);
        if (mode === "otp") {
          setOtpValue("");
          setTimeout(() => {
            setError(false);
            hiddenInputRef.current?.focus();
          }, 600);
        } else {
          setTimeout(() => setError(false), 600);
        }
        toast.error(
          mode === "otp"
            ? "OTP không đúng hoặc đã hết hạn"
            : "Recovery code không hợp lệ hoặc đã được dùng",
        );
      } finally {
        setLoading(false);
      }
    },
    [loading, mode, navigate, setAuth],
  );

  // ── OTP handlers ───────────────────────────────────────────────
  const handleHiddenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, "").slice(0, 6);
    setOtpValue(val);
    if (val.length === 6) doVerify(val);
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);
    setOtpValue(pasted);
    if (pasted.length === 6) doVerify(pasted);
  };

  // ── Switch mode ────────────────────────────────────────────────
  const switchMode = (next: "otp" | "recovery") => {
    setMode(next);
    setError(false);
    setOtpValue("");
    setRecoveryCode("");
  };

  const isOtpComplete = otpValue.length === 6;

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#ebf4f5",
        fontFamily: "var(--font-sans)",
        padding: 24,
      }}
    >
      <div style={{ width: "100%", maxWidth: 420 }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <span
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 900,
              fontSize: "1.5rem",
              color: "#0d0d0d",
            }}
          >
            Blog<span style={{ color: "#d32f2f" }}>AI</span>
          </span>
        </div>

        {/* Card */}
        <div
          style={{
            background: "#ffffff",
            border: "3px solid #0d0d0d",
            boxShadow: "6px 6px 0 #0d0d0d",
            padding: "36px 32px",
          }}
        >
          {/* Header */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 12,
              marginBottom: 28,
            }}
          >
            <span
              style={{
                width: 52,
                height: 52,
                background: error ? "#d32f2f" : "#0d0d0d",
                color: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "3px solid #0d0d0d",
                boxShadow: `4px 4px 0 ${error ? "#7f0d12" : "#d32f2f"}`,
                transition: "all 0.2s",
              }}
            >
              {mode === "recovery" ? (
                <Key size={22} />
              ) : (
                <ShieldCheck size={24} />
              )}
            </span>
            <div style={{ textAlign: "center" }}>
              <h2
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 900,
                  fontSize: "1.25rem",
                  color: "#0d0d0d",
                  margin: "0 0 4px",
                  letterSpacing: "-0.01em",
                }}
              >
                {mode === "otp" ? "Two-Factor Auth" : "Recovery Code"}
              </h2>
              <p
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: "0.82rem",
                  color: "#666",
                  margin: 0,
                }}
              >
                {mode === "otp"
                  ? "Enter the 6-digit code from your authenticator app"
                  : "Enter one of your saved recovery codes"}
              </p>
            </div>
          </div>

          {/* ── OTP mode ── */}
          {mode === "otp" && (
            <>
              <div
                onClick={() => hiddenInputRef.current?.focus()}
                style={{
                  display: "flex",
                  gap: 8,
                  justifyContent: "center",
                  marginBottom: 10,
                  cursor: "text",
                  position: "relative",
                }}
              >
                <input
                  ref={hiddenInputRef}
                  value={otpValue}
                  onChange={handleHiddenChange}
                  onPaste={handlePaste}
                  onKeyDown={(e) => e.key === "Enter" && doVerify(otpValue)}
                  onFocus={() => setFocused(true)}
                  onBlur={() => setFocused(false)}
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  style={{
                    position: "absolute",
                    opacity: 0,
                    pointerEvents: "none",
                    width: 1,
                    height: 1,
                  }}
                />
                {Array.from({ length: 6 }).map((_, i) => {
                  const isCursor =
                    focused && i === otpValue.length && !isOtpComplete;
                  const hasValue = !!otpValue[i];
                  return (
                    <div
                      key={i}
                      style={{
                        width: 48,
                        height: 58,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "1.5rem",
                        fontWeight: 900,
                        fontFamily: "var(--font-display)",
                        color: error ? "#d32f2f" : "#0d0d0d",
                        background: error
                          ? "#fff0f0"
                          : hasValue
                            ? "#f2fbfc"
                            : "#ffffff",
                        border: `3px solid ${error ? "#d32f2f" : isCursor ? "#0d0d0d" : hasValue ? "#0d0d0d" : "#ccc"}`,
                        boxShadow: isCursor ? "3px 3px 0 #d32f2f" : "none",
                        transition: "all 0.12s",
                        userSelect: "none",
                      }}
                    >
                      {hasValue ? (
                        otpValue[i]
                      ) : isCursor ? (
                        <span
                          style={{
                            width: 2,
                            height: 28,
                            background: "#0d0d0d",
                            display: "block",
                            animation: "blink 1s step-end infinite",
                          }}
                        />
                      ) : null}
                    </div>
                  );
                })}
              </div>

              <style>{`@keyframes blink{0%,100%{opacity:1}50%{opacity:0}}`}</style>

              {/* Progress dots */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: 6,
                  marginBottom: 20,
                }}
              >
                {Array.from({ length: 6 }).map((_, i) => (
                  <span
                    key={i}
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      background:
                        i < otpValue.length
                          ? error
                            ? "#d32f2f"
                            : "#0d0d0d"
                          : "#ddd",
                      transition: "background 0.15s",
                    }}
                  />
                ))}
              </div>

              {error && (
                <p
                  style={{
                    textAlign: "center",
                    fontFamily: "var(--font-sans)",
                    fontSize: "0.78rem",
                    color: "#d32f2f",
                    fontWeight: 600,
                    margin: "0 0 16px",
                  }}
                >
                  Incorrect code — please try again.
                </p>
              )}

              {/* Submit */}
              <button
                onClick={() => doVerify(otpValue)}
                disabled={!isOtpComplete || loading}
                style={{
                  width: "100%",
                  padding: 13,
                  fontFamily: "var(--font-display)",
                  fontWeight: 900,
                  fontSize: "0.82rem",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "#ffffff",
                  background: !isOtpComplete || loading ? "#aaa" : "#0d0d0d",
                  border: `3px solid ${!isOtpComplete || loading ? "#aaa" : "#0d0d0d"}`,
                  boxShadow:
                    isOtpComplete && !loading ? "4px 4px 0 #d32f2f" : "none",
                  cursor: !isOtpComplete || loading ? "not-allowed" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  marginBottom: 12,
                  transition: "all 0.15s",
                }}
                onMouseEnter={(e) => {
                  if (isOtpComplete && !loading) {
                    e.currentTarget.style.transform = "translate(-2px,-2px)";
                    e.currentTarget.style.boxShadow = "6px 6px 0 #d32f2f";
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "none";
                  e.currentTarget.style.boxShadow =
                    isOtpComplete && !loading ? "4px 4px 0 #d32f2f" : "none";
                }}
              >
                {loading ? (
                  <>
                    <Loader2 size={15} className="animate-spin" /> Verifying...
                  </>
                ) : (
                  <>
                    <ShieldCheck size={15} /> Verify Code
                  </>
                )}
              </button>

              {/* Switch to recovery */}
              <button
                onClick={() => switchMode("recovery")}
                style={{
                  width: "100%",
                  padding: "10px",
                  fontFamily: "var(--font-display)",
                  fontWeight: 700,
                  fontSize: "0.72rem",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "#666",
                  background: "transparent",
                  border: "2px solid #ddd",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 6,
                  marginBottom: 10,
                  transition: "all 0.15s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "#0d0d0d";
                  e.currentTarget.style.color = "#0d0d0d";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "#ddd";
                  e.currentTarget.style.color = "#666";
                }}
              >
                <Key size={13} /> Use a recovery code instead
              </button>
            </>
          )}

          {/* ── Recovery mode ── */}
          {mode === "recovery" && (
            <>
              {/* Info box */}
              <div
                style={{
                  background: "#fff8f8",
                  border: "2px solid #d32f2f",
                  padding: "12px 14px",
                  marginBottom: 16,
                }}
              >
                <p
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: "0.75rem",
                    color: "#7f0d12",
                    margin: 0,
                    lineHeight: 1.6,
                  }}
                >
                  Recovery codes were provided when you enabled 2FA. Each code
                  can only be used once. Format:{" "}
                  <code style={{ fontWeight: 700 }}>XXXX-XXXX-XXXX</code>
                </p>
              </div>

              <input
                type="text"
                placeholder="XXXX-XXXX-XXXX"
                value={recoveryCode}
                onChange={(e) => setRecoveryCode(e.target.value.toUpperCase())}
                onKeyDown={(e) => e.key === "Enter" && doVerify(recoveryCode)}
                autoFocus
                style={{
                  width: "100%",
                  padding: "14px",
                  fontFamily: "monospace",
                  fontWeight: 700,
                  fontSize: "1.1rem",
                  letterSpacing: "0.1em",
                  textAlign: "center",
                  color: error ? "#d32f2f" : "#0d0d0d",
                  background: error ? "#fff0f0" : "#ffffff",
                  border: `3px solid ${error ? "#d32f2f" : "#0d0d0d"}`,
                  borderRadius: 0,
                  outline: "none",
                  boxSizing: "border-box",
                  marginBottom: 16,
                  transition: "all 0.15s",
                }}
                onFocus={(e) => {
                  if (!error)
                    e.currentTarget.style.boxShadow = "4px 4px 0 #0d0d0d";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.boxShadow = "none";
                }}
              />

              {error && (
                <p
                  style={{
                    textAlign: "center",
                    fontFamily: "var(--font-sans)",
                    fontSize: "0.78rem",
                    color: "#d32f2f",
                    fontWeight: 600,
                    margin: "0 0 12px",
                  }}
                >
                  Invalid or already used recovery code.
                </p>
              )}

              {/* Submit */}
              <button
                onClick={() => doVerify(recoveryCode)}
                disabled={!recoveryCode.trim() || loading}
                style={{
                  width: "100%",
                  padding: 13,
                  fontFamily: "var(--font-display)",
                  fontWeight: 900,
                  fontSize: "0.82rem",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "#ffffff",
                  background:
                    !recoveryCode.trim() || loading ? "#aaa" : "#0d0d0d",
                  border: "3px solid #0d0d0d",
                  boxShadow:
                    recoveryCode.trim() && !loading
                      ? "4px 4px 0 #d32f2f"
                      : "none",
                  cursor:
                    !recoveryCode.trim() || loading ? "not-allowed" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  marginBottom: 12,
                  transition: "all 0.15s",
                }}
                onMouseEnter={(e) => {
                  if (recoveryCode.trim() && !loading) {
                    e.currentTarget.style.transform = "translate(-2px,-2px)";
                    e.currentTarget.style.boxShadow = "6px 6px 0 #d32f2f";
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "none";
                  e.currentTarget.style.boxShadow =
                    recoveryCode.trim() && !loading
                      ? "4px 4px 0 #d32f2f"
                      : "none";
                }}
              >
                {loading ? (
                  <>
                    <Loader2 size={15} className="animate-spin" /> Verifying...
                  </>
                ) : (
                  <>
                    <Key size={15} /> Use Recovery Code
                  </>
                )}
              </button>

              {/* Switch back to OTP */}
              <button
                onClick={() => switchMode("otp")}
                style={{
                  width: "100%",
                  padding: "10px",
                  fontFamily: "var(--font-display)",
                  fontWeight: 700,
                  fontSize: "0.72rem",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "#666",
                  background: "transparent",
                  border: "2px solid #ddd",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 6,
                  marginBottom: 10,
                  transition: "all 0.15s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "#0d0d0d";
                  e.currentTarget.style.color = "#0d0d0d";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "#ddd";
                  e.currentTarget.style.color = "#666";
                }}
              >
                <ShieldCheck size={13} /> Use authenticator app instead
              </button>
            </>
          )}

          {/* Back to login */}
          <button
            onClick={() => navigate("/login")}
            style={{
              width: "100%",
              padding: "10px",
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: "0.72rem",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "#666",
              background: "transparent",
              border: "2px solid #ddd",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
              transition: "all 0.15s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "#0d0d0d";
              e.currentTarget.style.color = "#0d0d0d";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "#ddd";
              e.currentTarget.style.color = "#666";
            }}
          >
            <ArrowLeft size={13} /> Back to Login
          </button>
        </div>

        <p
          style={{
            textAlign: "center",
            fontFamily: "var(--font-sans)",
            fontSize: "0.72rem",
            color: "#999",
            marginTop: 16,
          }}
        >
          {mode === "otp"
            ? "Code refreshes every 30 seconds · Works with Google Authenticator & Authy"
            : "Each recovery code can only be used once"}
        </p>
      </div>
    </div>
  );
};

export default TwoFactorPage;
