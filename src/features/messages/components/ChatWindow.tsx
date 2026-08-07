import MessageBubble from "./MessageBubble";
import MessageInput from "./MessageInput";
import TypingDots from "./TypingDots";
import { MessageResponse, PendingFile } from "../types/message.types";
import { ConversationResponse } from "@/types/response/conversationResponse.types";

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
}

export default function ChatWindow({
  conv, messages, inputText, isOtherTyping, isSending,
  userId, inputRef, messagesEndRef, scrollContainerRef,
  isLoadingMore, hasMore, pendingFile,
  onInputChange, onSend, onScroll, onFileSelect, onClearFile, onImageClick,
}: Props) {
  return (
    <>
      {/* Header */}
      <div className="shrink-0 flex items-center px-5 py-3 bg-white dark:bg-zinc-900 border-b-[3px] border-[#0d0d0d] dark:border-zinc-700">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              src={conv.otherUser.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(conv.otherUser.fullName)}&background=d32f2f&color=fff`}
              alt={conv.otherUser.fullName}
              className="w-9 h-9 rounded-full object-cover border-2 border-[#0d0d0d] dark:border-zinc-600"
            />
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-green-500 border-2 border-white dark:border-zinc-900" />
          </div>
          <div>
            <p className="text-sm font-black text-[#0d0d0d] dark:text-white font-display" >
              {conv.otherUser.fullName}
            </p>
            <p className="text-xs text-[#888] dark:text-zinc-500">{conv.otherUser.email}</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollContainerRef} onScroll={onScroll} className="flex-1 overflow-y-auto px-5 py-4 bg-[#ebf4f5] dark:bg-zinc-950">
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
    </>
  );
}