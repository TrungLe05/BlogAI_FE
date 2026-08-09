import { Users, Loader2, FileText, Eye, Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";

import StatChip from "./StatChip";
import { User } from "../types/user.types";
import { BlogResponse } from "@/features/blog/types/blog.types";

function formatNum(n: number): string {
  return n >= 1000 ? `${(n / 1000).toFixed(1)}K` : String(n);
}

interface Props {
  profileUser: User;
  blogs: BlogResponse[];
  totalViews: number;
  totalLikes: number;
  isOwnProfile: boolean;
  isFollowing: boolean;
  isFollowLoading: boolean;
  onFollowToggle: () => void;
}

export default function UserHero({
  profileUser,
  blogs,
  totalViews,
  totalLikes,
  isOwnProfile,
  isFollowing,
  isFollowLoading,
  onFollowToggle,
}: Props) {
  const navigate = useNavigate();

  return (
    <div className="w-full py-12 px-6 bg-[#0d0d0d] border-b-[3px] border-[#d32f2f]">
      <div className="max-w-7xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 mb-8 font-bold text-xs uppercase tracking-widest text-[#999] hover:text-[#d32f2f] transition-colors cursor-pointer"
          
        >
          ← Go Back
        </button>

        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6">
          {/* Left: Avatar + info */}
          <div className="flex items-start gap-5">
            <img
              src={
                profileUser.avatarUrl ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(profileUser.fullName ?? "U")}&background=d32f2f&color=fff&size=96`
              }
              alt={profileUser.fullName}
              className="shrink-0 object-cover"
              style={{
                width: 96,
                height: 96,
                border: "3px solid white",
                boxShadow: "4px 4px 0 #d32f2f",
              }}
            />
            <div>
              <div className="flex items-center gap-3 flex-wrap mb-1">
                <h1
                  className="font-black text-white font-display"
                  style={{ fontSize: "clamp(1.5rem, 3vw, 2.25rem)",
                    lineHeight: 1.1 }}
                >
                  {profileUser.fullName}
                </h1>
                
              </div>

              <p className="text-sm mb-4 text-[#999]">{profileUser.email}</p>

              <div className="flex flex-wrap items-center gap-0">
                <StatChip
                  icon={<FileText size={13} />}
                  label={`${blogs.length} Posts`}
                />
                <span className="text-white/30 mx-3 text-xs">|</span>
                <StatChip
                  icon={<Eye size={13} />}
                  label={`${formatNum(totalViews)} Views`}
                />
                <span className="text-white/30 mx-3 text-xs">|</span>
                <StatChip
                  icon={<Heart size={13} />}
                  label={`${formatNum(totalLikes)} Likes`}
                />
              </div>
            </div>
          </div>

          {/* Right: Follow / Own badge */}
          {!isOwnProfile ? (
            <div className="shrink-0 self-start sm:self-center">
              <button
                onClick={onFollowToggle}
                disabled={isFollowLoading}
                className={`flex items-center gap-2 px-6 py-3 font-black text-sm uppercase tracking-widest transition-all cursor-pointer border-[3px] border-white text-white shadow-[4px_4px_0_#d32f2f] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0_#d32f2f]
                  ${isFollowing ? "bg-transparent" : "bg-[#d32f2f]"}`}
                style={{ opacity: isFollowLoading ? 0.6 : 1 }}
              >
                {isFollowLoading ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Users size={16} />
                )}
                {isFollowLoading
                  ? "..."
                  : isFollowing
                    ? "Following ✓"
                    : "Follow"}
              </button>
            </div>
          ) : (
            <div className="shrink-0 self-start sm:self-center">
              <span
                className="inline-flex items-center gap-2 px-5 py-3 text-sm font-black uppercase tracking-widest text-[#999] border-[3px] border-[#999] font-display"
                
              >
                Your Profile
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
