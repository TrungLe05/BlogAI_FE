import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import {
  Camera, MapPin, Globe, Edit3, Share2, FileText,
  Heart, Trash2, Check, ExternalLink,
  BookOpen, Eye, Settings, BarChart2, Zap, ArrowRight
} from "lucide-react";

/* ── Mock Data ────────────────────────────────────────────── */

const USER = {
  name: "Sarah Chen",
  username: "@sarah_writes",
  bio: "Tech writer & AI researcher. Obsessed with the future of human-machine interaction. Writing to make complex ideas accessible.",
  location: "San Francisco, CA",
  website: "sarahchen.io",
  email: "sarah@example.com",
  avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face",
  following: 142,
  followers: 8200,
  posts: 47,
  joinedDate: "February 2023",
};

const MY_POSTS = [
  {
    id: 1,
    category: "Tech",
    title: "The Art of Storytelling in the Age of AI",
    excerpt: "What makes human-crafted stories irreplaceable even as artificial intelligence becomes an increasingly capable writing tool...",
    imageUrl: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=300&h=200&fit=crop",
    date: "Mar 20, 2025",
    readTime: 8,
    views: 12400,
    likes: 892,
    comments: 34,
    status: "published",
  },
  {
    id: 2,
    category: "Machine Learning",
    title: "How I Built a Custom AI Writing Assistant in a Weekend",
    excerpt: "A step-by-step breakdown of using the Gemini API to build a writing tool that understands your personal style...",
    imageUrl: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=300&h=200&fit=crop",
    date: "Mar 12, 2025",
    readTime: 12,
    views: 9800,
    likes: 734,
    comments: 51,
    status: "published",
  },
  {
    id: 3,
    category: "Personal",
    title: "Year Two of Full-Time Writing: What Nobody Tells You",
    excerpt: "After 24 months of writing online for a living, here's the unfiltered truth about the creative life...",
    imageUrl: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=300&h=200&fit=crop",
    date: "Feb 28, 2025",
    readTime: 9,
    views: 7200,
    likes: 541,
    comments: 28,
    status: "published",
  },
];

const DRAFTS = [
  {
    id: 4,
    title: "The Psychology of Productivity (Work in Progress)",
    excerpt: "Exploring why some productivity systems work and others fail spectacularly...",
    lastEdited: "2 days ago",
    wordCount: 1240,
    status: "draft",
  },
];

/* ── stat pill component ─────────────────────────────────── */
function StatBox({ value, label }: { value: string; label: string }) {
  return (
    <div
      className="text-center px-6 py-3"
      style={{ border: "3px solid rgba(255,255,255,0.4)", background: "rgba(255,255,255,0.08)" }}
    >
      <p className="font-black text-2xl text-white" style={{ fontFamily: "var(--font-display)" }}>
        {value}
      </p>
      <p className="text-xs text-white/60 uppercase tracking-widest mt-0.5" style={{ fontFamily: "var(--font-display)" }}>
        {label}
      </p>
    </div>
  );
}



/* ── Profile Page ─────────────────────────────────────────── */
function ProfilePage() {
  const [activeTab, setActiveTab] = useState<"published" | "drafts" | "scheduled">("published");
  const [form, setForm] = useState({
    name: USER.name,
    username: "sarah_writes",
    bio: USER.bio,
    website: USER.website,
    location: USER.location,
  });
  const [saved, setSaved] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(USER.avatar);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) setAvatarPreview(URL.createObjectURL(f));
  };

  const fmtNum = (n: number) =>
    n >= 1000 ? `${(n / 1000).toFixed(1)}K` : String(n);

  return (
    <div style={{ background: "#ebf4f5", minHeight: "100vh", fontFamily: "var(--font-sans)" }}>

      {/* ── Profile Banner ───────────────────────────────── */}
      <div
        className="relative"
        style={{ background: "#0d0d0d", borderBottom: "4px solid #d32f2f" }}
      >
        {/* Decorative corner accent */}
        <div className="absolute top-0 right-0 w-32 h-32" style={{ background: "#d32f2f", opacity: 0.15 }} />
        <div className="absolute bottom-0 left-0 w-20 h-20" style={{ background: "#d32f2f", opacity: 0.1 }} />

        <div className="max-w-340 mx-auto px-6 py-10 relative z-10">
          <div className="flex flex-col lg:flex-row items-start lg:items-end gap-6">

            {/* Avatar */}
            <div className="relative shrink-0">
              <img
                src={avatarPreview}
                alt={USER.name}
                className="w-28 h-28 object-cover"
                style={{ border: "4px solid white", boxShadow: "6px 6px 0 #d32f2f" }}
              />
              <button
                onClick={() => fileRef.current?.click()}
                className="absolute -bottom-2 -right-2 w-8 h-8 flex items-center justify-center"
                style={{ background: "#d32f2f", border: "2px solid white" }}
                title="Change avatar"
              >
                <Camera size={14} color="white" />
              </button>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
            </div>

            {/* Identity */}
            <div className="flex-1">
              <h1
                className="font-black text-white mb-1"
                style={{ fontFamily: "var(--font-display)", fontSize: "clamp(24px, 3vw, 36px)" }}
              >
                {form.name}
              </h1>
              <p className="text-white/50 text-sm mb-2" style={{ fontFamily: "var(--font-display)" }}>
                {form.username}
              </p>
              <p className="text-white/70 text-sm leading-relaxed max-w-xl mb-4">
                {form.bio}
              </p>
              <div className="flex flex-wrap items-center gap-3 text-white/50 text-xs mb-4">
                {form.location && (
                  <span className="flex items-center gap-1"><MapPin size={12} />{form.location}</span>
                )}
                {form.website && (
                  <a
                    href={`https://${form.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 hover:text-[#d32f2f] transition-colors"
                  >
                    <Globe size={12} />{form.website}
                  </a>
                )}
                <span className="flex items-center gap-1"><BookOpen size={12} />Joined {USER.joinedDate}</span>
              </div>

              {/* Stats row */}
              <div className="flex flex-wrap gap-2">
                <StatBox value={fmtNum(USER.followers)} label="Followers" />
                <StatBox value={String(USER.following)} label="Following" />
                <StatBox value={String(USER.posts)} label="Posts" />
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-3 shrink-0">
              <button
                className="brutal-btn-red"
                style={{ padding: "10px 20px" }}
                onClick={() => document.getElementById("edit-profile-panel")?.scrollIntoView({ behavior: "smooth" })}
              >
                <Edit3 size={15} />
                Edit Profile
              </button>
              <button className="brutal-btn-secondary" style={{ padding: "10px 20px" }}>
                <Share2 size={15} />
                Share Profile
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Main Content ─────────────────────────────────── */}
      <div className="max-w-340 mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-[1fr_360px] gap-8 items-start">

          {/* LEFT — Posts ──────────────────────────────────── */}
          <div>
            {/* Tab strip */}
            <div
              className="flex mb-6 bg-white"
              style={{ border: "3px solid #0d0d0d", boxShadow: "4px 4px 0 #0d0d0d" }}
            >
              {(["published", "drafts", "scheduled"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setActiveTab(t)}
                  className="flex-1 py-3 text-sm font-black uppercase tracking-widest transition-colors relative"
                  style={{
                    fontFamily: "var(--font-display)",
                    background: activeTab === t ? "#0d0d0d" : "transparent",
                    color: activeTab === t ? "white" : "#555",
                    borderRight: t !== "scheduled" ? "2px solid #0d0d0d" : "none",
                  }}
                >
                  {t}
                  {t === "drafts" && (
                    <span
                      className="ml-2 text-xs px-1.5 font-black"
                      style={{ background: "#d32f2f", color: "white", fontFamily: "var(--font-display)" }}
                    >
                      {DRAFTS.length}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Published Posts */}
            {activeTab === "published" && (
              <div className="space-y-4">
                {MY_POSTS.map((post) => (
                  <article
                    key={post.id}
                    className="bg-white flex gap-4 group"
                    style={{
                      border: "3px solid #0d0d0d",
                      boxShadow: "4px 4px 0 #0d0d0d",
                      transition: "transform 0.15s, box-shadow 0.15s",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget).style.transform = "translate(-2px,-2px)";
                      (e.currentTarget).style.boxShadow = "6px 6px 0 #0d0d0d";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget).style.transform = "translate(0,0)";
                      (e.currentTarget).style.boxShadow = "4px 4px 0 #0d0d0d";
                    }}
                  >
                    {/* Thumbnail */}
                    <div className="shrink-0 overflow-hidden" style={{ width: "140px" }}>
                      <img
                        src={post.imageUrl}
                        alt={post.title}
                        className="w-full h-full object-cover"
                        style={{ minHeight: "100%", display: "block" }}
                      />
                    </div>

                    {/* Content */}
                    <div className="flex-1 p-4 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span
                            className="text-xs font-black uppercase tracking-widest px-2 py-0.5 text-white"
                            style={{ background: "#d32f2f", fontFamily: "var(--font-display)" }}
                          >
                            {post.category}
                          </span>
                          <div className="flex gap-2">
                            <Link to={`/blog/${post.id}`}>
                              <button title="View post" className="p-1.5 hover:bg-[#ebf4f5]" style={{ border: "2px solid #0d0d0d" }}>
                                <ExternalLink size={13} />
                              </button>
                            </Link>
                            <Link to="/dashboard">
                              <button title="Edit post" className="p-1.5 hover:bg-[#ebf4f5]" style={{ border: "2px solid #0d0d0d" }}>
                                <Edit3 size={13} />
                              </button>
                            </Link>
                          </div>
                        </div>
                        <h3
                          className="font-black text-base leading-tight mb-2"
                          style={{ fontFamily: "var(--font-display)", color: "#0d0d0d" }}
                        >
                          {post.title}
                        </h3>
                        <p className="text-xs leading-relaxed" style={{ color: "#666" }}>
                          {post.excerpt}
                        </p>
                      </div>
                      <div
                        className="flex flex-wrap items-center gap-4 pt-3 mt-2"
                        style={{ borderTop: "2px solid #f0f0f0" }}
                      >
                        <span className="text-xs" style={{ color: "#999" }}>{post.date} · {post.readTime} min</span>
                        <div className="flex items-center gap-3 ml-auto">
                          <span className="flex items-center gap-1 text-xs font-bold" style={{ color: "#555" }}>
                            <Eye size={12} />{fmtNum(post.views)}
                          </span>
                          <span className="flex items-center gap-1 text-xs font-bold" style={{ color: "#d32f2f" }}>
                            <Heart size={12} />{fmtNum(post.likes)}
                          </span>
                          <span className="flex items-center gap-1 text-xs font-bold" style={{ color: "#555" }}>
                            💬 {post.comments}
                          </span>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
                <button
                  className="brutal-btn-primary w-full justify-center"
                  style={{ padding: "12px 24px" }}
                >
                  Load More Posts
                </button>
              </div>
            )}

            {/* Drafts */}
            {activeTab === "drafts" && (
              <div className="space-y-4">
                {DRAFTS.map((draft) => (
                  <article
                    key={draft.id}
                    className="bg-white p-5"
                    style={{ border: "3px solid #0d0d0d", boxShadow: "4px 4px 0 #0d0d0d" }}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <span
                          className="text-xs font-black uppercase tracking-widest px-2 py-0.5 mb-2 inline-block"
                          style={{ background: "#f0f0f0", color: "#666", border: "2px solid #ccc", fontFamily: "var(--font-display)" }}
                        >
                          Draft
                        </span>
                        <h3 className="font-black text-base" style={{ fontFamily: "var(--font-display)" }}>
                          {draft.title}
                        </h3>
                        <p className="text-xs mt-1" style={{ color: "#888" }}>
                          Last edited {draft.lastEdited} · {draft.wordCount} words
                        </p>
                      </div>
                      <div className="flex gap-2 shrink-0 ml-4">
                        <Link to="/dashboard">
                          <button className="brutal-btn-primary text-xs" style={{ padding: "8px 14px" }}>
                            <Edit3 size={12} /> Continue
                          </button>
                        </Link>
                        <button
                          className="p-2"
                          style={{ border: "3px solid #d32f2f", color: "#d32f2f", background: "white" }}
                          title="Delete draft"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                    <p className="text-sm" style={{ color: "#666" }}>{draft.excerpt}</p>
                  </article>
                ))}
              </div>
            )}

            {/* Scheduled placeholder */}
            {activeTab === "scheduled" && (
              <div
                className="text-center py-16 bg-white"
                style={{ border: "3px solid #0d0d0d", boxShadow: "4px 4px 0 #0d0d0d" }}
              >
                <p className="text-5xl mb-4">📅</p>
                <h3 className="font-black text-xl mb-2" style={{ fontFamily: "var(--font-display)" }}>No Scheduled Posts</h3>
                <p className="text-sm mb-6" style={{ color: "#888" }}>
                  Schedule posts from the Dashboard → Settings tab.
                </p>
                <Link to="/dashboard">
                  <button className="brutal-btn-red" style={{ padding: "12px 24px" }}>
                    Write a New Post
                  </button>
                </Link>
              </div>
            )}
          </div>

          {/* RIGHT — Edit Panel & Static Sidebar ────────────── */}
          <div className="space-y-6" id="edit-profile-panel">

            {/* Edit Profile Form */}
            <div
              className="bg-white p-6"
              style={{ border: "3px solid #0d0d0d", boxShadow: "4px 4px 0 #0d0d0d" }}
            >
              <h2
                className="font-black text-lg mb-5 flex items-center gap-2"
                style={{ fontFamily: "var(--font-display)", borderBottom: "3px solid #0d0d0d", paddingBottom: "12px" }}
              >
                <Edit3 size={18} style={{ color: "#d32f2f" }} />
                Edit Profile
              </h2>

              <div className="space-y-4">
                {[
                  { label: "Display Name", key: "name", type: "text", placeholder: "Your full name" },
                  { label: "Username", key: "username", type: "text", placeholder: "username (no @)" },
                  { label: "Website", key: "website", type: "url", placeholder: "yoursite.com" },
                  { label: "Location", key: "location", type: "text", placeholder: "City, Country" },
                ].map(({ label, key, type, placeholder }) => (
                  <div key={key}>
                    <label
                      className="block mb-1.5 text-xs font-black uppercase tracking-widest"
                      style={{ fontFamily: "var(--font-display)" }}
                    >
                      {label}
                    </label>
                    <input
                      type={type}
                      value={form[key as keyof typeof form]}
                      onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                      placeholder={placeholder}
                      className="brutal-input"
                    />
                  </div>
                ))}

                <div>
                  <label
                    className="block mb-1.5 text-xs font-black uppercase tracking-widest"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    Bio
                  </label>
                  <textarea
                    value={form.bio}
                    onChange={(e) => setForm({ ...form, bio: e.target.value })}
                    rows={3}
                    placeholder="Tell readers about yourself..."
                    className="brutal-input resize-none"
                  />
                  <p className="text-xs mt-1" style={{ color: "#aaa" }}>
                    {form.bio.length}/160 characters
                  </p>
                </div>

                <button
                  onClick={handleSave}
                  className="brutal-btn-red w-full justify-center"
                  style={{ padding: "12px", fontSize: "0.95rem" }}
                >
                  {saved ? (
                    <><Check size={16} /> Saved!</>
                  ) : (
                    "Save Changes"
                  )}
                </button>
              </div>
            </div>

            {/* ── Settings CTA ── */}
            <div
              style={{
                background: "#af101a",
                border: "3px solid #0d0d0d",
                boxShadow: "4px 4px 0 #0d0d0d",
                padding: "20px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
                <div style={{ background: "rgba(255,255,255,0.2)", border: "2px solid rgba(255,255,255,0.4)", width: "32px", height: "32px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Settings size={16} color="white" />
                </div>
                <p style={{ fontFamily: "var(--font-display)", fontWeight: 900, fontSize: "0.9rem", color: "#fff", margin: 0 }}>Account Settings</p>
              </div>
              <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.78rem", color: "rgba(255,255,255,0.75)", marginBottom: "14px" }}>
                Manage password, notifications, appearance &amp; security.
              </p>
              <Link to="/settings">
                <button
                  style={{
                    width: "100%",
                    padding: "10px 16px",
                    fontFamily: "var(--font-display)",
                    fontWeight: 900,
                    fontSize: "0.78rem",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "#af101a",
                    background: "#ffffff",
                    border: "3px solid #0d0d0d",
                    boxShadow: "3px 3px 0 #0d0d0d",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "6px",
                  }}
                >
                  <ArrowRight size={14} /> Go to Settings
                </button>
              </Link>
            </div>

            {/* ── Writing Stats Card ── */}
            <div
              style={{
                background: "#ffffff",
                border: "3px solid #0d0d0d",
                boxShadow: "4px 4px 0 #0d0d0d",
                overflow: "hidden",
              }}
            >
              <div style={{ background: "#0d0d0d", padding: "12px 16px", borderBottom: "3px solid #0d0d0d" }}>
                <p style={{ fontFamily: "var(--font-display)", fontWeight: 900, fontSize: "0.7rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.7)", margin: 0, display: "flex", alignItems: "center", gap: "6px" }}>
                  <BarChart2 size={12} /> Writing Statistics
                </p>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", borderBottom: "2px solid #e7f0f1" }}>
                {[
                  { label: "Total Posts", value: String(MY_POSTS.length), icon: <FileText size={14} /> },
                  { label: "Total Views", value: fmtNum(MY_POSTS.reduce((s, p) => s + p.views, 0)), icon: <Eye size={14} /> },
                  { label: "Total Likes", value: fmtNum(MY_POSTS.reduce((s, p) => s + p.likes, 0)), icon: <Heart size={14} /> },
                  { label: "Comments", value: String(MY_POSTS.reduce((s, p) => s + p.comments, 0)), icon: <BookOpen size={14} /> },
                ].map((stat, i) => (
                  <div
                    key={stat.label}
                    style={{
                      padding: "14px 16px",
                      borderRight: i % 2 === 0 ? "2px solid #e7f0f1" : "none",
                      borderBottom: i < 2 ? "2px solid #e7f0f1" : "none",
                    }}
                  >
                    <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "0.6rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "#5b403d", margin: "0 0 4px 0", display: "flex", alignItems: "center", gap: "4px" }}>
                      {stat.icon} {stat.label}
                    </p>
                    <p style={{ fontFamily: "var(--font-display)", fontWeight: 900, fontSize: "1.3rem", color: "#0d0d0d", margin: 0 }}>
                      {stat.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Quick Actions ── */}
            <div
              style={{
                background: "#0d0d0d",
                border: "3px solid #0d0d0d",
                boxShadow: "4px 4px 0 #af101a",
                padding: "20px",
              }}
            >
              <p style={{ fontFamily: "var(--font-display)", fontWeight: 900, fontSize: "0.7rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(255,255,255,0.5)", margin: "0 0 14px 0" }}>
                Quick Actions
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <Link to="/dashboard">
                  <button className="brutal-btn-red w-full justify-center text-sm" style={{ padding: "10px 14px", width: "100%" }}>
                    <FileText size={14} /> Write New Post
                  </button>
                </Link>
                <Link to="/stats">
                  <button className="brutal-btn-secondary w-full justify-center text-sm" style={{ padding: "10px 14px", background: "white", width: "100%" }}>
                    <BarChart2 size={14} /> View Analytics
                  </button>
                </Link>
                <Link to="/explore">
                  <button
                    style={{
                      width: "100%",
                      padding: "10px 14px",
                      fontFamily: "var(--font-display)",
                      fontWeight: 700,
                      fontSize: "0.8rem",
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      color: "rgba(255,255,255,0.7)",
                      background: "transparent",
                      border: "2px solid rgba(255,255,255,0.2)",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "6px",
                    }}
                  >
                    <Zap size={14} /> Explore Stories
                  </button>
                </Link>
              </div>
            </div>

            {/* ── Danger Zone ── */}
            <div
              style={{
                padding: "16px",
                border: "3px solid #af101a",
                background: "#fff",
              }}
            >
              <p style={{ fontFamily: "var(--font-display)", fontWeight: 900, fontSize: "0.7rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "#af101a", margin: "0 0 8px 0" }}>⚠ Danger Zone</p>
              <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.78rem", color: "#5b403d", margin: "0 0 12px 0" }}>
                Deleting your account is permanent and irreversible.
              </p>
              <button
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "8px 16px",
                  fontFamily: "var(--font-display)",
                  fontWeight: 700,
                  fontSize: "0.78rem",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "#af101a",
                  background: "#fff",
                  border: "3px solid #af101a",
                  cursor: "pointer",
                }}
              >
                <Trash2 size={13} /> Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
