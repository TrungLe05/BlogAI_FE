// src/components/dashboard/AIEditableField.tsx
import { useRef } from "react";
import { useAIToolbar, type AIInstruction } from "@/hooks/useAIToolbar";
import { AIFloatingToolbar } from "./AIFloatingToolbar";
import { AIResultPanel } from "./AIResultPanel";

interface AIEditableFieldProps {
  as: "input" | "textarea";
  fieldType: "title" | "summary";
  value: string;
  onChange: (value: string) => void;
  availableActions: AIInstruction[];
  placeholder?: string;
  className?: string;
  maxLength?: number;
  rows?: number; // chỉ dùng khi as="textarea"
}

export function AIEditableField({
  as,
  fieldType,
  value,
  onChange,
  availableActions,
  placeholder,
  className,
  maxLength,
  rows,
}: AIEditableFieldProps) {
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  const ai = useAIToolbar({
    mode: "plain",
    fieldType,
    inputRef,
    onChange,
  });

  const commonProps = {
    ref: inputRef as any,
    value,
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      onChange(e.target.value),
    onSelect: ai.handlePlainSelection,
    onMouseUp: ai.handlePlainSelection,
    onKeyUp: ai.handlePlainSelection,
    placeholder,
    className,
    maxLength,
  };

  return (
    <div className="relative">
      {as === "input" ? (
        <input {...commonProps} type="text" />
      ) : (
        <textarea {...commonProps} rows={rows} />
      )}

      <AIFloatingToolbar
        visible={ai.state.visible}
        position={ai.state.position}
        isLoading={ai.state.isLoading}
        activeInstruction={ai.state.activeInstruction}
        availableActions={availableActions}
        onAction={ai.triggerRewrite}
        onClose={ai.closeToolbar}
      />

      {(ai.state.isLoading || ai.state.result) && (
        <AIResultPanel
          originalText={ai.state.originalText}
          resultText={ai.state.result}
          isLoading={ai.state.isLoading}
          onAccept={ai.acceptResult}
          onDiscard={ai.discardResult}
        />
      )}
    </div>
  );
}