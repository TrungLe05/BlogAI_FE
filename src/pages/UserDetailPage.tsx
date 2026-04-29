import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Eye,
  Heart,
  Clock,
  Users,
  FileText,
  BarChart2,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import blogApi from "@/api/blogApi";
import followApi from "@/api/followApi";
import useAuthStore from "@/stores/authStore";
import { User } from "@/types/response/authResponse.type"; 
import { BlogResponse } from "@/types/response/blogResponse.types"; 
import { extractApiError } from "@/utils/apiError";
import LoadingSpinner from "@/components/common/LoadingSpinner";

function UserDetailPage() {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const { user: currentUser } = useAuthStore();

  const [profileUser, setProfileUser] = useState<User | null>(null);
  const [blogs, setBlogs] = useState<BlogResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFollowLoading, setIsFollowLoading] = useState(false);
  const [followOverride, setFollowOverride] = useState<boolean | null>(null);

  const isOwnProfile = profileUser?.id === currentUser?.id;
  const isFollowing =
    followOverride !== null
      ? followOverride
      : (profileUser?.following ?? false);

  // ─── Fetch user & blogs ───────────────────────────────────

  useEffect(() => {
    if (!userId) return;
    setFollowOverride(null);

    const load = async () => {
      setIsLoading(true);
      try {
        const { data } = await blogApi.getAllBlogPublishByUserId(userId);

        setBlogs(data.result.filter(Boolean));
        setProfileUser(data.result[0].author);
      } catch (e) {
        toast.error("Failed to load user profile.");
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, [userId]);

  // ─── Follow / Unfollow ────────────────────────────────────

  const handleFollowToggle = async () => {
    if (!profileUser?.id || isFollowLoading || isOwnProfile) return;
    setIsFollowLoading(true);
    try {
      if (isFollowing) {
        toast("Confirm", {
          description: "Are you sure you want to unfollow this user ?",
          action: {
            label: "Confirm",
            onClick: async () => {
              await followApi.unfollow(profileUser.id);
              setFollowOverride(false);
              toast.success("Unfollowed successfully");
            },
          },
          cancel: {
            label: "Cancel",
            onClick: () => {},
          },
        });
      } else {
        await followApi.follow(profileUser.id);
        setFollowOverride(true);
        toast.success("Following! They'll be notified.");
      }
    } catch (e) {
      toast.error(extractApiError(e));
    } finally {
      setIsFollowLoading(false);
    }
  };

  // ─── Derived ──────────────────────────────────────────────

  const totalViews = blogs.reduce((sum, b) => sum + (b.viewCount ?? 0), 0);
  const totalLikes = blogs.reduce((sum, b) => sum + (b.likeCount ?? 0), 0);

  if (isLoading) return <LoadingSpinner />;

  return (
    <div
      className="min-h-screen"
      style={{ background: "#ebf4f5", fontFamily: "var(--font-sans)" }}
    >
      {/* ── Hero Header ── */}
      <div
        className="w-full py-12 px-6"
        style={{ background: "#0d0d0d", borderBottom: "3px solid #d32f2f" }}
      >
        <div className="max-w-7xl mx-auto">
          {/* Back link */}
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 mb-8 font-bold text-xs uppercase tracking-widest hover:text-[#d32f2f] transition-colors cursor-pointer"
            style={{ fontFamily: "var(--font-display)", color: "#999" }}
          >
            <ArrowLeft size={14} />
            Go Back
          </button>

          {/* Profile Row */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6">
            {/* Left: Avatar + info */}
            <div className="flex items-start gap-5">
              <img
                src={
                  profileUser?.avatarUrl ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    profileUser?.fullName ?? "U",
                  )}&background=d32f2f&color=fff&size=96`
                }
                alt={profileUser?.fullName}
                className="shrink-0 object-cover"
                style={{
                  width: "96px",
                  height: "96px",
                  border: "3px solid white",
                  boxShadow: "4px 4px 0 #d32f2f",
                }}
              />
              <div>
                <div className="flex items-center gap-3 flex-wrap mb-1">
                  <h1
                    className="font-black text-white"
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "clamp(1.5rem, 3vw, 2.25rem)",
                      lineHeight: 1.1,
                    }}
                  >
                    {profileUser?.fullName}
                  </h1>
                  {/* Role badge */}
                  <span
                    className="text-xs font-black uppercase tracking-widest text-white px-2 py-0.5"
                    style={{
                      background: "#d32f2f",
                      border: "2px solid white",
                      fontFamily: "var(--font-display)",
                    }}
                  >
                    {profileUser?.role === "ADMIN" ? "ADMIN" : "AUTHOR"}
                  </span>
                </div>
                <p
                  className="text-sm mb-4"
                  style={{ color: "#999", fontFamily: "var(--font-sans)" }}
                >
                  {profileUser?.email}
                </p>

                {/* Stats row */}
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

            {/* Right: Follow button */}
            {!isOwnProfile && (
              <div className="shrink-0 self-start sm:self-center">
                <button
                  onClick={handleFollowToggle}
                  disabled={isFollowLoading}
                  className="flex items-center gap-2 px-6 py-3 font-black text-sm uppercase tracking-widest transition-all cursor-pointer"
                  style={{
                    fontFamily: "var(--font-display)",
                    border: "3px solid white",
                    background: isFollowing ? "transparent" : "#d32f2f",
                    color: "white",
                    boxShadow: "4px 4px 0 #d32f2f",
                    opacity: isFollowLoading ? 0.6 : 1,
                    cursor: isFollowLoading ? "not-allowed" : "pointer",
                  }}
                  onMouseEnter={(e) => {
                    if (!isFollowLoading) {
                      e.currentTarget.style.transform = "translate(-2px,-2px)";
                      e.currentTarget.style.boxShadow = "6px 6px 0 #d32f2f";
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translate(0,0)";
                    e.currentTarget.style.boxShadow = "4px 4px 0 #d32f2f";
                  }}
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
            )}

            {/* Own profile badge */}
            {isOwnProfile && (
              <div className="shrink-0 self-start sm:self-center">
                <span
                  className="inline-flex items-center gap-2 px-5 py-3 text-sm font-black uppercase tracking-widest text-white"
                  style={{
                    fontFamily: "var(--font-display)",
                    border: "3px solid #999",
                    color: "#999",
                  }}
                >
                  Your Profile
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Stat Summary Bar ── */}
      <div
        className="w-full"
        style={{ background: "#f5f5f5", borderBottom: "3px solid #0d0d0d" }}
      >
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

      {/* ── Published Stories ── */}
      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Section title */}
        <div className="mb-8">
          <div className="flex items-end gap-4 mb-1">
            <h2
              className="font-black"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(1.5rem, 3vw, 2rem)",
                color: "#0d0d0d",
                lineHeight: 1.1,
              }}
            >
              Published Stories
            </h2>
            <span
              className="text-xs font-black uppercase tracking-widest text-white px-3 py-1 mb-1"
              style={{
                fontFamily: "var(--font-display)",
                background: "#d32f2f",
                border: "2px solid #0d0d0d",
              }}
            >
              {blogs.length}
            </span>
          </div>
          <div
            style={{ height: "4px", background: "#d32f2f", width: "80px" }}
          />
        </div>

        {/* Blog Grid */}
        {blogs.length > 0 ? (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {blogs.map((blog) => (
              <Link
                key={blog.blogId}
                to={`/blog/${blog.blogId}`}
                className="bg-white overflow-hidden block group transition-all"
                style={{
                  border: "3px solid #0d0d0d",
                  boxShadow: "4px 4px 0 #0d0d0d",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translate(-2px,-2px)";
                  e.currentTarget.style.boxShadow = "6px 6px 0 #0d0d0d";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translate(0,0)";
                  e.currentTarget.style.boxShadow = "4px 4px 0 #0d0d0d";
                }}
              >
                {/* Cover image */}
                <div
                  className="relative overflow-hidden"
                  style={{ height: "180px" }}
                >
                  <img
                    src={
                      blog.coverImageUrl ??
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(blog.author.fullName)}&background=d32f2f&color=fff`
                    }
                    alt={blog.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {/* Tag pills */}
                  {blog.tags?.length > 0 && (
                    <div className="absolute top-3 left-3 flex gap-1 flex-wrap">
                      {blog.tags.slice(0, 2).map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 text-xs font-black uppercase tracking-widest text-white"
                          style={{
                            background: "#d32f2f",
                            border: "2px solid #0d0d0d",
                            fontFamily: "var(--font-display)",
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                  {/* View count */}
                  <div
                    className="absolute bottom-3 right-3 flex items-center gap-1 px-2 py-1 text-xs font-bold"
                    style={{ background: "rgba(0,0,0,0.75)", color: "white" }}
                  >
                    <Eye size={11} />
                    {blog.viewCount}
                  </div>
                </div>

                {/* Card body */}
                <div className="p-4">
                  <h3
                    className="font-black text-base leading-tight mb-2 line-clamp-2"
                    style={{
                      fontFamily: "var(--font-display)",
                      color: "#0d0d0d",
                    }}
                  >
                    {blog.title}
                  </h3>
                  <p
                    className="text-xs mb-3 leading-relaxed line-clamp-2"
                    style={{ color: "#666" }}
                  >
                    {blog.summary ?? "No summary available."}
                  </p>

                  <div
                    className="flex items-center justify-between pt-3"
                    style={{ borderTop: "2px solid #0d0d0d" }}
                  >
                    {/* Like count */}
                    <div
                      className="flex items-center gap-1 text-xs font-bold"
                      style={{
                        color: blog.likedByCurrentUser ? "#d32f2f" : "#555",
                      }}
                    >
                      <Heart
                        size={12}
                        fill={blog.likedByCurrentUser ? "#d32f2f" : "none"}
                        color={blog.likedByCurrentUser ? "#d32f2f" : "#555"}
                      />
                      {blog.likeCount}
                    </div>

                    {/* Date */}
                    <div
                      className="flex items-center gap-1 text-xs"
                      style={{ color: "#888" }}
                    >
                      <Clock size={11} />
                      {blog.createdAt}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div
            className="text-center py-20 bg-white"
            style={{
              border: "3px solid #0d0d0d",
              boxShadow: "4px 4px 0 #0d0d0d",
            }}
          >
            <p className="text-6xl mb-4">📝</p>
            <h3
              className="font-black text-xl mb-2"
              style={{ fontFamily: "var(--font-display)" }}
            >
              No stories yet
            </h3>
            <p style={{ color: "#888" }}>
              {isOwnProfile
                ? "You haven't published any stories yet."
                : "This author hasn't published any stories yet."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Helper components ────────────────────────────────────

function StatChip({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 text-xs font-bold"
      style={{ color: "#ccc", fontFamily: "var(--font-display)" }}
    >
      {icon}
      {label}
    </span>
  );
}

function SummaryPill({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <span
        className="flex items-center justify-center w-7 h-7"
        style={{
          border: "2px solid #0d0d0d",
          background: "#d32f2f",
          color: "white",
        }}
      >
        {icon}
      </span>
      <div>
        <p
          className="text-xs uppercase font-black tracking-widest leading-none"
          style={{ fontFamily: "var(--font-display)", color: "#888" }}
        >
          {label}
        </p>
        <p
          className="font-black text-sm leading-tight"
          style={{ fontFamily: "var(--font-display)", color: "#0d0d0d" }}
        >
          {value}
        </p>
      </div>
    </div>
  );
}

function formatNum(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return String(n);
}

export default UserDetailPage;
