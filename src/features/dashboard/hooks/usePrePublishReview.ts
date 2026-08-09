// src/hooks/usePrePublishReview.ts
import { useCallback, useState } from "react";
import blogApi from "@/features/blog/api/blogApi";
import { toast } from "sonner";
import { PrePublishReviewResult } from "@/features/blog/types/blog.types";

interface State {
  open: boolean;
  isLoading: boolean;
  result: PrePublishReviewResult | null;
}

const DEFAULT_STATE: State = {
  open: false,
  isLoading: false,
  result: null,
};

export function usePrePublishReview() {
  const [state, setState] = useState<State>(DEFAULT_STATE);

  const runReview = useCallback(
    async (payload: { title: string; summary: string; content: string }) => {
      setState({ open: true, isLoading: true, result: null });
      try {
        const { data } = await blogApi.reviewPrePublish(payload);
        setState({ open: true, isLoading: false, result: data.result });
      } catch (e) {
        toast.error("AI review failed. You can still publish directly.");
        setState(DEFAULT_STATE); // fail thì không chặn — coi như bỏ qua review
      }
    },
    [],
  );

  const close = useCallback(() => setState(DEFAULT_STATE), []);

  return { state, runReview, close };
}
