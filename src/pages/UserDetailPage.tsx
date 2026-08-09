import { useParams } from "react-router-dom";
import { Heart, FileText, BarChart2 } from "lucide-react";
import LoadingSpinner from "@/shared/components/common/LoadingSpinner";
import { useUserDetail } from "@/features/user/hooks/useUserDetail";
import UserHero from "@/features/user/components/UserHero";
import SummaryPill from "@/features/user/components/SummaryPill";
import UserBlogGrid from "@/features/user/components/UserBlogGrid";
import Header from "@/shared/components/layout/Header";

function formatNum(n: number): string {
  return n >= 1000 ? `${(n / 1000).toFixed(1)}K` : String(n);
}

export default function UserDetailPage() {
  const { userId } = useParams<{ userId: string }>();

  const {
    profileUser,
    blogs,
    isLoading,
    isFollowLoading,
    isOwnProfile,
    isFollowing,
    totalViews,
    totalLikes,
    handleFollowToggle,
  } = useUserDetail(userId);

  if (isLoading) return <LoadingSpinner />;
  if (!profileUser) return null;

  return (
    <div className="min-h-screen bg-[#ebf4f5] dark:bg-zinc-950 font-sans">
      {/* Header */}
      <Header />
      {/* Hero */}
      <UserHero
        profileUser={profileUser}
        blogs={blogs}
        totalViews={totalViews}
        totalLikes={totalLikes}
        isOwnProfile={isOwnProfile}
        isFollowing={isFollowing}
        isFollowLoading={isFollowLoading}
        onFollowToggle={handleFollowToggle}
      />

      {/* Summary Bar */}
      <div className="w-full bg-[#f5f5f5] dark:bg-zinc-900 border-b-[3px] border-[#0d0d0d] dark:border-zinc-700">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-wrap gap-6">
          <SummaryPill
            icon={<BarChart2 size={14} />}
            label="Total Views"
            value={formatNum(totalViews)}
          />
          <SummaryPill
            icon={<Heart size={14} />}
            label="Total Likes"
            value={formatNum(totalLikes)}
          />
          <SummaryPill
            icon={<FileText size={14} />}
            label="Published"
            value={`${blogs.length} Stories`}
          />
        </div>
      </div>

      {/* Blog Grid */}
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="mb-8">
          <div className="flex items-end gap-4 mb-1">
            <h2
              className="font-black text-[#0d0d0d] dark:text-white font-display"
              style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)", lineHeight: 1.1 }}
            >
              Published Stories
            </h2>
          </div>
          <div className="h-1 bg-[#d32f2f] w-20" />
        </div>

        <UserBlogGrid blogs={blogs} isOwnProfile={isOwnProfile} />
      </div>
    </div>
  );
}
