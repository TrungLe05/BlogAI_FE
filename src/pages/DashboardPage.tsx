import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
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
  Sparkles,
  RefreshCw,
  CheckCheck,
  ChevronDown,
  ChevronUp,
  Wand2,
  UserCircle,
  MessageCircle,
  Bell,
  Search,
} from "lucide-react";
import { ProfileContent } from "@/components/dashboard/ProfileContent";
import { StatsContent } from "@/components/dashboard/StatsContent";
import useAuthStore from "@/stores/authStore";
import blogApi from "@/api/blogApi";
import { RichEditor } from "@/components/dashboard/RichEditor";
import { TagResponse } from "@/types/blog.types";
import { AvatarDropdown } from "@/components/dashboard/AvatarDropdown";

type ActiveView = "write" | "stats" | "profile" | "settings";

// ── AI Title Generator (PRESERVED — no changes) ───────────────────
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
async function generateTitlesFromAI(content: string): Promise<string[]> {
  const { data } = await blogApi.generateTitles(content);
  return data.result;
}

function AISummaryPanel({
  content,
  summary,
  onSummaryChange,
}: {
  content: string;
  summary: string;
  onSummaryChange: (s: string) => void;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const hasContent = content.trim().split(/\s+/).filter(Boolean).length >= 10;

  const handleGenerate = async () => {
    if (!hasContent) return;
    setIsLoading(true);
    try {
      const { data } = await blogApi.generateSummary(content);
      onSummaryChange(data.result);
    } catch (e) {
      console.error("Generate summary failed:", e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="mb-8"
      style={{
        border: "3px solid #0d0d0d",
        boxShadow: "4px 4px 0 #0d0d0d",
        background: "white",
      }}
    >
      <div
        className="flex items-center justify-between px-6 py-4"
        style={{ background: "#0d0d0d" }}
      >
        <div className="flex items-center gap-3">
          <Sparkles size={16} color="#d32f2f" />
          <span
            className="font-black text-xs uppercase tracking-[0.15em] text-white"
            style={{ fontFamily: "var(--font-display)" }}
          >
            AI Summary
          </span>
          <span
            className="px-2 py-0.5 text-xs font-black uppercase tracking-widest"
            style={{
              background: "#d32f2f",
              color: "white",
              fontFamily: "var(--font-display)",
            }}
          >
            BETA
          </span>
        </div>
        <button
          onClick={handleGenerate}
          disabled={!hasContent || isLoading}
          className="flex items-center gap-2 px-4 py-2 text-xs font-black uppercase tracking-widest"
          style={{
            fontFamily: "var(--font-display)",
            background: hasContent && !isLoading ? "#d32f2f" : "#555",
            color: "white",
            border: "3px solid white",
            cursor: hasContent && !isLoading ? "pointer" : "not-allowed",
            opacity: !hasContent ? 0.5 : 1,
          }}
        >
          {isLoading ? (
            <>
              <RefreshCw size={12} className="animate-spin" /> Generating...
            </>
          ) : summary ? (
            <>
              <RefreshCw size={12} /> Regenerate
            </>
          ) : (
            <>
              <Wand2 size={12} /> Generate
            </>
          )}
        </button>
      </div>
      <div className="p-5">
        <p
          className="text-xs font-black uppercase tracking-[0.15em] mb-3"
          style={{ fontFamily: "var(--font-display)", color: "#8f6f6c" }}
        >
          {summary
            ? "AI generated — edit freely ↓"
            : "Or write your own summary ↓"}
        </p>
        <textarea
          value={summary}
          onChange={(e) => onSummaryChange(e.target.value)}
          placeholder="Write a short summary to hook your readers..."
          rows={3}
          className="w-full p-4 text-sm outline-none resize-none"
          style={{
            border: `3px solid ${summary.length > 200 ? "#d32f2f" : "#0d0d0d"}`,
            fontFamily: "var(--font-sans)",
            background: "#f2fbfc",
          }}
        />
        <p
          className="text-xs mt-1 text-right"
          style={{ color: summary.length > 200 ? "#d32f2f" : "#8f6f6c" }}
        >
          {summary.length}/200
        </p>
      </div>
    </div>
  );
}
// ── AI Title Panel (Stitch design refinements) ────────────────────
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
      const titles = await generateTitlesFromAI(content); // ✅ gọi backend
      setSuggestions(titles);
    } catch (e) {
      console.error("Generate titles failed:", e);
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
      className="mb-8"
      style={{
        border: "3px solid #0d0d0d",
        boxShadow: "4px 4px 0 #d32f2f",
        background: "white",
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-6 py-4 cursor-pointer select-none"
        style={{
          background: "#0d0d0d",
          borderBottom: isOpen ? "3px solid #0d0d0d" : "none",
        }}
        onClick={() => isOpen && !isLoading && setIsOpen(false)}
      >
        <div className="flex items-center gap-3">
          <Sparkles size={16} color="#d32f2f" />
          <span
            className="font-black text-xs uppercase tracking-[0.15em] text-white"
            style={{ fontFamily: "var(--font-display)" }}
          >
            AI Title Generator
          </span>
          <span
            className="px-2 py-0.5 text-xs font-black uppercase tracking-widest"
            style={{
              background: "#d32f2f",
              color: "white",
              fontFamily: "var(--font-display)",
            }}
          >
            BETA
          </span>
        </div>
        <div className="flex items-center gap-3">
          {!hasContent && (
            <span
              className="text-xs text-white/40"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Write 10+ words first
            </span>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleGenerate();
            }}
            disabled={!hasContent || isLoading}
            className="flex items-center gap-2 px-4 py-2 text-xs font-black uppercase tracking-widest transition-all cursor-pointer"
            style={{
              fontFamily: "var(--font-display)",
              background: hasContent && !isLoading ? "#d32f2f" : "#555",
              color: "white",
              border: "3px solid white",
              boxShadow:
                hasContent && !isLoading
                  ? "3px 3px 0 rgba(255,255,255,0.3)"
                  : "none",
              cursor: hasContent && !isLoading ? "pointer" : "not-allowed",
              opacity: !hasContent ? 0.5 : 1,
            }}
          >
            {isLoading ? (
              <>
                <RefreshCw size={12} className="animate-spin" /> Generating
                {dots}
              </>
            ) : suggestions.length > 0 ? (
              <>
                <RefreshCw size={12} /> Regenerate
              </>
            ) : (
              <>
                <Wand2 size={12} /> Generate
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
              <ChevronUp size={16} color="white" />
            </button>
          )}
          {!isOpen && suggestions.length > 0 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsOpen(true);
              }}
            >
              <ChevronDown size={16} color="white" />
            </button>
          )}
        </div>
      </div>
      {/* Suggestions */}
      {isOpen && (
        <div className="p-5">
          {isLoading ? (
            <div className="space-y-3">
              <p
                className="text-xs font-black uppercase tracking-[0.15em] mb-3 flex items-center gap-2"
                style={{ fontFamily: "var(--font-display)", color: "#d32f2f" }}
              >
                <Sparkles size={12} className="animate-pulse" />
                Analysing{dots}
              </p>
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="animate-pulse"
                  style={{
                    height: "48px",
                    background: `rgba(211,47,47,${0.04 * i + 0.04})`,
                    border: "3px solid #e7f0f1",
                  }}
                />
              ))}
            </div>
          ) : suggestions.length > 0 ? (
            <div>
              <p
                className="text-xs font-black uppercase tracking-[0.15em] mb-4"
                style={{ fontFamily: "var(--font-display)", color: "#8f6f6c" }}
              >
                Click to apply ↓
              </p>
              <div className="space-y-3">
                {suggestions.map((s, i) => {
                  const isApplied = applied === s;
                  return (
                    <button
                      key={i}
                      onClick={() => handleApply(s)}
                      className="w-full text-left flex items-start justify-between gap-3 transition-all group cursor-pointer"
                      style={{
                        padding: "12px 16px",
                        border: `3px solid ${isApplied ? "#d32f2f" : "#0d0d0d"}`,
                        background: isApplied ? "#d32f2f" : "white",
                        boxShadow: isApplied ? "4px 4px 0 #0d0d0d" : "none",
                        transform: isApplied ? "translate(-4px,-4px)" : "none",
                      }}
                      onMouseEnter={(e) => {
                        if (!isApplied) {
                          e.currentTarget.style.transform =
                            "translate(-4px,-4px)";
                          e.currentTarget.style.boxShadow = "4px 4px 0 #d32f2f";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isApplied) {
                          e.currentTarget.style.transform = "translate(0,0)";
                          e.currentTarget.style.boxShadow = "none";
                        }
                      }}
                    >
                      <div className="flex items-start gap-3 flex-1">
                        <span
                          className="shrink-0 w-6 h-6 flex items-center justify-center text-xs font-black"
                          style={{
                            fontFamily: "var(--font-display)",
                            background: isApplied ? "white" : "#0d0d0d",
                            color: isApplied ? "#d32f2f" : "white",
                          }}
                        >
                          {i + 1}
                        </span>
                        <span
                          className="text-sm font-bold leading-snug"
                          style={{
                            fontFamily: "var(--font-display)",
                            color: isApplied ? "white" : "#151d1e",
                          }}
                        >
                          {s}
                        </span>
                      </div>
                      {isApplied ? (
                        <CheckCheck
                          size={15}
                          color="white"
                          className="shrink-0 mt-0.5"
                        />
                      ) : (
                        <span
                          className="text-xs font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 shrink-0"
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

// ── WriteView Props (PRESERVED) ───────────────────────────────────
type WriteViewProps = {
  title: string;
  setTitle: (v: string) => void;
  summary: string; // ✅ thêm
  setSummary: (v: string) => void; // ✅ thêm
  content: string;
  setContent: (v: string) => void;
  coverImageUrl: string;
  coverImageFile: File | null;
  setCoverImageFile: (f: File | null) => void;
  tags: string[];
  setTags: (t: string[]) => void;
  onSaveDraft: () => void;
  onSavePublish: () => void;
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
  const [activeTab, setActiveTab] = useState<"write" | "preview">("write");
  const [tagsData, setTagsData] = useState<TagResponse[] | null>([]);
  const [selectedGroup, setSelectedGroup] = useState("");
  const [selectedTagInGroup, setSelectedTagInGroup] = useState("");
  const [coverImagePreview, setCoverImagePreview] = useState<string | null>(
    coverImageUrl || null,
  );
  const fileInputRef = useRef<HTMLInputElement>(null);
  const wordCount = content.split(/\s+/).filter(Boolean).length;

  // ── API calls (PRESERVED) ─────────────────────────
  useEffect(() => {
    if (coverImageUrl) setCoverImagePreview(coverImageUrl);
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
            className="px-8 py-3.5 text-xs font-black uppercase tracking-[0.15em] transition-colors cursor-pointer"
            style={{
              fontFamily: "var(--font-display)",
              background: activeTab === tab ? "#0d0d0d" : "transparent",
              color: activeTab === tab ? "white" : "#5b403d",
              borderRight: "3px solid #0d0d0d",
            }}
          >
            {tab === "write" && (
              <span className="flex items-center gap-2">
                <PenLine size={14} /> Write
              </span>
            )}
            {tab === "preview" && (
              <span className="flex items-center gap-2">
                <Eye size={14} /> Preview
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-auto" style={{ background: "#f2fbfc" }}>
        {/* ── Write Tab ── */}
        {activeTab === "write" && (
          <div className="max-w-250 mx-auto p-8">
            <AITitlePanel content={content} onApply={setTitle} />
            {/* <AISummaryPanel // ✅ thêm
              content={content}
              summary={summary}
              onSummaryChange={setSummary}
            /> */}
            {/* Tag Selection */}
            <div className="max-w-full mx-auto pb-6">
              <div
                className="bg-white p-8"
                style={{
                  border: "3px solid #0d0d0d",
                  boxShadow: "4px 4px 0 #0d0d0d",
                }}
              >
                <h2
                  className="font-black text-sm uppercase tracking-widest mb-6"
                  style={{
                    fontFamily: "var(--font-display)",
                    color: "#151d1e",
                  }}
                >
                  Post Tags
                </h2>

                <div className="mb-5">
                  <label
                    className="block mb-2 text-xs font-black uppercase tracking-[0.15em]"
                    style={{
                      fontFamily: "var(--font-display)",
                      color: "#5b403d",
                    }}
                  >
                    <Tag size={12} className="inline mr-1.5" />
                    Tags (max 5)
                  </label>

                  <div className="flex gap-3 mb-3">
                    <select
                      className="flex-1 px-4 py-3 text-sm outline-none"
                      style={{
                        border: "3px solid #0d0d0d",
                        background: "#ffffff",
                        fontFamily: "var(--font-sans)",
                      }}
                      value={selectedGroup}
                      onChange={(e) => {
                        setSelectedGroup(e.target.value);
                        setSelectedTagInGroup("");
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

                    <select
                      className="flex-1 px-4 py-3 text-sm outline-none"
                      style={{
                        border: "3px solid #0d0d0d",
                        background: "#ffffff",
                        fontFamily: "var(--font-sans)",
                      }}
                      disabled={!selectedGroup}
                      value={selectedTagInGroup}
                      onChange={(e) => {
                        const tag = e.target.value;
                        if (!tag) return;
                        if (!tags.includes(tag) && tags.length < 5) {
                          setTags([...tags, tag]);
                        }
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

                  {/* Selected tags */}
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <span
                        key={tag}
                        className="flex items-center gap-1.5 px-3 py-1 text-xs font-black uppercase tracking-widest"
                        style={{
                          background: "#0d0d0d",
                          color: "white",
                          fontFamily: "var(--font-display)",
                          border: "3px solid #0d0d0d",
                        }}
                      >
                        {tag}
                        <button
                          onClick={() => removeTag(tag)}
                          className="ml-1 cursor-pointer"
                        >
                          <X size={10} />
                        </button>
                      </span>
                    ))}
                    {tags.length >= 5 && (
                      <span
                        className="text-xs font-black self-center uppercase tracking-widest"
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
                className="mb-6 flex flex-col items-center justify-center cursor-pointer hover:bg-white transition-colors"
                style={{
                  border: "3px dashed #0d0d0d",
                  height: "500px",
                  background: "rgba(255,255,255,0.4)",
                }}
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload
                  size={32}
                  style={{ color: "#8f6f6c", marginBottom: "12px" }}
                />
                <p
                  className="font-black text-xs uppercase tracking-[0.15em]"
                  style={{
                    fontFamily: "var(--font-display)",
                    color: "#8f6f6c",
                  }}
                >
                  Click to upload cover image
                </p>
                <p className="text-xs mt-2" style={{ color: "#b0a0a0" }}>
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
              <div
                className="mb-6 relative"
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
                  className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center bg-white transition-all cursor-pointer"
                  style={{
                    border: "3px solid #0d0d0d",
                    boxShadow: "3px 3px 0 #0d0d0d",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#d32f2f";
                    e.currentTarget.style.color = "white";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "white";
                    e.currentTarget.style.color = "#0d0d0d";
                  }}
                >
                  <X size={14} />
                </button>
              </div>
            )}

            <RichEditor content={content} onChange={setContent} />

            {/* Footer controls */}
            <div className="mt-4 flex justify-between items-center">
              <p
                className="text-xs font-bold"
                style={{ color: "#8f6f6c", fontFamily: "var(--font-display)" }}
              >
                {wordCount} words · ~{Math.ceil(wordCount / 200)} min read
                {wordCount >= 10 && (
                  <span style={{ color: "#d32f2f", marginLeft: "10px" }}>
                    ✦ AI title ready
                  </span>
                )}
              </p>

              <div className="flex gap-4">
                <button
                  className="flex items-center gap-2 px-5 py-2.5 text-xs font-black uppercase tracking-widest transition-all cursor-pointer"
                  style={{
                    fontFamily: "var(--font-display)",
                    background: "white",
                    color: "#151d1e",
                    border: "3px solid #0d0d0d",
                    boxShadow: "4px 4px 0 #0d0d0d",
                  }}
                  onClick={onSaveDraft}
                  disabled={isDraftSaving}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translate(-4px,-4px)";
                    e.currentTarget.style.boxShadow = "8px 8px 0 #0d0d0d";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translate(0,0)";
                    e.currentTarget.style.boxShadow = "4px 4px 0 #0d0d0d";
                  }}
                >
                  <Save size={14} />
                  {isDraftSaving ? "Saving..." : "Save Draft"}
                </button>
                <button
                  className="flex items-center gap-2 px-5 py-2.5 text-xs font-black uppercase tracking-widest transition-all cursor-pointer"
                  style={{
                    fontFamily: "var(--font-display)",
                    background: "#af101a",
                    color: "white",
                    border: "3px solid #0d0d0d",
                    boxShadow: "4px 4px 0 #0d0d0d",
                  }}
                  onClick={onSavePublish}
                  disabled={isPublishSaving}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translate(-4px,-4px)";
                    e.currentTarget.style.boxShadow = "8px 8px 0 #0d0d0d";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translate(0,0)";
                    e.currentTarget.style.boxShadow = "4px 4px 0 #0d0d0d";
                  }}
                >
                  <Save size={14} />{" "}
                  {isPublishSaving ? "Publishing..." : "Publish"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── Preview Tab ── */}
        {activeTab === "preview" && (
          <div className="max-w-200 mx-auto p-8">
            <div
              className="bg-white p-10"
              style={{
                border: "3px solid #0d0d0d",
                boxShadow: "4px 4px 0 #0d0d0d",
              }}
            >
              <h1
                className="text-4xl font-black mb-8"
                style={{
                  fontFamily: "var(--font-display)",
                  color: "#0d0d0d",
                  letterSpacing: "-0.02em",
                  lineHeight: 1.1,
                }}
              >
                {title || "Your Post Title"}
              </h1>
              {content ? (
                <div
                  className="prose-content"
                  dangerouslySetInnerHTML={{ __html: content }}
                />
              ) : (
                <p style={{ color: "#8f6f6c" }}>
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
        color: active ? "white" : "#5b403d",
        borderBottom: "3px solid rgba(0,0,0,0.06)",
      }}
    >
      {icon}
      <span
        className="text-xs font-black uppercase tracking-[0.15em]"
        style={{
          fontFamily: "var(--font-display)",
          lineHeight: 1,
          fontSize: "0.6rem",
        }}
      >
        {label}
      </span>
    </button>
  );
}

// ── Dashboard Page (API logic PRESERVED) ──────────────────────────
function DashboardPage() {
  const [activeView, setActiveView] = useState<ActiveView>("write");
  const navigate = useNavigate();
  const [summary, setSummary] = useState("");

  // ── Blog state (PRESERVED) ──
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [coverImageUrl, setCoverImageUrl] = useState("");
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
  const [tagsSelection, setTagsSelection] = useState<string[]>([]);
  const [editingBlogId, setEditingBlogId] = useState<string | null>(null);
  const [isDraftSaving, setIsDraftSaving] = useState(false);
  const [isPublishSaving, setIsPublishSaving] = useState(false);

  const [_isLoadingBlog, setIsLoadingBlog] = useState(false);

  useAuthStore();

  // ── Save Draft (PRESERVED) ────────────────────────
  const handleSaveDraft = async () => {
    if (tagsSelection == null || tagsSelection.length === 0) {
      alert("Vui lòng chọn tags cho bài viết");
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
        alert("✅ Đã cập nhật draft!");
      } else {
        const { data } = await blogApi.saveDraft({
          title,
          summary,
          content,
          tags: tagsSelection,
          coverImage: coverImageFile,
        });
        setEditingBlogId(data.result.blogId);
        alert("✅ Đã lưu draft!");
      }
    } catch (e) {
      console.error("Save draft failed:", e);
      alert("❌ Lưu thất bại!");
    } finally {
      setIsDraftSaving(false);
    }
  };

  // ── Publish (PRESERVED) ───────────────────────────
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
        summary,
        content,
        tags: tagsSelection,
        coverImage: coverImageFile,
      });
      setEditingBlogId(data.result.blogId);
      alert("✅ Đã lưu và publish blog thành công!");
    } catch (e) {
      console.log("Eror: ", e);
    } finally {
      setIsPublishSaving(false);
    }
  };

  // ── Edit blog từ ProfileContent (PRESERVED) ───────
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
        background: "#f2fbfc",
        fontFamily: "var(--font-sans)",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* ▬▬ TOP BAR ▬▬ */}
      <div
        className="shrink-0 flex items-center justify-between px-8 h-14 bg-white"
        style={{ borderBottom: "3px solid #0d0d0d", zIndex: 50 }}
      >
        <div className="flex items-center">
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
              className="flex-1 mx-8 pr-6 text-base font-bold bg-transparent outline-none"
              style={{
                fontFamily: "var(--font-display)",
                color: "#151d1e",
                borderBottom: "3px solid #0d0d0d",
                paddingBottom: "4px",
                minWidth: "300px",
              }}
            />
          )}
          {activeView !== "write" && (
            <span
              className="mx-8 text-sm font-black uppercase tracking-[0.15em]"
              style={{ fontFamily: "var(--font-display)", color: "#151d1e" }}
            >
              {activeView === "stats"
                ? "Your Statistics"
                : activeView === "profile"
                  ? "Your Profile"
                  : "Settings"}
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          {/* Search icon */}
          <button
            title="Search"
            className="w-9 h-9 flex items-center justify-center hover:bg-[#ecf5f6] transition-colors cursor-pointer"
            style={{ border: "3px solid #0d0d0d" }}
          >
            <Search size={16} />
          </button>

          {/* Message icon */}
          <button
            onClick={() => navigate("/messages")}
            title="Messages"
            className="relative w-9 h-9 flex items-center justify-center hover:bg-[#ecf5f6] transition-colors cursor-pointer"
            style={{ border: "3px solid #0d0d0d" }}
          >
            <MessageCircle size={16} />
          </button>

          {/* Notification icon */}
          <button
            title="Notifications"
            className="relative w-9 h-9 flex items-center justify-center hover:bg-[#ecf5f6] transition-colors cursor-pointer"
            style={{ border: "3px solid #0d0d0d" }}
          >
            <Bell size={16} />
            <span
              className="absolute -top-1.5 -right-1.5 w-4 h-4 flex items-center justify-center text-white"
              style={{
                fontSize: "9px",
                fontWeight: 900,
                background: "#d32f2f",
                fontFamily: "var(--font-display)",
                border: "2px solid white",
              }}
            >
              3
            </span>
          </button>

          {/* Avatar Dropdown */}
          <AvatarDropdown
            onSettingsClick={() => handleActiveView("settings")}
          />
        </div>
      </div>

      {/* ▬▬ BODY ▬▬ */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div
          className="w-20 shrink-0 flex flex-col"
          style={{
            borderRight: "3px solid #0d0d0d",
            background: "#ecf5f6",
          }}
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
              summary={summary} // ✅
              setSummary={setSummary}
              content={content}
              setContent={setContent}
              coverImageUrl={coverImageUrl}
              coverImageFile={coverImageFile}
              setCoverImageFile={setCoverImageFile}
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
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
