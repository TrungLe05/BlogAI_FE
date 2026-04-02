import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Bold,
  Italic,
  Underline,
  Heading1,
  Heading2,
  Quote,
  Link2,
  Image,
  Save,
  Eye,
  Settings,
  Tag,
  Globe,
  Lock,
  LayoutDashboard,
  PenLine,
  BarChart,
  Upload,
  X,
  Sparkles,
  RefreshCw,
  CheckCheck,
  ChevronDown,
  ChevronUp,
  Wand2,
  UserCircle,
} from "lucide-react";
import { ProfileContent } from "@/components/dashboard/ProfileContent";
import { StatsContent } from "@/components/dashboard/StatsContent";
import useAuthStore from "@/stores/authStore";
import blogApi from "@/api/blogApi";
import { RichEditor } from "@/components/dashboard/RichEditor";
import { TagResponse } from "@/types/blog.types";

type ActiveView = "write" | "stats" | "profile" | "settings";

// ── AI Title Generator (giữ nguyên, không thay đổi) ──────────────
function extractKeywords(text: string): string[] {
  const stopWords = new Set([
    "the",
    "a",
    "an",
    "and",
    "or",
    "but",
    "in",
    "on",
    "at",
    "to",
    "for",
    "is",
    "are",
    "was",
    "were",
    "be",
    "been",
    "have",
    "has",
    "had",
    "do",
    "does",
    "did",
    "will",
    "would",
    "could",
    "should",
    "may",
    "might",
    "of",
    "that",
    "this",
    "with",
    "from",
    "by",
    "about",
    "as",
    "it",
    "its",
    "i",
    "you",
    "we",
    "they",
    "my",
    "your",
    "our",
    "their",
  ]);
  const words = text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .split(/\s+/)
    .filter((w) => w.length > 3 && !stopWords.has(w));
  const freq: Record<string, number> = {};
  words.forEach((w) => {
    freq[w] = (freq[w] || 0) + 1;
  });
  return Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([w]) => w);
}
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
const TEMPLATES = [
  (kw: string[]) =>
    `The Ultimate Guide to ${cap(kw[0] || "Your Topic")} in 2025`,
  (kw: string[]) =>
    `Why ${cap(kw[0] || "This")} Is Changing Everything We Know About ${cap(kw[1] || "the World")}`,
  (kw: string[]) =>
    `${cap(kw[0] || "How")} ${cap(kw[1] || "To Do It")}: A Deep Dive`,
  (kw: string[]) => `${cap(kw[0] || "Your Topic")}: What Nobody Tells You`,
  (kw: string[]) =>
    `From Zero to Expert: Mastering ${cap(kw[0] || "Your Craft")}`,
  (kw: string[]) =>
    `The Truth About ${cap(kw[0] || "Your Topic")} That Will Surprise You`,
];
async function generateTitles(content: string): Promise<string[]> {
  await new Promise((r) => setTimeout(r, 1800));
  const kw = extractKeywords(content);
  return [...TEMPLATES]
    .sort(() => Math.random() - 0.5)
    .slice(0, 4)
    .map((fn) => fn(kw));
}

function AITitlePanel({
  content,
  onApply,
}: {
  content: string;
  onApply: (t: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [applied, setApplied] = useState<string | null>(null);
  const [dots, setDots] = useState("");
  const hasContent = content.trim().split(/\s+/).filter(Boolean).length >= 10;

  const handleGenerate = async () => {
    if (!hasContent) return;
    setIsLoading(true);
    setSuggestions([]);
    setApplied(null);
    setIsOpen(true);
    let d = 0;
    const di = setInterval(() => {
      d = (d + 1) % 4;
      setDots(".".repeat(d));
    }, 400);
    try {
      const titles = await generateTitles(content);
      setSuggestions(titles);
    } finally {
      clearInterval(di);
      setIsLoading(false);
      setDots("");
    }
  };
  const handleApply = (t: string) => {
    onApply(t);
    setApplied(t);
  };

  return (
    <div
      className="mb-6"
      style={{
        border: "3px solid #0d0d0d",
        boxShadow: "4px 4px 0 #d32f2f",
        background: "white",
      }}
    >
      <div
        className="flex items-center justify-between px-5 py-3 cursor-pointer select-none"
        style={{
          background: "#0d0d0d",
          borderBottom: isOpen ? "3px solid #0d0d0d" : "none",
        }}
        onClick={() => isOpen && !isLoading && setIsOpen(false)}
      >
        <div className="flex items-center gap-2">
          <Sparkles size={15} color="#d32f2f" />
          <span
            className="font-black text-xs uppercase tracking-widest text-white"
            style={{ fontFamily: "var(--font-display)" }}
          >
            AI Title Generator
          </span>
          <span
            className="px-2 py-0.5 text-xs font-black"
            style={{
              background: "#d32f2f",
              color: "white",
              fontFamily: "var(--font-display)",
            }}
          >
            BETA
          </span>
        </div>
        <div className="flex items-center gap-2">
          {!hasContent && (
            <span className="text-xs text-white/50">Write 10+ words first</span>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleGenerate();
            }}
            disabled={!hasContent || isLoading}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-black uppercase transition-all"
            style={{
              fontFamily: "var(--font-display)",
              background: hasContent && !isLoading ? "#d32f2f" : "#555",
              color: "white",
              border: "2px solid white",
              boxShadow: hasContent && !isLoading ? "2px 2px 0 white" : "none",
              cursor: hasContent && !isLoading ? "pointer" : "not-allowed",
              opacity: !hasContent ? 0.5 : 1,
            }}
          >
            {isLoading ? (
              <>
                <RefreshCw size={11} className="animate-spin" /> Generating
                {dots}
              </>
            ) : suggestions.length > 0 ? (
              <>
                <RefreshCw size={11} /> Regenerate
              </>
            ) : (
              <>
                <Wand2 size={11} /> Generate
              </>
            )}
          </button>
          {isOpen && !isLoading && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsOpen(false);
              }}
            >
              <ChevronUp size={15} color="white" />
            </button>
          )}
          {!isOpen && suggestions.length > 0 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsOpen(true);
              }}
            >
              <ChevronDown size={15} color="white" />
            </button>
          )}
        </div>
      </div>
      {isOpen && (
        <div className="p-4">
          {isLoading ? (
            <div className="space-y-2">
              <p
                className="text-xs font-bold uppercase tracking-widest mb-2 flex items-center gap-2"
                style={{ fontFamily: "var(--font-display)", color: "#d32f2f" }}
              >
                <Sparkles size={11} className="animate-pulse" />
                Analysing{dots}
              </p>
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="animate-pulse"
                  style={{
                    height: "44px",
                    background: `rgba(211,47,47,${0.04 * i + 0.04})`,
                    border: "2px solid #e5e5e5",
                  }}
                />
              ))}
            </div>
          ) : suggestions.length > 0 ? (
            <div>
              <p
                className="text-xs font-bold uppercase tracking-widest mb-3"
                style={{ fontFamily: "var(--font-display)", color: "#888" }}
              >
                Click to apply ↓
              </p>
              <div className="space-y-2">
                {suggestions.map((s, i) => {
                  const isApplied = applied === s;
                  return (
                    <button
                      key={i}
                      onClick={() => handleApply(s)}
                      className="w-full text-left flex items-start justify-between gap-3 transition-all group"
                      style={{
                        padding: "10px 14px",
                        border: `3px solid ${isApplied ? "#d32f2f" : "#0d0d0d"}`,
                        background: isApplied ? "#d32f2f" : "white",
                        boxShadow: isApplied ? "3px 3px 0 #0d0d0d" : "none",
                        transform: isApplied ? "translate(-2px,-2px)" : "none",
                        cursor: "pointer",
                      }}
                      onMouseEnter={(e) => {
                        if (!isApplied) {
                          e.currentTarget.style.transform =
                            "translate(-2px,-2px)";
                          e.currentTarget.style.boxShadow = "3px 3px 0 #d32f2f";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isApplied) {
                          e.currentTarget.style.transform = "translate(0,0)";
                          e.currentTarget.style.boxShadow = "none";
                        }
                      }}
                    >
                      <div className="flex items-start gap-2 flex-1">
                        <span
                          className="shrink-0 w-5 h-5 flex items-center justify-center text-xs font-black"
                          style={{
                            fontFamily: "var(--font-display)",
                            background: isApplied ? "white" : "#0d0d0d",
                            color: isApplied ? "#d32f2f" : "white",
                          }}
                        >
                          {i + 1}
                        </span>
                        <span
                          className="text-xs font-bold leading-snug"
                          style={{
                            fontFamily: "var(--font-display)",
                            color: isApplied ? "white" : "#0d0d0d",
                          }}
                        >
                          {s}
                        </span>
                      </div>
                      {isApplied ? (
                        <CheckCheck
                          size={14}
                          color="white"
                          className="shrink-0 mt-0.5"
                        />
                      ) : (
                        <span
                          className="text-xs font-black opacity-0 group-hover:opacity-100 shrink-0"
                          style={{
                            fontFamily: "var(--font-display)",
                            color: "#d32f2f",
                          }}
                        >
                          Apply
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}

// ── WriteView Props (state lift lên DashboardPage) ────────────────
type WriteViewProps = {
  title: string;
  setTitle: (v: string) => void;
  content: string;
  setContent: (v: string) => void;
  coverImageUrl: string; // URL từ server (khi edit blog cũ)
  coverImageFile: File | null; // File thật để upload
  setCoverImageFile: (f: File | null) => void;
  tags: string[]; // state từ DashboardPage
  setTags: (t: string[]) => void;
  onSaveDraft: () => void;
  onSavePublish: () => void; // callback từ DashboardPage
  isDraftSaving: boolean;
  isPublishSaving: boolean;
};

// ── Write View ────────────────────────────────────────────────────
function WriteView({
  title,
  setTitle,
  content,
  setContent,
  coverImageUrl,
  setCoverImageFile,
  tags,
  setTags,
  onSaveDraft,
  onSavePublish,
  isDraftSaving,
  isPublishSaving,
}: WriteViewProps) {
  const [activeTab, setActiveTab] = useState<"write" | "preview" | "settings">(
    "write",
  );
  const [tagsData, setTagsData] = useState<TagResponse[] | null>([]);
  const [selectedGroup, setSelectedGroup] = useState("");
  const [selectedTagInGroup, setSelectedTagInGroup] = useState("");
  // coverImage chỉ dùng để preview UI
  const [coverImagePreview, setCoverImagePreview] = useState<string | null>(
    coverImageUrl || null,
  );
  const fileInputRef = useRef<HTMLInputElement>(null);
  const wordCount = content.split(/\s+/).filter(Boolean).length;

  // Khi edit blog cũ → sync preview từ URL server
  useEffect(() => {
    if (coverImageUrl) setCoverImagePreview(coverImageUrl);
  }, [coverImageUrl]);

  const handleCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      setCoverImagePreview(URL.createObjectURL(f)); // chỉ preview
      setCoverImageFile(f); // lưu file thật để upload
    }
  };

  const handleRemoveCover = () => {
    setCoverImagePreview(null);
    setCoverImageFile(null);
  };

  const removeTag = (t: string) => setTags(tags.filter((tag) => tag !== t));

  const getTagsData = async () => {
    try {
      const { data } = await blogApi.getAllTag();
      setTagsData(data.result);
    } catch (e) {
      console.log("Tags Data Error: ", e);
    }
  };
  useEffect(() => {
    getTagsData();
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
      {/* Tab Bar */}
      <div
        className="flex bg-white shrink-0"
        style={{ borderBottom: "3px solid #0d0d0d" }}
      >
        {(["write", "preview"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className="px-6 py-3 text-sm font-black uppercase tracking-widest transition-colors"
            style={{
              fontFamily: "var(--font-display)",
              background: activeTab === tab ? "#0d0d0d" : "transparent",
              color: activeTab === tab ? "white" : "#555",
              borderRight: "2px solid #0d0d0d",
            }}
          >
            {tab === "write" && (
              <span className="flex items-center gap-1">
                <PenLine size={13} /> Write
              </span>
            )}
            {tab === "preview" && (
              <span className="flex items-center gap-1">
                <Eye size={13} /> Preview
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-auto" style={{ background: "#ebf4f5" }}>
        {/* ── Write Tab ── */}
        {activeTab === "write" && (
          <div className="max-w-250 mx-auto p-6">
            <AITitlePanel content={content} onApply={setTitle} />

            <div className="max-w-full mx-auto pb-5">
              <div
                className="bg-white p-7"
                style={{
                  border: "3px solid #0d0d0d",
                  boxShadow: "4px 4px 0 #0d0d0d",
                }}
              >
                <h2
                  className="font-black text-lg mb-5"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  Post Tags
                </h2>

                {/* Tags theo group */}
                <div className="mb-5">
                  <label
                    className="block mb-1.5 text-xs font-black uppercase tracking-widest"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    <Tag size={11} className="inline mr-1" />
                    Tags (max 5)
                  </label>

                  <div className="flex gap-2 mb-2">
                    {/* Select 1: chọn group */}
                    <select
                      className="brutal-input flex-1"
                      value={selectedGroup}
                      onChange={(e) => {
                        setSelectedGroup(e.target.value);
                        setSelectedTagInGroup(""); // reset tag khi đổi group
                      }}
                    >
                      <option value="">Select group...</option>
                      {groupedTags &&
                        Object.keys(groupedTags).map((group) => (
                          <option key={group} value={group}>
                            {group}
                          </option>
                        ))}
                    </select>

                    {/* Select 2: chọn tag trong group */}
                    <select
                      className="brutal-input flex-1"
                      disabled={!selectedGroup}
                      value={selectedTagInGroup}
                      onChange={(e) => {
                        const tag = e.target.value;
                        if (!tag) return;
                        if (!tags.includes(tag) && tags.length < 5) {
                          setTags([...tags, tag]);
                        }
                        setSelectedTagInGroup(""); // reset sau khi chọn
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

                  {/* Tags đã chọn */}
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <span
                        key={tag}
                        className="flex items-center gap-1 px-2 py-0.5 text-xs font-black uppercase"
                        style={{
                          background: "#0d0d0d",
                          color: "white",
                          fontFamily: "var(--font-display)",
                          border: "2px solid #0d0d0d",
                        }}
                      >
                        {tag}
                        <button onClick={() => removeTag(tag)} className="ml-1">
                          <X size={9} />
                        </button>
                      </span>
                    ))}
                    {tags.length >= 5 && (
                      <span
                        className="text-xs self-center"
                        style={{
                          color: "#d32f2f",
                          fontFamily: "var(--font-display)",
                        }}
                      >
                        Max 5 tags reached
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
            {/* Cover Image */}
            {!coverImagePreview ? (
              <div
                className="mb-5 flex flex-col items-center justify-center cursor-pointer hover:bg-white transition-colors"
                style={{
                  border: "3px dashed #0d0d0d",
                  height: "500px",
                  background: "rgba(255,255,255,0.4)",
                }}
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload
                  size={28}
                  style={{ color: "#999", marginBottom: "10px" }}
                />
                <p
                  className="font-black text-xs uppercase tracking-widest"
                  style={{ fontFamily: "var(--font-display)", color: "#999" }}
                >
                  Add Cover Image
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
              <div
                className="mb-5 relative"
                style={{ border: "3px solid #0d0d0d" }}
              >
                <img
                  src={coverImagePreview}
                  alt="cover"
                  className="w-full"
                  style={{ height: "500px", objectFit: "cover" }}
                />
                <button
                  onClick={handleRemoveCover}
                  className="absolute top-2 right-2 w-7 h-7 flex items-center justify-center bg-white"
                  style={{ border: "2px solid #0d0d0d" }}
                >
                  <X size={13} />
                </button>
              </div>
            )}

            <RichEditor content={content} onChange={setContent} />

            <div className="mt-3 flex justify-between items-center">
              <p
                className="text-xs"
                style={{ color: "#999", fontFamily: "var(--font-display)" }}
              >
                {wordCount} words · ~{Math.ceil(wordCount / 200)} min read
                {wordCount >= 10 && (
                  <span style={{ color: "#d32f2f", marginLeft: "8px" }}>
                    ✦ AI title ready
                  </span>
                )}
              </p>

              {/* Nút Save nhỏ trong editor — gọi callback từ DashboardPage */}
              <div className="flex gap-4">
                <button
                  className="brutal-btn-primary text-xs"
                  style={{ padding: "7px 18px" }}
                  onClick={onSaveDraft}
                  disabled={isDraftSaving}
                >
                  <Save size={13} />{" "}
                  {isDraftSaving ? "Saving..." : "Save Draft"}
                </button>
                <button
                  className="brutal-btn-red text-xs"
                  style={{ padding: "6px 18px" }}
                  onClick={onSavePublish}
                  disabled={isPublishSaving}
                >
                  <Save size={13} /> {isPublishSaving ? "Saving..." : "Publish"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── Preview Tab ── */}
        {activeTab === "preview" && (
          <div className="max-w-200 mx-auto p-6">
            <div
              className="bg-white p-7"
              style={{
                border: "3px solid #0d0d0d",
                boxShadow: "4px 4px 0 #0d0d0d",
              }}
            >
              <h1
                className="text-3xl font-black mb-6"
                style={{ fontFamily: "var(--font-display)", color: "#0d0d0d" }}
              >
                {title || "Your Post Title"}
              </h1>
              {content ? (
                <div
                  className="prose-content"
                  dangerouslySetInnerHTML={{ __html: content }}
                />
              ) : (
                <p style={{ color: "#aaa" }}>
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

// ── Sidebar Item ──────────────────────────────────────────────────
function SideItem({
  icon,
  label,
  active,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      title={label}
      className="flex flex-col items-center justify-center w-full py-4 gap-1.5 transition-all cursor-pointer"
      style={{
        background: active ? "#d32f2f" : "transparent",
        color: active ? "white" : "#555",
        borderBottom: "1px solid rgba(0,0,0,0.06)",
      }}
    >
      {icon}
      <span
        className="text-xs font-black uppercase tracking-widest"
        style={{ fontFamily: "var(--font-display)", lineHeight: 1 }}
      >
        {label}
      </span>
    </button>
  );
}

// ── Dashboard Page ────────────────────────────────────────────────
function DashboardPage() {
  const [activeView, setActiveView] = useState<ActiveView>("write");

  // ── Blog state (tất cả lift lên đây để handleSaveDraft truy cập được) ──
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [coverImageUrl, setCoverImageUrl] = useState(""); // URL server (edit blog cũ)
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null); // File upload mới
  const [tagsSelection, setTagsSelection] = useState<string[]>([]);
  const [editingBlogId, setEditingBlogId] = useState<string | null>(null);
  const [isDraftSaving, setIsDraftSaving] = useState(false);
  const [isPublishSaving, setIsPublishSaving] = useState(false);

  const [isLoadingBlog, setIsLoadingBlog] = useState(false);

  const { user } = useAuthStore();

  // ── Save Draft ────────────────────────────────────────────────
  const handleSaveDraft = async () => {
    if (tagsSelection == null || tagsSelection.length === 0) {
      alert("Vui lòng chọn tags cho bài viết");
      return;
    }

    setIsDraftSaving(true);
    try {
      if (editingBlogId) {
        // ── UPDATE blog đã có ──
        const { data } = await blogApi.updateDraft(editingBlogId, {
          title,
          content,
          tags: tagsSelection,
          coverImage: coverImageFile,
        });
        alert("✅ Đã cập nhật draft!");
      } else {
        // ── CREATE blog mới ──
        const { data } = await blogApi.saveDraft({
          title,
          content,
          tags: tagsSelection,
          coverImage: coverImageFile,
        });
        setEditingBlogId(data.result.blogId); // lưu lại ID sau khi tạo
        alert("✅ Đã lưu draft!");
      }
    } catch (e) {
      console.error("Save draft failed:", e);
      alert("❌ Lưu thất bại!");
    } finally {
      setIsDraftSaving(false);
    }
  };

  const handlePublishBlog = async () => {
    if (tagsSelection == null || tagsSelection.length === 0) {
      alert("Vui lòng chọn tags cho bài viết");
      return;
    }

    const confirm = window.confirm(
      "Bạn có chắc chắn muốn lưu và publish blog này không ? Lưu ý: khi publish blog thì không thể chỉnh sửa nữa",
    );

    if (!confirm) return;
    setIsPublishSaving(true);
    try {
      const { data } = await blogApi.saveAndPublishBlog({
        title,
        content,
        tags: tagsSelection,
        coverImage: coverImageFile,
      });
      setEditingBlogId(data.result.blogId); // lưu lại ID sau khi tạo
      alert("✅ Đã lưu và publish blog thành công!");
    } catch (e) {
      console.log("Eror: ", e);
    } finally {
      setIsPublishSaving(false);
    }
  };

  // ── Edit blog từ ProfileContent ───────────────────────────────
  const handleEditBlog = async (blogId: string) => {
    setIsLoadingBlog(true);
    try {
      const { data } = await blogApi.getBlogDetailById(blogId);
      const blog = data.result;
      setTitle(blog.title ?? "");
      setContent(blog.content ?? "");
      setCoverImageUrl(blog?.coverImageUrl ?? "");
      setCoverImageFile(null); // reset file cũ
      setTagsSelection(blog.tags ?? []);
      setEditingBlogId(blogId);
      setActiveView("write");
    } catch (e) {
      console.error("Failed to load blog:", e);
    } finally {
      setIsLoadingBlog(false);
    }
  };

  const sideItems: {
    icon: React.ReactNode;
    label: string;
    view?: ActiveView;
    href?: string;
  }[] = [
    { icon: <LayoutDashboard size={20} />, label: "Home", href: "/" },
    { icon: <PenLine size={20} />, label: "Write", view: "write" },
    { icon: <BarChart size={20} />, label: "Stats", view: "stats" },
    { icon: <UserCircle size={20} />, label: "Profile", view: "profile" },
    { icon: <Settings size={20} />, label: "Settings", view: "settings" },
  ];

  const handleActiveView = (view: ActiveView) => {
    if (editingBlogId && view === "write") {
      const confirmed = window.confirm("Bỏ bài đang edit và tạo bài mới?");
      if (!confirmed) return;
      setTitle("");
      setContent("");
      setCoverImageUrl("");
      setCoverImageFile(null);
      setTagsSelection([]);
      setEditingBlogId(null);
    }
    setActiveView(view);
  };

  return (
    <div
      style={{
        background: "#ebf4f5",
        fontFamily: "var(--font-sans)",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Top Bar */}
      <div
        className="shrink-0 flex items-center justify-between px-6 h-14 bg-white"
        style={{ borderBottom: "3px solid #0d0d0d", zIndex: 50 }}
      >
        <div className="flex">
          <Link to="/">
            <span
              className="text-xl font-black"
              style={{ fontFamily: "var(--font-display)", color: "#0d0d0d" }}
            >
              Blog<span style={{ color: "#d32f2f" }}>AI</span>
            </span>
          </Link>

          {activeView === "write" && (
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Your story begins here..."
              className="flex-1 mx-6 pr-6 text-base font-bold bg-transparent outline-none"
              style={{
                fontFamily: "var(--font-display)",
                color: "#0d0d0d",
                borderBottom: "2px solid #0d0d0d",
                paddingBottom: "3px",
              }}
            />
          )}
          {activeView !== "write" && (
            <span
              className="flex-1 mx-6 text-base font-black uppercase tracking-widest"
              style={{ fontFamily: "var(--font-display)", color: "#0d0d0d" }}
            >
              {activeView === "stats"
                ? "Your Statistics"
                : activeView === "profile"
                  ? "Your Profile"
                  : "Settings"}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <h3
            className="font-black text-xl mb-0.5"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {user?.fullName}
          </h3>

          <img
            src={
              user?.avatarUrl ||
              "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face"
            }
            alt="user"
            className="w-12 h-12 rounded-full object-cover shrink-0"
            style={{ border: "2px solid #0d0d0d" }}
          />
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div
          className="w-20 shrink-0 gap-2 bg-white flex flex-col"
          style={{ borderRight: "2px solid #0d0d0d" }}
        >
          {sideItems.map((item) =>
            item.href ? (
              <Link to={item.href} key={item.label}>
                <SideItem
                  icon={item.icon}
                  label={item.label}
                  active={false}
                  onClick={() => {}}
                />
              </Link>
            ) : (
              <SideItem
                key={item.label}
                icon={item.icon}
                label={item.label}
                active={activeView === item.view}
                onClick={() => handleActiveView(item.view!)}
              />
            ),
          )}
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-hidden flex flex-col">
          {activeView === "write" && (
            <WriteView
              key={editingBlogId ?? "new"}
              title={title}
              setTitle={setTitle}
              content={content}
              setContent={setContent}
              coverImageUrl={coverImageUrl}
              coverImageFile={coverImageFile}
              setCoverImageFile={setCoverImageFile}
              tags={tagsSelection}
              setTags={setTagsSelection}
              onSaveDraft={handleSaveDraft} // ← truyền callback xuống
              isDraftSaving={isDraftSaving}
              isPublishSaving={isPublishSaving}
              onSavePublish={handlePublishBlog}
            />
          )}
          {activeView === "stats" && <StatsContent />}
          {activeView === "profile" && (
            <ProfileContent onEditBlog={handleEditBlog} />
          )}
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
