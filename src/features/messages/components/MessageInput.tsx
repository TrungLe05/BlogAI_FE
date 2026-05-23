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
  inputText, isSending, pendingFile,
  inputRef, onInputChange, onSend, onFileSelect, onClearFile,
}: Props) {
  const canSend = (inputText.trim() || pendingFile) && !isSending;

  return (
    <div className="shrink-0 bg-white dark:bg-zinc-900 border-t-[3px] border-[#0d0d0d] dark:border-zinc-700">
      {pendingFile && (
        <div className="px-5 pt-3">
          <div className="flex items-center gap-3 px-3 py-2 bg-[#ebf4f5] dark:bg-zinc-800 border-2 border-[#0d0d0d] dark:border-zinc-600">
            {pendingFile.isImage ? (
              <img src={pendingFile.previewUrl} className="w-12 h-12 object-cover border border-[#0d0d0d] shrink-0" />
            ) : (
              <div className="w-12 h-12 flex items-center justify-center bg-[#d32f2f] shrink-0">
                <FileIcon size={20} className="text-white" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold truncate text-[#0d0d0d] dark:text-white">{pendingFile.file.name}</p>
              <p className="text-xs text-[#888]">{(pendingFile.file.size / 1024).toFixed(1)} KB</p>
            </div>
            <button onClick={onClearFile} className="w-7 h-7 flex items-center justify-center text-[#888] hover:text-[#d32f2f] cursor-pointer">
              <X size={14} />
            </button>
          </div>
        </div>
      )}

      <div className="flex items-center gap-2 px-5 py-3">
        <label className="w-9 h-9 flex items-center justify-center border-2 border-[#0d0d0d] dark:border-zinc-600 hover:bg-[#ebf4f5] dark:hover:bg-zinc-800 transition-colors cursor-pointer shrink-0">
          <Paperclip size={15} className="text-[#0d0d0d] dark:text-white" />
          <input type="file" className="hidden" accept="image/*,.pdf,.doc,.docx,.txt,.xlsx,.pptx" onChange={onFileSelect} />
        </label>

        <input
          ref={inputRef}
          type="text"
          value={inputText}
          onChange={onInputChange}
          onKeyDown={(e) => e.key === "Enter" && onSend()}
          placeholder={pendingFile ? "Thêm chú thích (tuỳ chọn)..." : "Nhập tin nhắn... (Enter để gửi)"}
          className="flex-1 px-4 py-2.5 text-sm outline-none bg-[#ebf4f5] dark:bg-zinc-800 text-[#0d0d0d] dark:text-white border-2 border-[#0d0d0d] dark:border-zinc-600"
        />

        <button
          onClick={onSend}
          disabled={!canSend}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-black uppercase transition-all border-2 border-[#0d0d0d] dark:border-zinc-600 text-white shrink-0
            ${canSend
              ? "bg-[#d32f2f] shadow-[3px_3px_0_#0d0d0d] hover:-translate-x-0.5 hover:-translate-y-0.5 cursor-pointer"
              : "bg-[#ccc] dark:bg-zinc-600 cursor-not-allowed"
            }`}
          style={{ fontFamily: "var(--font-display)" }}
        >
          {isSending ? <Loader2 size={13} className="animate-spin" /> : <Send size={13} />}
          {isSending ? "..." : "Send"}
        </button>
      </div>
    </div>
  );
}