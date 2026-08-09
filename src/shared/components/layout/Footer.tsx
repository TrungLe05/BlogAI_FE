import { Link } from "react-router-dom";
import { Github, Twitter, Instagram, Linkedin } from "lucide-react";

const footerLinks = [
  { label: "About", href: "/about" },
  { label: "Explore", href: "/explore" },
  { label: "Contact", href: "/contact" },
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
];

const socialLinks = [
  { icon: <Twitter size={18} />, href: "https://twitter.com", label: "Twitter" },
  { icon: <Github size={18} />, href: "https://github.com", label: "GitHub" },
  { icon: <Instagram size={18} />, href: "https://instagram.com", label: "Instagram" },
  { icon: <Linkedin size={18} />, href: "https://linkedin.com", label: "LinkedIn" },
];

function Footer() {
  return (
    <footer
      className="font-sans" style={{ background: "#0d0d0d",
        borderTop: "3px solid #0d0d0d" }}
    >
      <div className="max-w-340 mx-auto px-6 py-12">
        <div className="grid md:grid-cols-3 gap-10 items-start mb-10">
          {/* Brand */}
          <div>
            <Link to="/">
              <span
                className="text-2xl font-black mb-3 block font-display"
                style={{ color: "white"  }}
              >
                Blog<span style={{ color: "#d32f2f" }}>AI</span>
              </span>
            </Link>
            <p className="text-white/60 text-sm leading-relaxed max-w-xs">
              The platform for writers who believe ideas deserve to be read.
              Join 10,000+ creators shaping the internet's story.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4
              className="font-black text-xs uppercase tracking-widest mb-4 text-white/40 font-display"
              
            >
              Navigation
            </h4>
            <ul className="space-y-2">
              {footerLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-sm text-white/70 hover:text-white transition-colors font-medium font-display"
                    
                  >
                    → {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social + CTA */}
          <div>
            <h4
              className="font-black text-xs uppercase tracking-widest mb-4 text-white/40 font-display"
              
            >
              Follow Us
            </h4>
            <div className="flex gap-3 mb-6">
              {socialLinks.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="w-10 h-10 flex items-center justify-center text-white hover:bg-white hover:text-black transition-colors"
                  style={{ border: "2px solid rgba(255,255,255,0.3)" }}
                >
                  {s.icon}
                </a>
              ))}
            </div>
            <Link to="/dashboard">
              <button
                className="brutal-btn-red text-xs"
                style={{ padding: "10px 20px" }}
              >
                Start Writing Today →
              </button>
            </Link>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8"
          style={{ borderTop: "2px solid rgba(255,255,255,0.1)" }}
        >
          <p className="text-xs text-white/40">
            © 2025 BlogAI. Made with ❤️ for writers everywhere.
          </p>
          <div className="flex items-center gap-2">
            <div
              className="w-2 h-2"
              style={{ background: "#22c55e", boxShadow: "0 0 6px #22c55e" }}
            />
            <span className="text-xs text-white/40">All systems operational</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
