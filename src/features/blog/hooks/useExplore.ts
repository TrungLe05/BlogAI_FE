import { useState, useEffect, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { toast } from "sonner";
import blogApi from "@/api/blogApi";
import tagApi from "@/api/tagApi";
import { BlogResponse, TagResponse, TagStatsResponse } from "@/types/response/blogResponse.types";
import { extractApiError } from "@/utils/apiError";

const SORTS = ["Latest", "Most Viewed"] as const;
const PAGE_SIZE = 9;

function parseDate(dateStr: string) {
  const [day, month, year] = dateStr.split("/");
  return new Date(`${year}-${month}-${day}`).getTime();
}

export function useExplore() {
  const location = useLocation();

  const [search, setSearch] = useState("");
  const [activeTag, setActiveTag] = useState(location.state?.selectedTag ?? "All");
  const [activeGroup, setActiveGroup] = useState("All");
  const [activeSort, setActiveSort] = useState<typeof SORTS[number]>("Latest");
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

  useEffect(() => { setPage(1); }, [search, activeTag, activeSort, activeGroup]);

  useEffect(() => {
    if (location.state?.selectedTag) {
      setActiveTag(location.state.selectedTag);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [location.state]);

  const groups = useMemo(() => {
    const uniqueGroups = [...new Set(tags.map((t) => t.groupName))];
    return ["All", ...uniqueGroups];
  }, [tags]);

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
  const paginated = filteredAndSorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleGroupClick = (group: string) => {
    setActiveGroup(group);
    setActiveTag("All");
  };

  const handleTagClick = (tag: string) => {
    setActiveTag(tag === activeTag ? "All" : tag);
  };

  return {
    search, setSearch,
    activeTag, setActiveTag,
    activeGroup,
    activeSort, setActiveSort,
    groups,
    filteredTagsByGroup,
    filteredAndSorted,
    paginated,
    totalPages,
    page, setPage,
    loading,
    tags,
    groupTrending,
    SORTS,
    handleGroupClick,
    handleTagClick,
  };
}