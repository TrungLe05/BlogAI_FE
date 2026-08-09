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
} from "@/shared/components/ui/alert-dialog";
import { BlogResponse } from "@/features/blog/types/blog.types";

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
        "flex flex-col sm:flex-row gap-0 group cursor-pointer transition-all",
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
      <div className="w-full h-40 sm:h-auto sm:w-50 shrink-0 overflow-hidden border-b-[3px] sm:border-b-0 sm:border-r-[3px] border-[#0d0d0d] dark:border-zinc-600">
        <img
          src={post.coverImageUrl}
          alt={post.title}
          className="w-full h-full object-cover block min-h-30"
        />
      </div>

      {/* Content */}
      <div className="flex-1 p-4 sm:p-5 flex flex-col justify-between min-w-0">
        {/* Top: tags + actions */}
        <div>
          <div className="flex items-start sm:items-center justify-between mb-3 gap-2">
            {/* Tags */}
            <div className="flex gap-1.5 flex-wrap">
              {post.tags.map((tag, i) => (
                <span
                  key={i}
                  className="text-[10px] sm:text-xs font-black uppercase tracking-widest px-2 sm:px-2.5 py-1 text-white bg-[#d32f2f] font-display"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Action buttons */}
            <div className="flex gap-2 flex-shrink-0">
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
                <AlertDialogContent className="dark:bg-zinc-900 dark:border-zinc-700 w-[calc(100%-2rem)] sm:w-auto rounded-none">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="dark:text-white">
                      Delete this blog?
                    </AlertDialogTitle>
                    <AlertDialogDescription className="dark:text-zinc-400">
                      This action cannot be undone. The blog and all its content
                      will be permanently deleted.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter className="flex-col-reverse sm:flex-row gap-2 sm:gap-0">
                    <AlertDialogCancel
                      onClick={onCancelDelete}
                      className="dark:bg-zinc-800 dark:text-white dark:border-zinc-600 w-full sm:w-auto"
                    >
                      Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                      onClick={onConfirmDelete}
                      className="bg-destructive text-white hover:bg-destructive/90 w-full sm:w-auto"
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
          <h3 className="font-bold text-lg sm:text-xl leading-tight mb-2 text-[#151d1e] dark:text-white font-display">
            {post.title}
          </h3>

          {/* Summary */}
          <h5 className="font-thin text-sm leading-tight mb-2 text-[#666] dark:text-zinc-400 font-display line-clamp-2 sm:line-clamp-none">
            {post.summary}
          </h5>
        </div>

        {/* Bottom: meta */}
        <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-3 mt-2 border-t-[3px] border-[#e7f0f1] dark:border-zinc-700">
          <span className="text-xs font-bold text-[#8f6f6c] dark:text-zinc-500 font-display">
            {post.createdAt}
          </span>
          <div className="flex items-center gap-3 sm:ml-auto">
            <span className="flex items-center gap-1.5 text-xs font-black text-[#151d1e] dark:text-zinc-300 font-display">
              <Eye size={12} />
              {fmtNum(post.viewCount)}
            </span>
            <span className="flex items-center gap-1.5 text-xs font-black text-[#d32f2f] font-display">
              <Heart size={12} />
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}

export default BlogPostCard;
