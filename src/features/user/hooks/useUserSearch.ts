import { User } from "@/features/user/types/user.types";
import { userApi, PagedResponse } from "@/features/user/api/userApi";
import { useEffect, useRef, useState } from "react";

interface UseUserSearchResult {
  keyword: string;
  setKeyword: (v: string) => void;
  results: User[];
  isLoading: boolean;
  pagination: Omit<PagedResponse<User>, "items"> | null;
  loadMore: () => void;
  clear: () => void;
}

const DEBOUNCE_MS = 300;

export function useUserSearch(): UseUserSearchResult {
  const [keyword, setKeyword] = useState("");
  const [results, setResults] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [pagination, setPagination] = useState<Omit<
    PagedResponse<User>,
    "items"
  > | null>(null);

  // AbortController để cancel request cũ khi keyword thay đổi
  const abortRef = useRef<AbortController | null>(null);
  // Debounce timer
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Trang hiện tại (dùng cho load more)
  const currentPageRef = useRef(0);

  const fetchUsers = async (kw: string, page: number, append = false) => {
    if (!kw.trim()) {
      setResults([]);
      setPagination(null);
      return;
    }

    // Cancel request đang bay
    if (abortRef.current) abortRef.current.abort();
    abortRef.current = new AbortController();

    setIsLoading(true);
    try {
      const res = await userApi.searchUsers(kw.trim(), page, 8);
      const { items, ...meta } = res.data.result;

      setResults((prev) => (append ? [...prev, ...items] : items));
      setPagination(meta);
      currentPageRef.current = page;
    } catch (err: unknown) {
      // Ignore cancel errors
      if (err instanceof Error && err.name === "CanceledError") return;
    } finally {
      setIsLoading(false);
    }
  };

  // Debounce khi keyword thay đổi
  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);

    if (!keyword.trim()) {
      setResults([]);
      setPagination(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true); // show spinner ngay khi gõ
    timerRef.current = setTimeout(() => {
      currentPageRef.current = 0;
      fetchUsers(keyword, 0, false);
    }, DEBOUNCE_MS);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [keyword]);

  const loadMore = () => {
    if (pagination?.hasNext) {
      fetchUsers(keyword, currentPageRef.current + 1, true);
    }
  };

  const clear = () => {
    if (abortRef.current) abortRef.current.abort();
    if (timerRef.current) clearTimeout(timerRef.current);
    setKeyword("");
    setResults([]);
    setPagination(null);
    setIsLoading(false);
  };

  return {
    keyword,
    setKeyword,
    results,
    isLoading,
    pagination,
    loadMore,
    clear,
  };
}
