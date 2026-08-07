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

        toast.success("Authentication successful!");
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
            ? "The OTP is incorrect or has expired."
            : "The recovery code is invalid or has already been used.",
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
    <div className="min-h-screen flex items-center justify-center bg-[#ebf4f5] dark:bg-zinc-950 p-6 font-sans" >
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <span
            className="font-black text-2xl text-[#0d0d0d] dark:text-white font-display"
            
          >
            Blog<span className="text-[#d32f2f]">AI</span>
          </span>
        </div>

        {/* Card */}
        <div className="bg-white dark:bg-zinc-900 border-[3px] border-[#0d0d0d] dark:border-zinc-600 shadow-[6px_6px_0_#0d0d0d] dark:shadow-[6px_6px_0_#52525b] p-9">
          {/* Header */}
          <div className="flex flex-col items-center gap-3 mb-7">
            <span
              className={`w-13 h-13 flex items-center justify-center text-white border-[3px] border-[#0d0d0d] dark:border-zinc-600 transition-all
                ${error ? "bg-[#d32f2f] shadow-[4px_4px_0_#7f0d12]" : "bg-[#0d0d0d] dark:bg-zinc-700 shadow-[4px_4px_0_#d32f2f]"}`}
              style={{ width: 52, height: 52 }}
            >
              {mode === "recovery" ? (
                <Key size={22} />
              ) : (
                <ShieldCheck size={24} />
              )}
            </span>
            <div className="text-center">
              <h2
                className="font-black text-xl text-[#0d0d0d] dark:text-white mb-1 font-display"
                style={{ letterSpacing: "-0.01em"  }}
              >
                {mode === "otp" ? "Two-Factor Auth" : "Recovery Code"}
              </h2>
              <p className="text-xs text-[#666] dark:text-zinc-400 font-sans" >
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
                className="flex gap-2 justify-center mb-2.5 cursor-text relative"
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
                  className="absolute opacity-0 pointer-events-none w-px h-px"
                />
                {Array.from({ length: 6 }).map((_, i) => {
                  const isCursor =
                    focused && i === otpValue.length && !isOtpComplete;
                  const hasValue = !!otpValue[i];
                  return (
                    <div
                      key={i}
                      className={`flex items-center justify-center font-black select-none transition-all
                        ${error
                          ? "border-[3px] border-[#d32f2f] bg-red-50 dark:bg-red-950/30 text-[#d32f2f]"
                          : isCursor
                            ? "border-[3px] border-[#0d0d0d] dark:border-zinc-400 bg-[#f2fbfc] dark:bg-zinc-800 text-[#0d0d0d] dark:text-white shadow-[3px_3px_0_#d32f2f]"
                            : hasValue
                              ? "border-[3px] border-[#0d0d0d] dark:border-zinc-500 bg-[#f2fbfc] dark:bg-zinc-800 text-[#0d0d0d] dark:text-white"
                              : "border-[3px] border-[#ccc] dark:border-zinc-600 bg-white dark:bg-zinc-800 text-[#0d0d0d] dark:text-white"
                        }`}
                       style={{ width: 48,
                        height: 58,
                        fontSize: "1.5rem" }}
                    >
                      {hasValue ? (
                        otpValue[i]
                      ) : isCursor ? (
                        <span
                          className="block bg-[#0d0d0d] dark:bg-white"
                          style={{
                            width: 2,
                            height: 28,
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
              <div className="flex justify-center gap-1.5 mb-5">
                {Array.from({ length: 6 }).map((_, i) => (
                  <span
                    key={i}
                    className={`w-1.5 h-1.5 rounded-full transition-colors
                      ${i < otpValue.length
                        ? error ? "bg-[#d32f2f]" : "bg-[#0d0d0d] dark:bg-white"
                        : "bg-[#ddd] dark:bg-zinc-600"
                      }`}
                  />
                ))}
              </div>

              {error && (
                <p className="text-center text-xs text-[#d32f2f] font-semibold mb-4">
                  Incorrect code — please try again.
                </p>
              )}

              {/* Submit */}
              <button
                onClick={() => doVerify(otpValue)}
                disabled={!isOtpComplete || loading}
                className={`w-full flex items-center justify-center gap-2 py-3 font-black text-xs uppercase tracking-[0.1em] text-white transition-all mb-3
                  ${isOtpComplete && !loading
                    ? "bg-[#0d0d0d] dark:bg-zinc-200 dark:text-zinc-900 border-[3px] border-[#0d0d0d] dark:border-zinc-200 shadow-[4px_4px_0_#d32f2f] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0_#d32f2f] cursor-pointer"
                    : "bg-[#aaa] dark:bg-zinc-600 border-[3px] border-[#aaa] dark:border-zinc-600 cursor-not-allowed"
                  }`}
                
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
                className="w-full flex items-center justify-center gap-1.5 py-2.5 font-bold text-xs uppercase tracking-[0.08em] text-[#666] dark:text-zinc-400 bg-transparent border-[2px] border-[#ddd] dark:border-zinc-700 hover:border-[#0d0d0d] dark:hover:border-zinc-400 hover:text-[#0d0d0d] dark:hover:text-white transition-all cursor-pointer mb-2.5"
                
              >
                <Key size={13} /> Use a recovery code instead
              </button>
            </>
          )}

          {/* ── Recovery mode ── */}
          {mode === "recovery" && (
            <>
              {/* Info box */}
              <div className="bg-red-50 dark:bg-red-950/30 border-[2px] border-[#d32f2f] p-3 mb-4">
                <p className="text-xs text-[#7f0d12] dark:text-red-400 leading-relaxed">
                  Recovery codes were provided when you enabled 2FA. Each code
                  can only be used once. Format:{" "}
                  <code className="font-bold">XXXX-XXXX-XXXX</code>
                </p>
              </div>

              <input
                type="text"
                placeholder="XXXX-XXXX-XXXX"
                value={recoveryCode}
                onChange={(e) => setRecoveryCode(e.target.value.toUpperCase())}
                onKeyDown={(e) => e.key === "Enter" && doVerify(recoveryCode)}
                autoFocus
                className={`w-full py-3.5 font-mono font-bold text-lg text-center tracking-[0.1em] outline-none border-[3px] mb-4 transition-all focus:shadow-[4px_4px_0_#0d0d0d] dark:focus:shadow-[4px_4px_0_#52525b]
                  ${error
                    ? "border-[#d32f2f] bg-red-50 dark:bg-red-950/30 text-[#d32f2f]"
                    : "border-[#0d0d0d] dark:border-zinc-600 bg-white dark:bg-zinc-800 text-[#0d0d0d] dark:text-white"
                  }`}
              />

              {error && (
                <p className="text-center text-xs text-[#d32f2f] font-semibold mb-3">
                  Invalid or already used recovery code.
                </p>
              )}

              {/* Submit */}
              <button
                onClick={() => doVerify(recoveryCode)}
                disabled={!recoveryCode.trim() || loading}
                className={`w-full flex items-center justify-center gap-2 py-3 font-black text-xs uppercase tracking-[0.1em] text-white transition-all mb-3
                  ${recoveryCode.trim() && !loading
                    ? "bg-[#0d0d0d] dark:bg-zinc-200 dark:text-zinc-900 border-[3px] border-[#0d0d0d] dark:border-zinc-200 shadow-[4px_4px_0_#d32f2f] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0_#d32f2f] cursor-pointer"
                    : "bg-[#aaa] dark:bg-zinc-600 border-[3px] border-[#0d0d0d] dark:border-zinc-600 cursor-not-allowed"
                  }`}
                
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
                className="w-full flex items-center justify-center gap-1.5 py-2.5 font-bold text-xs uppercase tracking-[0.08em] text-[#666] dark:text-zinc-400 bg-transparent border-[2px] border-[#ddd] dark:border-zinc-700 hover:border-[#0d0d0d] dark:hover:border-zinc-400 hover:text-[#0d0d0d] dark:hover:text-white transition-all cursor-pointer mb-2.5"
                
              >
                <ShieldCheck size={13} /> Use authenticator app instead
              </button>
            </>
          )}

          {/* Back to login */}
          <button
            onClick={() => navigate("/login")}
            className="w-full flex items-center justify-center gap-1.5 py-2.5 font-bold text-xs uppercase tracking-[0.08em] text-[#666] dark:text-zinc-400 bg-transparent border-[2px] border-[#ddd] dark:border-zinc-700 hover:border-[#0d0d0d] dark:hover:border-zinc-400 hover:text-[#0d0d0d] dark:hover:text-white transition-all cursor-pointer"
            
          >
            <ArrowLeft size={13} /> Back to Login
          </button>
        </div>

        <p className="text-center text-xs text-[#999] dark:text-zinc-600 mt-4 font-sans" >
          {mode === "otp"
            ? "Code refreshes every 30 seconds · Works with Google Authenticator & Authy"
            : "Each recovery code can only be used once"}
        </p>
      </div>
    </div>
  );
};

export default TwoFactorPage;
