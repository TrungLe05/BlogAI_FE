import { Edit3, ExternalLink, Eye, Heart, Trash } from "lucide-react";
import { Link } from "react-router-dom";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { BlogResponse } from "@/types/response/blogResponse.types";

interface BlogPostCardProps {
  post: BlogResponse;
  type: "published" | "draft";
  fmtNum: (n: number) => string;
  onMarkDelete: (blogId: string) => void;
  onConfirmDelete: () => void;
  onCancelDelete: () => void;
  onEdit?: (blogId: string) => void;
}

function BlogPostCard({
  post,
  type,
  fmtNum,
  onMarkDelete,
  onConfirmDelete,
  onCancelDelete,
  onEdit,
}: BlogPostCardProps) {
  return (
    <article
      className={[
        // layout
        "flex gap-0 group cursor-pointer transition-all",
        // light
        "bg-white border-[3px] border-[#0d0d0d] shadow-[4px_4px_0_#0d0d0d]",
        // dark
        "dark:bg-zinc-900 dark:border-zinc-600 dark:shadow-[4px_4px_0_#52525b]",
        // hover
        "hover:-translate-x-1 hover:-translate-y-1",
        "hover:shadow-[8px_8px_0_#0d0d0d] dark:hover:shadow-[8px_8px_0_#52525b]",
      ].join(" ")}
    >
      {/* Cover image */}
      <div className="w-35 shrink-0 overflow-hidden border-r-[3px] border-[#0d0d0d] dark:border-zinc-600">
        <img
          src={post.coverImageUrl}
          alt={post.title}
          className="w-full h-full object-cover block min-h-30"
        />
      </div>

      {/* Content */}
      <div className="flex-1 p-5 flex flex-col justify-between">
        {/* Top: tags + actions */}
        <div>
          <div className="flex items-center justify-between mb-3">
            {/* Tags */}
            <div className="flex gap-1.5 flex-wrap">
              {post.tags.map((tag, i) => (
                <span
                  key={i}
                  className="text-xs font-black uppercase tracking-widest px-2.5 py-1 text-white bg-[#d32f2f]"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Action buttons */}
            <div className="flex gap-2">
              {/* Delete */}
              <AlertDialog>
                <AlertDialogTrigger>
                  <button
                    title="Delete"
                    onClick={() => onMarkDelete(post.blogId)}
                    className={[
                      "p-2 border-[3px] cursor-pointer transition-colors",
                      "border-[#0d0d0d] dark:border-zinc-600",
                      "text-[#0d0d0d] dark:text-zinc-300",
                      "hover:bg-[#d32f2f] hover:text-white hover:border-[#d32f2f]",
                      "dark:hover:bg-[#d32f2f] dark:hover:border-[#d32f2f]",
                    ].join(" ")}
                  >
                    <Trash size={12} />
                  </button>
                </AlertDialogTrigger>
                <AlertDialogContent className="dark:bg-zinc-900 dark:border-zinc-700">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="dark:text-white">
                      Delete this blog?
                    </AlertDialogTitle>
                    <AlertDialogDescription className="dark:text-zinc-400">
                      This action cannot be undone. The blog and all its content
                      will be permanently deleted.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel
                      onClick={onCancelDelete}
                      className="dark:bg-zinc-800 dark:text-white dark:border-zinc-600"
                    >
                      Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                      onClick={onConfirmDelete}
                      className="bg-destructive text-white hover:bg-destructive/90"
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

              {/* View / Edit */}
              {type === "published" ? (
                <Link
                  to={`/blog/${post.blogId}`}
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    title="View"
                    className={[
                      "p-2 border-[3px] cursor-pointer transition-colors",
                      "border-[#0d0d0d] dark:border-zinc-600",
                      "text-[#0d0d0d] dark:text-zinc-300",
                      "hover:bg-[#0d0d0d] hover:text-white",
                      "dark:hover:bg-zinc-700 dark:hover:border-zinc-500",
                    ].join(" ")}
                  >
                    <ExternalLink size={12} />
                  </button>
                </Link>
              ) : (
                <button
                  title="Edit"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit?.(post.blogId);
                  }}
                  className={[
                    "p-2 border-[3px] cursor-pointer transition-colors",
                    "border-[#0d0d0d] dark:border-zinc-600",
                    "text-[#0d0d0d] dark:text-zinc-300",
                    "hover:bg-[#0d0d0d] hover:text-white",
                    "dark:hover:bg-zinc-700 dark:hover:border-zinc-500",
                  ].join(" ")}
                >
                  <Edit3 size={12} />
                </button>
              )}
            </div>
          </div>

          {/* Title */}
          <h3
            className="font-black text-base leading-tight mb-2 text-[#151d1e] dark:text-white"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {post.title}
          </h3>

          {/* Summary */}
          <h5
            className="font-thin text-sm leading-tight mb-2 text-[#666] dark:text-zinc-400"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {post.summary}
          </h5>
        </div>

        {/* Bottom: meta */}
        <div className="flex flex-wrap items-center gap-4 pt-3 mt-2 border-t-[3px] border-[#e7f0f1] dark:border-zinc-700">
          <span
            className="text-xs font-bold text-[#8f6f6c] dark:text-zinc-500"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {post.createdAt}
          </span>
          <div className="flex items-center gap-3 ml-auto">
            <span
              className="flex items-center gap-1.5 text-xs font-black text-[#151d1e] dark:text-zinc-300"
              style={{ fontFamily: "var(--font-display)" }}
            >
              <Eye size={12} />
              {fmtNum(post.viewCount)}
            </span>
            <span
              className="flex items-center gap-1.5 text-xs font-black text-[#d32f2f]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              <Heart size={12} />
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}

export default BlogPostCard;
