import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Settings,
  LogOut,
  KeyRound,
  Globe,
  ChevronDown,
} from "lucide-react";
import useAuthStore from "@/stores/authStore";

interface AvatarDropdownProps {
  onSettingsClick?: () => void;
}

export function AvatarDropdown({ onSettingsClick }: AvatarDropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = () => {
    logout();
    localStorage.removeItem("refreshToken");
    navigate("/login");
  };

  const menuItems = [
    {
      icon: <Settings size={14} />,
      label: "Settings",
      onClick: () => {
        onSettingsClick?.();
        setOpen(false);
      },
    },
    {
      icon: <KeyRound size={14} />,
      label: "Change Password",
      onClick: () => {
        setOpen(false);
        // Navigate to change password or open modal
      },
    },
    {
      icon: <Globe size={14} />,
      label: "Change Language",
      onClick: () => {
        setOpen(false);
      },
    },
    {
      icon: <LogOut size={14} />,
      label: "Log Out",
      onClick: handleLogout,
      danger: true,
    },
  ];

  return (
    <div ref={ref} className="relative">
      <button
        className="flex items-center gap-1.5 group"
        onClick={() => setOpen((o) => !o)}
        title="Account menu"
      >
        <div className="relative">
          <img
            src={
              user?.avatarUrl ||
              "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face"
            }
            alt="avatar"
            className="w-9 h-9 rounded-full object-cover shrink-0"
            style={{ border: "2px solid #0d0d0d" }}
          />
          {/* Online dot */}
          <span
            className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-green-500"
            style={{ border: "2px solid white" }}
          />
        </div>
        <ChevronDown
          size={13}
          style={{
            color: "#0d0d0d",
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.15s ease",
          }}
        />
      </button>

      {open && (
        <div
          className="absolute right-0 top-full mt-2 w-48 bg-white z-[200]"
          style={{
            border: "3px solid #0d0d0d",
            boxShadow: "4px 4px 0 #0d0d0d",
          }}
        >
          {/* User info header */}
          <div
            className="px-4 py-3"
            style={{ borderBottom: "2px solid #0d0d0d", background: "#ebf4f5" }}
          >
            <p
              className="text-xs font-black uppercase truncate"
              style={{ fontFamily: "var(--font-display)", color: "#0d0d0d" }}
            >
              {user?.fullName}
            </p>
            <p
              className="text-xs truncate mt-0.5"
              style={{ color: "#777", fontFamily: "var(--font-sans)" }}
            >
              {user?.email}
            </p>
          </div>

          {/* Menu items */}
          <div className="py-1">
            {menuItems.map((item) => (
              <button
                key={item.label}
                onClick={item.onClick}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors"
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "0.8rem",
                  fontWeight: 700,
                  color: item.danger ? "#d32f2f" : "#0d0d0d",
                  borderBottom: "1px solid rgba(0,0,0,0.06)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = item.danger
                    ? "#d32f2f"
                    : "#0d0d0d";
                  e.currentTarget.style.color = "white";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = item.danger
                    ? "#d32f2f"
                    : "#0d0d0d";
                }}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
