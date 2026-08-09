import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, PenLine } from "lucide-react";
import { authApi } from "@/features/auth/api/authApi";
import { toast } from "sonner";
import useAuthStore from "@/features/auth/stores/authStore";
import { userApi } from "@/features/user/api/userApi";

function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await authApi.login({ email, password });
      console.log(res.data);

      if (res.data.result.require2FA) {
        // localStorage.setItem("temp-token", res.data.result.tempToken);
        setAuth("", res.data.result.tempToken, null);
        navigate("/auth/2fa-verify-otp-code");
        return;
      }

      localStorage.setItem("refreshToken", res.data.result.refreshToken);
      setAuth(res.data.result.token, "", null);

      const { data } = await userApi.getMe();
      setAuth(res.data.result.token, res.data.result.tempToken, data.result);

      toast.success("Đăng nhập thành công!");
      navigate("/dashboard", { replace: true });
    } catch {
      toast.error("Email hoặc mật khẩu không đúng");
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-[#ebf4f5]  font-sans">
      {/* Left Panel */}
      <div className="hidden lg:flex flex-col justify-between p-12 relative overflow-hidden bg-[#0d0d0d]">
        {/* Decorative brute shapes */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-[#d32f2f] opacity-80" />
        <div className="absolute bottom-20 left-0 w-24 h-24 bg-[#d32f2f] opacity-50" />

        {/* Logo */}
        <div className="relative z-10">
          <Link to="/">
            <span className="text-2xl font-black text-white font-display">
              Blog<span className="text-[#d32f2f]">AI</span>
            </span>
          </Link>
        </div>

        {/* Headline */}
        <div className="relative z-10">
          <h2
            className="font-black mb-6 text-white font-display"
            style={{ fontSize: "clamp(36px, 4vw, 52px)", lineHeight: 1.1 }}
          >
            Welcome Back,
            <br />
            <span className="text-[#d32f2f]">Writer.</span>
          </h2>
          <p className="text-white/70 text-base leading-relaxed">
            Your audience is waiting. Your stories matter. Log in and keep
            creating.
          </p>

          {/* Testimonial card */}
          <div
            className="mt-8 p-6 bg-white"
            style={{
              border: "3px solid #d32f2f",
              boxShadow: "6px 6px 0 #d32f2f",
            }}
          >
            <p className="italic text-sm leading-relaxed mb-4 text-[#333]">
              "Since joining BlogAI, my writing has reached readers across 40
              countries. This platform completely changed my career."
            </p>
            <div className="flex items-center gap-3">
              <img
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=50&h=50&fit=crop&crop=face"
                alt="writer"
                className="w-9 h-9"
                style={{ border: "2px solid #0d0d0d" }}
              />
              <div>
                <p className="text-xs font-black text-[#0d0d0d] font-display">
                  Sarah Chen
                </p>
                <p className="text-xs text-[#888]">
                  Tech Writer · 12K followers
                </p>
              </div>
            </div>
          </div>
        </div>

        <p className="relative z-10 text-white/30 text-xs">
          © 2025 BlogAI. All rights reserved.
        </p>
      </div>

      {/* Right Panel - Form */}
      <div className="flex items-center justify-center p-8 lg:p-12 bg-[#ebf4f5] ">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden mb-8 text-center">
            <Link to="/">
              <span className="text-2xl font-black text-[#0d0d0d]  font-display">
                Blog<span className="text-[#d32f2f]">AI</span>
              </span>
            </Link>
          </div>

          <div className="bg-white  p-8 border-[3px] border-[#0d0d0d] shadow-[6px_6px_0_#0d0d0d]">
            <div className="flex items-center gap-3 mb-8">
              <div
                className="w-10 h-10 flex items-center justify-center bg-[#d32f2f]"
                style={{ border: "2px solid #0d0d0d" }}
              >
                <PenLine size={18} color="white" />
              </div>
              <div>
                <h1 className="font-black text-2xl text-[#0d0d0d]  font-display">
                  Sign In
                </h1>
                <p className="text-xs text-[#888]">
                  Continue writing your story
                </p>
              </div>
            </div>

            {/* Google Button */}
            <button
              className="w-full flex items-center justify-center gap-3 mb-6 font-bold text-sm bg-white text-[#0d0d0d]  border-[3px] border-[#0d0d0d] dark:border-zinc-600 shadow-[4px_4px_0_#0d0d0d] transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0_#0d0d0d] cursor-pointer font-display"
              style={{ padding: "12px 24px" }}
              onClick={authApi.loginWithGoogle}
            >
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continue with Google
            </button>

            <button
              className="w-full flex items-center justify-center gap-3 mb-6 font-bold text-sm bg-white  text-[#0d0d0d]  border-[#0d0d0d] border-[3px]  shadow-[4px_4px_0_#0d0d0d]  transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0_#0d0d0d]  cursor-pointer font-display"
              style={{ padding: "12px 24px" }}
              onClick={authApi.loginWithGithub}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                className="fill-[#0d0d0d] "
              >
                <path d="M10.226 17.284c-2.965-.36-5.054-2.493-5.054-5.256 0-1.123.404-2.336 1.078-3.144-.292-.741-.247-2.314.09-2.965.898-.112 2.111.36 2.83 1.01.853-.269 1.752-.404 2.853-.404 1.1 0 1.999.135 2.807.382.696-.629 1.932-1.1 2.83-.988.315.606.36 2.179.067 2.942.72.854 1.101 2 1.101 3.167 0 2.763-2.089 4.852-5.098 5.234.763.494 1.28 1.572 1.28 2.807v2.336c0 .674.561 1.056 1.235.786 4.066-1.55 7.255-5.615 7.255-10.646C23.5 6.188 18.334 1 11.978 1 5.62 1 .5 6.188.5 12.545c0 4.986 3.167 9.12 7.435 10.669.606.225 1.19-.18 1.19-.786V20.63a2.9 2.9 0 0 1-1.078.224c-1.483 0-2.359-.808-2.987-2.313-.247-.607-.517-.966-1.034-1.033-.27-.023-.359-.135-.359-.27 0-.27.45-.471.898-.471.652 0 1.213.404 1.797 1.235.45.651.921.943 1.483.943.561 0 .92-.202 1.437-.719.382-.381.674-.718.944-.943"></path>
              </svg>
              Continue with Github
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3 mb-6">
              <div className="flex-1 h-0.5 bg-[#0d0d0d] " />
              <span className="text-xs font-bold uppercase text-[#0d0d0d]  font-display">
                or
              </span>
              <div className="flex-1 h-0.5 bg-[#0d0d0d] " />
            </div>

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block mb-2 text-xs font-black uppercase tracking-widest text-[#0d0d0d] dark:text-zinc-200 font-display">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="brutal-input"
                  required
                />
              </div>
              <div className="mb-6">
                <label className="block mb-2 text-xs font-black uppercase tracking-widest text-[#0d0d0d] font-display">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="brutal-input pr-12"
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#555]"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                <Link
                  to="/forgot-password"
                  className="block mt-2 text-xs font-bold text-right text-[#d32f2f] font-display"
                >
                  Forgot Password?
                </Link>
              </div>

              <button
                type="submit"
                className="brutal-btn-primary w-full justify-center text-base"
                style={{ padding: "14px", fontSize: "1rem" }}
              >
                Log In
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-[#666] ">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="font-black text-[#d32f2f] font-display"
              >
                Start Writing →
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
