import blogApi from "@/api/blogApi";
import followApi from "@/api/followApi";
import useAuthStore from "@/stores/authStore";
import { BlogResponse } from "@/types/response/blogResponse.types";
import { extractApiError } from "@/utils/apiError";
import {
  ArrowLeft,
  Clock,
  User,
  Share2,
  Bookmark,
  MessageCircle,
  Heart,
  Eye,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

function BlogDetailPage() {
  const { blogId } = useParams<{ blogId: string }>();
  const [blogDetail, setBlogDetail] = useState<BlogResponse | null>(null);
  const [blogRelated, setBlogRelated] = useState<BlogResponse[] | null>(null);
  const [isLiking, setIsLiking] = useState(false);
  const [isFollowLoading, setIsFollowLoading] = useState(false);
  const [followOverride, setFollowOverride] = useState<boolean | null>(null); // ✅ thay isFollowing
  const [isBlogLoading, setIsBlogLoading] = useState(true);

  const navigate = useNavigate();
  const { user } = useAuthStore();

  const isAuthor = blogDetail?.author.email === user?.email;

  // ─── Effects ───────────────────────────────────────────

  // Reset override khi chuyển blog
  useEffect(() => {
    setFollowOverride(null);
  }, [blogId]);

  // Fetch blog detail + increment view
  useEffect(() => {
    if (!blogId) return;
    let cancelled = false;

    const load = async () => {
      setIsBlogLoading(true);
      try {
        const { data } = await blogApi.getBlogDetailById(blogId);
        if (cancelled) return;
        setBlogDetail(data.result);

        const { data: viewData } = await blogApi.incrementView(blogId);
        if (cancelled) return;
        setBlogDetail((prev) =>
          prev ? { ...prev, viewCount: viewData.result } : prev,
        );
      } catch (e) {
        console.error(e);
      } finally {
        if (!cancelled) setIsBlogLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [blogId]);

  const isFollowing =
    followOverride !== null
      ? followOverride
      : (blogDetail?.author?.following ?? false);

  // Fetch related blogs
  useEffect(() => {
    if (!blogDetail?.blogId || !blogDetail?.tags?.length) return;
    blogApi
      .getRelatedBlogs(blogDetail.tags, blogDetail.blogId)
      .then(({ data }) => setBlogRelated(data.result))
      .catch(console.error);
  }, [blogDetail?.blogId]);

  // ─── Handlers ──────────────────────────────────────────

  const handleClickTag = (tag: string) => {
    navigate("/explore", { state: { selectedTag: tag } });
  };

  const handleToggleLike = async () => {
    if (!blogId || isLiking) return;
    setIsLiking(true);
    try {
      const { data } = await blogApi.toggleLike(blogId);
      setBlogDetail((prev) =>
        prev
          ? {
              ...prev,
              likeCount: data.result.likeCount,
              likedByCurrentUser: data.result.likedByCurrentUser,
            }
          : prev,
      );
    } catch (e) {
      console.error(e);
    } finally {
      setIsLiking(false);
    }
  };

  const handleFollowAuthor = async () => {
    if (!blogDetail?.author?.id || isFollowLoading || isBlogLoading) return;

    setIsFollowLoading(true);
    try {
      if (isFollowing) {
        await followApi.unfollow(blogDetail.author.id);
        setFollowOverride(false);
        toast.success("Unfollowed successfully");
      } else {
        await followApi.follow(blogDetail.author.id);
        setFollowOverride(true);
        toast.success("Followed! They'll be notified.");
      }
    } catch (e) {
      toast.error(extractApiError(e));
      setFollowOverride(isFollowing ? true : false);
    } finally {
      setIsFollowLoading(false);
    }
  };

  // ─── Derived data ───────────────────────────────────────

  const filterBlogRelated = (blogRelated ?? [])
    .sort((a, b) => b.viewCount - a.viewCount)
    .slice(0, 3);

  return (
    <div
      className="min-h-screen"
      style={{ background: "#ebf4f5", fontFamily: "var(--font-sans)" }}
    >
      <div className="max-w-340 mx-auto px-6 py-10">
        {/* Back */}
        <Link
          to="/explore"
          className="inline-flex items-center gap-2 mb-8 font-bold text-sm uppercase tracking-widest hover:text-[#d32f2f] transition-colors"
          style={{ fontFamily: "var(--font-display)" }}
        >
          <ArrowLeft size={16} />
          Back to Explore
        </Link>

        <div className="grid lg:grid-cols-[1fr_320px] gap-8 items-start">
          {/* Main Article */}
          <article>
            {/* Tags */}
            <div className="flex gap-2 flex-wrap">
              {blogDetail?.tags.map((tag, index) => (
                <span
                  key={index}
                  className="cursor-pointer inline-block mb-4 px-3 py-1 text-xs font-black uppercase tracking-widest text-white"
                  style={{
                    background: "#d32f2f",
                    border: "2px solid #0d0d0d",
                    fontFamily: "var(--font-display)",
                  }}
                  onClick={() => handleClickTag(tag)}
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Title */}
            <h1
              className="font-black mb-6"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(28px, 4vw, 48px)",
                color: "#0d0d0d",
                lineHeight: 1.1,
              }}
            >
              {blogDetail?.title}
            </h1>

            {/* Author Row */}
            <div
              className="flex items-center justify-between mb-8 p-4 bg-white"
              style={{
                border: "3px solid #0d0d0d",
                boxShadow: "4px 4px 0 #0d0d0d",
              }}
            >
              <div className="flex items-center gap-3">
                <Link to={`/user/${blogDetail?.author.id}`}>
                  <img
                    src={
                      blogDetail?.author.avatarUrl ||
                      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face"
                    }
                    alt="author"
                    className="w-12 h-12"
                    style={{ border: "2px solid #0d0d0d" }}
                  />
                </Link>
                <div>
                  <Link
                    to={`/user/${blogDetail?.author.id}`}
                    className="font-black text-sm hover:text-[#d32f2f] transition-colors block"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {blogDetail?.author.fullName}
                  </Link>
                  <p className="text-xs" style={{ color: "#888" }}>
                    {blogDetail?.createdAt}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                {/* View count */}
                <div
                  className="flex items-center gap-1 text-xs font-bold"
                  style={{ fontFamily: "var(--font-display)", color: "#666" }}
                >
                  <Eye size={14} />
                  <span>{blogDetail?.viewCount ?? 0}</span>
                </div>

                {/* Like button */}
                <button
                  onClick={handleToggleLike}
                  disabled={isLiking}
                  className="flex items-center gap-1 text-xs font-bold transition-all cursor-pointer"
                  style={{
                    fontFamily: "var(--font-display)",
                    color: blogDetail?.likedByCurrentUser ? "#d32f2f" : "#666",
                    opacity: isLiking ? 0.6 : 1,
                  }}
                >
                  <Heart
                    size={16}
                    fill={blogDetail?.likedByCurrentUser ? "#d32f2f" : "none"}
                    color={blogDetail?.likedByCurrentUser ? "#d32f2f" : "#666"}
                  />
                  <span>{blogDetail?.likeCount ?? 0}</span>
                </button>

                <div
                  className="flex items-center gap-1 text-xs font-bold"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  <Clock size={14} />
                  <span>
                    {Math.ceil(
                      (blogDetail?.content?.split(/\s+/).length ?? 0) / 200,
                    )}{" "}
                    min read
                  </span>
                </div>

                <button
                  className="flex items-center gap-1 text-xs"
                  style={{ color: "#666" }}
                >
                  <Share2 size={14} />
                </button>
                <button
                  className="flex items-center gap-1 text-xs"
                  style={{ color: "#666" }}
                >
                  <Bookmark size={14} />
                </button>
              </div>
            </div>

            {/* Hero Image */}
            <div
              className="mb-8 overflow-hidden"
              style={{
                border: "3px solid #0d0d0d",
                boxShadow: "6px 6px 0 #0d0d0d",
              }}
            >
              <img
                src={
                  blogDetail?.coverImageUrl ||
                  "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=900&h=480&fit=crop"
                }
                alt="blog cover"
                className="w-full object-cover"
                style={{ height: "360px" }}
              />
            </div>

            {/* Article Body */}
            <div
              className="prose max-w-none mb-8"
              style={{
                color: "#333",
                lineHeight: 1.8,
                fontFamily: "var(--font-sans)",
                fontSize: "1.05rem",
              }}
            >
              <div
                className="prose-content"
                dangerouslySetInnerHTML={{ __html: blogDetail?.content ?? "" }}
              />
            </div>

            {/* Like button bottom */}
            <div className="flex items-center gap-4 mb-8">
              <button
                onClick={handleToggleLike}
                disabled={isLiking}
                className="flex items-center gap-2 px-6 py-3 font-black text-sm uppercase tracking-widest transition-all cursor-pointer"
                style={{
                  fontFamily: "var(--font-display)",
                  border: "3px solid #0d0d0d",
                  background: blogDetail?.likedByCurrentUser
                    ? "#d32f2f"
                    : "white",
                  color: blogDetail?.likedByCurrentUser ? "white" : "#0d0d0d",
                  boxShadow: "4px 4px 0 #0d0d0d",
                  opacity: isLiking ? 0.6 : 1,
                }}
                onMouseEnter={(e) => {
                  if (!blogDetail?.likedByCurrentUser) {
                    e.currentTarget.style.transform = "translate(-2px,-2px)";
                    e.currentTarget.style.boxShadow = "6px 6px 0 #0d0d0d";
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translate(0,0)";
                  e.currentTarget.style.boxShadow = "4px 4px 0 #0d0d0d";
                }}
              >
                <Heart
                  size={18}
                  fill={blogDetail?.likedByCurrentUser ? "white" : "none"}
                  color={blogDetail?.likedByCurrentUser ? "white" : "#0d0d0d"}
                />
                {blogDetail?.likedByCurrentUser ? "Liked" : "Like"} ·{" "}
                {blogDetail?.likeCount ?? 0}
              </button>
            </div>

            {/* Author Card */}
            {!isAuthor && (
              <div
                className="p-6 bg-white flex items-start gap-4"
                style={{
                  border: "3px solid #0d0d0d",
                  boxShadow: "4px 4px 0 #0d0d0d",
                }}
              >
                <img
                  src={blogDetail?.author.avatarUrl || "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=600&h=400&fit=crop"}
                  alt="author"
                  className="w-16 h-16 shrink-0 cursor-pointer"
                  style={{ border: "3px solid #0d0d0d" }}
                  onClick={() => navigate(`/user/${blogDetail?.author.id}`)}
                />
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Link
                      to={`/user/${blogDetail?.author.id}`}
                      className="font-black hover:text-[#d32f2f] transition-colors"
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize: "1.1rem",
                      }}
                    >
                      {blogDetail?.author.fullName}
                    </Link>
                    <User size={14} style={{ color: "#d32f2f" }} />
                  </div>
                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: "#555" }}
                  >
                    {blogDetail?.author.email}
                  </p>
                  <button
                    className="mt-3 flex items-center gap-2 px-4 py-2 font-black text-xs uppercase tracking-widest transition-all"
                    disabled={isFollowLoading || isBlogLoading}
                    onClick={handleFollowAuthor}
                    style={{
                      fontFamily: "var(--font-display)",
                      border: "3px solid #0d0d0d",
                      background: isFollowing ? "white" : "#d32f2f",
                      color: isFollowing ? "#0d0d0d" : "white",
                      boxShadow: "3px 3px 0 #0d0d0d",
                      opacity: isFollowLoading ? 0.6 : 1,
                      cursor: isFollowLoading ? "not-allowed" : "pointer",
                    }}
                  >
                    {isBlogLoading
                      ? "..."
                      : isFollowLoading
                        ? "..."
                        : isFollowing
                          ? "Following ✓"
                          : "Follow Author"}
                  </button>
                </div>
              </div>
            )}

            {/* Comments */}
            <div className="mt-10">
              <div className="flex items-center gap-3 mb-6">
                <MessageCircle size={20} />
                <h3
                  className="font-black text-xl"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  Leave a Comment
                </h3>
              </div>
              <div
                className="p-6 bg-white"
                style={{ border: "3px solid #0d0d0d" }}
              >
                <textarea
                  placeholder="Share your thoughts..."
                  className="brutal-input mb-4 resize-none"
                  rows={4}
                />
                <button
                  className="brutal-btn-primary"
                  style={{ padding: "10px 24px" }}
                >
                  Post Comment
                </button>
              </div>
            </div>
          </article>

          {/* Sidebar */}
          <aside className="hidden lg:block">
            {/* Related Articles */}
            <div
              className="mb-6 bg-white"
              style={{
                border: "3px solid #0d0d0d",
                boxShadow: "4px 4px 0 #0d0d0d",
              }}
            >
              <div
                className="px-5 py-3"
                style={{
                  background: "#0d0d0d",
                  borderBottom: "3px solid #0d0d0d",
                }}
              >
                <h3
                  className="font-black text-sm uppercase tracking-widest text-white"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  Related Articles
                </h3>
              </div>
              <div>
                {filterBlogRelated.length > 0 ? (
                  filterBlogRelated.map((post) => (
                    <Link
                      key={post.blogId}
                      to={`/blog/${post.blogId}`}
                      className="flex gap-3 p-4 hover:bg-[#ebf4f5] transition-colors"
                      style={{ borderBottom: "2px solid #0d0d0d" }}
                    >
                      <img
                        src={
                          post.coverImageUrl ||
                          "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=200&h=200&fit=crop"
                        }
                        alt={post.title}
                        className="w-16 h-16 object-cover shrink-0"
                        style={{ border: "2px solid #0d0d0d" }}
                      />
                      <div>
                        <div className="flex gap-1 flex-wrap mb-1">
                          {post.tags?.slice(0, 2).map((tag) => (
                            <span
                              key={tag}
                              className="text-xs uppercase font-black tracking-widest px-3 py-1"
                              style={{
                                color: "#fff",
                                fontFamily: "var(--font-display)",
                                background: "rgb(211, 47, 47)",
                                border: "2px solid black",
                              }}
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                        <p
                          className="text-sm font-bold leading-tight line-clamp-2"
                          style={{
                            fontFamily: "var(--font-display)",
                            color: "#0d0d0d",
                          }}
                        >
                          {post.title}
                        </p>
                        <div
                          className="flex items-center gap-2 mt-1 text-xs"
                          style={{ color: "#888" }}
                        >
                          <Eye size={11} />
                          <span>{post.viewCount}</span>
                          <Heart size={11} />
                          <span>{post.likeCount}</span>
                        </div>
                      </div>
                    </Link>
                  ))
                ) : (
                  <p className="p-4 text-sm" style={{ color: "#888" }}>
                    No related articles found.
                  </p>
                )}
              </div>
            </div>

            {/* Newsletter */}
            <div
              className="bg-white p-6"
              style={{
                border: "3px solid #0d0d0d",
                boxShadow: "4px 4px 0 #d32f2f",
              }}
            >
              <div
                className="mb-4 px-3 py-1 inline-block"
                style={{ background: "#d32f2f", border: "2px solid #0d0d0d" }}
              >
                <span
                  className="text-xs font-black uppercase text-white"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  Newsletter
                </span>
              </div>
              <h3
                className="font-black text-lg mb-2"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Stay in the Loop
              </h3>
              <p
                className="text-xs mb-4 leading-relaxed"
                style={{ color: "#666" }}
              >
                Get the best stories delivered to your inbox weekly. No spam.
              </p>
              <input
                type="email"
                placeholder="your@email.com"
                className="brutal-input mb-3"
              />
              <button
                className="brutal-btn-primary w-full justify-center"
                style={{ padding: "10px" }}
              >
                Subscribe
              </button>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

export default BlogDetailPage;
