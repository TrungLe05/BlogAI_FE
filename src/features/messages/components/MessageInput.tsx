import { Send, Paperclip, X, FileIcon, Loader2 } from "lucide-react";
import { PendingFile } from "../types/message.types";

interface Props {
  inputText: string;
  isSending: boolean;
  pendingFile: PendingFile | null;
  inputRef: React.RefObject<HTMLInputElement | null>;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSend: () => void;
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClearFile: () => void;
}

export default function MessageInput({
  inputText,
  isSending,
  pendingFile,
  inputRef,
  onInputChange,
  onSend,
  onFileSelect,
  onClearFile,
}: Props) {
  const canSend = (inputText.trim() || pendingFile) && !isSending;

  return (
    <div className="shrink-0 bg-white dark:bg-zinc-900 border-t-[3px] border-[#0d0d0d] dark:border-zinc-700">
      {pendingFile && (
        <div className="px-5 pt-3">
          <div className="flex items-center gap-3 px-3 py-2 bg-[#ebf4f5] dark:bg-zinc-800 border-2 border-[#0d0d0d] dark:border-zinc-600">
            {pendingFile.isImage ? (
              <img
                src={pendingFile.previewUrl}
                className="w-12 h-12 object-cover border border-[#0d0d0d] shrink-0"
              />
            ) : (
              <div className="w-12 h-12 flex items-center justify-center bg-[#d32f2f] shrink-0">
                <FileIcon size={20} className="text-white" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold truncate text-[#0d0d0d] dark:text-white">
                {pendingFile.file.name}
              </p>
              <p className="text-xs text-[#888]">
                {(pendingFile.file.size / 1024).toFixed(1)} KB
              </p>
            </div>
            <button
              onClick={onClearFile}
              className="w-7 h-7 flex items-center justify-center text-[#888] hover:text-[#d32f2f] cursor-pointer"
            >
              <X size={14} />
            </button>
          </div>
        </div>
      )}

      <div className="flex items-center px-3 sm:px-5 lg:px-5 py-2.5 sm:py-3">
        <div className="flex-1 flex items-center gap-1 min-w-0 bg-[#ebf4f5] dark:bg-zinc-800 border-2 border-[#0d0d0d] dark:border-zinc-600 pl-1 pr-1 focus-within:bg-white dark:focus-within:bg-zinc-900 transition-colors">
          {/* Attach — nằm trong input, bên trái */}
          <label
            title="Đính kèm file"
            className="w-8 h-8 flex items-center justify-center shrink-0 rounded-sm cursor-pointer text-[#5b403d] dark:text-zinc-400 hover:bg-black/5 dark:hover:bg-white/10 hover:text-[#0d0d0d] dark:hover:text-white transition-colors"
          >
            <Paperclip size={16} />
            <input
              type="file"
              className="hidden"
              accept="image/*,.pdf,.doc,.docx,.txt,.xlsx,.pptx"
              onChange={onFileSelect}
            />
          </label>

          {/* Text field — không viền riêng, viền chung với cả thanh */}
          <input
            ref={inputRef}
            type="text"
            value={inputText}
            onChange={onInputChange}
            onKeyDown={(e) => e.key === "Enter" && onSend()}
            placeholder={pendingFile ? "Thêm chú thích..." : "Nhập tin nhắn..."}
            className="flex-1 min-w-0 px-2 py-2 text-sm outline-none bg-transparent text-[#0d0d0d] dark:text-white placeholder:text-[#999] dark:placeholder:text-zinc-500"
          />

          {/* Send — icon-only, nằm trong input, bên phải */}
          <button
            onClick={onSend}
            disabled={!canSend}
            title="Gửi"
            className={`w-8 h-8 flex items-center justify-center shrink-0 rounded-sm transition-all
              ${
                canSend
                  ? "bg-[#d32f2f] text-white hover:bg-[#af101a] hover:scale-105 cursor-pointer"
                  : "bg-transparent text-[#bbb] dark:text-zinc-600 cursor-not-allowed"
              }`}
          >
            {isSending ? (
              <Loader2 size={15} className="animate-spin" />
            ) : (
              <Send size={15} />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
