import { CheckCheck, Check, FileIcon, Loader2 } from "lucide-react";
import { downloadFile } from "@/utils/downloadFile";
import { MessageResponse } from "../types/message.types";

function formatTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return new Date(iso).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
  });
}

interface Props {
  msg: MessageResponse;
  isLast: boolean;
  userId?: string;
  onImageClick: (url: string) => void;
}

export default function MessageBubble({
  msg,
  isLast,
  userId,
  onImageClick,
}: Props) {
  const isMine = msg.senderId === userId;
  const isLastMine = isMine && isLast;
  const isUploading = !!msg.isUploading;

  return (
    <div className={`flex mb-2 ${isMine ? "justify-end" : "justify-start"}`}>
      <div className="flex flex-col gap-0.5" style={{ maxWidth: "65%" }}>
        <div
          className={`text-sm border-2 overflow-hidden
            ${
              isMine
                ? "bg-[#0d0d0d] dark:bg-zinc-700 text-white border-[#0d0d0d] dark:border-zinc-600 shadow-[3px_3px_0_#d32f2f]"
                : "bg-white dark:bg-zinc-800 text-[#0d0d0d] dark:text-zinc-100 border-[#0d0d0d] dark:border-zinc-600 shadow-[3px_3px_0_#0d0d0d] dark:shadow-[3px_3px_0_#52525b]"
            }`}
        >
          {msg.type === "IMAGE" && msg.fileUrl ? (
            <div>
              <button
                onClick={() => !isUploading && onImageClick(msg.fileUrl!)}
                className={`relative block w-full ${isUploading ? "cursor-default" : "cursor-pointer"}`}
              >
                <img
                  src={msg.fileUrl}
                  alt={msg.fileName ?? "image"}
                  className={`max-w-65 max-h-85 object-cover block transition-opacity ${isUploading ? "opacity-60" : "hover:opacity-90"}`}
                />
                {isUploading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                    <Loader2 size={26} className="text-white animate-spin" />
                  </div>
                )}
              </button>
              {msg.content && (
                <p className="px-4 py-2 text-sm">{msg.content}</p>
              )}
            </div>
          ) : msg.type === "FILE" && msg.fileUrl ? (
            <button
              onClick={() =>
                !isUploading &&
                downloadFile(msg.fileUrl!, msg.fileName ?? "file")
              }
              disabled={isUploading}
              className={`flex items-center gap-3 px-4 py-3 transition-opacity w-full text-left
                ${isUploading ? "opacity-70 cursor-default" : "hover:opacity-80 cursor-pointer"}`}
            >
              <div className="w-9 h-9 flex items-center justify-center bg-[#d32f2f] shrink-0">
                {isUploading ? (
                  <Loader2 size={16} className="text-white animate-spin" />
                ) : (
                  <FileIcon size={16} className="text-white" />
                )}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold truncate max-w-40">
                  {msg.fileName ?? "File"}
                </p>
                {msg.fileSize != null && (
                  <p className="text-xs opacity-60">
                    {isUploading
                      ? "Uploading..."
                      : `${(msg.fileSize / 1024).toFixed(1)} KB`}
                  </p>
                )}
              </div>
            </button>
          ) : (
            <p className="px-4 py-2.5" style={{ lineHeight: 1.5 }}>
              {msg.content}
            </p>
          )}
        </div>

        <div
          className={`flex items-center gap-1 ${isMine ? "justify-end" : "justify-start"}`}
        >
          <span
            className="text-xs text-[#aaa] dark:text-zinc-400"
            style={{ fontSize: "10px" }}
          >
            {formatTime(msg.createdAt)}
          </span>
          {isLastMine &&
            (msg.isRead ? (
              <span
                className="flex items-center gap-0.5 text-xs text-[#d32f2f] font-bold font-display"
                style={{ fontSize: "10px" }}
              >
                <CheckCheck size={11} /> Seen
              </span>
            ) : (
              <span
                className="flex items-center gap-0.5 text-xs text-[#aaa] dark:text-zinc-400"
                style={{ fontSize: "10px" }}
              >
                <Check size={11} /> Sent
              </span>
            ))}
        </div>
      </div>
    </div>
  );
}
