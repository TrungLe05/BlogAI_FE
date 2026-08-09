import { useUserSearch } from "@/features/user/hooks/useUserSearch";
import { User } from "@/features/user/types/user.types";
import { Loader2, Search, UserRound, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

interface Props {
  /** Gọi khi user chọn kết quả hoặc nhấn Escape (chỉ cần ở mobile menu) */
  onClose?: () => void;
}

function getInitials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

function Avatar({ user }: { user: User }) {
  if (user.avatarUrl) {
    return (
      <img
        src={user.avatarUrl}
        alt={user.fullName}
        className="w-9 h-9 rounded-full object-cover shrink-0 ring-1 ring-black/10"
      />
    );
  }
  return (
    <div className="w-9 h-9 rounded-full bg-[#d32f2f] flex items-center justify-center shrink-0 ring-1 ring-black/10">
      <span className="text-white text-[11px] font-bold tracking-wider select-none">
        {getInitials(user.fullName)}
      </span>
    </div>
  );
}

function UserRow({ user, onClick }: { user: User; onClick: () => void }) {
  return (
    <button
      type="button"
      onMouseDown={(e) => e.preventDefault()} // giữ focus input khi click kết quả
      onClick={onClick}
      className="w-full flex items-center gap-3 px-4 py-2.5 text-left
                 hover:bg-black/4 dark:hover:bg-white/5
                 transition-colors group"
    >
      <Avatar user={user} />
      <div className="flex-1 min-w-0">
        <p
          className="text-[13px] font-semibold text-[#0d0d0d] dark:text-zinc-100 truncate
                      group-hover:text-[#d32f2f] transition-colors leading-tight"
        >
          {user.fullName}
        </p>
        <p className="text-[11px] text-gray-400 dark:text-zinc-500 truncate mt-0.5 leading-tight">
          {user.email}
        </p>
      </div>
      {user.following && (
        <span
          className="shrink-0 text-[9px] font-bold uppercase tracking-wider
                         text-[#d32f2f] border border-[#d32f2f]/60 px-1.5 py-0.5 rounded-sm"
        >
          Following
        </span>
      )}
    </button>
  );
}

export default function UserSearchBox({ onClose }: Props) {
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [isFocused, setFocused] = useState(false);

  const {
    keyword,
    setKeyword,
    results,
    isLoading,
    pagination,
    loadMore,
    clear,
  } = useUserSearch();

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    function handle(e: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setFocused(false);
      }
    }
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, []);

  // Escape đóng và clear
  useEffect(() => {
    function handle(e: KeyboardEvent) {
      if (e.key === "Escape") {
        clear();
        setFocused(false);
        onClose?.();
      }
    }
    document.addEventListener("keydown", handle);
    return () => document.removeEventListener("keydown", handle);
  }, [clear, onClose]);

  const handleSelect = (userId: string) => {
    navigate(`/user/${userId}`);
    clear();
    setFocused(false);
    onClose?.();
  };

  const showDropdown = isFocused && keyword.trim().length > 0;
  const hasResults = results.length > 0;

  return (
    <div ref={wrapperRef} className="relative w-full max-w-105">
      {/* ── Input wrapper ──────────────────────────────── */}
      <div
        className={[
          // Base: gradient xám từ trái qua phải, bo nhẹ
          "flex items-center gap-2.5 px-3.5 py-2",
          "rounded-full transition-all duration-200",
          // Background gradient tạo hiệu ứng nổi nhẹ
          "bg-linear-to-r from-black/[0.07] via-black/5 to-black/3",
          "dark:from-white/8 dark:via-white/5 dark:to-white/2",
          // Border: transparent bình thường, visible khi focus
          isFocused
            ? "ring-1 ring-black/20 dark:ring-white/20 shadow-sm"
            : "ring-1 ring-transparent",
        ].join(" ")}
      >
        {/* Icon search / spinner — nằm trong input bên trái */}
        {isLoading ? (
          <Loader2 size={15} className="shrink-0 text-[#d32f2f] animate-spin" />
        ) : (
          <Search
            size={15}
            className={`shrink-0 transition-colors duration-200 ${
              isFocused ? "text-[#d32f2f]" : "text-gray-400 dark:text-zinc-400"
            }`}
          />
        )}

        {/* Input */}
        <input
          ref={inputRef}
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onFocus={() => setFocused(true)}
          placeholder="Search people..."
          className="flex-1 min-w-0 bg-transparent outline-none border-none
                     text-[13px] text-[#0d0d0d] dark:text-zinc-100
                     placeholder:text-gray-400 dark:placeholder:text-zinc-400
                     caret-[#d32f2f]"
        />

        {/* Clear button — chỉ hiện khi có keyword */}
        {keyword && (
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => {
              clear();
              inputRef.current?.focus();
            }}
            className="shrink-0 w-4 h-4 rounded-full bg-black/10 dark:bg-white/10
                       flex items-center justify-center
                       hover:bg-black/20 dark:hover:bg-white/20 transition-colors"
            aria-label="Clear"
          >
            <X size={9} className="text-gray-600 dark:text-zinc-300" />
          </button>
        )}
      </div>

      {/* ── Dropdown ───────────────────────────────────── */}
      {showDropdown && (
        <div
          className="absolute top-full left-1/2 -translate-x-1/2 mt-2
                     w-90 z-50 rounded-xl overflow-hidden
                     bg-white dark:bg-zinc-800
                     shadow-[0_8px_30px_rgba(0,0,0,0.12)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.4)]
                     border border-black/6 dark:border-white/8"
        >
          {/* Không có kết quả */}
          {!isLoading && !hasResults && (
            <div className="flex flex-col items-center gap-2 py-10">
              <UserRound
                size={28}
                className="text-gray-200 dark:text-zinc-600"
              />
              <p className="text-[13px] font-medium text-gray-400 dark:text-zinc-500">
                No users found
              </p>
              <p className="text-[11px] text-gray-300 dark:text-zinc-600">
                Try a different name or email
              </p>
            </div>
          )}

          {/* Kết quả */}
          {hasResults && (
            <>
              {/* Header tóm tắt */}
              <div className="px-4 py-2 border-b border-black/4 dark:border-white/5">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 dark:text-zinc-500">
                  {pagination?.totalElements ?? results.length} result
                  {(pagination?.totalElements ?? results.length) !== 1
                    ? "s"
                    : ""}
                </p>
              </div>

              <div className="py-1">
                {results.map((user) => (
                  <UserRow
                    key={user.id}
                    user={user}
                    onClick={() => handleSelect(user.id)}
                  />
                ))}
              </div>

              {/* Load more */}
              {pagination?.hasNext && (
                <div className="border-t border-black/4 dark:border-white/5">
                  <button
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={loadMore}
                    disabled={isLoading}
                    className="w-full py-2.5 text-[12px] font-semibold
                               text-gray-500 dark:text-zinc-400
                               hover:text-[#d32f2f] dark:hover:text-[#f87171]
                               hover:bg-black/2 dark:hover:bg-white/3
                               transition-colors disabled:opacity-40"
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center gap-1.5">
                        <Loader2 size={11} className="animate-spin" /> Loading…
                      </span>
                    ) : (
                      "Show more results"
                    )}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
