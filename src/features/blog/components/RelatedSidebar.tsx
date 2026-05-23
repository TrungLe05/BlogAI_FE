import { TrendingUp } from "lucide-react";
import BlogCardMini from "./BlogCardMini";
import { BlogResponse } from "@/types/response/blogResponse.types";

interface Props {
  relatedBlogs: BlogResponse[];
}

export default function RelatedSidebar({ relatedBlogs }: Props) {
  return (
    <div className="mb-6 bg-white dark:bg-zinc-800 border-[3px] border-[#0d0d0d] dark:border-zinc-600 shadow-[4px_4px_0_#0d0d0d] dark:shadow-[4px_4px_0_#52525b]">
      <div className="px-5 py-3 bg-[#0d0d0d] border-b-[3px] border-[#0d0d0d] flex items-center gap-2">
        <TrendingUp size={14} className="text-white" />
        <h3
          className="font-black text-sm uppercase tracking-widest text-white"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Related Articles
        </h3>
      </div>
      <div>
        {relatedBlogs.length > 0 ? (
          relatedBlogs.map((post) => <BlogCardMini key={post.blogId} blog={post} />)
        ) : (
          <p className="p-4 text-sm text-[#888] dark:text-zinc-500">
            No related articles found.
          </p>
        )}
      </div>
    </div>
  );
}