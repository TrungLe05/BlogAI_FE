// src/components/dashboard/AIFloatingToolbar.tsx
import { useEffect, useRef, useState } from "react";
import {
  Sparkles,
  Scissors,
  Expand,
  MessageSquare,
  SpellCheck2,
  Loader2,
  ChevronRight,
} from "lucide-react";
import type {
  AIInstruction,
  AIToolbarPosition,
} from "@/features/dashboard/hooks/useAIToolbar";

// ── Types ─────────────────────────────────────────────────────────
interface Props {
  visible: boolean;
  position: AIToolbarPosition;
  isLoading: boolean;
  activeInstruction: AIInstruction | null;
  availableActions: AIInstruction[];
  onAction: (instruction: AIInstruction) => void;
  onClose: () => void;
}

// ── Action config ─────────────────────────────────────────────────
const ACTION_CONFIG: {
  key: AIInstruction;
  label: string;
  icon: React.ReactNode;
  color: string;
}[] = [
  {
    key: "improve",
    label: "Improve",
    icon: <Sparkles size={13} />,
    color: "#a855f7",
  },
  {
    key: "shorten",
    label: "Shorten",
    icon: <Scissors size={13} />,
    color: "#3b82f6",
  },
  {
    key: "expand",
    label: "Expand",
    icon: <Expand size={13} />,
    color: "#10b981",
  },
  {
    key: "grammar",
    label: "Fix Grammar",
    icon: <SpellCheck2 size={13} />,
    color: "#f59e0b",
  },
];

const TONE_OPTIONS: { key: AIInstruction; label: string }[] = [
  { key: "tone:formal", label: "Formal" },
  { key: "tone:casual", label: "Casual" },
  { key: "tone:professional", label: "Professional" },
];

// ── Component ─────────────────────────────────────────────────────
export function AIFloatingToolbar({
  visible,
  position,
  isLoading,
  activeInstruction,
  availableActions,
  onAction,
  onClose,
}: Props) {
  const [toneOpen, setToneOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Animate mount
  useEffect(() => {
    if (visible) {
      requestAnimationFrame(() => setMounted(true));
    } else {
      setMounted(false);
    }
  }, [visible]);

  // Đóng khi click ngoài
  useEffect(() => {
    if (!visible) return;
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      // Bỏ qua nếu click nằm trong toolbar HOẶC trong AIResultPanel
      // (2 component render tách biệt về DOM nên .contains() không nhận ra nhau)
      if (
        ref.current &&
        !ref.current.contains(target) &&
        !target.closest("[data-ai-result-panel]")
      ) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [visible, onClose]);

  if (!visible) return null;

  const hasTone = availableActions.some((a) => a.startsWith("tone:"));
  const visibleActions = ACTION_CONFIG.filter((a) =>
    availableActions.includes(a.key),
  );

  return (
    <div
      ref={ref}
      style={{
        position: "fixed",
        top: position.y - 56,
        left: `clamp(84px, ${position.x}px, calc(100vw - 84px))`,
        transform: `translateX(-50%) scale(${mounted ? 1 : 0.85})`,
        opacity: mounted ? 1 : 0,
        transition: "opacity 0.15s ease, transform 0.15s ease",
        zIndex: 9999,
        maxWidth: "94vw",
      }}
    >
      {/* Main toolbar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "2px",
          background: "#0d0d0d",
          borderRadius: "999px",
          padding: "4px 6px",
          boxShadow: "0 4px 24px rgba(0,0,0,0.32), 0 1px 4px rgba(0,0,0,0.2)",
          border: "1px solid rgba(255,255,255,0.08)",
          whiteSpace: "nowrap",
          overflowX: "auto",
          maxWidth: "94vw",
        }}
      >
        {/* AI badge */}
        <span
          style={{
            display: "flex",
            alignItems: "center",
            gap: "4px",
            padding: "3px 8px",
            borderRadius: "999px",
            background: "linear-gradient(135deg, #d32f2f, #9c27b0)",
            color: "white",
            fontSize: "10px",
            fontWeight: 800,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            marginRight: "4px",
          }}
        >
          <Sparkles size={10} />
          AI
        </span>

        {/* Separator */}
        <div
          style={{
            width: "1px",
            height: "18px",
            background: "rgba(255,255,255,0.12)",
            margin: "0 4px",
          }}
        />

        {/* Action buttons */}
        {visibleActions.map((action) => {
          const isActive = activeInstruction === action.key;
          return (
            <button
              key={action.key}
              onMouseDown={(e) => {
                e.preventDefault(); // giữ selection
                if (!isLoading) onAction(action.key);
              }}
              disabled={isLoading && !isActive}
              title={action.label}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "5px",
                padding: "5px 10px",
                borderRadius: "999px",
                border: "none",
                background: isActive ? action.color : "transparent",
                color: isActive ? "white" : "rgba(255,255,255,0.75)",
                fontSize: "12px",
                fontWeight: 600,
                cursor: isLoading && !isActive ? "not-allowed" : "pointer",
                opacity: isLoading && !isActive ? 0.4 : 1,
                transition: "background 0.15s, color 0.15s, opacity 0.15s",
              }}
              onMouseEnter={(e) => {
                if (!isLoading || isActive) {
                  (e.currentTarget as HTMLButtonElement).style.background =
                    isActive ? action.color : "rgba(255,255,255,0.1)";
                }
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background =
                  isActive ? action.color : "transparent";
              }}
            >
              {isLoading && isActive ? (
                <Loader2 size={12} className="animate-spin" />
              ) : (
                action.icon
              )}
              {action.label}
            </button>
          );
        })}

        {/* Change Tone */}
        {hasTone && (
          <div style={{ position: "relative" }}>
            <button
              onMouseDown={(e) => {
                e.preventDefault();
                if (!isLoading) setToneOpen((p) => !p);
              }}
              disabled={isLoading}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "5px",
                padding: "5px 10px",
                borderRadius: "999px",
                border: "none",
                background: activeInstruction?.startsWith("tone:")
                  ? "#f97316"
                  : "transparent",
                color: activeInstruction?.startsWith("tone:")
                  ? "white"
                  : "rgba(255,255,255,0.75)",
                fontSize: "12px",
                fontWeight: 600,
                cursor: isLoading ? "not-allowed" : "pointer",
                opacity: isLoading ? 0.4 : 1,
                transition: "background 0.15s, color 0.15s",
              }}
              onMouseEnter={(e) => {
                if (!isLoading)
                  (e.currentTarget as HTMLButtonElement).style.background =
                    activeInstruction?.startsWith("tone:")
                      ? "#f97316"
                      : "rgba(255,255,255,0.1)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background =
                  activeInstruction?.startsWith("tone:")
                    ? "#f97316"
                    : "transparent";
              }}
            >
              {isLoading && activeInstruction?.startsWith("tone:") ? (
                <Loader2 size={12} className="animate-spin" />
              ) : (
                <MessageSquare size={13} />
              )}
              Tone
              <ChevronRight
                size={11}
                style={{
                  transform: toneOpen ? "rotate(90deg)" : "rotate(0)",
                  transition: "transform 0.15s",
                  opacity: 0.6,
                }}
              />
            </button>

            {/* Tone submenu */}
            {toneOpen && !isLoading && (
              <div
                style={{
                  position: "absolute",
                  bottom: "calc(100% + 6px)",
                  left: "50%",
                  transform: "translateX(-50%)",
                  background: "#0d0d0d",
                  borderRadius: "12px",
                  padding: "4px",
                  boxShadow: "0 4px 24px rgba(0,0,0,0.4)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  minWidth: "130px",
                }}
              >
                {TONE_OPTIONS.filter((t) =>
                  availableActions.includes(t.key),
                ).map((tone) => (
                  <button
                    key={tone.key}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      setToneOpen(false);
                      onAction(tone.key);
                    }}
                    style={{
                      display: "block",
                      width: "100%",
                      padding: "7px 12px",
                      borderRadius: "8px",
                      border: "none",
                      background: "transparent",
                      color: "rgba(255,255,255,0.8)",
                      fontSize: "12px",
                      fontWeight: 600,
                      cursor: "pointer",
                      textAlign: "left",
                      transition: "background 0.1s",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.background =
                        "rgba(255,255,255,0.1)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.background =
                        "transparent";
                    }}
                  >
                    {tone.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Arrow down */}
      <div
        style={{
          width: 0,
          height: 0,
          borderLeft: "6px solid transparent",
          borderRight: "6px solid transparent",
          borderTop: "6px solid #0d0d0d",
          margin: "0 auto",
        }}
      />
    </div>
  );
}
