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
  LogOut,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { authApi } from "@/api/authApi";
import useAuthStore from "@/stores/authStore";
import Cookies from "js-cookie";
import { userApi } from "@/api/userApi";
import blogApi from "@/api/blogApi";
import { BlogResponse } from "@/types/blog.types";

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

function StatBox({ value, label }: { value: string; label: string }) {
  return (
    <div
      className="text-center px-6 py-3"
      style={{
        border: "3px solid rgba(255,255,255,0.4)",
        background: "rgba(255,255,255,0.08)",
      }}
    >
      <p
        className="font-black text-2xl text-white"
        style={{ fontFamily: "var(--font-display)" }}
      >
        {value}
      </p>
      <p
        className="text-xs text-white/60 uppercase tracking-widest mt-0.5"
        style={{ fontFamily: "var(--font-display)" }}
      >
        {label}
      </p>
    </div>
  );
}

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
      style={{ borderBottom: "1px solid #e5e5e5" }}
    >
      <span className="text-sm font-medium" style={{ color: "#333" }}>
        {label}
      </span>
      <button
        onClick={() => setOn(!on)}
        style={{
          width: "48px",
          height: "24px",
          background: on ? "#d32f2f" : "#e5e5e5",
          border: "3px solid #0d0d0d",
          borderRadius: 0,
          position: "relative",
          transition: "background 0.2s",
        }}
      >
        <span
          style={{
            position: "absolute",
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
interface ProfileContentProps {
  onEditBlog: (blogId: string) => void;
}
export function ProfileContent({ onEditBlog }: ProfileContentProps) {
  const [activeTab, setActiveTab] = useState<"published" | "drafts">(
    "published",
  );

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
  const navigate = useNavigate();
  const setUser = useAuthStore((state) => state.setUser);
  const setAuth = useAuthStore((state) => state.setAuth);
  const [myPublishBlog, setMyPublishBlog] = useState<BlogResponse[]>([]);
  const [myDraftBlog, setMyDraftBlog] = useState<BlogResponse[]>([]);

  const getBlogsPublish = async () => {
    try {
      const { data } = await blogApi.getAllBlogPublishByAuthor();
      console.log("blog published: ", data.result);
      setMyPublishBlog(data.result);
    } catch (e) {
      console.log("error: ", e);
    }
  };

  const getBlogsDraft = async () => {
    try {
      const { data } = await blogApi.getAllBlogDraftByAuthor();
      console.log("blogs draft: ", data.result);
      setMyDraftBlog(data.result);
    } catch (e) {
      console.log("error: ", e);
    }
  };

  useEffect(() => {
    getBlogsDraft();
    getBlogsPublish();
  }, []);

  const filterPublishBlog = myPublishBlog.filter((blog) => blog != null);
  const filterDraftBlog = myDraftBlog.filter((blog) => blog != null);

  const handleSave = async () => {
    try {
      const { data } = await userApi.updateMe({ fullName: form.fullName });
      setUser(data.result);
      setSaved(true);
    } catch (err) {
      // handle error
    } finally {
      setTimeout(() => setSaved(false), 2500);
    }
  };

  const handleLogout = () => {
    authApi.logout().catch((e) => console.log(e));

    setAuth("", null);
    Cookies.remove("accessToken");
    navigate("/login");
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setAvatarPreview(URL.createObjectURL(file)); // preview tạm ngay lập tức

    try {
      const { data } = await userApi.updateMe({ avatarUrl: file });
      setUser(data.result); // cập nhật store với avatarUrl thật từ server
    } catch (err) {
      setAvatarPreview(user?.avatarUrl); // rollback nếu lỗi
    }
  };
  const fmtNum = (n: number) =>
    n >= 1000 ? `${(n / 1000).toFixed(1)}K` : String(n);


  return (
    <div className="overflow-auto h-full" style={{ background: "#ebf4f5" }}>
      {/* Profile Banner */}
      <div
        className="relative"
        style={{ background: "#0d0d0d", borderBottom: "4px solid #d32f2f" }}
      >
        <div
          className="absolute top-0 right-0 w-32 h-32"
          style={{ background: "#d32f2f", opacity: 0.15 }}
        />
        <div className="px-8 py-8 relative z-10">
          <div className="flex flex-col lg:flex-row items-start lg:items-end gap-5">
            {/* Avatar */}
            <div className="relative shrink-0">
              <img
                src={
                  avatarPreview ||
                  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face"
                }
                alt={user?.fullName}
                className="w-24 h-24 object-cover"
                style={{
                  border: "4px solid white",
                  boxShadow: "5px 5px 0 #d32f2f",
                }}
              />
              <button
                onClick={() => fileRef.current?.click()}
                className="absolute -bottom-2 -right-2 w-7 h-7 flex items-center justify-center"
                style={{ background: "#d32f2f", border: "2px solid white" }}
                title="Change avatar"
              >
                <Camera size={12} color="white" />
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
                className="font-black text-white text-2xl mb-0.5"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {form.fullName}
              </h1>
              <p
                className="text-white/50 text-xs mb-2"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {form.email}
              </p>
              <p className="text-white/70 text-sm leading-relaxed max-w-lg mb-3">
                {/* {form.bio} */}
              </p>

              <div className="flex flex-wrap gap-2">
                <StatBox value={fmtNum(USER.followers)} label="Followers" />
                <StatBox value={String(USER.following)} label="Following" />
                <StatBox value={String(USER.posts)} label="Posts" />
              </div>
            </div>
            {/* Actions */}
            <div className="flex flex-col gap-2 shrink-0">
              <button
                className="brutal-btn-red"
                style={{ padding: "8px 16px", fontSize: "0.8rem" }}
                onClick={() =>
                  document
                    .getElementById("dash-edit-panel")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
              >
                <Edit3 size={13} /> Edit Profile
              </button>
              <button
                className="brutal-btn-secondary"
                style={{ padding: "8px 16px", fontSize: "0.8rem" }}
              >
                <Share2 size={13} /> Share
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        <div className="grid lg:grid-cols-[1fr_320px] gap-6 items-start">
          {/* LEFT — Posts */}
          <div>
            {/* Tab strip */}
            <div
              className="flex mb-5 bg-white"
              style={{
                border: "3px solid #0d0d0d",
                boxShadow: "4px 4px 0 #0d0d0d",
              }}
            >
              {(["published", "drafts"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setActiveTab(t)}
                  className="flex-1 py-2.5 text-xs font-black uppercase tracking-widest transition-colors"
                  style={{
                    fontFamily: "var(--font-display)",
                    background: activeTab === t ? "#0d0d0d" : "transparent",
                    color: activeTab === t ? "white" : "#555",
                  }}
                >
                  {t}
                  {t === "drafts" && (
                    <span
                      className="ml-1.5 text-xs px-1.5 font-black"
                      style={{ background: "#d32f2f", color: "white" }}
                    >
                      {filterDraftBlog.length}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {activeTab === "published" && (
              <div className="space-y-3">
                {filterPublishBlog.map((post) => (
                  <article
                    key={post.blogId}
                    className="bg-white flex gap-3 group transition-all"
                    style={{
                      border: "3px solid #0d0d0d",
                      boxShadow: "4px 4px 0 #0d0d0d",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translate(-2px,-2px)";
                      e.currentTarget.style.boxShadow = "6px 6px 0 #0d0d0d";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translate(0,0)";
                      e.currentTarget.style.boxShadow = "4px 4px 0 #0d0d0d";
                    }}
                    onClick={() => navigate(`/blog/${post.blogId}`)}
                  >
                    <div
                      className="shrink-0 overflow-hidden"
                      style={{ width: "120px" }}
                    >
                      <img
                        src={post.coverImageUrl}
                        alt={post.title}
                        className="w-full h-full object-cover"
                        style={{ display: "block" }}
                      />
                    </div>
                    <div className="flex-1 p-3 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="flex gap-1 flex-wrap">
                            {post.tags.map((tag, index) => (
                              <span
                                key={index}
                                className="text-xs font-black uppercase tracking-widest px-2 py-0.5 text-white"
                                style={{
                                  background: "#d32f2f",
                                  fontFamily: "var(--font-display)",
                                }}
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                          <div className="flex gap-1.5">
                            <Link
                              to={`/blog/${post.blogId}`}
                              onClick={(e) => e.stopPropagation()}
                            >
                              <button
                                title="View"
                                className="p-1.5 hover:bg-[#ebf4f5]"
                                style={{ border: "2px solid #0d0d0d" }}
                              >
                                <ExternalLink size={11} />
                              </button>
                            </Link>
                            
                          </div>
                        </div>
                        <h3
                          className="font-black text-sm leading-tight mb-1"
                          style={{ fontFamily: "var(--font-display)" }}
                        >
                          {post.title}
                        </h3>
                        <p
                          className="text-xs leading-relaxed"
                          style={{ color: "#666" }}
                        >
                          {/* {post.excerpt} */}
                        </p>
                      </div>
                      <div
                        className="flex flex-wrap items-center gap-3 pt-2 mt-1"
                        style={{ borderTop: "1px solid #f0f0f0" }}
                      >
                        <span className="text-xs" style={{ color: "#999" }}>
                          {post.createdAt} ·{/* {post.readTime}m */}
                        </span>
                        <div className="flex items-center gap-2 ml-auto">
                          <span
                            className="flex items-center gap-1 text-xs font-bold"
                            style={{ color: "#555" }}
                          >
                            <Eye size={11} />
                            {fmtNum(post.viewCount)}
                          </span>
                          <span
                            className="flex items-center gap-1 text-xs font-bold"
                            style={{ color: "#d32f2f" }}
                          >
                            <Heart size={11} />
                            {/* {fmtNum(post.likes)} */}
                          </span>
                          <span
                            className="text-xs font-bold"
                            style={{ color: "#555" }}
                          >
                            {/* 💬 {post.comments} */}
                          </span>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
                {/*    */}
              </div>
            )}

            {activeTab === "drafts" && (
              <div className="space-y-3">
                {filterDraftBlog.map((draft) => (
                  <article
                    key={draft.blogId}
                    className="bg-white flex gap-3 group transition-all"
                    style={{
                      border: "3px solid #0d0d0d",
                      boxShadow: "4px 4px 0 #0d0d0d",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translate(-2px,-2px)";
                      e.currentTarget.style.boxShadow = "6px 6px 0 #0d0d0d";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translate(0,0)";
                      e.currentTarget.style.boxShadow = "4px 4px 0 #0d0d0d";
                    }}
                  >
                    <div
                      className="shrink-0 overflow-hidden"
                      style={{ width: "120px" }}
                    >
                      <img
                        src={draft.coverImageUrl}
                        alt={draft.title}
                        className="w-full h-full object-cover"
                        style={{ display: "block" }}
                      />
                    </div>
                    <div className="flex-1 p-3 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="flex gap-1 flex-wrap">
                            {draft.tags.map((tag, index) => (
                              <span
                                key={index}
                                className="text-xs font-black uppercase tracking-widest px-2 py-0.5 text-white"
                                style={{
                                  background: "#d32f2f",
                                  fontFamily: "var(--font-display)",
                                }}
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                          <div className="flex gap-1.5">
                            
                            <button
                              title="Edit"
                              className="p-1.5 hover:bg-[#ebf4f5]"
                              style={{ border: "2px solid #0d0d0d" }}
                              onClick={(e) => {
                                e.stopPropagation();
                                onEditBlog(draft.blogId); // hoặc draft.blogId
                              }}
                            >
                              <Edit3 size={11} />
                            </button>
                          </div>
                        </div>
                        <h3
                          className="font-black text-sm leading-tight mb-1"
                          style={{ fontFamily: "var(--font-display)" }}
                        >
                          {draft.title}
                        </h3>
                        <p
                          className="text-xs leading-relaxed"
                          style={{ color: "#666" }}
                        >
                          {/* {post.excerpt} */}
                        </p>
                      </div>
                      <div
                        className="flex flex-wrap items-center gap-3 pt-2 mt-1"
                        style={{ borderTop: "1px solid #f0f0f0" }}
                      >
                        <span className="text-xs" style={{ color: "#999" }}>
                          {draft.createdAt} ·{/* {post.readTime}m */}
                        </span>
                        <div className="flex items-center gap-2 ml-auto">
                          <span
                            className="flex items-center gap-1 text-xs font-bold"
                            style={{ color: "#555" }}
                          >
                            <Eye size={11} />
                            {fmtNum(draft.viewCount)}
                          </span>
                          <span
                            className="flex items-center gap-1 text-xs font-bold"
                            style={{ color: "#d32f2f" }}
                          >
                            <Heart size={11} />
                            {/* {fmtNum(post.likes)} */}
                          </span>
                          <span
                            className="text-xs font-bold"
                            style={{ color: "#555" }}
                          >
                            {/* 💬 {post.comments} */}
                          </span>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT — Edit + Settings */}
          <div className="space-y-5" id="dash-edit-panel">
            {/* Edit Form */}
            <div
              className="bg-white p-5"
              style={{
                border: "3px solid #0d0d0d",
                boxShadow: "4px 4px 0 #0d0d0d",
              }}
            >
              <h2
                className="font-black text-base mb-4 flex items-center gap-2 pb-3"
                style={{
                  fontFamily: "var(--font-display)",
                  borderBottom: "3px solid #0d0d0d",
                }}
              >
                <Edit3 size={16} style={{ color: "#d32f2f" }} /> Edit Profile
              </h2>
              <div className="space-y-3">
                {[
                  { label: "Full Name", key: "fullName", type: "text" },
                  { label: "Email", key: "email", type: "text" },
                ].map(({ label, key, type }) => (
                  <div key={key}>
                    <label
                      className="block mb-1 text-xs font-black uppercase tracking-widest"
                      style={{ fontFamily: "var(--font-display)" }}
                    >
                      {label}
                    </label>
                    <input
                      type={type}
                      value={form[key as keyof typeof form]}
                      onChange={(e) =>
                        setForm({ ...form, [key]: e.target.value })
                      }
                      className="brutal-input"
                      disabled={
                        (key as keyof typeof form) == "email" ? true : false
                      }
                    />
                  </div>
                ))}
                <button
                  onClick={handleSave}
                  className="brutal-btn-red w-full justify-center"
                  style={{ padding: "10px" }}
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

            {/* Account Settings */}
            <div
              className="bg-white p-5"
              style={{
                border: "3px solid #0d0d0d",
                boxShadow: "4px 4px 0 #0d0d0d",
              }}
            >
              <h2
                className="font-black text-base mb-4 flex items-center gap-2 pb-3"
                style={{
                  fontFamily: "var(--font-display)",
                  borderBottom: "3px solid #0d0d0d",
                }}
              >
                <Lock size={16} style={{ color: "#d32f2f" }} /> Account Settings
              </h2>

              <div
                className="p-3 mb-4"
                style={{ background: "#ebf4f5", border: "2px solid #0d0d0d" }}
              >
                <p
                  className="text-xs font-black uppercase tracking-widest mb-2 flex items-center gap-1"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  <Bell size={12} /> Notifications
                </p>
                <BrutalToggle defaultOn label="New followers" />
                <BrutalToggle defaultOn label="Post likes" />
                <BrutalToggle defaultOn label="Comments" />
                <BrutalToggle label="Weekly digest" />
              </div>
              <div className="p-2 flex justify-center items-center">
                <button
                  className="brutal-btn-red cursor-pointer py-1.5 px-3"
                  style={{ fontFamily: "var(--font-display)" }}
                  onClick={() => handleLogout()}
                >
                  <LogOut size={12} /> Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// export default ProfileContent;
