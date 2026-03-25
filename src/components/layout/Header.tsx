import { Menu, Search, X } from "lucide-react";
import { useState } from "react";

function Header() {
  const [isSearchOpen, setSearchOpen] = useState(false);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false); // ✅ false = ẩn mặc định

  const items = [
    "BREAKING: New neural architecture achieves 99% accuracy in medical imaging",
    "LATEST RESEARCH: Quantum computing breakthrough accelerates AI training by 1000x",
    "TRENDING: OpenAI releases groundbreaking multimodal model",
  ];

  const listItems = [
    "ai ethics",
    "machine learning",
    "neural networks",
    "robotics",
    "future tech",
    "research",
  ];

  return (
    <>
      <div className="z-50 top-0">
        {/* Ticker */}
        <div className="bg-ink text-cream overflow-hidden h-8">
          <div className="animate-marquee inline-flex items-center h-full gap-16">
            {[...items, ...items].map((item, i) => (
              <span
                key={i}
                className="whitespace-nowrap font-sans text-xs tracking-widest shrink-0"
              >
                ◈ &nbsp; {item}
              </span>
            ))}
          </div>
        </div>

        {/* Masthead */}
        <div className="p-6 bg-cream border-b-2 border-ink">
          <div className="max-w-340 mx-auto">
            {/* Mobile: hamburger button — chỉ hiện khi < lg */}
            <div className="lg:hidden flex justify-between items-center mb-6">
              <button
                className="p-2"
                aria-label="toggle menu"
                onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                {/* ✅ Mở → show X | Đóng → show Menu */}
              </button>
            </div>

            {/* Brand */}
            <div className="text-center mb-6">
              <a href="/">
                <h1
                  className="tracking-[0.18em] hover:opacity-80 transition-opacity leading-none"
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "clamp(48px, 10vw, 70px)",
                    fontWeight: 700,
                  }}
                >
                  NEURAL
                </h1>
              </a>
              <p className="mt-2 italic font-serif-italic text-[16px] text-muted">
                Artificial Intelligence & Machine Learning Quarterly
              </p>
            </div>

            {/* Search + Subscribe — chỉ hiện desktop */}
            <div className="hidden lg:flex justify-end items-center gap-4">
              {isSearchOpen && (
                <input className="flex-5 border border-black px-3 py-2 rounded-2xl h-10" />
              )}
              <div className="flex-1 flex justify-end gap-4">
                <button
                  className="hover:bg-black hover:text-white p-2 cursor-pointer"
                  onClick={() => setSearchOpen(!isSearchOpen)}
                >
                  <Search size={20} />
                </button>
                <button className="cursor-pointer tracking-tight leading-1 font-display px-6 py-4 text-sm text-cream bg-black border-black border-2 hover:bg-cream hover:text-black transition-colors">
                  SUBSCRIBE
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Nav menu */}
        <div className="bg-cream border-b-2 border-black">
          <div className="max-w-340 mx-auto px-6">
            {/*
              ✅ Desktop (lg+): luôn hiển thị  → "lg:flex"
              ✅ Mobile: chỉ hiện khi isMobileMenuOpen = true → "flex" hoặc "hidden"
            */}
            <ul
              className={`
                flex-col lg:flex-row lg:items-center gap-0 p-0
                lg:flex justify-center
                ${isMobileMenuOpen ? "flex" : "hidden"}
              `}
            >
              {listItems.map((item, i) => (
                <li
                  key={i}
                  className="cursor-pointer uppercase py-4 px-6 leading-1 tracking-tight font-display hover:bg-black hover:text-cream transition-colors"
                >
                  <a className="text-sm leading-1 tracking-tighter font-bold">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}

export default Header;