import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, CheckCircle } from "lucide-react";
import { authApi } from "@/api/authApi";
import { toast } from "sonner";

const stats = [
  { value: "10K+", label: "Active Writers" },
  { value: "50K+", label: "Blogs Published" },
  { value: "1M+", label: "Monthly Readers" },
];

const perks = [
  "Free forever plan with unlimited posts",
  "AI-powered writing assistant",
  "Built-in analytics dashboard",
  "Custom domain support",
];

function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
  });
  const navigate = useNavigate();

  const validate = (): boolean => {
    if (!form.name.trim()) {
      toast.error("Vui lòng nhập họ tên");
      return false;
    }

    if (!form.email.trim()) {
      toast.error("Vui lòng nhập email");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      toast.error("Email không hợp lệ");
      return false;
    }

    if (!form.password) {
      toast.error("Vui lòng nhập mật khẩu");
      return false;
    }

    if (form.password.length < 8) {
      toast.error("Mật khẩu phải có ít nhất 8 ký tự");
      return false;
    }

    if (!form.confirm) {
      toast.error("Vui lòng xác nhận mật khẩu");
      return false;
    }

    if (form.password !== form.confirm) {
      toast.error("Mật khẩu xác nhận không khớp");
      return false;
    }

    return true;
  };

  // const setAuth = useAuthStore((state) => state.setAuth)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      const { data } = await authApi.register({
        fullName: form.name,
        email: form.email,
        passwordHash: form.password,
      });
      if (data) {
        toast.success("Đăng ký thành công!");
        navigate("/login");
      }
    } catch (e) {
      toast.error("Đã có lỗi xảy ra");
      console.log("Error: ", e);
    }
  };

  const update = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <div
      className="min-h-screen grid lg:grid-cols-2 bg-[#ebf4f5] "
      style={{ fontFamily: "var(--font-sans)" }}
    >
      {/* Left Panel */}
      <div className="hidden lg:flex flex-col justify-between p-12 relative overflow-hidden bg-[#ebf4f5] border-r-[3px] border-[#0d0d0d]">
        <div
          className="absolute -top-8 -right-8 w-48 h-48 bg-[#d32f2f]"
          style={{ zIndex: 0 }}
        />

        <div className="relative z-10">
          <Link to="/">
            <span
              className="text-2xl font-black text-[#0d0d0d]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Blog<span className="text-[#d32f2f]">AI</span>
            </span>
          </Link>
        </div>

        <div className="relative z-10">
          <h2
            className="font-black mb-4 text-[#0d0d0d]"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(36px, 4vw, 52px)",
              lineHeight: 1.1,
            }}
          >
            Join <span className="text-[#d32f2f]">10,000+</span>
            <br />
            Writers.
          </h2>
          <p className="mb-8 text-base leading-relaxed text-[#555]">
            Start your writing journey today. No credit card. No limits. Just
            stories.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 mb-8">
            {stats.map((s) => (
              <div
                key={s.label}
                className="p-4 bg-white text-center border-[3px] border-[#0d0d0d] shadow-[4px_4px_0_#0d0d0d]"
              >
                <p
                  className="font-black text-2xl text-[#d32f2f]"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {s.value}
                </p>
                <p
                  className="text-xs text-[#666]"
                  style={{ fontFamily: "var(--font-sans)" }}
                >
                  {s.label}
                </p>
              </div>
            ))}
          </div>

          {/* Perks */}
          <div className="space-y-3">
            {perks.map((p) => (
              <div key={p} className="flex items-center gap-3">
                <CheckCircle size={18} className="shrink-0 text-[#d32f2f]" />
                <span className="text-sm font-medium text-[#333]">{p}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="relative z-10 text-xs text-[#999]">
          © 2025 BlogAI. All rights reserved.
        </p>
      </div>

      {/* Right Panel */}
      <div className="flex items-center justify-center p-8 lg:p-12 bg-[#ebf4f5]">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-8 text-center">
            <Link to="/">
              <span
                className="text-2xl font-black text-[#0d0d0d]"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Blog<span className="text-[#d32f2f]">AI</span>
              </span>
            </Link>
          </div>

          <div className="bg-white p-8 border-[3px] border-[#0d0d0d]  shadow-[6px_6px_0_#0d0d0d]">
            <h1
              className="font-black text-2xl mb-2 text-[#0d0d0d]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Create Your Account
            </h1>
            <p className="text-sm mb-6 text-[#888]">
              Start writing for free in seconds
            </p>

            {/* Google */}
            <button
              className="w-full flex items-center justify-center gap-3 mb-5 font-bold text-sm bg-white text-[#0d0d0d] border-[3px] border-[#0d0d0d] shadow-[4px_4px_0_#0d0d0d] transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0_#0d0d0d] cursor-pointer"
              style={{
                padding: "12px 24px",
                fontFamily: "var(--font-display)",
              }}
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
              Sign up with Google
            </button>
            <button
              className="w-full flex items-center justify-center gap-3 mb-6 font-bold text-sm bg-white  text-[#0d0d0d] border-[3px] border-[#0d0d0d]  shadow-[4px_4px_0_#0d0d0d] transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0_#0d0d0d] cursor-pointer"
              style={{
                padding: "12px 24px",
                fontFamily: "var(--font-display)",
              }}
              onClick={authApi.loginWithGithub}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                className="fill-[#0d0d0d]"
              >
                <path d="M10.226 17.284c-2.965-.36-5.054-2.493-5.054-5.256 0-1.123.404-2.336 1.078-3.144-.292-.741-.247-2.314.09-2.965.898-.112 2.111.36 2.83 1.01.853-.269 1.752-.404 2.853-.404 1.1 0 1.999.135 2.807.382.696-.629 1.932-1.1 2.83-.988.315.606.36 2.179.067 2.942.72.854 1.101 2 1.101 3.167 0 2.763-2.089 4.852-5.098 5.234.763.494 1.28 1.572 1.28 2.807v2.336c0 .674.561 1.056 1.235.786 4.066-1.55 7.255-5.615 7.255-10.646C23.5 6.188 18.334 1 11.978 1 5.62 1 .5 6.188.5 12.545c0 4.986 3.167 9.12 7.435 10.669.606.225 1.19-.18 1.19-.786V20.63a2.9 2.9 0 0 1-1.078.224c-1.483 0-2.359-.808-2.987-2.313-.247-.607-.517-.966-1.034-1.033-.27-.023-.359-.135-.359-.27 0-.27.45-.471.898-.471.652 0 1.213.404 1.797 1.235.45.651.921.943 1.483.943.561 0 .92-.202 1.437-.719.382-.381.674-.718.944-.943"></path>
              </svg>
              Sign up with Github
            </button>
            <div className="flex items-center gap-3 mb-5">
              <div className="flex-1 h-0.5 bg-[#0d0d0d]" />
              <span
                className="text-xs font-bold uppercase text-[#0d0d0d]"
                style={{ fontFamily: "var(--font-display)" }}
              >
                or
              </span>
              <div className="flex-1 h-0.5 bg-[#0d0d0d] " />
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  className="block mb-1.5 text-xs font-black uppercase tracking-widest text-[#0d0d0d]"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  Full Name
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => update("name", e.target.value)}
                  placeholder="Your name"
                  className="brutal-input"
                />
              </div>
              <div>
                <label
                  className="block mb-1.5 text-xs font-black uppercase tracking-widest text-[#0d0d0d]"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  Email Address
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => update("email", e.target.value)}
                  placeholder="you@example.com"
                  className="brutal-input"
                />
              </div>
              <div>
                <label
                  className="block mb-1.5 text-xs font-black uppercase tracking-widest text-[#0d0d0d]"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={(e) => update("password", e.target.value)}
                    placeholder="Min. 8 characters"
                    className="brutal-input pr-12 "
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#555]"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              <div>
                <label
                  className="block mb-1.5 text-xs font-black uppercase tracking-widest text-[#0d0d0d]"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={form.confirm}
                    onChange={(e) => update("confirm", e.target.value)}
                    placeholder="Repeat your password"
                    className="brutal-input"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#555]"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="brutal-btn-red w-full justify-center mt-2"
                style={{ padding: "14px", fontSize: "1rem" }}
              >
                Create Account 🚀
              </button>
            </form>

            <p className="mt-4 text-xs text-center text-[#999] ">
              By signing up, you agree to our{" "}
              <Link to="/terms" className="font-bold underline text-[#0d0d0d] ">
                Terms
              </Link>{" "}
              and{" "}
              <Link
                to="/privacy"
                className="font-bold underline text-[#0d0d0d]"
              >
                Privacy Policy
              </Link>
            </p>

            <p className="mt-4 text-center text-sm text-[#666]">
              Already a writer?{" "}
              <Link
                to="/login"
                className="font-black text-[#d32f2f]"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Log in →
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
