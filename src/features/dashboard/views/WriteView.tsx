import { useState, useRef, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Save, Eye, Tag, PenLine, Upload, X, FilePlus2 } from "lucide-react";
import { toast } from "sonner";
import blogApi from "@/features/blog/api/blogApi";
import { RichEditor } from "@/features/dashboard/components/editor/RichEditor";
import { AIEditableField } from "@/features/dashboard/components/editor/AIEditableField";
import { AIPrePublishReviewPanel } from "@/features/dashboard/components/editor/AIPrePublishReviewPanel";
import { usePrePublishReview } from "@/features/dashboard/hooks/usePrePublishReview";
import { extractApiError } from "@/utils/apiError";
import { validateCreateBlog, validateUpdateBlog } from "@/utils/blogValidation";
import {
  FULL_AI_ACTIONS,
  TITLE_AI_ACTIONS,
} from "@/shared/constants/aiActions";
import { TagResponse } from "@/features/blog/types/blog.types";

const emptyState = { title: "", summary: "", content: "", coverImageUrl: "" };

export function WriteView() {
  // ── 1. State giờ nằm hẳn ở đây, không nhận từ props nữa ──
  const [searchParams, setSearchParams] = useSearchParams();
  const editId = searchParams.get("editId");

  const [activeTab, setActiveTab] = useState<"write" | "preview">("write");
  const [title, setTitle] = useState(emptyState.title);
  const [summary, setSummary] = useState(emptyState.summary);
  const [content, setContent] = useState(emptyState.content);
  const [, setCoverImageUrl] = useState(emptyState.coverImageUrl);
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [editingBlogId, setEditingBlogId] = useState<string | null>(null);
  const [isDraftSaving, setIsDraftSaving] = useState(false);
  const [isPublishSaving, setIsPublishSaving] = useState(false);
  const [isLoadingBlog, setIsLoadingBlog] = useState(false);

  const [tagsData, setTagsData] = useState<TagResponse[] | null>([]);
  const [selectedGroup, setSelectedGroup] = useState("");
  const [selectedTagInGroup, setSelectedTagInGroup] = useState("");
  const [coverImagePreview, setCoverImagePreview] = useState<string | null>(
    null,
  );
  const fileInputRef = useRef<HTMLInputElement>(null);
  const wordCount = content.split(/\s+/).filter(Boolean).length;

  const prePublishReview = usePrePublishReview();

  // ── 2. Load danh sách tag (giữ nguyên logic cũ) ──
  useEffect(() => {
    blogApi
      .getAllTag()
      .then(({ data }) => setTagsData(data.result))
      .catch(console.error);
  }, []);

  // ── 3. QUAN TRỌNG: tự load bài viết khi URL có ?editId=... ──
  // (thay thế hoàn toàn cho handleEditBlog trước đây nằm ở DashboardPage)
  useEffect(() => {
    if (!editId || editId === editingBlogId) return;
    setIsLoadingBlog(true);
    blogApi
      .getBlogDetailById(editId)
      .then(({ data }) => {
        const blog = data.result;
        setTitle(blog.title ?? "");
        setSummary(blog.summary ?? "");
        setContent(blog.content ?? "");
        setCoverImageUrl(blog?.coverImageUrl ?? "");
        setCoverImagePreview(blog?.coverImageUrl ?? null);
        setCoverImageFile(null);
        setTags(blog.tags ?? []);
        setEditingBlogId(editId);
      })
      .catch((e) => console.error(e))
      .finally(() => setIsLoadingBlog(false));
  }, [editId, editingBlogId]);

  // ── 4. Reset form dùng chung cho: publish xong / save draft lần đầu / bấm New Post ──
  const resetForm = () => {
    setTitle(emptyState.title);
    setSummary(emptyState.summary);
    setContent(emptyState.content);
    setCoverImageUrl(emptyState.coverImageUrl);
    setCoverImageFile(null);
    setCoverImagePreview(null);
    setTags([]);
    setEditingBlogId(null);
    const next = new URLSearchParams(searchParams);
    next.delete("editId");
    setSearchParams(next, { replace: true });
  };

  const handleNewPost = () => {
    if (!editingBlogId) return;
    toast("Discard current edits?", {
      description: "You are currently editing a post.",
      action: { label: "Confirm", onClick: resetForm },
      cancel: { label: "Cancel", onClick: () => {} },
    });
  };

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
    setCoverImageUrl("");
  };

  const removeTag = (t: string) => setTags(tags.filter((tag) => tag !== t));

  const groupedTags = tagsData?.reduce(
    (acc, item) => {
      if (!acc[item.groupName]) acc[item.groupName] = [];
      acc[item.groupName].push(item.tag);
      return acc;
    },
    {} as Record<string, string[]>,
  );

  const runValidation = () =>
    editingBlogId
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
          tags,
          coverImage: coverImageFile,
        });

  // ── 5. Copy nguyên 3 hàm này từ DashboardPage cũ, chỉ đổi tagsSelection → tags ──
  const handleSaveDraft = async () => {
    const errors = runValidation();
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
          tags,
          coverImage: coverImageFile,
        });
        toast.success("Draft updated successfully");
      } else {
        const { data } = await blogApi.saveDraft({
          title,
          summary,
          content,
          tags,
          coverImage: coverImageFile,
        });
        setEditingBlogId(data.result.blogId);
        toast.success("Draft saved successfully");
        resetForm();
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
          tags,
          coverImage: coverImageFile,
        });
        await blogApi.publishBlog(editingBlogId);
      } else {
        await blogApi.saveAndPublishBlog({
          title,
          summary,
          content,
          tags,
          coverImage: coverImageFile,
        });
      }
      toast.success("Blog published successfully!");
      resetForm();
    } catch (e) {
      toast.error(extractApiError(e));
    } finally {
      setIsPublishSaving(false);
    }
  };

  const handlePublishBlog = () => {
    const errors = runValidation();
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
      cancel: { label: "Publish Now", onClick: () => doPublish() },
    });
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center bg-white dark:bg-[#111318] shrink-0 border-b-[3px] border-[#0d0d0d] dark:border-[#2d3148]">
        {(["write", "preview"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 sm:px-8 py-3 sm:py-3.5 text-xs font-black uppercase tracking-[0.15em] transition-colors cursor-pointer border-r-[3px] border-[#0d0d0d] dark:border-[#2d3148]
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
        {editingBlogId && (
          <button
            onClick={handleNewPost}
            className="ml-auto mr-4 flex items-center gap-1.5 px-3 py-2 text-[0.68rem] font-black uppercase tracking-widest text-[#8f6f6c] dark:text-slate-400 hover:text-[#d32f2f] transition-colors cursor-pointer"
          >
            <FilePlus2 size={13} /> New Post
          </button>
        )}
      </div>

      <div className="flex-1 overflow-auto bg-[#f2fbfc] dark:bg-[#0f1117]">
        {activeTab === "write" && (
          <div className="max-w-250 mx-auto p-4 sm:p-8">
            {isLoadingBlog && (
              <p className="text-xs font-black uppercase tracking-widest text-[#8f6f6c] dark:text-slate-400 mb-4">
                Loading post...
              </p>
            )}

            <div className="mb-5 sm:mb-6">
              <label className="block mb-2 text-xs font-black uppercase tracking-[0.15em] text-[#5b403d] dark:text-slate-400 font-display">
                <PenLine size={11} className="inline mr-1.5" />
                Post Title
                <span className="ml-2 text-[#b0a0a0] normal-case font-normal">
                  {" "}
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
                className="w-full text-xl sm:text-2xl font-bold border-b-2 border-[#0d0d0d] px-2 py-2.5 sm:py-3 outline-none dark:placeholder:text-zinc-400 dark:text-zinc-400 dark:focus:border-zinc-200"
                maxLength={120}
              />
              <p className="text-xs mt-1.5 text-right text-[#b0a0a0] dark:text-slate-500">
                {title.length}/120 chars
              </p>
            </div>

            <div className="mb-6 sm:mb-8">
              <label className="block mb-2 text-xs font-black uppercase tracking-[0.15em] text-[#5b403d] dark:text-slate-400 font-display">
                Summary
                <span className="ml-2 text-[#b0a0a0] normal-case font-normal">
                  {" "}
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
                className="w-full border-[3px] border-[#0d0d0d] p-2.5 sm:p-3 text-sm resize-none dark:placeholder:text-zinc-400 dark:text-zinc-400"
                rows={3}
                maxLength={300}
              />
              <p
                className={`text-xs mt-1 text-right ${summary.length > 200 ? "text-[#d32f2f]" : "text-[#8f6f6c] dark:text-slate-400"}`}
              >
                {summary.length}/200
              </p>
            </div>

            <div className="max-w-full mx-auto pb-6">
              <div className="bg-white dark:bg-[#1a1d26] p-4 sm:p-8 border-[3px] border-[#0d0d0d] dark:border-zinc-600 shadow-[4px_4px_0_#0d0d0d] dark:shadow-[4px_4px_0_#52525b]">
                <h2 className="font-black text-sm uppercase tracking-widest mb-5 sm:mb-6 text-[#151d1e] dark:text-slate-200 font-display">
                  Post Tags
                </h2>
                <div className="mb-5">
                  <label className="block mb-2 text-xs font-black uppercase tracking-[0.15em] text-[#5b403d] dark:text-slate-400 font-display">
                    <Tag size={12} className="inline mr-1.5" />
                    Tags (max 5)
                  </label>
                  <div className="flex flex-col sm:flex-row gap-3 mb-3">
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
                      {(groupedTags?.[selectedGroup] ?? []).map(
                        (tag: string) => (
                          <option
                            key={tag}
                            value={tag}
                            disabled={tags.includes(tag)}
                          >
                            {tag} {tags.includes(tag) ? "✓" : ""}
                          </option>
                        ),
                      )}
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
                      <span className="text-xs font-black self-center uppercase tracking-widest text-[#d32f2f] font-display">
                        Max 5 tags reached
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {!coverImagePreview ? (
              <div
                className="mb-6 flex flex-col items-center justify-center cursor-pointer hover:bg-white dark:hover:bg-[#1a1d26] transition-colors border-[3px] border-dashed border-[#0d0d0d] dark:border-[#2d3148] h-52 sm:h-80 lg:h-125 bg-white/40 dark:bg-[#1a1d26]/40"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload
                  size={28}
                  className="text-[#8f6f6c] dark:text-slate-400 mb-3 sm:size-8"
                />
                <p className="font-black text-xs uppercase tracking-[0.15em] text-[#8f6f6c] dark:text-slate-400 font-display text-center px-4">
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
                  className="w-full h-52 sm:h-80 lg:h-125 object-cover"
                />
                <button
                  onClick={handleRemoveCover}
                  className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center bg-white dark:bg-[#1a1d26] border-[3px] border-[#0d0d0d] dark:border-[#2d3148] shadow-[3px_3px_0_#0d0d0d] dark:shadow-[3px_3px_0_#2d3148] transition-all cursor-pointer hover:bg-[#d32f2f] hover:text-white"
                >
                  <X size={14} />
                </button>
              </div>
            )}

            <RichEditor content={content} onChange={setContent} />

            <div className="mt-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
              <p className="text-xs font-bold text-[#8f6f6c] dark:text-slate-400 font-display">
                {wordCount} words · ~{Math.ceil(wordCount / 200)} min read
              </p>
              <div className="flex gap-3 sm:gap-4">
                <button
                  className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 text-xs font-black uppercase tracking-widest transition-all cursor-pointer bg-white dark:bg-[#1a1d26] text-[#151d1e] dark:text-slate-200 border-[3px] border-[#0d0d0d] dark:border-zinc-600 shadow-[4px_4px_0_#0d0d0d] dark:shadow-[4px_4px_0_#52525b] hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[8px_8px_0_#0d0d0d] dark:hover:shadow-[8px_8px_0_#52525b] disabled:opacity-50"
                  onClick={handleSaveDraft}
                  disabled={isDraftSaving}
                >
                  <Save size={14} />
                  {isDraftSaving ? "Saving..." : "Save Draft"}
                </button>
                <button
                  className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 text-xs font-black uppercase tracking-widest transition-all cursor-pointer bg-[#af101a] text-white border-[3px] border-[#0d0d0d] dark:border-zinc-600 shadow-[4px_4px_0_#0d0d0d] dark:shadow-[4px_4px_0_#52525b] hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[8px_8px_0_#0d0d0d] dark:hover:shadow-[8px_8px_0_#52525b] disabled:opacity-50"
                  onClick={handlePublishBlog}
                  disabled={isPublishSaving}
                >
                  <Save size={14} />
                  {isPublishSaving ? "Publishing..." : "Publish"}
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === "preview" && (
          <div className="max-w-200 mx-auto p-4 sm:p-8">
            <div className="bg-white dark:bg-[#1a1d26] p-5 sm:p-10 border-[3px] border-[#0d0d0d] dark:border-[#2d3148] shadow-[4px_4px_0_#0d0d0d] dark:shadow-[4px_4px_0_#2d3148]">
              <h1
                className="text-2xl sm:text-4xl font-bold mb-5 sm:mb-8 text-[#0d0d0d] dark:text-slate-100 font-display"
                style={{ letterSpacing: "-0.02em", lineHeight: 1.1 }}
              >
                {title || "Your Post Title"}
              </h1>
              <h3
                className="text-lg sm:text-2xl font-bold mb-5 sm:mb-8 text-[#0d0d0d] dark:text-slate-200 font-display"
                style={{ letterSpacing: "-0.02em", lineHeight: 1.1 }}
              >
                {summary || "Your Post Summary"}
              </h3>
              <img src={coverImagePreview ?? ""}/>
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

export default WriteView;
