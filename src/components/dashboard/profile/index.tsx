import { useState, useEffect } from "react";
import useAuthStore from "@/stores/authStore";
import { userApi } from "@/api/userApi";
import blogApi from "@/api/blogApi";
import { BlogResponse } from "@/types/response/blogResponse.types";
import { toast } from "sonner";
import { validationUpdateMe } from "@/utils/userValidation";
import { User } from "@/types/response/authResponse.type";
import { extractApiError } from "@/utils/apiError";
import followApi from "@/api/followApi";
import LoadingSpinner from "../../common/LoadingSpinner";

import ProfileBanner from "./components/ProfileBanner";
import BlogPostsList from "./components/BlogPostsList";
import ProfileSettingsForm from "./components/ProfileSettingsForm";
import FollowModal from "./components/FollowModal";

/* ── ProfileContent ────────────────────────────────── */
interface ProfileContentProps {
  onEditBlog: (blogId: string) => void;
}

export function ProfileContent({ onEditBlog }: ProfileContentProps) {
  const [activeTab, setActiveTab] = useState<"published" | "drafts">("published");

  const { user } = useAuthStore();

  const [form, setForm] = useState<{ fullName: string; email: string; avatarUrl: string }>({
    fullName: user?.fullName ?? "",
    email: user?.email ?? "",
    avatarUrl: user?.avatarUrl ?? "",
  });

  const [saved, setSaved] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(user?.avatarUrl);
  const setUser = useAuthStore((state) => state.setUser);

  const [myPublishBlog, setMyPublishBlog] = useState<BlogResponse[]>([]);
  const [myDraftBlog, setMyDraftBlog] = useState<BlogResponse[]>([]);
  const [followModal, setFollowModal] = useState<"followers" | "following" | null>(null);
  const [followers, setFollowers] = useState<User[]>([]);
  const [following, setFollowing] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [deletingBlogId, setDeletingBlogId] = useState<string | null>(null);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [blogPublish, blogDraft, followers, following] = await Promise.all([
          blogApi.getAllBlogPublishByAuthor(),
          blogApi.getAllBlogDraftByAuthor(),
          followApi.getFollowers(),
          followApi.getFollowing(),
        ]);
        setMyPublishBlog(blogPublish.data.result);
        setMyDraftBlog(blogDraft.data.result);
        setFollowers(followers.data.result);
        setFollowing(following.data.result);
      } catch (e) {
        console.log("error: ", e);
        toast.error(extractApiError(e));
      }
    };
    fetchAll();
  }, []);

  const filterPublishBlog = myPublishBlog.filter((blog) => blog != null);
  const filterDraftBlog = myDraftBlog.filter((blog) => blog != null);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const { data } = await userApi.updateMe({ fullName: form.fullName });
      setUser(data.result);
      setSaved(true);
    } catch (err) {
      toast.error(extractApiError(err));
    } finally {
      setTimeout(() => setSaved(false), 2500);
      setIsLoading(false);
    }
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarPreview(URL.createObjectURL(file));
    const errors = validationUpdateMe({ avatarUrl: file });
    if (errors.length > 0) {
      errors.forEach((e) => { toast.error(e.message); return; });
    }
    setIsLoading(true);
    try {
      const { data } = await userApi.updateMe({ avatarUrl: file });
      setUser(data.result);
    } catch (err) {
      setAvatarPreview(user?.avatarUrl);
    } finally {
      setIsLoading(false);
    }
  };

  const fmtNum = (n: number) => n >= 1000 ? `${(n / 1000).toFixed(1)}K` : String(n);

  const handleDeleteBlog = async () => {
    if (!deletingBlogId) return;
    try {
      await blogApi.deleteBlog(deletingBlogId);
      setMyPublishBlog((prev) => prev.filter((b) => b.blogId !== deletingBlogId));
      setMyDraftBlog((prev) => prev.filter((b) => b.blogId !== deletingBlogId));
      toast.success("Blog deleted successfully");
    } catch (e) {
      toast.error("Failed to delete blog");
    } finally {
      setDeletingBlogId(null);
    }
  };

  const handleUnfollow = async (id: string) => {
    try {
      await followApi.unfollow(id);
      setFollowing((prev) => prev.filter((u) => u.id !== id));
      toast.success("Unfollowed successfully");
    } catch (e) {
      toast.error(extractApiError(e));
    }
  };

  return (
    <>
      {isLoading && <LoadingSpinner />}
      <div className="overflow-auto h-full" style={{ background: "#f2fbfc" }}>
        <ProfileBanner
          user={user} avatarPreview={avatarPreview} form={form}
          followers={followers} following={following}
          myPublishBlog={myPublishBlog} myDraftBlog={myDraftBlog} fmtNum={fmtNum}
          onFollowersClick={() => setFollowModal("followers")}
          onFollowingClick={() => setFollowModal("following")}
          onAvatarChange={handleAvatarChange}
        />
        <div className="p-8">
          <div className="grid lg:grid-cols-[1fr_340px] gap-8 items-start">
            <BlogPostsList
              activeTab={activeTab} onTabChange={setActiveTab}
              filterPublishBlog={filterPublishBlog} filterDraftBlog={filterDraftBlog} fmtNum={fmtNum}
              onMarkDelete={setDeletingBlogId}
              onConfirmDelete={handleDeleteBlog}
              onCancelDelete={() => setDeletingBlogId(null)}
              onEditBlog={onEditBlog}
            />
            <ProfileSettingsForm
              form={form} saved={saved}
              onFormChange={(key, value) => setForm({ ...form, [key]: value })}
              onSave={handleSave}
            />
          </div>
        </div>
        <FollowModal
          mode={followModal} followers={followers} following={following}
          onClose={() => setFollowModal(null)} onUnfollow={handleUnfollow}
        />
      </div>
    </>
  );
}

export default ProfileContent;
