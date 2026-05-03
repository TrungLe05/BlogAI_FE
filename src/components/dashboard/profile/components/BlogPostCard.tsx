import { Edit3, ExternalLink, Eye, Heart, Trash } from "lucide-react";
import { Link } from "react-router-dom";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader,
  AlertDialogTitle, AlertDialogTrigger,
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

function BlogPostCard({ post, type, fmtNum, onMarkDelete, onConfirmDelete, onCancelDelete, onEdit }: BlogPostCardProps) {
  return (
    <article
      className="bg-white flex gap-0 group transition-all cursor-pointer"
      style={{ border: "3px solid #0d0d0d", boxShadow: "4px 4px 0 #0d0d0d" }}
      onMouseEnter={(e) => { e.currentTarget.style.transform = "translate(-4px,-4px)"; e.currentTarget.style.boxShadow = "8px 8px 0 #0d0d0d"; }}
      onMouseLeave={(e) => { e.currentTarget.style.transform = "translate(0,0)"; e.currentTarget.style.boxShadow = "4px 4px 0 #0d0d0d"; }}
    >
      <div className="shrink-0 overflow-hidden" style={{ width: "140px", borderRight: "3px solid #0d0d0d" }}>
        <img src={post.coverImageUrl} alt={post.title} className="w-full h-full object-cover" style={{ display: "block", minHeight: "120px" }} />
      </div>
      <div className="flex-1 p-5 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex gap-1.5 flex-wrap">
              {post.tags.map((tag, index) => (
                <span key={index} className="text-xs font-black uppercase tracking-widest px-2.5 py-1 text-white" style={{ background: "#d32f2f", fontFamily: "var(--font-display)" }}>
                  {tag}
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <AlertDialog>
                <AlertDialogTrigger>
                  <button title="Delete" className="p-2 hover:bg-[#d32f2f] hover:text-white transition-colors cursor-pointer" style={{ border: "3px solid #0d0d0d" }} onClick={() => onMarkDelete(post.blogId)}>
                    <Trash size={12} />
                  </button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete this blog?</AlertDialogTitle>
                    <AlertDialogDescription>This action cannot be undone. The blog and all its content will be permanently deleted.</AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel onClick={onCancelDelete}>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={onConfirmDelete} className="bg-destructive text-white hover:bg-destructive/90">Delete</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

              {type === "published" ? (
                <Link to={`/blog/${post.blogId}`} onClick={(e) => e.stopPropagation()}>
                  <button title="View" className="p-2 hover:bg-[#0d0d0d] hover:text-white transition-colors cursor-pointer" style={{ border: "3px solid #0d0d0d" }}>
                    <ExternalLink size={12} />
                  </button>
                </Link>
              ) : (
                <button title="Edit" className="p-2 hover:bg-[#0d0d0d] hover:text-white transition-colors cursor-pointer" style={{ border: "3px solid #0d0d0d" }} onClick={(e) => { e.stopPropagation(); onEdit?.(post.blogId); }}>
                  <Edit3 size={12} />
                </button>
              )}
            </div>
          </div>
          <h3 className="font-black text-base leading-tight mb-2" style={{ fontFamily: "var(--font-display)", color: "#151d1e" }}>{post.title}</h3>
          <h5 className="font-thin text-sm leading-tight mb-2" style={{ fontFamily: "var(--font-display)", color: "rgb(102, 102, 102)" }}>{post.summary}</h5>
        </div>
        <div className="flex flex-wrap items-center gap-4 pt-3 mt-2" style={{ borderTop: "3px solid #e7f0f1" }}>
          <span className="text-xs font-bold" style={{ color: "#8f6f6c", fontFamily: "var(--font-display)" }}>{post.createdAt}</span>
          <div className="flex items-center gap-3 ml-auto">
            <span className="flex items-center gap-1.5 text-xs font-black" style={{ color: "#151d1e", fontFamily: "var(--font-display)" }}><Eye size={12} />{fmtNum(post.viewCount)}</span>
            <span className="flex items-center gap-1.5 text-xs font-black" style={{ color: "#d32f2f", fontFamily: "var(--font-display)" }}><Heart size={12} /></span>
          </div>
        </div>
      </div>
    </article>
  );
}

export default BlogPostCard;
