import { Search } from "lucide-react";
import ConversationItem from "./ConversationItem";
import { ConversationResponse } from "../types/message.types";

interface Props {
  conversations: ConversationResponse[];
  selectedConv: ConversationResponse | null;
  searchQuery: string;
  userId?: string;
  onSelect: (c: ConversationResponse) => void;
  onSearch: (q: string) => void;
}

export default function ConversationList({
  conversations,
  selectedConv,
  searchQuery,
  userId,
  onSelect,
  onSearch,
}: Props) {
  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-white dark:bg-zinc-900 h-full">
      {/* Search */}
      <div className="p-3 border-b-2 border-[#0d0d0d] dark:border-zinc-700">
        <div className="relative">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#999] dark:text-zinc-500"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearch(e.target.value)}
            placeholder="Search by name or email..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-white dark:bg-zinc-800 text-[#0d0d0d] dark:text-white outline-none border-2 border-[#0d0d0d] dark:border-zinc-600"
          />
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto">
        {conversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-2 px-4 text-center">
            <Search size={28} className="text-[#ccc] dark:text-zinc-600" />
            <p className="text-xs font-bold uppercase text-[#aaa] dark:text-zinc-500 font-display">
              {searchQuery
                ? "Không tìm thấy người dùng"
                : "Chưa có cuộc trò chuyện"}
            </p>
            <p className="text-xs text-[#bbb] dark:text-zinc-600">
              Chỉ hiển thị người dùng đã follow nhau
            </p>
          </div>
        ) : (
          conversations.map((conv) => (
            <ConversationItem
              key={conv.otherUser.id}
              conv={conv}
              isActive={selectedConv?.otherUser.id === conv.otherUser.id}
              userId={userId}
              onSelect={onSelect}
            />
          ))
        )}
      </div>
    </div>
  );
}
