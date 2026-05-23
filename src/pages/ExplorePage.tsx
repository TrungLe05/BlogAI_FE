import { useNavigate } from "react-router-dom";
import { Search, ChevronLeft, ChevronRight, TrendingUp } from "lucide-react";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import BlogCard from "@/features/blog/components/BlogCard";
import { useExplore } from "@/features/blog/hooks/useExplore";

export default function ExplorePage() {
  const navigate = useNavigate();
  const {
    search,
    setSearch,
    activeTag,
    setActiveTag,
    activeGroup,
    activeSort,
    setActiveSort,
    groups,
    filteredTagsByGroup,
    filteredAndSorted,
    paginated,
    totalPages,
    page,
    setPage,
    loading,
    tags,
    groupTrending,
    SORTS,
    handleGroupClick,
    handleTagClick,
  } = useExplore();

  if (loading) return <LoadingSpinner />;

  return (
    <div
      className="min-h-screen bg-[#ebf4f5] dark:bg-zinc-950"
      style={{ fontFamily: "var(--font-sans)" }}
    >
      {/* Header */}
      <div className="py-12 px-6 bg-[#0d0d0d] border-b-[3px] border-[#d32f2f]">
        <div className="max-w-7xl mx-auto">
          <h1
            className="font-black mb-4 text-white"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(36px, 5vw, 64px)",
              lineHeight: 1.1,
            }}
          >
            Explore <span className="text-[#d32f2f]">Stories</span>
          </h1>
          <p className="text-white/60 text-base mb-8">
            Discover blogs from writers around the world.
          </p>
          <div className="relative max-w-2xl">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[#999]"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search blogs, authors, topics..."
              className="brutal-input dark:bg-zinc-800 dark:text-white dark:border-zinc-600"
              style={{ paddingLeft: 40 }}
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Group Pills */}
        <div className="flex flex-wrap gap-2 mb-4">
          {groups.map((group) => (
            <button
              key={group}
              onClick={() => handleGroupClick(group)}
              className={`px-4 py-2 text-xs font-black uppercase tracking-widest transition-all border-2 cursor-pointer
                ${
                  activeGroup === group
                    ? "bg-[#d32f2f] text-white border-[#d32f2f] shadow-[3px_3px_0_#0d0d0d] dark:shadow-[3px_3px_0_#52525b]"
                    : "bg-white dark:bg-zinc-800 text-[#0d0d0d] dark:text-zinc-200 border-[#0d0d0d] dark:border-zinc-600 hover:bg-[#f2fbfc] dark:hover:bg-zinc-700"
                }`}
              style={{ fontFamily: "var(--font-display)" }}
            >
              {group}
            </button>
          ))}
        </div>

        {/* Tag Pills */}
        {activeGroup !== "All" && filteredTagsByGroup.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6 p-4 bg-white dark:bg-zinc-800 border-2 border-[#0d0d0d] dark:border-zinc-600 border-t-0">
            <button
              onClick={() => setActiveTag("All")}
              className={`px-3 py-1.5 text-xs font-black uppercase tracking-widest transition-all border-2 cursor-pointer
                ${
                  activeTag === "All"
                    ? "bg-[#0d0d0d] dark:bg-zinc-200 text-white dark:text-zinc-900 border-[#0d0d0d] dark:border-zinc-200"
                    : "bg-[#f2fbfc] dark:bg-zinc-700 text-[#0d0d0d] dark:text-zinc-200 border-[#0d0d0d] dark:border-zinc-500"
                }`}
              style={{ fontFamily: "var(--font-display)" }}
            >
              All in {activeGroup}
            </button>
            {filteredTagsByGroup.map((t) => (
              <button
                key={t.tag}
                onClick={() => handleTagClick(t.tag)}
                className={`px-3 py-1.5 text-xs font-black uppercase tracking-widest transition-all border-2 cursor-pointer
                  ${
                    activeTag === t.tag
                      ? "bg-[#0d0d0d] dark:bg-zinc-200 text-white dark:text-zinc-900 border-[#0d0d0d] shadow-[2px_2px_0_#d32f2f]"
                      : "bg-[#f2fbfc] dark:bg-zinc-700 text-[#0d0d0d] dark:text-zinc-200 border-[#0d0d0d] dark:border-zinc-500"
                  }`}
                style={{ fontFamily: "var(--font-display)" }}
              >
                {t.tag}
              </button>
            ))}
          </div>
        )}

        {/* Sort Bar */}
        <div className="flex items-center justify-between mb-8 p-3 bg-white dark:bg-zinc-800 border-[3px] border-[#0d0d0d] dark:border-zinc-600">
          <div className="flex gap-0">
            {SORTS.map((sort, i) => (
              <button
                key={sort}
                onClick={() => setActiveSort(sort)}
                className={`px-6 py-2 text-sm font-black uppercase tracking-widest transition-colors cursor-pointer
                  ${
                    activeSort === sort
                      ? "bg-[#0d0d0d] dark:bg-zinc-200 text-white dark:text-zinc-900"
                      : "bg-transparent text-[#555] dark:text-zinc-400 hover:bg-[#f2fbfc] dark:hover:bg-zinc-700"
                  }
                  ${i < SORTS.length - 1 ? "border-r-2 border-[#0d0d0d] dark:border-zinc-600" : ""}`}
                style={{ fontFamily: "var(--font-display)" }}
              >
                {sort}
              </button>
            ))}
          </div>
          <p
            className="text-sm text-[#888] dark:text-zinc-400"
            style={{ fontFamily: "var(--font-display)" }}
          >
            <span className="font-black text-[#d32f2f]">
              {filteredAndSorted.length}
            </span>{" "}
            stories found
          </p>
        </div>

        <div className="grid lg:grid-cols-[1fr_280px] gap-8">
          {/* Blog Grid */}
          <div>
            {paginated.length > 0 ? (
              <>
                <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
                  {paginated.map((blog) => (
                    <BlogCard
                      key={blog.blogId}
                      blog={blog}
                      onTagClick={handleTagClick}
                    />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="w-10 h-10 flex items-center justify-center disabled:opacity-40 bg-white dark:bg-zinc-800 border-[3px] border-[#0d0d0d] dark:border-zinc-600 shadow-[3px_3px_0_#0d0d0d] cursor-pointer"
                    >
                      <ChevronLeft
                        size={16}
                        className="text-[#0d0d0d] dark:text-white"
                      />
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (p) => (
                        <button
                          key={p}
                          onClick={() => setPage(p)}
                          className={`w-10 h-10 flex items-center justify-center text-sm font-black cursor-pointer border-[3px]
                          ${
                            page === p
                              ? "bg-[#0d0d0d] dark:bg-zinc-200 text-white dark:text-zinc-900 border-[#0d0d0d] shadow-[3px_3px_0_#d32f2f]"
                              : "bg-white dark:bg-zinc-800 text-[#0d0d0d] dark:text-white border-[#0d0d0d] dark:border-zinc-600 shadow-[3px_3px_0_#0d0d0d]"
                          }`}
                          style={{ fontFamily: "var(--font-display)" }}
                        >
                          {p}
                        </button>
                      ),
                    )}
                    <button
                      onClick={() =>
                        setPage((p) => Math.min(totalPages, p + 1))
                      }
                      disabled={page === totalPages}
                      className="w-10 h-10 flex items-center justify-center disabled:opacity-40 bg-white dark:bg-zinc-800 border-[3px] border-[#0d0d0d] dark:border-zinc-600 shadow-[3px_3px_0_#0d0d0d] cursor-pointer"
                    >
                      <ChevronRight
                        size={16}
                        className="text-[#0d0d0d] dark:text-white"
                      />
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-20 bg-white dark:bg-zinc-800 border-[3px] border-[#0d0d0d] dark:border-zinc-600 shadow-[4px_4px_0_#0d0d0d]">
                <p className="text-6xl mb-4">📝</p>
                <h3
                  className="font-black text-xl mb-2 text-[#0d0d0d] dark:text-white"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  No stories found
                </h3>
                <p className="text-[#888] dark:text-zinc-500">
                  Try a different search or tag
                </p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="hidden lg:block space-y-6">
            {/* Trending Topics */}
            <div className="bg-white dark:bg-zinc-800 border-[3px] border-[#0d0d0d] dark:border-zinc-600 shadow-[4px_4px_0_#0d0d0d] dark:shadow-[4px_4px_0_#52525b]">
              <div className="px-5 py-3 bg-[#0d0d0d] border-b-[3px] border-[#0d0d0d]">
                <h3
                  className="font-black text-sm uppercase tracking-widest text-white flex items-center gap-2"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  <TrendingUp size={14} /> Trending Topics
                </h3>
              </div>
              {groupTrending.map((t, i) => (
                <div
                  key={t.tag}
                  className={`flex items-center justify-between px-5 py-3 cursor-pointer hover:bg-[#ebf4f5] dark:hover:bg-zinc-700 transition-colors ${i < groupTrending.length - 1 ? "border-b border-[#eee] dark:border-zinc-700" : ""}`}
                  onClick={() => handleGroupClick(t.tag)}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="w-6 h-6 flex items-center justify-center text-xs font-black text-white bg-[#d32f2f]"
                      style={{ fontFamily: "var(--font-display)" }}
                    >
                      {i + 1}
                    </span>
                    <span
                      className="text-sm font-bold text-[#0d0d0d] dark:text-zinc-200"
                      style={{ fontFamily: "var(--font-display)" }}
                    >
                      {t.tag}
                    </span>
                  </div>
                  <span className="text-xs text-[#888] dark:text-zinc-500">
                    {t.count} {t.count === 1 ? "post" : "posts"}
                  </span>
                </div>
              ))}
            </div>

            {/* Popular Tags */}
            <div className="bg-white dark:bg-zinc-800 p-5 border-[3px] border-[#0d0d0d] dark:border-zinc-600 shadow-[4px_4px_0_#0d0d0d] dark:shadow-[4px_4px_0_#52525b]">
              <h3
                className="font-black text-sm uppercase tracking-widest mb-4 text-[#0d0d0d] dark:text-zinc-200"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Popular Tags
              </h3>
              <div className="flex flex-wrap gap-2">
                {tags.slice(0, 10).map((t) => (
                  <span
                    key={t.tag}
                    onClick={() => {
                      const group = tags.find(
                        (tag) => tag.tag === t.tag,
                      )?.groupName;
                      if (group) handleGroupClick(group);
                      setActiveTag(t.tag);
                    }}
                    className="brutal-tag cursor-pointer transition-all hover:bg-[#0d0d0d] hover:text-white dark:border-zinc-500 dark:text-zinc-300"
                  >
                    {t.tag}
                  </span>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
