import { NotificationBell } from "@/shared/components/common/NotificationBell";
import UserSearchBox from "@/shared/components/common/UserSearchBox";
import { AvatarDropdown } from "@/shared/components/common/AvatarDropdown";
import useAuthStore from "@/features/auth/stores/authStore";
import { Menu, PenLine, X } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Header() {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);

  return (
    <header className="sticky top-0 z-50 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md border-b border-black/[0.07] dark:border-white/[0.07]">
      {/* ── Desktop ──────────────────────────────────────── */}
      <div className="hidden lg:flex items-center h-14 px-6 max-w-7xl mx-auto gap-4">
        {/* Logo */}
        <Link to="/" className="shrink-0 mr-2">
          <span
            className="font-bold text-[#0d0d0d] dark:text-zinc-100 tracking-tight select-none font-display"
            style={{ fontSize: "22px" }}
          >
            Blog<span style={{ color: "#d32f2f" }}>AI</span>
          </span>
        </Link>

        {/* Search — ngay sau logo, chiếm khoảng ~240px */}
        <div className="w-60">
          <UserSearchBox />
        </div>

        {/* Spacer đẩy actions sang phải */}
        <div className="flex-1" />

        {/* Actions */}
        <div className="flex items-center gap-3">
          {/* Write */}
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full
                       text-[13px] text-gray-500 dark:text-zinc-400
                       hover:text-[#0d0d0d] dark:hover:text-zinc-100
                       hover:bg-black/4 dark:hover:bg-white/5
                       transition-colors"
          >
            <PenLine size={15} strokeWidth={1.8} />
            <span className="font-sans">Write</span>
          </button>

          {/* Notification Bell */}
          {user && (
            <div className="flex items-center">
              <NotificationBell />
            </div>
          )}

          {/* Sign in / Avatar */}
          {user ? (
            <AvatarDropdown />
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="ml-1 px-4 py-1.5 rounded-full bg-[#0d0d0d] dark:bg-zinc-100
                         text-white dark:text-zinc-900
                         text-[13px] font-medium hover:opacity-85 transition-opacity"
            >
              Sign in
            </button>
          )}
        </div>
      </div>

      {/* ── Mobile: logo + hamburger ─────────────────────── */}
      <div className="lg:hidden flex items-center justify-between px-4 h-14">
        <Link to="/">
          <span
            className="font-bold text-[#0d0d0d] dark:text-zinc-100 tracking-tight font-display"
            style={{ fontSize: "20px" }}
          >
            Blog<span style={{ color: "#d32f2f" }}>AI</span>
          </span>
        </Link>
        <div className="flex items-center gap-2">
          {user && <NotificationBell />}
          {user && <AvatarDropdown />}
          <button
            className="p-1.5 rounded-full hover:bg-black/5 dark:text-zinc-200 transition-colors"
            onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="toggle menu"
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* ── Mobile Menu ──────────────────────────────────── */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white dark:bg-zinc-900 border-t border-black/6 dark:border-white/6">
          {/* Search */}
          <div className="px-4 py-3">
            <UserSearchBox onClose={() => setMobileMenuOpen(false)} />
          </div>

          {/* Nav links */}
          {[
            { label: "Explore", href: "/explore" },
            { label: "Dashboard", href: "/dashboard" },
          ].map((item) => (
            <Link
              key={item.label}
              to={item.href}
              className="block px-6 py-3 text-[14px] font-medium
                         text-gray-700 dark:text-zinc-300
                         border-b border-black/4 dark:border-white/4
                         hover:bg-black/3 dark:hover:bg-white/3
                         transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              {item.label}
            </Link>
          ))}

          {/* Write / Sign in */}
          <div className="px-4 py-3">
            {user ? (
              <button
                className="flex items-center gap-2 w-full px-4 py-2.5 rounded-full
                           bg-[#0d0d0d] dark:bg-zinc-100 text-white dark:text-zinc-900
                           text-[13px] font-medium justify-center transition-opacity hover:opacity-85"
                onClick={() => {
                  navigate("/dashboard");
                  setMobileMenuOpen(false);
                }}
              >
                <PenLine size={14} />
                Start Writing
              </button>
            ) : (
              <button
                className="w-full px-4 py-2.5 rounded-full bg-[#0d0d0d] text-white
                           text-[13px] font-medium hover:opacity-85 transition-opacity"
                onClick={() => {
                  navigate("/login");
                  setMobileMenuOpen(false);
                }}
              >
                Sign in
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
