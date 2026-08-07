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
      <div className="max-w-340 mx-auto px-6 py-10">
        <Link
          to="/explore"
          className="inline-flex items-center gap-2 mb-8 font-bold text-sm uppercase tracking-widest text-[#0d0d0d] dark:text-zinc-300 hover:text-[#d32f2f] transition-colors font-display"
        >
          <ArrowLeft size={16} /> Back to Explore
        </Link>

        <div className="grid lg:grid-cols-[1fr_320px] gap-8 items-start">
          <article>
            {/* Tags */}
            <div className="flex gap-2 flex-wrap mb-4">
              {blogDetail?.tags.map((tag) => (
                <TagPill
                  key={tag}
                  tag={tag}
                  onClick={() => handleClickTag(tag)}
                  size="md"
                />
              ))}
            </div>

            {/* Title */}
            <h1
              className="font-bold tracking-wide mb-6 text-[#0d0d0d] dark:text-white font-display"
              style={{ fontSize: "clamp(28px, 4vw, 48px)", lineHeight: 1.1 }}
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
                    className="font-black text-sm text-[#0d0d0d] dark:text-white hover:text-[#d32f2f] transition-colors block font-display"
                  >
                    {blogDetail?.author.fullName}
                  </Link>
                  <p className="text-xs text-[#888] dark:text-zinc-500">
                    {blogDetail?.createdAt}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
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

            {/* Hero Image */}
            <div className="mb-8 overflow-hidden border-[3px] border-[#0d0d0d] dark:border-zinc-600 shadow-[6px_6px_0_#0d0d0d] dark:shadow-[6px_6px_0_#52525b]">
              <img
                src={
                  blogDetail?.coverImageUrl ||
                  "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=900&h=480&fit=crop"
                }
                alt="blog cover"
                className="w-full object-cover"
                style={{ height: 360 }}
              />
            </div>

            {/* Content */}
            <div
              className="prose max-w-none mb-8 text-[#333] dark:text-zinc-300 font-sans"
              style={{
                lineHeight: 1.8,

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
                className={`flex items-center gap-2 px-6 py-3 font-black text-sm uppercase tracking-widest transition-all cursor-pointer border-[3px] border-[#0d0d0d] dark:border-zinc-600 shadow-[4px_4px_0_#0d0d0d] hover:-translate-x-0.5 hover:-translate-y-0.5
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
            <div className="mt-10">
              <div className="flex items-center gap-3 mb-6">
                <MessageCircle
                  size={20}
                  className="text-[#0d0d0d] dark:text-white"
                />
                <h3 className="font-black text-xl text-[#0d0d0d] dark:text-white font-display">
                  Leave a Comment
                </h3>
              </div>
              <div className="p-6 bg-white dark:bg-zinc-800 border-[3px] border-[#0d0d0d] dark:border-zinc-600 dark:shadow-[4px_4px_0_#52525b]">
                <textarea
                  placeholder="Share your thoughts..."
                  className="brutal-input mb-4 resize-none dark:bg-zinc-700 dark:text-black dark:border-zinc-500"
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
          <aside className="hidden lg:block w-full h-full">
            <RelatedSidebar relatedBlogs={relatedBlogs} />

            {/* Newsletter
            <div className="bg-white dark:bg-zinc-800 p-6 border-[3px] border-[#0d0d0d] dark:border-zinc-600 shadow-[4px_4px_0_#d32f2f]">
              <div className="mb-4 px-3 py-1 inline-block bg-[#d32f2f] border-2 border-[#0d0d0d]">
                <span
                  className="text-xs font-black uppercase text-white font-display"
                  
                >
                  Newsletter
                </span>
              </div>
              <h3
                className="font-black text-lg mb-2 text-[#0d0d0d] dark:text-white font-display"
                
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
            </div> */}
          </aside>
        </div>
      </div>
    </div>
  );
}
