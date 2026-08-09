import { useParams, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Clock,
  Share2,
  Bookmark,
  MessageCircle,
  Heart,
  Eye,
} from "lucide-react";
import { useBlogDetail } from "@/features/blog/hooks/useBlogDetail";
import AuthorCard from "@/features/blog/components/AuthorCard";
import RelatedSidebar from "@/features/blog/components/RelatedSidebar";
import TagPill from "@/features/blog/components/TagPill";

export default function BlogDetailPage() {
  const { blogId } = useParams<{ blogId: string }>();
  const navigate = useNavigate();

  const {
    blogDetail,
    relatedBlogs,
    isLiking,
    isFollowLoading,
    isBlogLoading,
    isAuthor,
    isFollowing,
    handleClickTag,
    handleToggleLike,
    handleFollowAuthor,
  } = useBlogDetail(blogId);

  return (
    <div className="min-h-screen bg-[#ebf4f5] dark:bg-zinc-950 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        {/* Back link */}
        <Link
          to="/explore"
          className="inline-flex items-center gap-2 mb-6 sm:mb-8 font-bold text-sm uppercase tracking-widest text-[#0d0d0d] dark:text-zinc-300 hover:text-[#d32f2f] transition-colors font-display"
        >
          <ArrowLeft size={16} /> Back to Explore
        </Link>

        {/* 2-col grid on lg+, single col on mobile */}
        <div className="grid lg:grid-cols-[1fr_300px] xl:grid-cols-[1fr_320px] gap-8 items-start">
          <article>
            {/* Tags */}
            <div className="flex gap-2 flex-wrap mb-4">
              {blogDetail?.tags.map((tag: string) => (
                <TagPill
                  key={tag}
                  tag={tag}
                  onClick={() => handleClickTag(tag)}
                  size="md"
                />
              ))}
            </div>

            {/* Title — clamp font size */}
            <h1
              className="font-bold tracking-wide mb-5 sm:mb-6 text-[#0d0d0d] dark:text-white font-display"
              style={{ fontSize: "clamp(24px, 4vw, 48px)", lineHeight: 1.15 }}
            >
              {blogDetail?.title}
            </h1>

            {/* Author Row — stack on very small screens */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8 p-3 sm:p-4 bg-white dark:bg-zinc-800 border-[3px] border-[#0d0d0d] dark:border-zinc-600 shadow-[4px_4px_0_#0d0d0d] dark:shadow-[4px_4px_0_#52525b]">
              {/* Author info */}
              <div className="flex items-center gap-3">
                <Link to={`/user/${blogDetail?.author.id}`}>
                  <img
                    src={
                      blogDetail?.author.avatarUrl ||
                      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face"
                    }
                    alt="author"
                    className="w-10 h-10 sm:w-12 sm:h-12 border-2 border-[#0d0d0d] dark:border-zinc-600 object-cover"
                  />
                </Link>
                <div>
                  <Link
                    to={`/user/${blogDetail?.author.id}`}
                    className="font-black text-sm text-[#0d0d0d] dark:text-white hover:text-[#d32f2f] transition-colors block font-display"
                  >
                    {blogDetail?.author.fullName}
                  </Link>
                  <p className="text-xs text-[#888] dark:text-zinc-500">
                    {blogDetail?.createdAt}
                  </p>
                </div>
              </div>

              {/* Stats row — always horizontal, wraps neatly */}
              <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
                <div className="flex items-center gap-1 text-xs font-bold text-[#666] dark:text-zinc-400">
                  <Eye size={14} />
                  <span>{blogDetail?.viewCount ?? 0}</span>
                </div>
                <button
                  onClick={handleToggleLike}
                  disabled={isLiking}
                  className="flex items-center gap-1 text-xs font-bold transition-all cursor-pointer"
                  style={{
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
                <div className="flex items-center gap-1 text-xs font-bold text-[#666] dark:text-zinc-400">
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

            {/* Hero Image — responsive height */}
            <div className="mb-6 sm:mb-8 overflow-hidden border-[3px] border-[#0d0d0d] dark:border-zinc-600 shadow-[6px_6px_0_#0d0d0d] dark:shadow-[6px_6px_0_#52525b]">
              <img
                src={
                  blogDetail?.coverImageUrl ||
                  "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=900&h=480&fit=crop"
                }
                alt="blog cover"
                className="w-full object-cover h-48 sm:h-64 md:h-80 lg:h-90"
              />
            </div>

            {/* Content */}
            <div
              className="prose max-w-none mb-6 sm:mb-8 text-[#333] dark:text-zinc-300 font-sans"
              style={{ lineHeight: 1.8, fontSize: "1.05rem" }}
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
                className={`flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 font-black text-xs sm:text-sm uppercase tracking-widest transition-all cursor-pointer border-[3px] border-[#0d0d0d] dark:border-zinc-600 shadow-[4px_4px_0_#0d0d0d] hover:-translate-x-0.5 hover:-translate-y-0.5
                  ${blogDetail?.likedByCurrentUser ? "bg-[#d32f2f] text-white" : "bg-white dark:bg-zinc-800 text-[#0d0d0d] dark:text-white"}`}
                style={{ opacity: isLiking ? 0.6 : 1 }}
              >
                <Heart
                  size={18}
                  fill={blogDetail?.likedByCurrentUser ? "white" : "none"}
                  color={
                    blogDetail?.likedByCurrentUser ? "white" : "currentColor"
                  }
                />
                {blogDetail?.likedByCurrentUser ? "Liked" : "Like"} ·{" "}
                {blogDetail?.likeCount ?? 0}
              </button>
            </div>

            {/* Author Card */}
            {!isAuthor && blogDetail && (
              <AuthorCard
                blogDetail={blogDetail}
                isFollowing={isFollowing}
                isFollowLoading={isFollowLoading}
                isBlogLoading={isBlogLoading}
                onFollow={handleFollowAuthor}
                onNavigate={(id) => navigate(`/user/${id}`)}
              />
            )}

            {/* Comments */}
            <div className="mt-8 sm:mt-10">
              <div className="flex items-center gap-3 mb-5 sm:mb-6">
                <MessageCircle
                  size={20}
                  className="text-[#0d0d0d] dark:text-white"
                />
                <h3 className="font-black text-lg sm:text-xl text-[#0d0d0d] dark:text-white font-display">
                  Leave a Comment
                </h3>
              </div>
              <div className="p-4 sm:p-6 bg-white dark:bg-zinc-800 border-[3px] border-[#0d0d0d] dark:border-zinc-600 dark:shadow-[4px_4px_0_#52525b]">
                <textarea
                  placeholder="Share your thoughts..."
                  className="brutal-input mb-4 resize-none dark:bg-zinc-700 dark:text-black dark:border-zinc-500 w-full"
                  rows={4}
                />
                <button
                  className="brutal-btn-primary text-sm"
                  style={{ padding: "10px 24px" }}
                >
                  Post Comment
                </button>
              </div>
            </div>
          </article>

          {/* Sidebar — hidden on mobile, visible lg+ */}
          <aside className="hidden lg:block w-full">
            <RelatedSidebar relatedBlogs={relatedBlogs} />
          </aside>
        </div>
      </div>
    </div>
  );
}
