import { useState, useEffect } from "react";
import { toast } from "sonner";
import blogApi from "@/api/blogApi";
import followApi from "@/api/followApi";
import useAuthStore from "@/stores/authStore";
import { User } from "@/types/response/authResponse.type";
import { BlogResponse } from "@/types/response/blogResponse.types";
import { extractApiError } from "@/utils/apiError";

export function useUserDetail(userId: string | undefined) {
  const { user: currentUser } = useAuthStore();

  const [profileUser, setProfileUser] = useState<User | null>(null);
  const [blogs, setBlogs] = useState<BlogResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFollowLoading, setIsFollowLoading] = useState(false);
  const [followOverride, setFollowOverride] = useState<boolean | null>(null);

  const isOwnProfile = profileUser?.id === currentUser?.id;
  const isFollowing =
    followOverride !== null ? followOverride : (profileUser?.following ?? false);

  useEffect(() => {
    if (!userId) return;
    setFollowOverride(null);

    const load = async () => {
      setIsLoading(true);
      try {
        const { data } = await blogApi.getAllBlogPublishByUserId(userId);
        const result = data.result.filter(Boolean);
        setBlogs(result);
        if (result.length > 0) setProfileUser(result[0].author);
      } catch (e) {
        toast.error("Failed to load user profile.");
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, [userId]);

  const handleFollowToggle = async () => {
    if (!profileUser?.id || isFollowLoading || isOwnProfile) return;
    setIsFollowLoading(true);
    try {
      if (isFollowing) {
        toast("Confirm", {
          description: "Are you sure you want to unfollow this user?",
          action: {
            label: "Confirm",
            onClick: async () => {
              await followApi.unfollow(profileUser.id);
              setFollowOverride(false);
              toast.success("Unfollowed successfully");
            },
          },
          cancel: { label: "Cancel", onClick: () => {} },
        });
      } else {
        await followApi.follow(profileUser.id);
        setFollowOverride(true);
        toast.success("Following! They'll be notified.");
      }
    } catch (e) {
      toast.error(extractApiError(e));
    } finally {
      setIsFollowLoading(false);
    }
  };

  const totalViews = blogs.reduce((sum, b) => sum + (b.viewCount ?? 0), 0);
  const totalLikes = blogs.reduce((sum, b) => sum + (b.likeCount ?? 0), 0);

  return {
    profileUser,
    blogs,
    isLoading,
    isFollowLoading,
    isOwnProfile,
    isFollowing,
    totalViews,
    totalLikes,
    handleFollowToggle,
  };
}