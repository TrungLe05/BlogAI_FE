import { Link } from "react-router-dom";
import { Eye, Heart } from "lucide-react";
import TagPill from "./TagPill";
import { BlogResponse } from "../types/blog.types";

const FALLBACK =
  "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=200&h=200&fit=crop";

interface Props {
  blog: BlogResponse;
}

export default function BlogCardMini({ blog }: Props) {
  return (
    <Link
      to={`/blog/${blog.blogId}`}
      className="flex gap-3 p-4 hover:bg-[#ebf4f5] dark:hover:bg-zinc-700 transition-colors border-b-2 border-[#0d0d0d] dark:border-zinc-700"
    >
      <img
        src={blog.coverImageUrl || FALLBACK}
        alt={blog.title}
        className="w-16 h-16 object-cover shrink-0 border-2 border-[#0d0d0d] dark:border-zinc-600"
      />
      <div>
        <div className="flex gap-1 flex-wrap mb-3">
          {blog.tags?.slice(0, 2).map((tag) => (
            <TagPill key={tag} tag={tag} />
          ))}
        </div>
        <p
          className="text-sm font-bold leading-tight line-clamp-2 text-[#0d0d0d] dark:text-zinc-200 font-display"
          
        >
          {blog.title}
        </p>
        <div className="flex items-center gap-2 mt-1 text-xs text-[#888] dark:text-zinc-500">
          <Eye size={11} />
          <span>{blog.viewCount}</span>
          <Heart size={11} />
          <span>{blog.likeCount}</span>
        </div>
      </div>
    </Link>
  );
}