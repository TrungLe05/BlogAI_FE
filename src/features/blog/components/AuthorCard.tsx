import { Link } from "react-router-dom";
import { User } from "lucide-react";
import { BlogResponse } from "@/types/response/blogResponse.types";

interface Props {
  blogDetail: BlogResponse;
  isFollowing: boolean;
  isFollowLoading: boolean;
  isBlogLoading: boolean;
  onFollow: () => void;
  onNavigate: (id: string) => void;
}

export default function AuthorCard({
  blogDetail, isFollowing, isFollowLoading, isBlogLoading, onFollow, onNavigate,
}: Props) {
  return (
    <div className="p-6 bg-white dark:bg-zinc-800 flex items-start gap-4 border-[3px] border-[#0d0d0d] dark:border-zinc-600 shadow-[4px_4px_0_#0d0d0d] dark:shadow-[4px_4px_0_#52525b]">
      <img
        src={blogDetail.author.avatarUrl || "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=600&h=400&fit=crop"}
        alt="author"
        className="w-16 h-16 shrink-0 cursor-pointer border-[3px] border-[#0d0d0d] dark:border-zinc-600"
        onClick={() => onNavigate(blogDetail.author.id)}
      />
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Link
            to={`/user/${blogDetail.author.id}`}
            className="font-black text-[#0d0d0d] dark:text-white hover:text-[#d32f2f] transition-colors"
            style={{ fontFamily: "var(--font-display)", fontSize: "1.1rem" }}
          >
            {blogDetail.author.fullName}
          </Link>
          <User size={14} className="text-[#d32f2f]" />
        </div>
        <p className="text-sm leading-relaxed text-[#555] dark:text-zinc-400">
          {blogDetail.author.email}
        </p>
        <button
          className={`mt-3 flex items-center gap-2 px-4 py-2 font-black text-xs uppercase tracking-widest transition-all border-[3px] border-[#0d0d0d] dark:border-zinc-600 shadow-[3px_3px_0_#0d0d0d] dark:shadow-[3px_3px_0_#52525b]
            ${isFollowing
              ? "bg-white dark:bg-zinc-700 text-[#0d0d0d] dark:text-white"
              : "bg-[#d32f2f] text-white"
            }`}
          disabled={isFollowLoading || isBlogLoading}
          onClick={onFollow}
          style={{
            fontFamily: "var(--font-display)",
            opacity: isFollowLoading ? 0.6 : 1,
            cursor: isFollowLoading ? "not-allowed" : "pointer",
          }}
        >
          {isBlogLoading ? "..." : isFollowLoading ? "..." : isFollowing ? "Following ✓" : "Follow Author"}
        </button>
      </div>
    </div>
  );
}