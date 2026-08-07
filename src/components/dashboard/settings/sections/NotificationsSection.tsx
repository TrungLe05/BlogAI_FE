import { useState } from "react";
import { User, Heart, MessageSquare, AtSign, Newspaper, Megaphone } from "lucide-react";
import { toast } from "sonner";
import { BrutalToggle, SaveButton } from "../components";

export function NotificationsSection() {
  const [notifs, setNotifs] = useState({
    followers: true, postLikes: true, comments: true,
    mentions: true, emailDigest: false, marketing: false,
  });
  const toggle = (key: keyof typeof notifs) => setNotifs(p => ({ ...p, [key]: !p[key] }));

  const rows: { key: keyof typeof notifs; icon: React.ReactNode; label: string; sub: string }[] = [
    { key: "followers",   icon: <User size={13} />,        label: "New Followers",       sub: "When someone starts following you" },
    { key: "postLikes",   icon: <Heart size={13} />,       label: "Post Likes",          sub: "When someone likes your article" },
    { key: "comments",    icon: <MessageSquare size={13} />, label: "Comments",          sub: "When someone comments on your post" },
    { key: "mentions",    icon: <AtSign size={13} />,      label: "Mentions",            sub: "When you are mentioned in a post" },
    { key: "emailDigest", icon: <Newspaper size={13} />,   label: "Weekly Email Digest", sub: "Top stories and performance stats" },
    { key: "marketing",   icon: <Megaphone size={13} />,   label: "Marketing Emails",    sub: "Product updates and announcements" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {rows.map(r => (
        <div key={r.key} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 14px", background: "#ffffff", border: "2px solid #0d0d0d" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ width: 28, height: 28, background: "#e7f0f1", border: "2px solid #0d0d0d", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{r.icon}</span>
            <div>
              <p className="font-display" style={{ fontWeight: 700, fontSize: "0.82rem", color: "#0d0d0d", margin: 0 }}>{r.label}</p>
              <p className="font-sans" style={{ fontSize: "0.72rem", color: "#5b403d", margin: 0 }}>{r.sub}</p>
            </div>
          </div>
          <BrutalToggle enabled={notifs[r.key]} onChange={() => toggle(r.key)} />
        </div>
      ))}
      <div style={{ marginTop: 8 }}>
        <SaveButton onClick={() => toast.success("Notification preferences saved.")} label="Save Preferences" />
      </div>
    </div>
  );
}