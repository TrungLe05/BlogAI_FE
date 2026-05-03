import { useRef } from "react";
import { Camera, Edit3, Share2 } from "lucide-react";
import { User } from "@/types/response/authResponse.type";
import { BlogResponse } from "@/types/response/blogResponse.types";
import StatBox from "./StatBox";

interface ProfileBannerProps {
  user: User | null;
  avatarPreview: string | undefined;
  form: { fullName: string; email: string; avatarUrl: string };
  followers: User[];
  following: User[];
  myPublishBlog: BlogResponse[];
  myDraftBlog: BlogResponse[];
  fmtNum: (n: number) => string;
  onFollowersClick: () => void;
  onFollowingClick: () => void;
  onAvatarChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

function ProfileBanner({
  user, avatarPreview, form, followers, following,
  myPublishBlog, myDraftBlog, fmtNum,
  onFollowersClick, onFollowingClick, onAvatarChange,
}: ProfileBannerProps) {
  const fileRef = useRef<HTMLInputElement>(null);

  return (
    <div className="relative" style={{ background: "#0d0d0d", borderBottom: "4px solid #d32f2f" }}>
      <div className="absolute top-0 right-0 w-40 h-40" style={{ background: "#d32f2f", opacity: 0.08 }} />
      <div className="px-10 py-10 relative z-10">
        <div className="flex flex-col lg:flex-row items-start lg:items-end gap-8">
          {/* Avatar */}
          <div className="relative shrink-0">
            <img
              src={avatarPreview || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face"}
              alt={user?.fullName}
              className="w-28 h-28 object-cover"
              style={{ border: "4px solid white", boxShadow: "6px 6px 0 #d32f2f" }}
            />
            <button
              onClick={() => fileRef.current?.click()}
              className="absolute -bottom-2 -right-2 w-8 h-8 flex items-center justify-center"
              style={{ background: "#d32f2f", border: "3px solid white", cursor: "pointer" }}
              title="Change avatar"
            >
              <Camera size={13} color="white" />
            </button>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onAvatarChange} />
          </div>
          {/* Identity */}
          <div className="flex-1">
            <h1 className="font-black text-white text-3xl mb-1" style={{ fontFamily: "var(--font-display)", letterSpacing: "-0.02em" }}>
              {form.fullName}
            </h1>
            <p className="text-white/40 text-xs uppercase tracking-[0.15em] mb-4" style={{ fontFamily: "var(--font-display)" }}>
              {form.email}
            </p>
            <div className="flex flex-wrap gap-3">
              <StatBox value={fmtNum(followers.length)} label="Followers" onClick={onFollowersClick} />
              <StatBox value={String(following.length)} label="Following" onClick={onFollowingClick} />
              <StatBox value={String(myPublishBlog.length + myDraftBlog.length)} label="Posts" />
            </div>
          </div>
          {/* Actions */}
          <div className="flex flex-col gap-3 shrink-0">
            <button
              className="flex items-center gap-2 px-5 py-2.5 text-xs font-black uppercase tracking-widest transition-all cursor-pointer"
              style={{ fontFamily: "var(--font-display)", background: "#d32f2f", color: "white", border: "3px solid #0d0d0d", boxShadow: "4px 4px 0 rgba(255,255,255,0.2)" }}
              onClick={() => document.getElementById("dash-edit-panel")?.scrollIntoView({ behavior: "smooth" })}
              onMouseEnter={(e) => { e.currentTarget.style.transform = "translate(-2px,-2px)"; e.currentTarget.style.boxShadow = "6px 6px 0 rgba(255,255,255,0.3)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = "translate(0,0)"; e.currentTarget.style.boxShadow = "4px 4px 0 rgba(255,255,255,0.2)"; }}
            >
              <Edit3 size={13} /> Edit Profile
            </button>
            <button
              className="flex items-center gap-2 px-5 py-2.5 text-xs font-black uppercase tracking-widest transition-all cursor-pointer"
              style={{ fontFamily: "var(--font-display)", background: "transparent", color: "white", border: "3px solid rgba(255,255,255,0.3)" }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = "white"; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.3)"; }}
            >
              <Share2 size={13} /> Share
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfileBanner;
