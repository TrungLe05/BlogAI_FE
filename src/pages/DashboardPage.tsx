import { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  Save,
  Eye,
  Settings,
  Tag,
  LayoutDashboard,
  PenLine,
  BarChart,
  Upload,
  X,
  UserCircle,
  MessageCircle,
} from "lucide-react";
import { ProfileContent } from "@/components/dashboard/profile";
import { StatsContent } from "@/components/dashboard/stats";
import useAuthStore from "@/stores/authStore";
import blogApi from "@/api/blogApi";
import { RichEditor } from "@/components/dashboard/RichEditor";
import { TagResponse } from "@/types/response/blogResponse.types";
import { AvatarDropdown } from "@/components/dashboard/AvatarDropdown";
import { toast } from "sonner";
import { extractApiError } from "@/utils/apiError";
import { validateCreateBlog, validateUpdateBlog } from "@/utils/blogValidation";
import { NotificationBell } from "@/components/common/NotificationBell";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { authApi } from "@/api/authApi";
import { SettingsContent } from "@/components/dashboard/settings";
import { AIEditableField } from "@/components/dashboard/AIEditableField";
import { FULL_AI_ACTIONS, TITLE_AI_ACTIONS } from "@/constants/aiActions";
import { usePrePublishReview } from "@/hooks/usePrePublishReview";
import { AIPrePublishReviewPanel } from "@/components/dashboard/AIPrePublishReviewPanel";

type ActiveView = "write" | "stats" | "profile" | "settings";

// ─────────────────────────────────────────────────────────────────
// WRITE VIEW
// ─────────────────────────────────────────────────────────────────
type WriteViewProps = {
  title: string;
  setTitle: (v: string) => void;
  summary: string;
  setSummary: (v: string) => void;
  content: string;
  setContent: (v: string) => void;
  coverImageUrl: string;
  coverImageFile: File | null;
  setCoverImageFile: (f: File | null) => void;
  onRemoveCover: () => void;
  tags: string[];
  setTags: (t: string[]) => void;
  onSaveDraft: () => void;
  onSavePublish: () => void;
  isDraftSaving: boolean;
  isPublishSaving: boolean;
};

function WriteView({
  title,
  setTitle,
  content,
  setContent,
  coverImageUrl,
  setCoverImageFile,
  onRemoveCover,
  tags,
  setTags,
  onSaveDraft,
  onSavePublish,
  isDraftSaving,
  isPublishSaving,
  summary,
  setSummary,
}: WriteViewProps) {
  const [activeTab, setActiveTab] = useState<"write" | "preview">("write");
  const [tagsData, setTagsData] = useState<TagResponse[] | null>([]);
  const [selectedGroup, setSelectedGroup] = useState("");
  const [selectedTagInGroup, setSelectedTagInGroup] = useState("");
  const [coverImagePreview, setCoverImagePreview] = useState<string | null>(
    coverImageUrl || null,
  );
  const fileInputRef = useRef<HTMLInputElement>(null);
  const wordCount = content.split(/\s+/).filter(Boolean).length;

  useEffect(() => {
    setCoverImagePreview(coverImageUrl || null);
  }, [coverImageUrl]);

  const handleCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      setCoverImagePreview(URL.createObjectURL(f));
      setCoverImageFile(f);
    }
  };

  const handleRemoveCover = () => {
    setCoverImagePreview(null);
    setCoverImageFile(null);
    onRemoveCover();
  };

  const removeTag = (t: string) => setTags(tags.filter((tag) => tag !== t));

  useEffect(() => {
    blogApi
      .getAllTag()
      .then(({ data }) => setTagsData(data.result))
      .catch(console.error);
  }, []);

  const groupedTags = tagsData?.reduce(
    (acc, item) => {
      if (!acc[item.groupName]) acc[item.groupName] = [];
      acc[item.groupName].push(item.tag);
      return acc;
    },
    {} as Record<string, string[]>,
  );

  return (
    <div className="flex flex-col h-full">
      {/* Tab bar */}
      <div className="flex bg-white dark:bg-[#111318] shrink-0 border-b-[3px] border-[#0d0d0d] dark:border-[#2d3148]">
        {(["write", "preview"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-8 py-3.5 text-xs font-black uppercase tracking-[0.15em] transition-colors cursor-pointer border-r-[3px] border-[#0d0d0d] dark:border-[#2d3148]
              ${
                activeTab === tab
                  ? "bg-[#0d0d0d] dark:bg-[#2d3148] text-white"
                  : "bg-transparent text-[#5b403d] dark:text-slate-400 hover:bg-[#f2fbfc] dark:hover:bg-[#1a1d26]"
              }`}
            
          >
            {tab === "write" ? (
              <span className="flex items-center gap-2">
                <PenLine size={14} /> Write
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Eye size={14} /> Preview
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto bg-[#f2fbfc] dark:bg-[#0f1117]">
        {activeTab === "write" && (
          <div className="max-w-250 mx-auto p-8">
            {/* ── Title Field ── */}
            <div className="mb-6">
              <label
                className="block mb-2 text-xs font-black uppercase tracking-[0.15em] text-[#5b403d] dark:text-slate-400 font-display"
                
              >
                <PenLine size={11} className="inline mr-1.5" />
                Post Title
                <span className="ml-2 text-[#b0a0a0] normal-case font-normal">
                  - select text for AI rewrite
                </span>
              </label>
              <AIEditableField
                as="input"
                fieldType="title"
                value={title}
                onChange={setTitle}
                availableActions={TITLE_AI_ACTIONS}
                placeholder="Blog title..."
                className="w-full text-2xl font-bold border-b-2 border-[#0d0d0d] px-2 py-3 outline-none dark:placeholder:text-zinc-400 dark:text-zinc-400 dark:focus:border-zinc-200"
                maxLength={120}
              />
              <p className="text-xs mt-1.5 text-right text-[#b0a0a0] dark:text-slate-500">
                {title.length}/120 chars
              </p>
            </div>

            {/* ── Summary Field ── */}
            <div className="mb-8">
              <label
                className="block mb-2 text-xs font-black uppercase tracking-[0.15em] text-[#5b403d] dark:text-slate-400 font-display"
                
              >
                Summary
                <span className="ml-2 text-[#b0a0a0] normal-case font-normal">
                  - select text for AI rewrite
                </span>
              </label>
              <AIEditableField
                as="textarea"
                fieldType="summary"
                value={summary}
                onChange={setSummary}
                availableActions={FULL_AI_ACTIONS}
                placeholder="Short summary for preview..."
                className="w-full border-[3px] border-[#0d0d0d] p-3 text-sm resize-none dark:placeholder:text-zinc-400 dark:text-zinc-400"
                rows={3}
                maxLength={300}
              />
              <p
                className={`text-xs mt-1 text-right ${
                  summary.length > 200
                    ? "text-[#d32f2f]"
                    : "text-[#8f6f6c] dark:text-slate-400"
                }`}
              >
                {summary.length}/200
              </p>
            </div>

            {/* Tags */}
            <div className="max-w-full mx-auto pb-6">
              <div className="bg-white dark:bg-[#1a1d26] p-8 border-[3px] border-[#0d0d0d] dark:border-zinc-600 shadow-[4px_4px_0_#0d0d0d] dark:shadow-[4px_4px_0_#52525b]">
                <h2
                  className="font-black text-sm uppercase tracking-widest mb-6 text-[#151d1e] dark:text-slate-200 font-display"
                  
                >
                  Post Tags
                </h2>
                <div className="mb-5">
                  <label
                    className="block mb-2 text-xs font-black uppercase tracking-[0.15em] text-[#5b403d] dark:text-slate-400 font-display"
                    
                  >
                    <Tag size={12} className="inline mr-1.5" />
                    Tags (max 5)
                  </label>
                  <div className="flex gap-3 mb-3">
                    <select
                      className="flex-1 px-4 py-3 text-sm outline-none border-[3px] border-[#0d0d0d] dark:border-[#2d3148] bg-white dark:bg-[#1e2130] text-[#151d1e] dark:text-slate-200 font-sans"
                      
                      value={selectedGroup}
                      onChange={(e) => {
                        setSelectedGroup(e.target.value);
                        setSelectedTagInGroup("");
                      }}
                    >
                      <option value="">Select group...</option>
                      {groupedTags &&
                        Object.keys(groupedTags).map((g) => (
                          <option key={g} value={g}>
                            {g}
                          </option>
                        ))}
                    </select>
                    <select
                      className="flex-1 px-4 py-3 text-sm outline-none border-[3px] border-[#0d0d0d] dark:border-[#2d3148] bg-white dark:bg-[#1e2130] text-[#151d1e] dark:text-slate-200 disabled:opacity-50 font-sans"
                      
                      disabled={!selectedGroup}
                      value={selectedTagInGroup}
                      onChange={(e) => {
                        const tag = e.target.value;
                        if (!tag) return;
                        if (!tags.includes(tag) && tags.length < 5)
                          setTags([...tags, tag]);
                        setSelectedTagInGroup("");
                      }}
                    >
                      <option value="">Select tag...</option>
                      {(groupedTags?.[selectedGroup] ?? []).map((tag) => (
                        <option
                          key={tag}
                          value={tag}
                          disabled={tags.includes(tag)}
                        >
                          {tag} {tags.includes(tag) ? "✓" : ""}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <span
                        key={tag}
                        className="flex items-center gap-1.5 px-3 py-1 text-xs font-black uppercase tracking-widest bg-[#0d0d0d] dark:bg-[#2d3148] text-white border-[3px] border-[#0d0d0d] dark:border-[#2d3148] font-display"
                        
                      >
                        {tag}
                        <button
                          onClick={() => removeTag(tag)}
                          className="ml-1 cursor-pointer hover:text-[#d32f2f]"
                        >
                          <X size={10} />
                        </button>
                      </span>
                    ))}
                    {tags.length >= 5 && (
                      <span
                        className="text-xs font-black self-center uppercase tracking-widest text-[#d32f2f] font-display"
                        
                      >
                        Max 5 tags reached
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Cover image */}
            {!coverImagePreview ? (
              <div
                className="mb-6 flex flex-col items-center justify-center cursor-pointer hover:bg-white dark:hover:bg-[#1a1d26] transition-colors border-[3px] border-dashed border-[#0d0d0d] dark:border-[#2d3148] h-125 bg-white/40 dark:bg-[#1a1d26]/40"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload
                  size={32}
                  className="text-[#8f6f6c] dark:text-slate-400 mb-3"
                />
                <p
                  className="font-black text-xs uppercase tracking-[0.15em] text-[#8f6f6c] dark:text-slate-400 font-display"
                  
                >
                  Click to upload cover image
                </p>
                <p className="text-xs mt-2 text-[#b0a0a0] dark:text-slate-500">
                  Recommended: 1200 × 630px
                </p>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleCoverUpload}
                  className="hidden"
                />
              </div>
            ) : (
              <div className="mb-6 relative border-[3px] border-[#0d0d0d] dark:border-[#2d3148]">
                <img
                  src={coverImagePreview}
                  alt="cover"
                  className="w-full h-125 object-cover"
                />
                <button
                  onClick={handleRemoveCover}
                  className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center bg-white dark:bg-[#1a1d26] border-[3px] border-[#0d0d0d] dark:border-[#2d3148] shadow-[3px_3px_0_#0d0d0d] dark:shadow-[3px_3px_0_#2d3148] transition-all cursor-pointer hover:bg-[#d32f2f] hover:text-white"
                >
                  <X size={14} />
                </button>
              </div>
            )}

            {/* Rich Editor — AI toolbar gắn trong RichEditor */}
            <RichEditor content={content} onChange={setContent} />

            {/* Footer actions */}
            <div className="mt-4 flex justify-between items-center">
              <p
                className="text-xs font-bold text-[#8f6f6c] dark:text-slate-400 font-display"
                
              >
                {wordCount} words · ~{Math.ceil(wordCount / 200)} min read
              </p>
              <div className="flex gap-4">
                <button
                  className="flex items-center gap-2 px-5 py-2.5 text-xs font-black uppercase tracking-widest 
                  transition-all cursor-pointer bg-white dark:bg-[#1a1d26] text-[#151d1e] dark:text-slate-200 
                  border-[3px] border-[#0d0d0d] dark:border-zinc-600 shadow-[4px_4px_0_#0d0d0d] 
                  dark:shadow-[4px_4px_0_#52525b] hover:-translate-x-1 hover:-translate-y-1 
                  hover:shadow-[8px_8px_0_#0d0d0d] dark:hover:shadow-[8px_8px_0_#52525b] disabled:opacity-50"
                  onClick={onSaveDraft}
                  disabled={isDraftSaving}
                >
                  <Save size={14} />
                  {isDraftSaving ? "Saving..." : "Save Draft"}
                </button>
                <button
                  className="flex items-center gap-2 px-5 py-2.5 text-xs font-black uppercase tracking-widest 
                  transition-all cursor-pointer bg-[#af101a] text-white border-[3px] border-[#0d0d0d] 
                  dark:border-zinc-600 shadow-[4px_4px_0_#0d0d0d] dark:shadow-[4px_4px_0_#52525b] hover:-translate-x-1 
                  hover:-translate-y-1 hover:shadow-[8px_8px_0_#0d0d0d] dark:hover:shadow-[8px_8px_0_#52525b] 
                  disabled:opacity-50"
                  onClick={onSavePublish}
                  disabled={isPublishSaving}
                >
                  <Save size={14} />
                  {isPublishSaving ? "Publishing..." : "Publish"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Preview tab */}
        {activeTab === "preview" && (
          <div className="max-w-200 mx-auto p-8">
            <div className="bg-white dark:bg-[#1a1d26] p-10 border-[3px] border-[#0d0d0d] dark:border-[#2d3148] shadow-[4px_4px_0_#0d0d0d] dark:shadow-[4px_4px_0_#2d3148]">
              <h1
                className="text-4xl font-bold mb-8 text-[#0d0d0d] dark:text-slate-100 font-display"
                style={{ letterSpacing: "-0.02em",
                  lineHeight: 1.1 }}
              >
                {title || "Your Post Title"}
              </h1>
              <h3
                className="text-2xl font-bold mb-8 text-[#0d0d0d] dark:text-slate-200 font-display"
                style={{ letterSpacing: "-0.02em",
                  lineHeight: 1.1 }}
              >
                {summary || "Your Post Summary"}
              </h3>
              {content ? (
                <div
                  className="prose-content dark:prose-invert"
                  dangerouslySetInnerHTML={{ __html: content }}
                />
              ) : (
                <p className="text-[#8f6f6c] dark:text-slate-400">
                  Start writing to see your preview here...
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
// COLLAPSIBLE SIDEBAR ITEM
// ─────────────────────────────────────────────────────────────────
function SideItem({
  icon,
  label,
  active,
  onClick,
  expanded,
}: {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
  expanded: boolean;
}) {
  return (
    <button
      onClick={onClick}
      title={!expanded ? label : undefined}
      className={`flex items-center w-full transition-all cursor-pointer border-b-2 border-white/6 overflow-hidden whitespace-nowrap
        ${active ? "bg-[#d32f2f] text-white" : "bg-transparent text-[#5b403d] dark:text-slate-400 hover:bg-white/5"}
        ${expanded ? "gap-3 px-4.5 py-3.25 justify-start" : "gap-0 px-0 py-4 justify-center"}`}
    >
      <span className="shrink-0">{icon}</span>
      <span
        className="font-black uppercase tracking-[0.12em] transition-all text-[0.7rem] font-display"
        style={{ opacity: expanded ? 1 : 0,
          maxWidth: expanded ? 120 : 0,
          transition: "opacity 0.2s, max-width 0.25s" }}
      >
        {label}
      </span>
    </button>
  );
}

// ─────────────────────────────────────────────────────────────────
// DASHBOARD PAGE
// ─────────────────────────────────────────────────────────────────
function DashboardPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialView = (searchParams.get("view") as ActiveView) || "write";
  const [activeView, setActiveView] = useState<ActiveView>(
    ["write", "stats", "profile", "settings"].includes(initialView)
      ? initialView
      : "write",
  );

  useEffect(() => {
    const viewParam = searchParams.get("view") as ActiveView;
    if (
      viewParam &&
      ["write", "stats", "profile", "settings"].includes(viewParam)
    ) {
      setActiveView(viewParam);
    }
  }, [searchParams]);
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const navigate = useNavigate();
  const [summary, setSummary] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [coverImageUrl, setCoverImageUrl] = useState("");
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
  const [tagsSelection, setTagsSelection] = useState<string[]>([]);
  const [editingBlogId, setEditingBlogId] = useState<string | null>(null);
  const [isDraftSaving, setIsDraftSaving] = useState(false);
  const [isPublishSaving, setIsPublishSaving] = useState(false);
  const [_isLoadingBlog, setIsLoadingBlog] = useState(false);
  const [show2FADialog, setShow2FADialog] = useState(false);
  const prePublishReview = usePrePublishReview();

  useEffect(() => {
    const fetch2FAStatus = async () => {
      try {
        const { user } = useAuthStore.getState();
        const key = `2fa-dialog-seen-${user?.id}`;
        if (localStorage.getItem(key) === "true") return;
        const { data } = await authApi.get2FAStatus();
        if (!data.result) setShow2FADialog(true);
      } catch (err) {
        console.error(err);
      }
    };
    fetch2FAStatus();
  }, []);

  useAuthStore();

  const handleRemoveCover = () => {
    setCoverImageFile(null);
    setCoverImageUrl("");
  };

  const handleSaveDraft = async () => {
    const errors = editingBlogId
      ? validateUpdateBlog({
          title,
          summary,
          content,
          coverImage: coverImageFile,
        })
      : validateCreateBlog({
          title,
          summary,
          content,
          tags: tagsSelection,
          coverImage: coverImageFile,
        });
    if (errors.length > 0) {
      errors.forEach((e) => toast.error(e.message));
      return;
    }
    setIsDraftSaving(true);
    try {
      if (editingBlogId) {
        await blogApi.updateDraft(editingBlogId, {
          title,
          summary,
          content,
          tags: tagsSelection,
          coverImage: coverImageFile,
        });
        toast.success("Draft updated successfully");
      } else {
        const { data } = await blogApi.saveDraft({
          title,
          summary,
          content,
          tags: tagsSelection,
          coverImage: coverImageFile,
        });
        setEditingBlogId(data.result.blogId);
        toast.success("Draft saved successfully");
        setTitle("");
        setContent("");
        setCoverImageFile(null);
        setCoverImageUrl("");
        setSummary("");
      }
    } catch (e) {
      toast.error(extractApiError(e));
    } finally {
      setIsDraftSaving(false);
    }
  };

  const doPublish = async () => {
    setIsPublishSaving(true);
    try {
      if (editingBlogId) {
        await blogApi.updateDraft(editingBlogId, {
          title,
          summary,
          content,
          tags: tagsSelection,
          coverImage: coverImageFile,
        });
        await blogApi.publishBlog(editingBlogId);
      } else {
        await blogApi.saveAndPublishBlog({
          title,
          summary,
          content,
          tags: tagsSelection,
          coverImage: coverImageFile,
        });
      }
      toast.success("Blog published successfully!");
      setTitle("");
      setContent("");
      setCoverImageFile(null);
      setCoverImageUrl("");
      setTagsSelection([]);
      setEditingBlogId(null);
      setSummary("");
    } catch (e) {
      toast.error(extractApiError(e));
    } finally {
      setIsPublishSaving(false);
    }
  };

  const handlePublishBlog = async () => {
    const errors = editingBlogId
      ? validateUpdateBlog({
          title,
          summary,
          content,
          coverImage: coverImageFile,
        })
      : validateCreateBlog({
          title,
          summary,
          content,
          tags: tagsSelection,
          coverImage: coverImageFile,
        });
    if (errors.length > 0) {
      errors.forEach((e) => toast.error(e.message));
      return;
    }

    toast("Ready to publish?", {
      description:
        "You can let AI check readability, SEO and engagement first, or publish right away.",
      action: {
        label: "AI Review",
        onClick: () => prePublishReview.runReview({ title, summary, content }),
      },
      cancel: {
        label: "Publish Now",
        onClick: () => doPublish(),
      },
    });
  };

  const handleEditBlog = async (blogId: string) => {
    setIsLoadingBlog(true);
    try {
      const { data } = await blogApi.getBlogDetailById(blogId);
      const blog = data.result;
      setTitle(blog.title ?? "");
      setContent(blog.content ?? "");
      setCoverImageUrl(blog?.coverImageUrl ?? "");
      setCoverImageFile(null);
      setTagsSelection(blog.tags ?? []);
      setEditingBlogId(blogId);
      setActiveView("write");
      setSummary(blog.summary ?? "");
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoadingBlog(false);
    }
  };

  const handleActiveView = (view: ActiveView) => {
    if (editingBlogId && view === "write") {
      toast("Discard current edits?", {
        description: "You are currently editing a post.",
        action: {
          label: "Confirm",
          onClick: () => {
            setTitle("");
            setContent("");
            setCoverImageUrl("");
            setCoverImageFile(null);
            setTagsSelection([]);
            setEditingBlogId(null);
            setActiveView(view);
            setSearchParams({ view }, { replace: true });
          },
        },
        cancel: { label: "Cancel", onClick: () => {} },
      });
      return;
    }
    setActiveView(view);
    setSearchParams({ view }, { replace: true });
  };

  const sideItems: {
    icon: React.ReactNode;
    label: string;
    view?: ActiveView;
    href?: string;
  }[] = [
    { icon: <LayoutDashboard size={18} />, label: "Home", href: "/" },
    { icon: <PenLine size={18} />, label: "Write", view: "write" },
    { icon: <BarChart size={18} />, label: "Stats", view: "stats" },
    { icon: <UserCircle size={18} />, label: "Profile", view: "profile" },
    { icon: <Settings size={18} />, label: "Settings", view: "settings" },
  ];

  return (
    <div
      className="bg-[#f2fbfc] dark:bg-[#0f1117] h-screen flex flex-col font-sans"
      
    >
      {/* ── TOP BAR ── */}
      <div className="shrink-0 flex items-center justify-between px-10 h-14 bg-white dark:bg-[#111318] border-b-[3px] border-[#0d0d0d] dark:border-[#2d3148] z-50">
        <div className="flex items-center gap-4">
          <Link to="/">
            <span
              className="text-xl font-black text-[#0d0d0d] dark:text-white font-display"
              
            >
              Blog<span className="text-[#d32f2f]">AI</span>
            </span>
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/messages")}
            title="Messages"
            className="relative w-10 h-10 rounded-full flex items-center justify-center
                   text-gray-500 dark:text-zinc-400
                   hover:text-[#0d0d0d] dark:hover:text-zinc-100
                   hover:bg-black/5 dark:hover:bg-white/6
                   transition-colors cursor-pointer"
          >
            <MessageCircle size={17} strokeWidth={1.8} />
          </button>

          <NotificationBell />
          <AvatarDropdown
            onSettingsClick={() => handleActiveView("settings")}
          />
        </div>
      </div>

      {/* ── BODY ── */}
      <div className="flex flex-1 overflow-hidden">
        {/* ── COLLAPSIBLE SIDEBAR ── */}
        <div
          onMouseEnter={() => setSidebarExpanded(true)}
          onMouseLeave={() => setSidebarExpanded(false)}
          className="shrink-0 flex flex-col border-r-[3px] border-[#0d0d0d] dark:border-[#2d3148] bg-[#0d0d0d] dark:bg-[#070809] z-40 overflow-hidden transition-[width] duration-250 ease-in-out"
          style={{ width: sidebarExpanded ? 180 : 60 }}
        >
          {/* Logo */}
          <div
            className="flex items-center border-b-2 border-white/8 transition-[padding] duration-250 overflow-hidden whitespace-nowrap"
            style={{
              padding: sidebarExpanded ? "14px 18px" : "14px 0",
              justifyContent: sidebarExpanded ? "flex-start" : "center",
            }}
          >
            <span
              className="font-black text-base text-white shrink-0 font-display"
              
            >
              B<span className="text-[#d32f2f]">.</span>
            </span>
            <span
              className="font-black text-[0.75rem] text-white/50 pl-1.5 overflow-hidden transition-[opacity,max-width] duration-250 font-display"
              style={{ opacity: sidebarExpanded ? 1 : 0,
                maxWidth: sidebarExpanded ? 120 : 0 }}
            >
              log<span className="text-[#d32f2f]">AI</span>
            </span>
          </div>

          {/* Nav items */}
          {sideItems.map((item) =>
            item.href ? (
              <Link to={item.href} key={item.label}>
                <SideItem
                  icon={item.icon}
                  label={item.label}
                  active={false}
                  onClick={() => {}}
                  expanded={sidebarExpanded}
                />
              </Link>
            ) : (
              <SideItem
                key={item.label}
                icon={item.icon}
                label={item.label}
                active={activeView === item.view}
                onClick={() => handleActiveView(item.view!)}
                expanded={sidebarExpanded}
              />
            ),
          )}
        </div>

        {/* ── MAIN CONTENT ── */}
        <div className="flex-1 overflow-hidden flex flex-col">
          {activeView === "write" && (
            <WriteView
              key={editingBlogId ?? "new"}
              title={title}
              setTitle={setTitle}
              summary={summary}
              setSummary={setSummary}
              content={content}
              setContent={setContent}
              coverImageUrl={coverImageUrl}
              coverImageFile={coverImageFile}
              setCoverImageFile={setCoverImageFile}
              onRemoveCover={handleRemoveCover}
              tags={tagsSelection}
              setTags={setTagsSelection}
              onSaveDraft={handleSaveDraft}
              isDraftSaving={isDraftSaving}
              isPublishSaving={isPublishSaving}
              onSavePublish={handlePublishBlog}
            />
          )}
          {activeView === "stats" && <StatsContent />}
          {activeView === "profile" && (
            <ProfileContent onEditBlog={handleEditBlog} />
          )}
          {activeView === "settings" && <SettingsContent />}
        </div>
      </div>

      <Enable2FADialog
        open={show2FADialog}
        onClose={() => setShow2FADialog(false)}
        handleEnable2FA={() => {
          setActiveView("settings");
          setShow2FADialog(false);
        }}
      />

      <AIPrePublishReviewPanel
        open={prePublishReview.state.open}
        isLoading={prePublishReview.state.isLoading}
        result={prePublishReview.state.result}
        onEditMore={prePublishReview.close}
        onPublishAnyway={() => {
          prePublishReview.close();
          doPublish();
        }}
      />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// 2FA DIALOG
// ─────────────────────────────────────────────────────────────────
type Enable2FAProps = {
  open: boolean;
  onClose: () => void;
  handleEnable2FA: () => void;
};

function Enable2FADialog({ open, onClose, handleEnable2FA }: Enable2FAProps) {
  const dismiss = () => {
    const { user } = useAuthStore.getState();
    localStorage.setItem(`2fa-dialog-seen-${user?.id}`, "true");
    onClose();
  };
  const enable = () => {
    const { user } = useAuthStore.getState();
    localStorage.setItem(`2fa-dialog-seen-${user?.id}`, "true");
    handleEnable2FA();
  };
  return (
    <Dialog open={open} onOpenChange={dismiss}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Bật bảo mật 2 lớp</DialogTitle>
          <DialogDescription>
            Tài khoản của bạn chưa bật xác thực 2 bước (2FA). Điều này giúp bảo
            vệ tài khoản tốt hơn.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex justify-end gap-2">
          <Button variant="outline" onClick={dismiss}>
            Để sau
          </Button>
          <Button onClick={enable}>Bật ngay</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─────────────────────────────────────────────────────────────────
// THEME INIT (gọi trong main.tsx trước render)
// ─────────────────────────────────────────────────────────────────
export function initTheme() {
  const saved = localStorage.getItem("theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  if (saved === "dark" || (!saved && prefersDark)) {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
}

export default DashboardPage;
