import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import blogApi from "@/features/blog/api/blogApi";
import followApi from "@/features/user/api/followApi";
import useAuthStore from "@/features/auth/stores/authStore";
import { BlogResponse } from "@/types/response/blogResponse.types";
import { extractApiError } from "@/utils/apiError";

export function useBlogDetail(blogId: string | undefined) {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const [blogDetail, setBlogDetail] = useState<BlogResponse | null>(null);
  const [blogRelated, setBlogRelated] = useState<BlogResponse[]>([]);
  const [isLiking, setIsLiking] = useState(false);
  const [isFollowLoading, setIsFollowLoading] = useState(false);
  const [followOverride, setFollowOverride] = useState<boolean | null>(null);
  const [isBlogLoading, setIsBlogLoading] = useState(true);

  const isAuthor = blogDetail?.author.email === user?.email;
  const isFollowing =
    followOverride !== null
      ? followOverride
      : (blogDetail?.author?.following ?? false);

  // Reset override khi chuyển blog
  useEffect(() => {
    setFollowOverride(null);
  }, [blogId]);

  // Fetch blog detail + increment view
  useEffect(() => {
    if (!blogId) return;
    let cancelled = false;

    const load = async () => {
      setIsBlogLoading(true);
      try {
        const { data } = await blogApi.getBlogDetailById(blogId);
        if (cancelled) return;
        setBlogDetail(data.result);

        const { data: viewData } = await blogApi.incrementView(blogId);
        if (cancelled) return;
        setBlogDetail((prev) =>
          prev ? { ...prev, viewCount: viewData.result } : prev,
        );
      } catch (e) {
        console.error(e);
      } finally {
        if (!cancelled) setIsBlogLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [blogId]);

  // Fetch related blogs
  useEffect(() => {
    if (!blogDetail?.blogId || !blogDetail?.tags?.length) return;
    blogApi
      .getRelatedBlogs(blogDetail.tags, blogDetail.blogId)
      .then(({ data }) => setBlogRelated(data.result))
      .catch(console.error);
  }, [blogDetail?.blogId]);

  const handleClickTag = (tag: string) => {
    navigate("/explore", { state: { selectedTag: tag } });
  };

  const handleToggleLike = async () => {
    if (!blogId || isLiking) return;
    setIsLiking(true);
    try {
      const { data } = await blogApi.toggleLike(blogId);
      setBlogDetail((prev) =>
        prev
          ? {
              ...prev,
              likeCount: data.result.likeCount,
              likedByCurrentUser: data.result.likedByCurrentUser,
            }
          : prev,
      );
    } catch (e) {
      console.error(e);
    } finally {
      setIsLiking(false);
    }
  };

  const handleFollowAuthor = async () => {
    if (!blogDetail?.author?.id || isFollowLoading || isBlogLoading) return;
    setIsFollowLoading(true);
    try {
      if (isFollowing) {
        await followApi.unfollow(blogDetail.author.id);
        setFollowOverride(false);
        toast.success("Unfollowed successfully");
      } else {
        await followApi.follow(blogDetail.author.id);
        setFollowOverride(true);
        toast.success("Followed! They'll be notified.");
      }
    } catch (e) {
      toast.error(extractApiError(e));
      setFollowOverride(isFollowing ? true : false);
    } finally {
      setIsFollowLoading(false);
    }
  };

  const relatedBlogs = [...blogRelated]
    .sort((a, b) => b.viewCount - a.viewCount)
    .slice(0, 3);

  return {
    blogDetail,
    relatedBlogs,
    isLiking,
    isFollowLoading,
    isBlogLoading,
    isAuthor,
    isFollowing,
    handleClickTag,
    handleToggleLike,
    handleFollowAuthor,
  };
}
