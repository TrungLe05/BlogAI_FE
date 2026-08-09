import { BlogResponse } from "@/features/blog/types/blog.types";
import BlogPostCard from "./BlogPostCard";

interface BlogPostsListProps {
  activeTab: "published" | "drafts";
  onTabChange: (tab: "published" | "drafts") => void;
  filterPublishBlog: BlogResponse[];
  filterDraftBlog: BlogResponse[];
  fmtNum: (n: number) => string;
  onMarkDelete: (blogId: string) => void;
  onConfirmDelete: () => void;
  onCancelDelete: () => void;
  onEditBlog: (blogId: string) => void;
}

function BlogPostsList({
  activeTab,
  onTabChange,
  filterPublishBlog,
  filterDraftBlog,
  fmtNum,
  onMarkDelete,
  onConfirmDelete,
  onCancelDelete,
  onEditBlog,
}: BlogPostsListProps) {
  return (
    <div>
      {/* Tab strip */}
      <div className="flex mb-5 sm:mb-6 bg-white shadow-[4px_4px_0_#0d0d0d] dark:shadow-[4px_4px_0_#52525b] dark:border-zinc-600 border-[3px] border-[#0d0d0d] ">
        {(["published", "drafts"] as const).map((t) => (
          <button
            key={t}
            onClick={() => onTabChange(t)}
            className="flex-1 py-2.5 sm:py-3 text-[11px] sm:text-xs font-black uppercase tracking-[0.15em] transition-colors cursor-pointer"
            style={{ background: activeTab === t ? "#0d0d0d" : "transparent",
              color: activeTab === t ? "white" : "#5b403d",
              borderRight: t === "published" ? "3px solid #0d0d0d" : "none" }}
          >
            {t}
            {t === "drafts" && (
              <span
                className="ml-1.5 sm:ml-2 text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 font-black"
                style={{ background: "#d32f2f", color: "white" }}
              >
                {filterDraftBlog.length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Published Posts */}
      {activeTab === "published" && (
        <div className="space-y-4">
          {filterPublishBlog.map((post) => (
            <BlogPostCard
              key={post.blogId}
              post={post}
              type="published"
              fmtNum={fmtNum}
              onMarkDelete={onMarkDelete}
              onConfirmDelete={onConfirmDelete}
              onCancelDelete={onCancelDelete}
            />
          ))}
        </div>
      )}

      {/* Draft Posts */}
      {activeTab === "drafts" && (
        <div className="space-y-4">
          {filterDraftBlog.map((draft) => (
            <BlogPostCard
              key={draft.blogId}
              post={draft}
              type="draft"
              fmtNum={fmtNum}
              onMarkDelete={onMarkDelete}
              onConfirmDelete={onConfirmDelete}
              onCancelDelete={onCancelDelete}
              onEdit={onEditBlog}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default BlogPostsList;