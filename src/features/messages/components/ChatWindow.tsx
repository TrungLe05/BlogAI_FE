import { useState } from "react";
import {  ChevronLeft, Settings2 } from "lucide-react";
import MessageBubble from "./MessageBubble";
import MessageInput from "./MessageInput";
import TypingDots from "./TypingDots";
import MessageSettings from "./MessageSettings";
import {
  ConversationResponse,
  MessageResponse,
  PendingFile,
} from "../types/message.types";

interface Props {
  conv: ConversationResponse;
  messages: MessageResponse[];
  inputText: string;
  isOtherTyping: boolean;
  isSending: boolean;
  userId?: string;
  inputRef: React.RefObject<HTMLInputElement | null>;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
  scrollContainerRef: React.RefObject<HTMLDivElement | null>;
  isLoadingMore: boolean;
  hasMore: boolean;
  pendingFile: PendingFile | null;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSend: () => void;
  onScroll: () => void;
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClearFile: () => void;
  onImageClick: (url: string) => void;
  onBack: () => void;
}

export default function ChatWindow({
  conv,
  messages,
  inputText,
  isOtherTyping,
  isSending,
  userId,
  inputRef,
  messagesEndRef,
  scrollContainerRef,
  isLoadingMore,
  hasMore,
  pendingFile,
  onInputChange,
  onSend,
  onScroll,
  onFileSelect,
  onClearFile,
  onImageClick,
  onBack
}: Props) {
  // Toggle riêng của ChatWindow — thuần UI, không cần đẩy lên component cha
  const [showSettings, setShowSettings] = useState(false);
  const theme = localStorage.getItem(`conv-theme-${conv.id}`);
  return (
    <div className="relative flex-1 flex flex-col overflow-hidden">
      {/* Header — luôn hiển thị thông tin contact, không đổi theo showSettings */}
      <div className="shrink-0 flex items-center px-5 py-3 bg-white dark:bg-zinc-900 border-b-[3px] border-[#0d0d0d] dark:border-zinc-700">
        <div className="flex justify-between items-center w-full">
          <div className="flex items-center gap-3">
            <button 
            className="sm:hidden text-[#0d0d0d] dark:text-white hover:opacity-70 transition-opacity cursor-pointer"
            onClick={onBack}
            >
              <ChevronLeft size={20} strokeWidth={1.8} />
            </button>
            <div className="relative">
              <img
                src={
                  conv.otherUser.avatarUrl ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(conv.otherUser.fullName)}&background=d32f2f&color=fff`
                }
                alt={conv.otherUser.fullName}
                className="w-9 h-9 rounded-full object-cover border-2 border-[#0d0d0d] dark:border-zinc-600"
              />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-green-500 border-2 border-white dark:border-zinc-900" />
            </div>
            <div>
              <p className="text-sm font-black text-[#0d0d0d] dark:text-white font-display">
                {conv.otherUser.fullName}
              </p>
              <p className="text-xs text-[#888] dark:text-zinc-500">
                {conv.otherUser.email}
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowSettings(true)}
            className="text-[#0d0d0d] dark:text-white hover:opacity-70 transition-opacity cursor-pointer"
            title="Conversation settings"
          >
            <Settings2 size={22} strokeWidth={1.8} />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div
        ref={scrollContainerRef}
        onScroll={onScroll}
        className={`flex-1 overflow-y-auto px-5 py-4 dark:bg-zinc-950 ${theme ? `bg-[${theme}]` : "bg-[#ebf4f5]"}`}
      >
        {isLoadingMore && (
          <div className="flex justify-center py-2">
            <span className="text-xs text-gray-400">Đang tải...</span>
          </div>
        )}
        {!hasMore && (
          <div className="flex justify-center py-2">
            <span className="text-xs text-gray-400">Đã tải hết tin nhắn</span>
          </div>
        )}

        {messages.map((msg, idx) => (
          <MessageBubble
            key={msg.id}
            msg={msg}
            isLast={idx === messages.length - 1}
            userId={userId}
            onImageClick={onImageClick}
          />
        ))}

        {isOtherTyping && (
          <div className="flex justify-start mb-2">
            <div className="bg-white dark:bg-zinc-800 border-2 border-[#0d0d0d] dark:border-zinc-600 shadow-[3px_3px_0_#0d0d0d]">
              <TypingDots />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <MessageInput
        inputText={inputText}
        isSending={isSending}
        pendingFile={pendingFile}
        inputRef={inputRef}
        onInputChange={onInputChange}
        onSend={onSend}
        onFileSelect={onFileSelect}
        onClearFile={onClearFile}
      />

      {/* Backdrop mờ — chỉ để bấm ra ngoài là đóng panel, không cản việc đọc chat bên dưới */}
      <div
        onClick={() => setShowSettings(false)}
        className={`absolute inset-0 bg-black/20 z-20 transition-opacity duration-300 ${
          showSettings
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Sliding settings panel — trượt từ phải, đè lên trên chat, không thay thế nó */}
      <div
        className={`absolute top-0 right-0 h-full w-full sm:w-96 bg-white dark:bg-zinc-900 border-l-[3px] border-[#0d0d0d] dark:border-zinc-700 shadow-[-6px_0_20px_rgba(0,0,0,0.15)] z-30 flex flex-col transition-transform duration-300 ease-in-out ${
          showSettings ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="shrink-0 flex items-center gap-3 px-5 py-3 border-b-[3px] border-[#0d0d0d] dark:border-zinc-700">
          <button
            onClick={() => setShowSettings(false)}
            className=" px-2 py-2 rounded-2xl flex items-center justify-center dark:border-zinc-600 text-[#0d0d0d] dark:text-white hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer shrink-0"
          >
            <ChevronLeft size={18} strokeWidth={1.8}/>
          </button>
          <p className="text-sm font-black text-[#0d0d0d] dark:text-white font-display uppercase tracking-widest">
            Conversation Info
          </p>
        </div>
        <MessageSettings
          conv={conv}
          messages={messages}
          onImageClick={onImageClick}
        />
      </div>
    </div>
  );
}
