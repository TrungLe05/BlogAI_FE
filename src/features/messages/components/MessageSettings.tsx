import { useMemo, useState } from "react";
import {
  FileIcon,
  Search,
  ImageIcon,
  Paperclip,
  Palette,
  Tag,
  X,
} from "lucide-react";
import { downloadFile } from "@/utils/downloadFile";
import { ConversationResponse, MessageResponse } from "../types/message.types";
import { useNavigate } from "react-router-dom";

interface Props {
  conv: ConversationResponse;
  messages: MessageResponse[];
  onImageClick: (url: string) => void;
}

type MediaTab = "images" | "files";

const THEME_COLORS = [
  { name: "Red", value: "#d32f2f" },
  { name: "Blue", value: "#1976d2" },
  { name: "Green", value: "#388e3c" },
  { name: "Purple", value: "#7c3aed" },
  { name: "Orange", value: "#f59e0b" },
  { name: "Pink", value: "#e91e63" },
];

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

// ── Section wrapper — giữ đồng bộ style border/shadow brutalist ──
function Section({
  title,
  icon,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white dark:bg-zinc-900 border-[3px] border-[#0d0d0d] dark:border-zinc-600 shadow-[4px_4px_0_#0d0d0d] dark:shadow-[4px_4px_0_#52525b] p-4">
      <h3 className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[#0d0d0d] dark:text-white font-display mb-3">
        {icon}
        {title}
      </h3>
      {children}
    </div>
  );
}

export default function MessageSettings({
  conv,
  messages,
  onImageClick,
}: Props) {
  // ── 2. Media tabs ──
  const [mediaTab, setMediaTab] = useState<MediaTab>("images");

  // ── 3. Search ──
  const [searchQuery, setSearchQuery] = useState("");

  // ── 4. Theme (lưu tạm ở localStorage theo conversation, chưa nối vào bubble) ──
  const themeKey = `conv-theme-${conv.id}`;
  const [selectedTheme, setSelectedTheme] = useState<string>(
    () => localStorage.getItem(themeKey) || THEME_COLORS[0].value,
  );

  const imageMessages = useMemo(
    () =>
      messages.filter((m) => m.type === "IMAGE" && m.fileUrl && !m.isUploading),
    [messages],
  );
  const fileMessages = useMemo(
    () =>
      messages.filter((m) => m.type === "FILE" && m.fileUrl && !m.isUploading),
    [messages],
  );

  const searchResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];
    return messages.filter(
      (m) => m.type === "TEXT" && m.content?.toLowerCase().includes(q),
    );
  }, [searchQuery, messages]);

  const handleSelectTheme = (value: string) => {
    setSelectedTheme(value);
    localStorage.setItem(themeKey, value);
  };
  const navigate = useNavigate();
  return (
    <div className="flex-1 overflow-y-auto px-5 py-5 bg-[#ebf4f5] dark:bg-zinc-950 space-y-5">
      {/* ── 1. Thông tin người dùng ── */}
      <div className="bg-white dark:bg-zinc-900 border-[3px] border-[#0d0d0d] dark:border-zinc-600 shadow-[4px_4px_0_#0d0d0d] dark:shadow-[4px_4px_0_#52525b] p-6 flex flex-col items-center text-center">
        <img
          src={
            conv.otherUser.avatarUrl ||
            `https://ui-avatars.com/api/?name=${encodeURIComponent(conv.otherUser.fullName)}&background=d32f2f&color=fff`
          }
          alt={conv.otherUser.fullName}
          className="w-20 h-20 rounded-full object-cover border-[3px] border-[#0d0d0d] dark:border-zinc-600 mb-3"
        />
        <p className="font-black text-base text-[#0d0d0d] dark:text-white font-display">
          {conv.otherUser.fullName}
        </p>
        <p className="text-xs text-[#888] dark:text-zinc-500 mt-1">
          {conv.otherUser.email}
        </p>
        <button
          className="brutal-btn-secondary mt-5 text-xs"
          onClick={() => {
            navigate(`/user/${conv.otherUser.id}`);
          }}
        >
          Profile
        </button>
      </div>

      {/* ── 2. Media — 2 tab Images / Files ── */}
      <Section
        title="Shared Media"
        icon={<ImageIcon size={14} className="text-[#d32f2f]" />}
      >
        <div className="flex mb-3 border-2 border-[#0d0d0d] dark:border-zinc-600">
          {(["images", "files"] as MediaTab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setMediaTab(tab)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-black uppercase tracking-widest transition-colors cursor-pointer
                ${
                  mediaTab === tab
                    ? "bg-[#0d0d0d] dark:bg-zinc-700 text-white"
                    : "bg-transparent text-[#5b403d] dark:text-slate-400 hover:bg-black/5 dark:hover:bg-white/5"
                }`}
            >
              {tab === "images" ? (
                <>
                  <ImageIcon size={13} /> Images ({imageMessages.length})
                </>
              ) : (
                <>
                  <Paperclip size={13} /> Files ({fileMessages.length})
                </>
              )}
            </button>
          ))}
        </div>

        {mediaTab === "images" ? (
          imageMessages.length === 0 ? (
            <p className="text-xs text-[#aaa] dark:text-zinc-500 text-center py-6">
              Chưa có ảnh nào được gửi
            </p>
          ) : (
            <div className="grid grid-cols-3 gap-2">
              {imageMessages.map((m) => (
                <button
                  key={m.id}
                  onClick={() => onImageClick(m.fileUrl!)}
                  className="aspect-square overflow-hidden border-2 border-[#0d0d0d] dark:border-zinc-600 cursor-pointer"
                >
                  <img
                    src={m.fileUrl}
                    alt={m.fileName ?? "image"}
                    className="w-full h-full object-cover hover:opacity-80 transition-opacity"
                  />
                </button>
              ))}
            </div>
          )
        ) : fileMessages.length === 0 ? (
          <p className="text-xs text-[#aaa] dark:text-zinc-500 text-center py-6">
            Chưa có file nào được gửi
          </p>
        ) : (
          <div className="flex flex-col gap-2">
            {fileMessages.map((m) => (
              <button
                key={m.id}
                onClick={() => downloadFile(m.fileUrl!, m.fileName ?? "file")}
                className="flex items-center gap-3 p-2.5 border-2 border-[#0d0d0d] dark:border-zinc-600 hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer text-left"
              >
                <div className="w-8 h-8 flex items-center justify-center bg-[#d32f2f] shrink-0">
                  <FileIcon size={14} className="text-white" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold truncate text-[#0d0d0d] dark:text-white">
                    {m.fileName ?? "File"}
                  </p>
                  <p className="text-[10px] text-[#888] dark:text-zinc-500">
                    {m.fileSize != null
                      ? `${(m.fileSize / 1024).toFixed(1)} KB · `
                      : ""}
                    {formatDate(m.createdAt)}
                  </p>
                </div>
              </button>
            ))}
          </div>
        )}
      </Section>

      {/* ── 3. Tìm kiếm tin nhắn ── */}
      <Section
        title="Search Messages"
        icon={<Search size={14} className="text-[#d32f2f]" />}
      >
        <div className="relative mb-3">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#aaa] dark:text-zinc-500"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm trong đoạn chat này..."
            className="w-full pl-9 pr-8 py-2.5 text-sm outline-none border-2 border-[#0d0d0d] dark:border-zinc-600 bg-white dark:bg-zinc-800 text-[#0d0d0d] dark:text-white"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#aaa] dark:text-zinc-500 hover:text-[#d32f2f] cursor-pointer"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {searchQuery.trim() &&
          (searchResults.length === 0 ? (
            <p className="text-xs text-[#aaa] dark:text-zinc-500 text-center py-4">
              Không tìm thấy kết quả
            </p>
          ) : (
            <div className="flex flex-col gap-2 max-h-60 overflow-y-auto">
              {searchResults.map((m) => (
                <div
                  key={m.id}
                  className="p-2.5 border-2 border-[#0d0d0d] dark:border-zinc-600 bg-white dark:bg-zinc-800"
                >
                  <p className="text-xs text-[#0d0d0d] dark:text-white line-clamp-2">
                    {m.content}
                  </p>
                  <p className="text-[10px] text-[#888] dark:text-zinc-500 mt-1">
                    {formatDate(m.createdAt)}
                  </p>
                </div>
              ))}
            </div>
          ))}
      </Section>

      {/* ── 4. UX: đổi theme + đặt biệt danh ── */}
      <Section
        title="Conversation Theme"
        icon={<Palette size={14} className="text-[#d32f2f]" />}
      >
        <div className="flex flex-wrap gap-2.5">
          {THEME_COLORS.map((c) => (
            <button
              key={c.value}
              onClick={() => handleSelectTheme(c.value)}
              title={c.name}
              className="w-8 h-8 rounded-full border-2 cursor-pointer transition-transform hover:scale-110"
              style={{
                background: c.value,
                borderColor:
                  selectedTheme === c.value ? "#0d0d0d" : "transparent",
                boxShadow:
                  selectedTheme === c.value
                    ? "0 0 0 2px white, 0 0 0 4px #0d0d0d"
                    : "none",
              }}
            />
          ))}
        </div>
        <p className="text-[10px] text-[#aaa] dark:text-zinc-500 mt-3">
          Màu đang được lưu cho cuộc trò chuyện này. Áp dụng màu vào khung chat
          sẽ được hoàn thiện ở bản cập nhật sau.
        </p>
      </Section>

      <Section
        title="Nickname"
        icon={<Tag size={14} className="text-[#d32f2f]" />}
      >
        <input
          type="text"
          disabled
          placeholder="Sắp ra mắt..."
          className="w-full px-3 py-2.5 text-sm outline-none border-2 border-dashed border-[#ccc] dark:border-zinc-700 bg-[#f5f5f5] dark:bg-zinc-800/50 text-[#aaa] dark:text-zinc-500 cursor-not-allowed"
        />
      </Section>
    </div>
  );
}
