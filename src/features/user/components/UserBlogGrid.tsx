import { Link } from "react-router-dom";
import { Eye, Heart, Clock, FileEdit } from "lucide-react";
import { BlogResponse } from "@/types/response/blogResponse.types";

interface Props {
  blogs: BlogResponse[];
  isOwnProfile: boolean;
}

export default function UserBlogGrid({ blogs, isOwnProfile }: Props) {
  if (blogs.length === 0) {
    return (
      <div className="w-full text-center py-20 bg-white dark:bg-zinc-800 border-[3px] border-[#0d0d0d] dark:border-zinc-600 shadow-[4px_4px_0_#0d0d0d] dark:shadow-[4px_4px_0_#52525b]">
        {/* <p className="text-6xl mb-4">📝</p> */}
        <div className="flex items-center justify-center mb-3">
          <FileEdit size={70} strokeWidth={1.8} />
        </div>

        <h3 className="font-black text-xl mb-2 text-[#0d0d0d] dark:text-white font-display">
          No stories yet
        </h3>
        <p className="text-[#888] dark:text-zinc-500">
          {isOwnProfile
            ? "You haven't published any stories yet."
            : "This author hasn't published any stories yet."}
        </p>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
      {blogs.map((blog) => (
        <Link
          key={blog.blogId}
          to={`/blog/${blog.blogId}`}
          className="bg-white dark:bg-zinc-800 overflow-hidden block group transition-all border-[3px] border-[#0d0d0d] dark:border-zinc-600 shadow-[4px_4px_0_#0d0d0d] dark:shadow-[4px_4px_0_#52525b] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0_#0d0d0d] dark:hover:shadow-[6px_6px_0_#52525b]"
        >
          {/* Cover */}
          <div className="relative overflow-hidden" style={{ height: 180 }}>
            <img
              src={
                blog.coverImageUrl ??
                `https://ui-avatars.com/api/?name=${encodeURIComponent(blog.author.fullName)}&background=d32f2f&color=fff`
              }
              alt={blog.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            {blog.tags?.length > 0 && (
              <div className="absolute top-3 left-3 flex gap-1 flex-wrap">
                {blog.tags.slice(0, 2).map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 text-xs font-black uppercase tracking-widest text-white bg-[#d32f2f] border-2 border-[#0d0d0d] font-display"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
            <div className="absolute bottom-3 right-3 flex items-center gap-1 px-2 py-1 text-xs font-bold bg-black/75 text-white">
              <Eye size={11} />
              {blog.viewCount}
            </div>
          </div>

          {/* Body */}
          <div className="p-4">
            <h3 className="font-bold tracking-wider text-lg leading-tight mb-2 line-clamp-2 text-[#0d0d0d] dark:text-white font-display">
              {blog.title}
            </h3>
            <p className="text-xs mb-3 leading-relaxed line-clamp-2 text-[#666] dark:text-zinc-400">
              {blog.summary ?? "No summary available."}
            </p>

            <div className="flex items-center justify-between pt-3 border-t-2 border-[#0d0d0d] dark:border-zinc-600">
              <div
                className={`flex items-center gap-1 text-xs font-bold ${blog.likedByCurrentUser ? "text-[#d32f2f]" : "text-[#555] dark:text-zinc-400"}`}
              >
                <Heart
                  size={12}
                  fill={blog.likedByCurrentUser ? "#d32f2f" : "none"}
                  color={blog.likedByCurrentUser ? "#d32f2f" : "currentColor"}
                />
                {blog.likeCount}
              </div>
              <div className="flex items-center gap-1 text-xs text-[#888] dark:text-zinc-500">
                <Clock size={11} />
                {blog.createdAt}
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
