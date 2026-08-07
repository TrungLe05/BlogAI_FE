import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Settings, LogOut, KeyRound, Globe } from "lucide-react";
import useAuthStore from "@/stores/authStore";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { validateChangePassword } from "@/utils/userValidation";
import { toast } from "sonner";
import { authApi } from "@/api/authApi";
import { extractApiError } from "@/utils/apiError";
import LoadingSpinner from "../common/LoadingSpinner";
import UserAvatar from "../common/userAvatar";

interface AvatarDropdownProps {
  onSettingsClick?: () => void;
}

export function AvatarDropdown({ onSettingsClick }: AvatarDropdownProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [languageDialogOpen, setLanguageDialogOpen] = useState(false);

  const ref = useRef<HTMLDivElement>(null);
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setDropdownOpen(false);
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
        setDropdownOpen(false);
        if (onSettingsClick) {
          onSettingsClick();
        } else {
          navigate("/dashboard?view=settings");
        }
      },
    },
    {
      icon: <KeyRound size={14} />,
      label: "Change Password",
      onClick: () => {
        setDropdownOpen(false); // đóng dropdown
        setPasswordDialogOpen(true); // mở dialog
      },
    },
    {
      icon: <Globe size={14} />,
      label: "Change Language",
      onClick: () => {
        setDropdownOpen(false);
        setLanguageDialogOpen(true); // ← thêm
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
    <>
      <div ref={ref} className="relative">
        <button
          className="flex items-center gap-1.5 group"
          onClick={() => setDropdownOpen((o) => !o)}
          title="Account menu"
        >
          {/* <div className="relative">
            <img
              src={
                user?.avatarUrl ||
                "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face"
              }
              alt="avatar"
              className="w-9 h-9 rounded-full object-cover shrink-0"
              style={{ border: "2px solid #0d0d0d" }}
            />
            <span
              className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-green-500"
              style={{ border: "2px solid white" }}
            />
          </div> */}
          <UserAvatar />
          {/* <ChevronDown
            size={13}
            style={{
              color: "#0d0d0d",
              transform: dropdownOpen ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 0.15s ease",
            }}
          /> */}
        </button>

        {dropdownOpen && (
          <div
            className="absolute right-0 top-full mt-2 w-48 bg-white z-50"
            style={{
              border: "3px solid #0d0d0d",
              boxShadow: "4px 4px 0 #0d0d0d",
            }}
          >
            <div
              className="px-4 py-3"
              style={{
                borderBottom: "2px solid #0d0d0d",
                background: "#ebf4f5",
              }}
            >
              <p
                className="text-xs font-black uppercase truncate font-display"
                
              >
                {user?.fullName}
              </p>
              <p className="text-xs truncate mt-0.5" style={{ color: "#777" }}>
                {user?.email}
              </p>
            </div>
            <div className="py-1">
              {menuItems.map((item) => (
                <button
                  key={item.label}
                  onClick={item.onClick}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors font-display"
                  style={{ fontSize: "0.8rem",
                    fontWeight: 700,
                    color: item.danger ? "#d32f2f" : "#0d0d0d",
                    borderBottom: "1px solid rgba(0,0,0,0.06)" }}
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

      {/* Dialog nằm ngoài div dropdown để tránh bị clipped */}
      <ChangePasswordDialog
        open={passwordDialogOpen}
        onOpenChange={setPasswordDialogOpen}
      />
      <ChangeLanguageDialog
        open={languageDialogOpen}
        onOpenChange={setLanguageDialogOpen}
      />
    </>
  );
}

function ChangePasswordDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { logout } = useAuthStore();
  const navigate = useNavigate();
  const handleSubmit = async () => {
    const dataSubmit = { currentPassword, newPassword, confirmPassword };

    const errors = validateChangePassword(dataSubmit);
    if (errors.length > 0) {
      errors.forEach((e) => toast.error(e.message));
      return;
    }

    setLoading(true);
    try {
      const { data } = await authApi.changePassword(dataSubmit);
      if (!data.result) {
        toast.error("Change password failed!");
        return;
      }
      toast.success("Password changed successfully, please sign in again");
      onOpenChange(false);

      await authApi.logout(); // invalid token ở backend
      logout(); // clear store (accessToken, user → null)
      navigate("/login");
    } catch (e) {
      toast.error(extractApiError(e));
    } finally {
      setLoading(false);
    }
  };

  // ✅ loading nằm BÊN TRONG Dialog, không unmount
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Change Password</DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="flex justify-center py-8">
            <LoadingSpinner />
          </div>
        ) : (
          <form className="space-y-4">
            <Input
              type="password"
              placeholder="Current Password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
            <Input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <Input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <Button
              type="button"
              className="w-full"
              onClick={handleSubmit}
            >
              Update Password
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}

function ChangeLanguageDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [selected, setSelected] = useState<"VI" | "EN">("EN");

  const languages = [
    { code: "VI", label: "Tiếng Việt", flag: "🇻🇳" },
    { code: "EN", label: "English", flag: "🇺🇸" },
  ] as const;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xs">
        <DialogHeader>
          <DialogTitle
            className="font-black uppercase tracking-widest font-display"
            
          >
            Change Language
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-3 py-2">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => setSelected(lang.code)}
              className="flex items-center gap-4 px-4 py-3 transition-all text-left"
              style={{ border: `3px solid #0d0d0d`,
                background: selected === lang.code ? "#0d0d0d" : "white",
                color: selected === lang.code ? "white" : "#0d0d0d",
                boxShadow:
                  selected === lang.code
                    ? "3px 3px 0 #d32f2f"
                    : "3px 3px 0 #0d0d0d",
                
                fontWeight: 800 }}
            >
              <span className="text-2xl">{lang.flag}</span>
              <div>
                <p className="text-sm font-black uppercase tracking-widest">
                  {lang.code}
                </p>
                <p
                  className="text-xs font-normal"
                  style={{
                    color:
                      selected === lang.code ? "rgba(255,255,255,0.7)" : "#666",
                  }}
                >
                  {lang.label}
                </p>
              </div>
              {selected === lang.code && (
                <span
                  className="ml-auto text-xs font-black uppercase tracking-widest"
                  style={{
                    color: "#d32f2f",
                    background: "white",
                    padding: "2px 6px",
                    border: "2px solid #d32f2f",
                  }}
                >
                  Active
                </span>
              )}
            </button>
          ))}
        </div>

        <Button
          className="w-full font-black uppercase tracking-widest font-display"
          style={{ background: "#d32f2f",
            border: "3px solid #0d0d0d",
            boxShadow: "3px 3px 0 #0d0d0d",
            borderRadius: 0 }}
          onClick={() => onOpenChange(false)}
        >
          Apply
        </Button>
      </DialogContent>
    </Dialog>
  );
}
