import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { authApi } from "@/api/authApi";
import { extractApiError } from "@/utils/apiError";
import { BrutalInput, FieldLabel, SaveButton } from "../components";

export function PasswordSection() {
  const [current, setCurrent] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!current || !newPwd || !confirm) { toast.error("Please fill in all fields."); return; }
    if (newPwd !== confirm) { toast.error("New passwords do not match."); return; }
    if (newPwd.length < 8) { toast.error("Password must be at least 8 characters."); return; }
    setLoading(true);
    try {
      await authApi.changePassword({ currentPassword: current, newPassword: newPwd, confirmPassword: confirm });
      toast.success("Password changed successfully!");
      setCurrent(""); setNewPwd(""); setConfirm("");
    } catch (e) { toast.error(extractApiError(e)); } finally { setLoading(false); }
  };

  const strength = newPwd.length === 0 ? 0 : newPwd.length < 6 ? 1 : newPwd.length < 10 ? 2 : 3;
  const strengthColors = ["", "#af101a", "#f59e0b", "#16a34a"];
  const strengthLabels = ["", "Weak", "Fair", "Strong"];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div>
        <FieldLabel>Current Password</FieldLabel>
        <BrutalInput type={showCurrent ? "text" : "password"} placeholder="Enter current password" value={current} onChange={setCurrent}
          suffix={<span onClick={() => setShowCurrent(v => !v)}>{showCurrent ? <EyeOff size={14} /> : <Eye size={14} />}</span>} />
      </div>
      <div>
        <FieldLabel>New Password</FieldLabel>
        <BrutalInput type={showNew ? "text" : "password"} placeholder="Min 8 characters" value={newPwd} onChange={setNewPwd}
          suffix={<span onClick={() => setShowNew(v => !v)}>{showNew ? <EyeOff size={14} /> : <Eye size={14} />}</span>} />
        {newPwd.length > 0 && (
          <div style={{ marginTop: 8 }}>
            <div style={{ display: "flex", gap: 4, marginBottom: 4 }}>
              {[1,2,3].map(i => <div key={i} style={{ flex: 1, height: 5, background: i <= strength ? strengthColors[strength] : "#e7f0f1", border: "1px solid #0d0d0d", transition: "background 0.2s" }} />)}
            </div>
            <p className="font-display" style={{ fontSize: "0.68rem", fontWeight: 700, color: strengthColors[strength], margin: 0 }}>{strengthLabels[strength]}</p>
          </div>
        )}
      </div>
      <div>
        <FieldLabel>Confirm New Password</FieldLabel>
        <BrutalInput type={showConfirm ? "text" : "password"} placeholder="Repeat new password" value={confirm} onChange={setConfirm}
          suffix={<span onClick={() => setShowConfirm(v => !v)}>{showConfirm ? <EyeOff size={14} /> : <Eye size={14} />}</span>} />
        {confirm.length > 0 && newPwd !== confirm && (
          <p className="font-sans" style={{ fontSize: "0.72rem", color: "#af101a", marginTop: 4 }}>Passwords do not match.</p>
        )}
      </div>
      <SaveButton onClick={handleSave} loading={loading} />
      <div style={{ background: "#e7f0f1", border: "2px solid #0d0d0d", padding: "14px 16px" }}>
        <p className="font-display" style={{ fontWeight: 700, fontSize: "0.65rem", letterSpacing: "0.1em", textTransform: "uppercase" as const, color: "#0d0d0d", margin: "0 0 8px" }}>💡 Security Tips</p>
        {["Use 8+ characters with symbols", "Never reuse passwords", "Enable Two-Factor Auth below"].map(tip => (
          <p key={tip} className="font-sans" style={{ fontSize: "0.78rem", color: "#5b403d", margin: "0 0 4px", paddingLeft: 10, borderLeft: "3px solid #af101a" }}>{tip}</p>
        ))}
      </div>
    </div>
  );
}