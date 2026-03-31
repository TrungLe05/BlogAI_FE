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
    <header className="sticky top-0 z-50 bg-[#ebf4f5]" style={{ borderBottom: "3px solid #0d0d0d" }}>
      <div className="max-w-340 mx-auto px-6 h-16 flex items-center justify-between gap-6">
        {/* Logo */}
        <Link to="/" className="shrink-0">
          <span
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(22px, 3vw, 28px)",
              fontWeight: 700,
              color: "#0d0d0d",
              letterSpacing: "0.05em",
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
              className="px-5 py-4 font-bold text-sm uppercase tracking-wider hover:bg-[#0d0d0d] hover:text-white transition-colors"
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
            <Search size={18} />
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
          className="lg:hidden p-2"
          onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="toggle menu"
        >
          {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden bg-white"
          style={{ borderTop: "2px solid #0d0d0d" }}
        >
          {navItems.map((item) => (
            <Link
              key={item.label}
              to={item.href}
              className="block px-6 py-4 font-bold text-sm uppercase tracking-wider hover:bg-[#0d0d0d] hover:text-white transition-colors"
              style={{
                fontFamily: "var(--font-display)",
                borderBottom: "1px solid #0d0d0d",
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