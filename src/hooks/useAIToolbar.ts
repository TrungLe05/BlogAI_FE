// src/hooks/useAIToolbar.ts
import { useCallback, useRef, useState } from "react";
import type { RefObject } from "react";
import type { Editor } from "@tiptap/react";
import blogApi from "@/api/blogApi";
import { toast } from "sonner";

// ── Types ─────────────────────────────────────────────────────────
export type AIInstruction =
  | "improve"
  | "shorten"
  | "expand"
  | "tone:formal"
  | "tone:casual"
  | "tone:professional"
  | "grammar";

export type AIToolbarMode = "plain" | "tiptap";

export interface AIToolbarPosition {
  x: number;
  y: number;
}

export interface AIToolbarState {
  visible: boolean;
  position: AIToolbarPosition;
  selectedText: string;
  isLoading: boolean;
  activeInstruction: AIInstruction | null;
  result: string | null;
  originalText: string;
  // For Tiptap mode
  tiptapRange: { from: number; to: number } | null;
  // For plain mode
  plainIndices: { start: number; end: number } | null;
}

const DEFAULT_STATE: AIToolbarState = {
  visible: false,
  position: { x: 0, y: 0 },
  selectedText: "",
  isLoading: false,
  activeInstruction: null,
  result: null,
  originalText: "",
  tiptapRange: null,
  plainIndices: null,
};

interface UseAIToolbarOptions {
  mode: AIToolbarMode;
  fieldType: "title" | "summary" | "content"; 
  editor?: Editor | null;
  inputRef?: RefObject<HTMLInputElement | HTMLTextAreaElement | null>;
  onChange?: (newValue: string) => void;
}

function getCaretCoordinates(
  el: HTMLInputElement | HTMLTextAreaElement,
  start: number,
  end: number,
): { left: number; top: number; height: number } {
  const isInput = el.tagName === "INPUT";
  const style = window.getComputedStyle(el);
  const div = document.createElement("div");

  // Các thuộc tính CSS ảnh hưởng trực tiếp đến layout/wrap của text —
  // phải copy y hệt thì vị trí đo mới khớp với field thật
  const propertiesToCopy = [
    "boxSizing",
    "width",
    "paddingTop",
    "paddingRight",
    "paddingBottom",
    "paddingLeft",
    "borderTopWidth",
    "borderRightWidth",
    "borderBottomWidth",
    "borderLeftWidth",
    "fontStyle",
    "fontVariant",
    "fontWeight",
    "fontStretch",
    "fontSize",
    "fontFamily",
    "lineHeight",
    "letterSpacing",
    "textTransform",
    "wordSpacing",
    "textIndent",
    "wordBreak",
  ] as const;

  propertiesToCopy.forEach((prop) => {
    (div.style as any)[prop] = style[prop as any];
  });

  div.style.position = "absolute";
  div.style.visibility = "hidden";
  div.style.overflow = "hidden";
  // input không xuống dòng, textarea có xuống dòng theo nội dung
  div.style.whiteSpace = isInput ? "pre" : "pre-wrap";
  div.style.wordWrap = "break-word";
  div.style.top = "0";
  div.style.left = "-9999px";

  document.body.appendChild(div);

  const value = el.value;
  div.textContent = value.substring(0, start);

  const span = document.createElement("span");
  span.textContent = value.substring(start, end) || " ";
  div.appendChild(span);
  div.appendChild(document.createTextNode(value.substring(end)));

  const spanLeft = span.offsetLeft;
  const spanTop = span.offsetTop;
  const spanWidth = span.offsetWidth;
  const spanHeight = span.offsetHeight;

  document.body.removeChild(div);

  const elRect = el.getBoundingClientRect();
  const borderLeft = parseFloat(style.borderLeftWidth) || 0;
  const borderTop = parseFloat(style.borderTopWidth) || 0;

  return {
    left: elRect.left + borderLeft + (spanLeft - el.scrollLeft) + spanWidth / 2,
    top: elRect.top + borderTop + (spanTop - el.scrollTop),
    height: spanHeight,
  };
}

// ── Hook ──────────────────────────────────────────────────────────
export function useAIToolbar({
  mode,
  fieldType,
  editor,
  inputRef,
  onChange,
}: UseAIToolbarOptions) {
  const [state, setState] = useState<AIToolbarState>(DEFAULT_STATE);
  const abortRef = useRef<AbortController | null>(null);

  // ── Lấy vị trí toolbar dựa trên DOM selection (dùng cho Tiptap/contenteditable) ──
  const getToolbarPosition = useCallback((): AIToolbarPosition | null => {
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return null;
    const rect = sel.getRangeAt(0).getBoundingClientRect();
    if (rect.width === 0) return null;
    return {
      x: rect.left + rect.width / 2 + window.scrollX,
      y: rect.top + window.scrollY - 12,
    };
  }, []);

  // ── Lấy vị trí toolbar cho input/textarea thuần (window.getSelection() không hoạt động với form controls) ──
  const getPlainToolbarPosition = useCallback(
    (
      el: HTMLInputElement | HTMLTextAreaElement,
      start: number,
      end: number,
    ): AIToolbarPosition => {
      try {
        const coords = getCaretCoordinates(el, start, end);
        return {
          x: coords.left + window.scrollX,
          y: coords.top + window.scrollY - 12, // 12px phía trên vùng chọn
        };
      } catch {
        // Fallback: nếu đo lỗi (trình duyệt lạ, style bất thường) → giữa phía trên field
        const rect = el.getBoundingClientRect();
        return {
          x: rect.left + rect.width / 2 + window.scrollX,
          y: rect.top + window.scrollY - 12,
        };
      }
    },
    [],
  );

  // ── Handler cho Tiptap selection ──
  const handleTiptapSelection = useCallback(
    ({ editor: ed }: { editor: Editor }) => {
      const { from, to } = ed.state.selection;
      if (from === to) {
        setState((prev) => (prev.visible ? { ...DEFAULT_STATE } : prev));
        return;
      }
      const selectedText = ed.state.doc.textBetween(from, to, " ").trim();
      if (!selectedText) {
        setState((prev) => (prev.visible ? { ...DEFAULT_STATE } : prev));
        return;
      }

      // Nhỏ delay để DOM kịp render selection rect
      setTimeout(() => {
        const pos = getToolbarPosition();
        if (!pos) return;
        setState({
          ...DEFAULT_STATE,
          visible: true,
          position: pos,
          selectedText,
          originalText: selectedText,
          tiptapRange: { from, to },
        });
      }, 10);
    },
    [getToolbarPosition],
  );

  const handlePlainSelection = useCallback(() => {
    const el = inputRef?.current;
    if (!el) return;

    const start = el.selectionStart ?? 0;
    const end = el.selectionEnd ?? 0;
    if (start === end) {
      setState((prev) => (prev.visible ? { ...DEFAULT_STATE } : prev));
      return;
    }

    const selectedText = el.value.slice(start, end).trim();
    if (!selectedText) {
      setState((prev) => (prev.visible ? { ...DEFAULT_STATE } : prev));
      return;
    }

    const pos = getPlainToolbarPosition(el, start, end); // ← truyền start/end
    setState({
      ...DEFAULT_STATE,
      visible: true,
      position: pos,
      selectedText,
      originalText: selectedText,
      plainIndices: { start, end },
    });
  }, [inputRef, getPlainToolbarPosition]);

  // ── Gọi AI rewrite API ──
  const triggerRewrite = useCallback(
    async (instruction: AIInstruction) => {
      if (!state.selectedText) return;

      // Hủy request cũ nếu có
      abortRef.current?.abort();
      abortRef.current = new AbortController();

      setState((prev) => ({
        ...prev,
        isLoading: true,
        activeInstruction: instruction,
        result: null,
      }));

      try {
        const { data } = await blogApi.rewriteText(
          state.selectedText,
          instruction,
          fieldType
        );
        setState((prev) => ({
          ...prev,
          isLoading: false,
          result: data.result,
        }));
      } catch (err: unknown) {
        if ((err as { name?: string }).name === "CanceledError") return;
        toast.error("AI rewrite failed. Please try again.");
        setState((prev) => ({
          ...prev,
          isLoading: false,
          activeInstruction: null,
        }));
      }
    },
    [state.selectedText,fieldType],
  );

  // ── Accept: thay thế text trong editor / input ──
  const acceptResult = useCallback(() => {
    if (!state.result) return;

    if (mode === "tiptap" && editor && state.tiptapRange) {
      editor
        .chain()
        .focus()
        .deleteRange(state.tiptapRange)
        .insertContentAt(state.tiptapRange.from, state.result)
        .run();
    } else if (mode === "plain" && inputRef?.current && state.plainIndices) {
      const el = inputRef.current as HTMLInputElement | HTMLTextAreaElement;
      const { start, end } = state.plainIndices;

      // Input/textarea đang là controlled component (value từ props),
      // nên chỉ cần tính chuỗi mới bằng JS thuần và gọi onChange —
      // KHÔNG mutate DOM trực tiếp (setRangeText/dispatchEvent), vì
      // React sẽ ghi đè DOM về lại giá trị prop cũ ở lần re-render tiếp theo,
      // gây hiện tượng "accept nhưng không gán lại".
      const currentValue = el.value; // giá trị hiện tại lúc accept
      const newValue =
        currentValue.slice(0, start) + state.result + currentValue.slice(end);

      onChange?.(newValue);

      // Đặt lại con trỏ sau đoạn text vừa thay, sau khi React re-render xong
      const newCaretPos = start + state.result.length;
      requestAnimationFrame(() => {
        el.focus();
        el.setSelectionRange(newCaretPos, newCaretPos);
      });
    }

    setState({ ...DEFAULT_STATE });
  }, [state, mode, editor, inputRef, onChange]);

  // ── Discard: đóng panel ──
  const discardResult = useCallback(() => {
    setState((prev) => ({
      ...prev,
      result: null,
      isLoading: false,
      activeInstruction: null,
    }));
  }, []);

  // ── Đóng toolbar hoàn toàn ──
  const closeToolbar = useCallback(() => {
    setState({ ...DEFAULT_STATE });
  }, []);

  return {
    state,
    handleTiptapSelection,
    handlePlainSelection,
    triggerRewrite,
    acceptResult,
    discardResult,
    closeToolbar,
  };
}
