import { useEffect, useState, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Search,
  Clock,
  ChevronLeft,
  ChevronRight,
  Eye,
  TrendingUp,
  Loader2,
} from "lucide-react";
import blogApi from "@/api/blogApi";
import { toast } from "sonner";
import { BlogResponse, TagResponse } from "@/types/blog.types";
import { TagStatsResponse } from "@/types/tag.types";
import tagApi from "@/api/tagApi";
import { extractApiError } from "@/utils/apiError";
import LoadingSpinner from "@/components/common/LoadingSpinner";

const SORTS = ["Latest", "Most Viewed"];
const FALLBACK_COVER =
  "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=600&h=400&fit=crop";
const PAGE_SIZE = 9;

const parseDate = (dateStr: string) => {
  const [day, month, year] = dateStr.split("/");
  return new Date(`${year}-${month}-${day}`).getTime();
};

function ExplorePage() {
  const [search, setSearch] = useState("");
  const location = useLocation();
  const [activeTag, setActiveTag] = useState(
    location.state?.selectedTag ?? "All",
  );
  const [activeGroup, setActiveGroup] = useState("All");
  const [activeSort, setActiveSort] = useState("Latest");
  const [blogs, setBlogs] = useState<BlogResponse[]>([]);
  const [tags, setTags] = useState<TagResponse[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [groupTrending, setGroupTrending] = useState<TagStatsResponse[]>([]);

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const [blogsRes, tagsRes, trendingRes] = await Promise.all([
          blogApi.getAllBlog(),
          blogApi.getAllTag(),
          tagApi.getTrendingGroups(),
        ]);

        setBlogs(blogsRes.data.result.filter(Boolean));
        setTags(tagsRes.data.result);
        setGroupTrending(trendingRes.data.result);
      } catch (e) {
        toast.error("Failed to fetch data");
        console.log(extractApiError(e));
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  useEffect(() => {
    setPage(1);
  }, [search, activeTag, activeSort, activeGroup]);

  useEffect(() => {
    if (location.state?.selectedTag) {
      setActiveTag(location.state.selectedTag);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [location.state]);

  // Groups từ tags
  const groups = useMemo(() => {
    const uniqueGroups = [...new Set(tags.map((t) => t.groupName))];
    return ["All", ...uniqueGroups];
  }, [tags]);

  // Tags theo group đang active
  const filteredTagsByGroup = useMemo(() => {
    if (activeGroup === "All") return [];
    return tags.filter((t) => t.groupName === activeGroup);
  }, [tags, activeGroup]);

  const filteredAndSorted = useMemo(() => {
    return blogs
      .filter((blog) => {
        const matchTag = activeTag === "All" || blog.tags.includes(activeTag);
        const matchGroup =
          activeGroup === "All" ||
          blog.tags.some((tag) =>
            tags.find((t) => t.tag === tag && t.groupName === activeGroup),
          );
        const matchSearch =
          blog.title.toLowerCase().includes(search.toLowerCase()) ||
          (blog.summary ?? "").toLowerCase().includes(search.toLowerCase());
        return matchTag && matchSearch && matchGroup;
      })
      .sort((a, b) => {
        if (activeSort === "Latest")
          return parseDate(b.createdAt ?? "") - parseDate(a.createdAt ?? "");
        if (activeSort === "Most Viewed") return b.viewCount - a.viewCount;
        return 0;
      });
  }, [blogs, activeTag, activeGroup, search, activeSort, tags]);

  const totalPages = Math.ceil(filteredAndSorted.length / PAGE_SIZE);
  const paginated = filteredAndSorted.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE,
  );

  const handleGroupClick = (group: string) => {
    setActiveGroup(group);
    setActiveTag("All"); // reset tag khi đổi group
  };

  const handleTagClick = (tag: string) => {
    setActiveTag(tag === activeTag ? "All" : tag);
  };

  if (loading) {
    return <LoadingSpinner />;
  }
  return (
    <div
      style={{
        background: "#ebf4f5",
        fontFamily: "var(--font-sans)",
        minHeight: "100vh",
      }}
    >


      {/* Header */}
      <div
        className="py-12 px-6"
        style={{ background: "#0d0d0d", borderBottom: "3px solid #d32f2f" }}
      >
        <div className="max-w-7xl mx-auto">
          <h1
            className="font-black mb-4"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(36px, 5vw, 64px)",
              color: "white",
              lineHeight: 1.1,
            }}
          >
            Explore <span style={{ color: "#d32f2f" }}>Stories</span>
          </h1>
          <p className="text-white/60 text-base mb-8">
            Discover blogs from writers around the world.
          </p>
          <div className="relative max-w-2xl">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2"
              style={{ color: "#999" }}
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search blogs, authors, topics..."
              className="brutal-input"
              style={{ background: "white", paddingLeft: "40px" }}
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* ── Group Pills ── */}
        <div className="flex flex-wrap gap-2 mb-4">
          {groups.map((group) => (
            <button
              key={group}
              onClick={() => handleGroupClick(group)}
              className="px-4 py-2 text-xs font-black uppercase tracking-widest transition-all"
              style={{
                fontFamily: "var(--font-display)",
                border: "2px solid #0d0d0d",
                background: activeGroup === group ? "#d32f2f" : "white",
                color: activeGroup === group ? "white" : "#0d0d0d",
                boxShadow: activeGroup === group ? "3px 3px 0 #0d0d0d" : "none",
              }}
            >
              {group}
            </button>
          ))}
        </div>

        {/* ── Tag Pills (chỉ hiện khi chọn group) ── */}
        {activeGroup !== "All" && filteredTagsByGroup.length > 0 && (
          <div
            className="flex flex-wrap gap-2 mb-6 p-4"
            style={{
              background: "white",
              border: "2px solid #0d0d0d",
              borderTop: "none",
            }}
          >
            <button
              onClick={() => setActiveTag("All")}
              className="px-3 py-1.5 text-xs font-black uppercase tracking-widest transition-all"
              style={{
                fontFamily: "var(--font-display)",
                border: "2px solid #0d0d0d",
                background: activeTag === "All" ? "#0d0d0d" : "#f2fbfc",
                color: activeTag === "All" ? "white" : "#0d0d0d",
              }}
            >
              All in {activeGroup}
            </button>
            {filteredTagsByGroup.map((t) => (
              <button
                key={t.tag}
                onClick={() => handleTagClick(t.tag)}
                className="px-3 py-1.5 text-xs font-black uppercase tracking-widest transition-all"
                style={{
                  fontFamily: "var(--font-display)",
                  border: "2px solid #0d0d0d",
                  background: activeTag === t.tag ? "#0d0d0d" : "#f2fbfc",
                  color: activeTag === t.tag ? "white" : "#0d0d0d",
                  boxShadow: activeTag === t.tag ? "2px 2px 0 #d32f2f" : "none",
                }}
              >
                {t.tag}
              </button>
            ))}
          </div>
        )}

        {/* Sort Bar */}
        <div
          className="flex items-center justify-between mb-8 p-3 bg-white"
          style={{ border: "3px solid #0d0d0d" }}
        >
          <div className="flex gap-0">
            {SORTS.map((sort, i) => (
              <button
                key={sort}
                onClick={() => setActiveSort(sort)}
                className="px-6 py-2 text-sm font-black uppercase tracking-widest transition-colors"
                style={{
                  fontFamily: "var(--font-display)",
                  background: activeSort === sort ? "#0d0d0d" : "transparent",
                  color: activeSort === sort ? "white" : "#555",
                  borderRight:
                    i < SORTS.length - 1 ? "2px solid #0d0d0d" : "none",
                }}
              >
                {sort}
              </button>
            ))}
          </div>
          <p
            className="text-sm"
            style={{ color: "#888", fontFamily: "var(--font-display)" }}
          >
            <span className="font-black" style={{ color: "#d32f2f" }}>
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
                    <Link
                      to={`/blog/${blog.blogId}`}
                      key={blog.blogId}
                      className="bg-white overflow-hidden block group transition-all"
                      style={{
                        border: "3px solid #0d0d0d",
                        boxShadow: "4px 4px 0 #0d0d0d",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform =
                          "translate(-2px,-2px)";
                        e.currentTarget.style.boxShadow = "6px 6px 0 #0d0d0d";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "translate(0,0)";
                        e.currentTarget.style.boxShadow = "4px 4px 0 #0d0d0d";
                      }}
                    >
                      <div
                        className="relative overflow-hidden"
                        style={{ height: "180px" }}
                      >
                        <img
                          src={blog.coverImageUrl ?? FALLBACK_COVER}
                          alt={blog.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute top-3 left-3 flex gap-1 flex-wrap">
                          {blog.tags.slice(0, 2).map((tag) => (
                            <span
                              key={tag}
                              className="px-2 py-1 text-xs font-black uppercase tracking-widest text-white"
                              style={{
                                background: "#d32f2f",
                                border: "2px solid #0d0d0d",
                                fontFamily: "var(--font-display)",
                              }}
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                        <div
                          className="absolute bottom-3 right-3 flex items-center gap-1 px-2 py-1 text-xs font-bold"
                          style={{
                            background: "rgba(0,0,0,0.7)",
                            color: "white",
                          }}
                        >
                          <Eye size={11} />
                          {blog.viewCount}
                        </div>
                      </div>
                      <div className="p-4">
                        <h3
                          className="font-black text-base leading-tight mb-2 line-clamp-2"
                          style={{
                            fontFamily: "var(--font-display)",
                            color: "#0d0d0d",
                          }}
                        >
                          {blog.title}
                        </h3>
                        <p
                          className="text-xs mb-3 leading-relaxed line-clamp-2"
                          style={{ color: "#666" }}
                        >
                          {blog.summary ?? "No summary available."}
                        </p>
                        <div
                          className="flex items-center justify-between pt-3"
                          style={{ borderTop: "2px solid #0d0d0d" }}
                        >
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
                              className="w-6 h-6 object-cover"
                              style={{ border: "2px solid #0d0d0d" }}
                            />
                            <span
                              className="text-xs font-bold truncate max-w-25 hover:text-[#d32f2f] transition-colors"
                              style={{ fontFamily: "var(--font-display)" }}
                            >
                              {blog.author.fullName}
                            </span>
                          </Link>
                          <div
                            className="flex items-center gap-1 text-xs"
                            style={{ color: "#888" }}
                          >
                            <Clock size={11} />
                            {blog.createdAt}
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="w-10 h-10 flex items-center justify-center disabled:opacity-40"
                      style={{
                        border: "3px solid #0d0d0d",
                        background: "white",
                        boxShadow: "3px 3px 0 #0d0d0d",
                      }}
                    >
                      <ChevronLeft size={16} />
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (p) => (
                        <button
                          key={p}
                          onClick={() => setPage(p)}
                          className="w-10 h-10 flex items-center justify-center text-sm font-black"
                          style={{
                            fontFamily: "var(--font-display)",
                            border: "3px solid #0d0d0d",
                            background: page === p ? "#0d0d0d" : "white",
                            color: page === p ? "white" : "#0d0d0d",
                            boxShadow:
                              page === p
                                ? "3px 3px 0 #d32f2f"
                                : "3px 3px 0 #0d0d0d",
                          }}
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
                      className="w-10 h-10 flex items-center justify-center disabled:opacity-40"
                      style={{
                        border: "3px solid #0d0d0d",
                        background: "white",
                        boxShadow: "3px 3px 0 #0d0d0d",
                      }}
                    >
                      <ChevronRight size={16} />
                    </button>
                  </div>
                )}
              </>
            ) : (
              !loading && (
                <div
                  className="text-center py-20 bg-white"
                  style={{
                    border: "3px solid #0d0d0d",
                    boxShadow: "4px 4px 0 #0d0d0d",
                  }}
                >
                  <p className="text-6xl mb-4">📝</p>
                  <h3
                    className="font-black text-xl mb-2"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    No stories found
                  </h3>
                  <p style={{ color: "#888" }}>Try a different search or tag</p>
                </div>
              )
            )}
          </div>

          {/* Sidebar */}
          <aside className="hidden lg:block space-y-6">
            {/* Trending Topics */}
            <div
              className="bg-white"
              style={{
                border: "3px solid #0d0d0d",
                boxShadow: "4px 4px 0 #0d0d0d",
              }}
            >
              <div
                className="px-5 py-3"
                style={{
                  background: "#0d0d0d",
                  borderBottom: "3px solid #0d0d0d",
                }}
              >
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
                  className="flex items-center justify-between px-5 py-3 cursor-pointer hover:bg-[#ebf4f5] transition-colors"
                  style={{
                    borderBottom:
                      i < groupTrending.length - 1 ? "1px solid #eee" : "none",
                  }}
                  onClick={() => handleGroupClick(t.tag)}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="w-6 h-6 flex items-center justify-center text-xs font-black text-white"
                      style={{
                        background: "#d32f2f",
                        fontFamily: "var(--font-display)",
                      }}
                    >
                      {i + 1}
                    </span>
                    <span
                      className="text-sm font-bold"
                      style={{ fontFamily: "var(--font-display)" }}
                    >
                      {t.tag}
                    </span>
                  </div>
                  <span className="text-xs" style={{ color: "#888" }}>
                    {t.count} {t.count === 1 ? "post" : "posts"}
                  </span>
                </div>
              ))}
            </div>

            {/* Popular Tags */}
            <div
              className="bg-white p-5"
              style={{
                border: "3px solid #0d0d0d",
                boxShadow: "4px 4px 0 #0d0d0d",
              }}
            >
              <h3
                className="font-black text-sm uppercase tracking-widest mb-4"
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
                      if (group) setActiveGroup(group);
                      setActiveTag(t.tag);
                    }}
                    className="brutal-tag cursor-pointer transition-all hover:bg-[#0d0d0d] hover:text-white"
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

export default ExplorePage;
