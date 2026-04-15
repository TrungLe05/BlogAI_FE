import { useState, useRef, useEffect } from "react";
import {
  Camera,
  Edit3,
  Share2,
  Heart,
  Lock,
  Bell,
  Check,
  ExternalLink,
  Eye,
  Trash,
} from "lucide-react";
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
import { Link, useNavigate } from "react-router-dom";
import useAuthStore from "@/stores/authStore";
import { userApi } from "@/api/userApi";
import blogApi from "@/api/blogApi";
import { BlogResponse } from "@/types/blog.types";
import { toast } from "sonner";
import { validationUpdateMe } from "@/utils/userValidation";
import { User } from "@/types/auth.types";
import { extractApiError } from "@/utils/apiError";
import followApi from "@/api/followApi";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import LoadingSpinner from "../common/LoadingSpinner";

const USER = {
  name: "Sarah Chen",
  username: "@sarah_writes",
  bio: "Tech writer & AI researcher. Obsessed with the future of human-machine interaction. Writing to make complex ideas accessible.",
  location: "San Francisco, CA",
  website: "sarahchen.io",
  email: "sarah@example.com",
  avatar:
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face",
  following: 142,
  followers: 8200,
  posts: 47,
  joinedDate: "February 2023",
};

/* ── Stat Box (Profile Banner) ─────────────────────── */
// Cập nhật StatBox component
function StatBox({
  value,
  label,
  onClick,
}: {
  value: string;
  label: string;
  onClick?: () => void;
}) {
  return (
    <div
      className="text-center px-8 py-4 transition-all"
      onClick={onClick}
      style={{
        border: "3px solid rgba(255,255,255,0.3)",
        background: "rgba(255,255,255,0.06)",
        cursor: onClick ? "pointer" : "default",
      }}
      onMouseEnter={(e) => {
        if (onClick)
          e.currentTarget.style.background = "rgba(255,255,255,0.15)";
      }}
      onMouseLeave={(e) => {
        if (onClick)
          e.currentTarget.style.background = "rgba(255,255,255,0.06)";
      }}
    >
      <p
        className="font-black text-2xl text-white"
        style={{ fontFamily: "var(--font-display)" }}
      >
        {value}
      </p>
      <p
        className="text-xs text-white/50 uppercase tracking-[0.15em] mt-1"
        style={{ fontFamily: "var(--font-display)" }}
      >
        {label}
      </p>
    </div>
  );
}

/* ── Brutal Toggle Switch ──────────────────────────── */
function BrutalToggle({
  defaultOn = false,
  label,
}: {
  defaultOn?: boolean;
  label: string;
}) {
  const [on, setOn] = useState(defaultOn);
  return (
    <div
      className="flex items-center justify-between py-3"
      style={{ borderBottom: "3px solid #e7f0f1" }}
    >
      <span
        className="text-sm font-bold"
        style={{ color: "#151d1e", fontFamily: "var(--font-display)" }}
      >
        {label}
      </span>
      <button
        onClick={() => setOn(!on)}
        style={{
          width: "48px",
          height: "24px",
          background: on ? "#d32f2f" : "#dbe4e5",
          border: "3px solid #0d0d0d",
          borderRadius: 0,
          position: "relative",
          transition: "background 0.2s",
          cursor: "pointer",
        }}
      >
        <span
          style={{
            position: "absolute",
            top: "2px",
            left: on ? "22px" : "2px",
            width: "14px",
            height: "14px",
            background: "white",
            border: "2px solid #0d0d0d",
            transition: "left 0.2s",
          }}
        />
      </button>
    </div>
  );
}

/* ── ProfileContent ────────────────────────────────── */
interface ProfileContentProps {
  onEditBlog: (blogId: string) => void;
}
export function ProfileContent({ onEditBlog }: ProfileContentProps) {
  const [activeTab, setActiveTab] = useState<"published" | "drafts">(
    "published",
  );

  // ── Auth & user data (PRESERVED) ──
  const { user } = useAuthStore();

  const [form, setForm] = useState<{
    fullName: string;
    email: string;
    avatarUrl: string;
  }>({
    fullName: user?.fullName ?? "",
    email: user?.email ?? "",
    avatarUrl: user?.avatarUrl ?? "",
  });

  const [saved, setSaved] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(user?.avatarUrl);
  const fileRef = useRef<HTMLInputElement>(null);
  const setUser = useAuthStore((state) => state.setUser);

  const [myPublishBlog, setMyPublishBlog] = useState<BlogResponse[]>([]);
  const [myDraftBlog, setMyDraftBlog] = useState<BlogResponse[]>([]);

  const [followModal, setFollowModal] = useState<
    "followers" | "following" | null
  >(null);

  const [followers, setFollowers] = useState<User[]>([]);
  const [following, setFollowing] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const [deletingBlogId, setDeletingBlogId] = useState<string | null>(null);

  //API calls
  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [blogPublish, blogDraft, followers, following] =
          await Promise.all([
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
      errors.forEach((e) => {
        toast.error(e.message);
        return;
      });
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

  const fmtNum = (n: number) =>
    n >= 1000 ? `${(n / 1000).toFixed(1)}K` : String(n);

  const handleDeleteBlog = async () => {
    if (!deletingBlogId) return;
    try {
      await blogApi.deleteBlog(deletingBlogId);
      setMyPublishBlog((prev) =>
        prev.filter((b) => b.blogId !== deletingBlogId),
      );
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
        {/* ▬▬ PROFILE BANNER ▬▬ */}
        <div
          className="relative"
          style={{ background: "#0d0d0d", borderBottom: "4px solid #d32f2f" }}
        >
          {/* Decorative block */}
          <div
            className="absolute top-0 right-0 w-40 h-40"
            style={{ background: "#d32f2f", opacity: 0.08 }}
          />
          <div className="px-10 py-10 relative z-10">
            <div className="flex flex-col lg:flex-row items-start lg:items-end gap-8">
              {/* Avatar */}
              <div className="relative shrink-0">
                <img
                  src={
                    avatarPreview ||
                    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face"
                  }
                  alt={user?.fullName}
                  className="w-28 h-28 object-cover"
                  style={{
                    border: "4px solid white",
                    boxShadow: "6px 6px 0 #d32f2f",
                  }}
                />
                <button
                  onClick={() => fileRef.current?.click()}
                  className="absolute -bottom-2 -right-2 w-8 h-8 flex items-center justify-center"
                  style={{
                    background: "#d32f2f",
                    border: "3px solid white",
                    cursor: "pointer",
                  }}
                  title="Change avatar"
                >
                  <Camera size={13} color="white" />
                </button>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarChange}
                />
              </div>
              {/* Identity */}
              <div className="flex-1">
                <h1
                  className="font-black text-white text-3xl mb-1"
                  style={{
                    fontFamily: "var(--font-display)",
                    letterSpacing: "-0.02em",
                  }}
                >
                  {form.fullName}
                </h1>
                <p
                  className="text-white/40 text-xs uppercase tracking-[0.15em] mb-4"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {form.email}
                </p>
                <div className="flex flex-wrap gap-3">
                  <StatBox
                    value={fmtNum(followers.length)}
                    label="Followers"
                    onClick={() => setFollowModal("followers")}
                  />
                  <StatBox
                    value={String(following.length)}
                    label="Following"
                    onClick={() => setFollowModal("following")}
                  />
                  <StatBox
                    value={String(myPublishBlog.length + myDraftBlog.length)}
                    label="Posts"
                  />
                </div>
              </div>
              {/* Actions */}
              <div className="flex flex-col gap-3 shrink-0">
                <button
                  className="flex items-center gap-2 px-5 py-2.5 text-xs font-black uppercase tracking-widest transition-all cursor-pointer"
                  style={{
                    fontFamily: "var(--font-display)",
                    background: "#d32f2f",
                    color: "white",
                    border: "3px solid #0d0d0d",
                    boxShadow: "4px 4px 0 rgba(255,255,255,0.2)",
                  }}
                  onClick={() =>
                    document
                      .getElementById("dash-edit-panel")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translate(-2px,-2px)";
                    e.currentTarget.style.boxShadow =
                      "6px 6px 0 rgba(255,255,255,0.3)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translate(0,0)";
                    e.currentTarget.style.boxShadow =
                      "4px 4px 0 rgba(255,255,255,0.2)";
                  }}
                >
                  <Edit3 size={13} /> Edit Profile
                </button>
                <button
                  className="flex items-center gap-2 px-5 py-2.5 text-xs font-black uppercase tracking-widest transition-all cursor-pointer"
                  style={{
                    fontFamily: "var(--font-display)",
                    background: "transparent",
                    color: "white",
                    border: "3px solid rgba(255,255,255,0.3)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "white";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.3)";
                  }}
                >
                  <Share2 size={13} /> Share
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ▬▬ CONTENT AREA ▬▬ */}
        <div className="p-8">
          <div className="grid lg:grid-cols-[1fr_340px] gap-8 items-start">
            {/* ── LEFT — Posts ── */}
            <div>
              {/* Tab strip */}
              <div
                className="flex mb-6 bg-white"
                style={{
                  border: "3px solid #0d0d0d",
                  boxShadow: "4px 4px 0 #0d0d0d",
                }}
              >
                {(["published", "drafts"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setActiveTab(t)}
                    className="flex-1 py-3 text-xs font-black uppercase tracking-[0.15em] transition-colors cursor-pointer"
                    style={{
                      fontFamily: "var(--font-display)",
                      background: activeTab === t ? "#0d0d0d" : "transparent",
                      color: activeTab === t ? "white" : "#5b403d",
                      borderRight:
                        t === "published" ? "3px solid #0d0d0d" : "none",
                    }}
                  >
                    {t}
                    {t === "drafts" && (
                      <span
                        className="ml-2 text-xs px-2 py-0.5 font-black"
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
                    <article
                      key={post.blogId}
                      className="bg-white flex gap-0 group transition-all cursor-pointer"
                      style={{
                        border: "3px solid #0d0d0d",
                        boxShadow: "4px 4px 0 #0d0d0d",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform =
                          "translate(-4px,-4px)";
                        e.currentTarget.style.boxShadow = "8px 8px 0 #0d0d0d";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "translate(0,0)";
                        e.currentTarget.style.boxShadow = "4px 4px 0 #0d0d0d";
                      }}
                      // onClick={() => navigate(`/blog/${post.blogId}`)}
                    >
                      <div
                        className="shrink-0 overflow-hidden"
                        style={{
                          width: "140px",
                          borderRight: "3px solid #0d0d0d",
                        }}
                      >
                        <img
                          src={post.coverImageUrl}
                          alt={post.title}
                          className="w-full h-full object-cover"
                          style={{ display: "block", minHeight: "120px" }}
                        />
                      </div>
                      <div className="flex-1 p-5 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex gap-1.5 flex-wrap">
                              {post.tags.map((tag, index) => (
                                <span
                                  key={index}
                                  className="text-xs font-black uppercase tracking-widest px-2.5 py-1 text-white"
                                  style={{
                                    background: "#d32f2f",
                                    fontFamily: "var(--font-display)",
                                  }}
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                            <div className="flex gap-2">
                              <AlertDialog>
                                <AlertDialogTrigger>
                                  <button
                                    title="Delete"
                                    className="p-2 hover:bg-[#d32f2f] hover:text-white transition-colors cursor-pointer"
                                    style={{ border: "3px solid #0d0d0d" }}
                                    onClick={() =>
                                      setDeletingBlogId(post.blogId)
                                    }
                                  >
                                    <Trash size={12} />
                                  </button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>
                                      Delete this blog?
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                      This action cannot be undone. The blog and
                                      all its content will be permanently
                                      deleted.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel
                                      onClick={() => setDeletingBlogId(null)}
                                    >
                                      Cancel
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={handleDeleteBlog}
                                      className="bg-destructive text-white hover:bg-destructive/90"
                                    >
                                      Delete
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                              <Link
                                to={`/blog/${post.blogId}`}
                                onClick={(e) => e.stopPropagation()}
                              >
                                <button
                                  title="View"
                                  className="p-2 hover:bg-[#0d0d0d] hover:text-white transition-colors cursor-pointer"
                                  style={{ border: "3px solid #0d0d0d" }}
                                >
                                  <ExternalLink size={12} />
                                </button>
                              </Link>
                            </div>
                          </div>
                          <h3
                            className="font-black text-base leading-tight mb-2"
                            style={{
                              fontFamily: "var(--font-display)",
                              color: "#151d1e",
                            }}
                          >
                            {post.title}
                          </h3>
                          <h5
                            className="font-thin text-sm leading-tight mb-2"
                            style={{
                              fontFamily: "var(--font-display)",
                              color: "rgb(102, 102, 102)",
                            }}
                          >
                            {post.summary}
                          </h5>
                        </div>
                        <div
                          className="flex flex-wrap items-center gap-4 pt-3 mt-2"
                          style={{ borderTop: "3px solid #e7f0f1" }}
                        >
                          <span
                            className="text-xs font-bold"
                            style={{
                              color: "#8f6f6c",
                              fontFamily: "var(--font-display)",
                            }}
                          >
                            {post.createdAt}
                          </span>
                          <div className="flex items-center gap-3 ml-auto">
                            <span
                              className="flex items-center gap-1.5 text-xs font-black"
                              style={{
                                color: "#151d1e",
                                fontFamily: "var(--font-display)",
                              }}
                            >
                              <Eye size={12} />
                              {fmtNum(post.viewCount)}
                            </span>
                            <span
                              className="flex items-center gap-1.5 text-xs font-black"
                              style={{
                                color: "#d32f2f",
                                fontFamily: "var(--font-display)",
                              }}
                            >
                              <Heart size={12} />
                            </span>
                          </div>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}

              {/* Draft Posts */}
              {activeTab === "drafts" && (
                <div className="space-y-4">
                  {filterDraftBlog.map((draft) => (
                    <article
                      key={draft.blogId}
                      className="bg-white flex gap-0 group transition-all"
                      style={{
                        border: "3px solid #0d0d0d",
                        boxShadow: "4px 4px 0 #0d0d0d",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform =
                          "translate(-4px,-4px)";
                        e.currentTarget.style.boxShadow = "8px 8px 0 #0d0d0d";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "translate(0,0)";
                        e.currentTarget.style.boxShadow = "4px 4px 0 #0d0d0d";
                      }}
                    >
                      <div
                        className="shrink-0 overflow-hidden"
                        style={{
                          width: "140px",
                          borderRight: "3px solid #0d0d0d",
                        }}
                      >
                        <img
                          src={draft.coverImageUrl}
                          alt={draft.title}
                          className="w-full h-full object-cover"
                          style={{ display: "block", minHeight: "120px" }}
                        />
                      </div>
                      <div className="flex-1 p-5 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex gap-1.5 flex-wrap">
                              {draft.tags.map((tag, index) => (
                                <span
                                  key={index}
                                  className="text-xs font-black uppercase tracking-widest px-2.5 py-1 text-white"
                                  style={{
                                    background: "#d32f2f",
                                    fontFamily: "var(--font-display)",
                                  }}
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                            <div className="flex gap-2">
                              <AlertDialog>
                                <AlertDialogTrigger>
                                  <button
                                    title="Delete"
                                    className="p-2 hover:bg-[#d32f2f] hover:text-white transition-colors cursor-pointer"
                                    style={{ border: "3px solid #0d0d0d" }}
                                    onClick={() =>
                                      setDeletingBlogId(draft.blogId)
                                    }
                                  >
                                    <Trash size={12} />
                                  </button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>
                                      Delete this blog?
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                      This action cannot be undone. The blog and
                                      all its content will be permanently
                                      deleted.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel
                                      onClick={() => setDeletingBlogId(null)}
                                    >
                                      Cancel
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={handleDeleteBlog}
                                      className="bg-destructive text-white hover:bg-destructive/90"
                                    >
                                      Delete
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                              <button
                                title="Edit"
                                className="p-2 hover:bg-[#0d0d0d] hover:text-white transition-colors cursor-pointer"
                                style={{ border: "3px solid #0d0d0d" }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onEditBlog(draft.blogId);
                                }}
                              >
                                <Edit3 size={12} />
                              </button>
                            </div>
                          </div>
                          <h3
                            className="font-black text-base leading-tight mb-2"
                            style={{
                              fontFamily: "var(--font-display)",
                              color: "#151d1e",
                            }}
                          >
                            {draft.title}
                          </h3>
                          <h5
                            className="font-thin text-sm leading-tight mb-2"
                            style={{
                              fontFamily: "var(--font-display)",
                              color: "rgb(102, 102, 102)",
                            }}
                          >
                            {draft.summary}
                          </h5>
                        </div>
                        <div
                          className="flex flex-wrap items-center gap-4 pt-3 mt-2"
                          style={{ borderTop: "3px solid #e7f0f1" }}
                        >
                          <span
                            className="text-xs font-bold"
                            style={{
                              color: "#8f6f6c",
                              fontFamily: "var(--font-display)",
                            }}
                          >
                            {draft.createdAt}
                          </span>
                          <div className="flex items-center gap-3 ml-auto">
                            <span
                              className="flex items-center gap-1.5 text-xs font-black"
                              style={{
                                color: "#151d1e",
                                fontFamily: "var(--font-display)",
                              }}
                            >
                              <Eye size={12} />
                              {fmtNum(draft.viewCount)}
                            </span>
                            <span
                              className="flex items-center gap-1.5 text-xs font-black"
                              style={{
                                color: "#d32f2f",
                                fontFamily: "var(--font-display)",
                              }}
                            >
                              <Heart size={12} />
                            </span>
                          </div>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>

            {/* ── RIGHT — Quick Actions + Edit + Settings ── */}
            <div className="space-y-6" id="dash-edit-panel">
              {/* Profile Settings Form */}
              <div
                className="bg-white p-6"
                style={{
                  border: "3px solid #0d0d0d",
                  boxShadow: "4px 4px 0 #0d0d0d",
                }}
              >
                <h2
                  className="font-black text-sm uppercase tracking-widest mb-5 flex items-center gap-2 pb-4"
                  style={{
                    fontFamily: "var(--font-display)",
                    borderBottom: "3px solid #0d0d0d",
                    color: "#151d1e",
                  }}
                >
                  <Edit3 size={16} style={{ color: "#d32f2f" }} /> Profile
                  Settings
                </h2>
                <div className="space-y-4">
                  {[
                    { label: "Display Name", key: "fullName", type: "text" },
                    { label: "Email", key: "email", type: "text" },
                  ].map(({ label, key, type }) => (
                    <div key={key}>
                      <label
                        className="block mb-2 text-xs font-black uppercase tracking-[0.15em]"
                        style={{
                          fontFamily: "var(--font-display)",
                          color: "#5b403d",
                        }}
                      >
                        {label}
                      </label>
                      <input
                        type={type}
                        value={form[key as keyof typeof form]}
                        onChange={(e) =>
                          setForm({ ...form, [key]: e.target.value })
                        }
                        className="w-full px-4 py-3 text-sm outline-none transition-all"
                        style={{
                          border: "3px solid #0d0d0d",
                          background: "#ffffff",
                          fontFamily: "var(--font-sans)",
                          color: "#151d1e",
                        }}
                        onFocus={(e) => {
                          e.currentTarget.style.background = "#e1eaeb";
                          e.currentTarget.style.boxShadow = "4px 4px 0 #0d0d0d";
                        }}
                        onBlur={(e) => {
                          e.currentTarget.style.background = "#ffffff";
                          e.currentTarget.style.boxShadow = "none";
                        }}
                        disabled={
                          (key as keyof typeof form) == "email" ? true : false
                        }
                      />
                    </div>
                  ))}
                  <button
                    onClick={handleSave}
                    className="w-full flex items-center justify-center gap-2 py-3 text-xs font-black uppercase tracking-widest transition-all cursor-pointer"
                    style={{
                      fontFamily: "var(--font-display)",
                      background: "#af101a",
                      color: "white",
                      border: "3px solid #0d0d0d",
                      boxShadow: "4px 4px 0 #0d0d0d",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translate(-4px,-4px)";
                      e.currentTarget.style.boxShadow = "8px 8px 0 #0d0d0d";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translate(0,0)";
                      e.currentTarget.style.boxShadow = "4px 4px 0 #0d0d0d";
                    }}
                  >
                    {saved ? (
                      <>
                        <Check size={14} /> Saved!
                      </>
                    ) : (
                      "Save Changes"
                    )}
                  </button>
                </div>
              </div>

              {/* Account Section */}
              <div
                className="bg-white p-6"
                style={{
                  border: "3px solid #0d0d0d",
                  boxShadow: "4px 4px 0 #0d0d0d",
                }}
              >
                <h2
                  className="font-black text-sm uppercase widest mb-5 flex items-center gap-2 pb-4"
                  style={{
                    fontFamily: "var(--font-display)",
                    borderBottom: "3px solid #0d0d0d",
                    color: "#151d1e",
                  }}
                >
                  <Lock size={16} style={{ color: "#d32f2f" }} /> Account
                </h2>

                <div
                  className="p-4 mb-5"
                  style={{ background: "#ecf5f6", border: "3px solid #0d0d0d" }}
                >
                  <p
                    className="text-xs font-black uppercase tracking-[0.15em] mb-3 flex items-center gap-2"
                    style={{
                      fontFamily: "var(--font-display)",
                      color: "#151d1e",
                    }}
                  >
                    <Bell size={13} /> Preferences
                  </p>
                  <BrutalToggle defaultOn label="Email Notifications" />
                  <BrutalToggle defaultOn label="Post Likes" />
                  <BrutalToggle defaultOn label="Comments" />
                  <BrutalToggle label="Weekly Digest" />
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Đặt cuối return, trước closing div */}
        <Dialog
          open={followModal !== null}
          onOpenChange={() => setFollowModal(null)}
        >
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle
                className="font-black uppercase tracking-widest"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {followModal === "followers" ? "Followers" : "Following"}
              </DialogTitle>
            </DialogHeader>

            <div className="flex flex-col gap-3 max-h-96 overflow-y-auto py-2">
              {(followModal === "followers" ? followers : following).length ===
              0 ? (
                <p
                  className="text-center py-8 text-sm"
                  style={{ color: "#888" }}
                >
                  {followModal === "followers"
                    ? "No followers yet"
                    : "Not following anyone yet"}
                </p>
              ) : (
                (followModal === "followers" ? followers : following).map(
                  (u) => (
                    <div
                      key={u.id}
                      className="flex items-center gap-3 p-3 transition-colors"
                      style={{ border: "2px solid #0d0d0d" }}
                    >
                      <img
                        src={
                          u.avatarUrl ||
                          `https://ui-avatars.com/api/?name=${encodeURIComponent(u.fullName)}&background=d32f2f&color=fff`
                        }
                        alt={u.fullName}
                        className="w-10 h-10 object-cover shrink-0"
                        style={{ border: "2px solid #0d0d0d" }}
                      />
                      <div className="flex-1 min-w-0">
                        <p
                          className="font-black text-sm truncate"
                          style={{ fontFamily: "var(--font-display)" }}
                        >
                          {u.fullName}
                        </p>
                        <p
                          className="text-xs truncate"
                          style={{ color: "#888" }}
                        >
                          {u.email}
                        </p>
                      </div>

                      {followModal === "following" && (
                        <button
                          className="px-3 py-1.5 text-xs font-black uppercase tracking-widest transition-all cursor-pointer"
                          style={{
                            fontFamily: "var(--font-display)",
                            background: "white",
                            color: "#0d0d0d",
                            border: "2px solid #0d0d0d",
                            boxShadow: "2px 2px 0 #0d0d0d",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = "#d32f2f";
                            e.currentTarget.style.color = "white";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = "white";
                            e.currentTarget.style.color = "#0d0d0d";
                          }}
                          onClick={() => handleUnfollow(u.id)}
                        >
                          Unfollow
                        </button>
                      )}
                    </div>
                  ),
                )
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}

// export default ProfileContent;
