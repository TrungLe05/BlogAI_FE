import { useState, useCallback } from "react";
import { toast } from "sonner";
import { PendingFile } from "../types/message.types";

export function useFileUpload() {
  const [pendingFile, setPendingFile] = useState<PendingFile | null>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      toast.error("File tối đa 10MB");
      return;
    }

    const isImage = file.type.startsWith("image/");
    const previewUrl = isImage ? URL.createObjectURL(file) : "";
    setPendingFile({ file, isImage, previewUrl });
  };

  const clearFile = useCallback(() => {
    if (pendingFile?.previewUrl) URL.revokeObjectURL(pendingFile.previewUrl);
    setPendingFile(null);
  }, [pendingFile]);

  return { pendingFile, handleFileSelect, clearFile };
}