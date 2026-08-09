import { Link } from "react-router-dom";
import { Eye, Clock } from "lucide-react";
import TagPill from "./TagPill";
import { BlogResponse } from "../types/blog.types";

const FALLBACK_COVER =
  "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=600&h=400&fit=crop";

interface Props {
  blog: BlogResponse;
  onTagClick?: (tag: string) => void;
}

export default function BlogCard({ blog, onTagClick }: Props) {
  return (
    <Link
      to={`/blog/${blog.blogId}`}
      className="bg-white dark:bg-zinc-800 overflow-hidden block group transition-all border-[3px] border-[#0d0d0d] dark:border-zinc-600 shadow-[4px_4px_0_#0d0d0d] dark:shadow-[4px_4px_0_#52525b] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0_#0d0d0d] dark:hover:shadow-[6px_6px_0_#52525b]"
    >
      {/* Cover */}
      <div className="relative overflow-hidden" style={{ height: 180 }}>
        <img
          src={blog.coverImageUrl ?? FALLBACK_COVER}
          alt={blog.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 left-3 flex gap-1 flex-wrap">
          {blog.tags.slice(0, 2).map((tag) => (
            <TagPill
              key={tag}
              tag={tag}
              onClick={onTagClick ? (e: any) => { e.preventDefault(); onTagClick(tag); } : undefined}
            />
          ))}
        </div>
        <div className="absolute bottom-3 right-3 flex items-center gap-1 px-2 py-1 text-xs font-bold bg-black/70 text-white">
          <Eye size={11} />
          {blog.viewCount}
        </div>
      </div>

      {/* Body */}
      <div className="p-4">
        <h3
          className="font-display font-bold text-base leading-tight mb-2 line-clamp-2 text-[#0d0d0d] dark:text-white"
          
        >
          {blog.title}
        </h3>
        <p className="text-xs mb-3 leading-relaxed line-clamp-2 text-[#666] dark:text-zinc-400">
          {blog.summary ?? "No summary available."}
        </p>

        <div className="flex items-center justify-between pt-3 border-t-2 border-[#0d0d0d] dark:border-zinc-600">
          <Link
            to={`/user/${blog.author.id}`}
            className="flex items-center gap-2"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={
                blog.author.avatarUrl ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(blog.author.fullName)}&background=d32f2f&color=fff`
              }
              alt={blog.author.fullName}
              className="w-6 h-6 object-cover border-2 border-[#0d0d0d] dark:border-zinc-600"
            />
            <span
              className="text-xs font-bold truncate max-w-25 text-[#0d0d0d] dark:text-zinc-200 hover:text-[#d32f2f] transition-colors font-display"
              
            >
              {blog.author.fullName}
            </span>
          </Link>
          <div className="flex items-center gap-1 text-xs text-[#888] dark:text-zinc-500">
            <Clock size={11} />
            {blog.createdAt}
          </div>
        </div>
      </div>
    </Link>
  );
}