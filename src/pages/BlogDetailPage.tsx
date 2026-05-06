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
    <div className="min-h-screen bg-[#ebf4f5] dark:bg-zinc-950" style={{ fontFamily: "var(--font-sans)" }}>
      <div className="max-w-340 mx-auto px-6 py-10">
        {/* Back */}
        <Link
          to="/explore"
          className="inline-flex items-center gap-2 mb-8 font-bold text-sm uppercase tracking-widest text-[#0d0d0d] dark:text-zinc-300 hover:text-[#d32f2f] dark:hover:text-[#d32f2f] transition-colors"
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
                  className="cursor-pointer inline-block mb-4 px-3 py-1 text-xs font-black uppercase tracking-widest text-white bg-[#d32f2f] border-2 border-[#0d0d0d]"
                  style={{ fontFamily: "var(--font-display)" }}
                  onClick={() => handleClickTag(tag)}
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Title */}
            <h1
              className="font-black mb-6 text-[#0d0d0d] dark:text-white"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(28px, 4vw, 48px)",
                lineHeight: 1.1,
              }}
            >
              {blogDetail?.title}
            </h1>

            {/* Author Row */}
            <div className="flex items-center justify-between mb-8 p-4 bg-white dark:bg-zinc-800 border-[3px] border-[#0d0d0d] dark:border-zinc-600 shadow-[4px_4px_0_#0d0d0d] dark:shadow-[4px_4px_0_#52525b]">
              <div className="flex items-center gap-3">
                <Link to={`/user/${blogDetail?.author.id}`}>
                  <img
                    src={
                      blogDetail?.author.avatarUrl ||
                      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face"
                    }
                    alt="author"
                    className="w-12 h-12 border-2 border-[#0d0d0d] dark:border-zinc-600"
                  />
                </Link>
                <div>
                  <Link
                    to={`/user/${blogDetail?.author.id}`}
                    className="font-black text-sm text-[#0d0d0d] dark:text-white hover:text-[#d32f2f] transition-colors block"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {blogDetail?.author.fullName}
                  </Link>
                  <p className="text-xs text-[#888] dark:text-zinc-500">
                    {blogDetail?.createdAt}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                {/* View count */}
                <div
                  className="flex items-center gap-1 text-xs font-bold text-[#666] dark:text-zinc-400"
                  style={{ fontFamily: "var(--font-display)" }}
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
                  className="flex items-center gap-1 text-xs font-bold text-[#666] dark:text-zinc-400"
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

                <button className="flex items-center gap-1 text-xs text-[#666] dark:text-zinc-400">
                  <Share2 size={14} />
                </button>
                <button className="flex items-center gap-1 text-xs text-[#666] dark:text-zinc-400">
                  <Bookmark size={14} />
                </button>
              </div>
            </div>

            {/* Hero Image */}
            <div className="mb-8 overflow-hidden border-[3px] border-[#0d0d0d] dark:border-zinc-600 shadow-[6px_6px_0_#0d0d0d] dark:shadow-[6px_6px_0_#52525b]">
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
              className="prose max-w-none mb-8 text-[#333] dark:text-zinc-300"
              style={{
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
                className={`flex items-center gap-2 px-6 py-3 font-black text-sm uppercase tracking-widest transition-all cursor-pointer border-[3px] border-[#0d0d0d] dark:border-zinc-600 shadow-[4px_4px_0_#0d0d0d] dark:shadow-[4px_4px_0_#52525b] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0_#0d0d0d] dark:hover:shadow-[6px_6px_0_#52525b]
                  ${blogDetail?.likedByCurrentUser
                    ? "bg-[#d32f2f] text-white"
                    : "bg-white dark:bg-zinc-800 text-[#0d0d0d] dark:text-white"
                  }`}
                style={{
                  fontFamily: "var(--font-display)",
                  opacity: isLiking ? 0.6 : 1,
                }}
              >
                <Heart
                  size={18}
                  fill={blogDetail?.likedByCurrentUser ? "white" : "none"}
                  color={blogDetail?.likedByCurrentUser ? "white" : "currentColor"}
                />
                {blogDetail?.likedByCurrentUser ? "Liked" : "Like"} ·{" "}
                {blogDetail?.likeCount ?? 0}
              </button>
            </div>

            {/* Author Card */}
            {!isAuthor && (
              <div className="p-6 bg-white dark:bg-zinc-800 flex items-start gap-4 border-[3px] border-[#0d0d0d] dark:border-zinc-600 shadow-[4px_4px_0_#0d0d0d] dark:shadow-[4px_4px_0_#52525b]">
                <img
                  src={blogDetail?.author.avatarUrl || "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=600&h=400&fit=crop"}
                  alt="author"
                  className="w-16 h-16 shrink-0 cursor-pointer border-[3px] border-[#0d0d0d] dark:border-zinc-600"
                  onClick={() => navigate(`/user/${blogDetail?.author.id}`)}
                />
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Link
                      to={`/user/${blogDetail?.author.id}`}
                      className="font-black text-[#0d0d0d] dark:text-white hover:text-[#d32f2f] transition-colors"
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize: "1.1rem",
                      }}
                    >
                      {blogDetail?.author.fullName}
                    </Link>
                    <User size={14} className="text-[#d32f2f]" />
                  </div>
                  <p className="text-sm leading-relaxed text-[#555] dark:text-zinc-400">
                    {blogDetail?.author.email}
                  </p>
                  <button
                    className={`mt-3 flex items-center gap-2 px-4 py-2 font-black text-xs uppercase tracking-widest transition-all border-[3px] border-[#0d0d0d] dark:border-zinc-600 shadow-[3px_3px_0_#0d0d0d] dark:shadow-[3px_3px_0_#52525b]
                      ${isFollowing
                        ? "bg-white dark:bg-zinc-700 text-[#0d0d0d] dark:text-white"
                        : "bg-[#d32f2f] text-white"
                      }`}
                    disabled={isFollowLoading || isBlogLoading}
                    onClick={handleFollowAuthor}
                    style={{
                      fontFamily: "var(--font-display)",
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
                <MessageCircle size={20} className="text-[#0d0d0d] dark:text-white" />
                <h3
                  className="font-black text-xl text-[#0d0d0d] dark:text-white"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  Leave a Comment
                </h3>
              </div>
              <div className="p-6 bg-white dark:bg-zinc-800 border-[3px] border-[#0d0d0d] dark:border-zinc-600 dark:shadow-[4px_4px_0_#52525b]">
                <textarea
                  placeholder="Share your thoughts..."
                  className="brutal-input  mb-4 resize-none dark:bg-zinc-700 dark:text-black dark:border-zinc-500"
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
            <div className="mb-6 bg-white dark:bg-zinc-800 border-[3px] border-[#0d0d0d] dark:border-zinc-600 shadow-[4px_4px_0_#0d0d0d] dark:shadow-[4px_4px_0_#52525b]">
              <div className="px-5 py-3 bg-[#0d0d0d] border-b-[3px] border-[#0d0d0d]">
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
                      className="flex gap-3 p-4 hover:bg-[#ebf4f5] dark:hover:bg-zinc-700 transition-colors border-b-2 border-[#0d0d0d] dark:border-zinc-700"
                    >
                      <img
                        src={
                          post.coverImageUrl ||
                          "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=200&h=200&fit=crop"
                        }
                        alt={post.title}
                        className="w-16 h-16 object-cover shrink-0 border-2 border-[#0d0d0d] dark:border-zinc-600"
                      />
                      <div>
                        <div className="flex gap-1 flex-wrap mb-1">
                          {post.tags?.slice(0, 2).map((tag) => (
                            <span
                              key={tag}
                              className="text-xs uppercase font-black tracking-widest px-3 py-1 text-white bg-[#d32f2f] border-2 border-[#0d0d0d]"
                              style={{ fontFamily: "var(--font-display)" }}
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                        <p
                          className="text-sm font-bold leading-tight line-clamp-2 text-[#0d0d0d] dark:text-zinc-200"
                          style={{ fontFamily: "var(--font-display)" }}
                        >
                          {post.title}
                        </p>
                        <div className="flex items-center gap-2 mt-1 text-xs text-[#888] dark:text-zinc-500">
                          <Eye size={11} />
                          <span>{post.viewCount}</span>
                          <Heart size={11} />
                          <span>{post.likeCount}</span>
                        </div>
                      </div>
                    </Link>
                  ))
                ) : (
                  <p className="p-4 text-sm text-[#888] dark:text-zinc-500">
                    No related articles found.
                  </p>
                )}
              </div>
            </div>

            {/* Newsletter */}
            <div className="bg-white dark:bg-zinc-800 p-6 border-[3px] border-[#0d0d0d] dark:border-zinc-600 shadow-[4px_4px_0_#d32f2f]">
              <div className="mb-4 px-3 py-1 inline-block bg-[#d32f2f] border-2 border-[#0d0d0d]">
                <span
                  className="text-xs font-black uppercase text-white"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  Newsletter
                </span>
              </div>
              <h3
                className="font-black text-lg mb-2 text-[#0d0d0d] dark:text-white"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Stay in the Loop
              </h3>
              <p className="text-xs mb-4 leading-relaxed text-[#666] dark:text-zinc-400">
                Get the best stories delivered to your inbox weekly. No spam.
              </p>
              <input
                type="email"
                placeholder="your@email.com"
                className="brutal-input mb-3 dark:bg-zinc-700 dark:text-white dark:border-zinc-500"
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
