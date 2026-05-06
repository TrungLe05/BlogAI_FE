import { Menu, Search, X, PenLine } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Header() {
  const [isSearchOpen, setSearchOpen] = useState(false);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const navItems = [
    { label: "Explore", href: "/explore" },
    { label: "Features", href: "/#features" },
    { label: "Write", href: "/dashboard" },
  ];

  return (
    <header
      className="sticky top-0 z-50 bg-[#ebf4f5] dark:bg-zinc-900 border-b-[3px] border-[#0d0d0d] dark:border-zinc-600"
    >
      <div className="max-w-340 mx-auto px-6 h-16 flex items-center justify-between gap-6">
        {/* Logo */}
        <Link to="/" className="shrink-0">
          <span
          className="font-bold text-[#0d0d0d] tracking-[0.05em] dark:text-zinc-100"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(22px, 3vw, 28px)",
              // fontWeight: 700,
              // color: "#0d0d0d",
              // letterSpacing: "0.05em",
            }}
          >
            Blog<span style={{ color: "#d32f2f" }}>AI</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-0">
          {navItems.map((item) => (
            <Link
              key={item.label}
              to={item.href}
              className=" px-5 py-4 dark:text-white font-bold text-sm uppercase tracking-wider hover:bg-[#0d0d0d] hover:text-white transition-colors"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Desktop Right */}
        <div className="hidden lg:flex items-center gap-3">
          {isSearchOpen && (
            <input
              className="brutal-input w-52 text-sm"
              placeholder="Search blogs..."
              autoFocus
              onBlur={() => setSearchOpen(false)}
            />
          )}
          <button
            className="p-2 hover:bg-[#0d0d0d] hover:text-white transition-colors"
            onClick={() => setSearchOpen(!isSearchOpen)}
          >
            <Search size={18} className="dark:text-white"/>
          </button>
          <button
            className="brutal-btn-red text-sm"
            style={{ padding: "10px 20px" }}
            onClick={() => navigate("/dashboard")}
          >
            <PenLine size={16} />
            Start Writing
          </button>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="lg:hidden p-2 dark:text-white"
          onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="toggle menu"
        >
          {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden bg-white dark:bg-black border-t-2 border-[#0d0d0d] dark:border-zinc-600"
        >
          {navItems.map((item) => (
            <Link
              key={item.label}
              to={item.href}
              className="border-b-2 border-[#0d0d0d] dark:text-white hover:dark:bg-zinc-400 dark:border-zinc-600 block px-6 py-4 font-bold text-sm uppercase tracking-wider hover:bg-[#0d0d0d] hover:text-white transition-colors"
              style={{
                fontFamily: "var(--font-display)",
              }}
              onClick={() => setMobileMenuOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          <div className="p-4">
            <button
              className="brutal-btn-red w-full justify-center"
              onClick={() => {
                navigate("/dashboard");
                setMobileMenuOpen(false);
              }}
            >
              <PenLine size={16} />
              Start Writing
            </button>
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;
