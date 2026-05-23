import { useEffect, useCallback } from "react";
import { X, ChevronLeft, ChevronRight, Download } from "lucide-react";
import { downloadFile } from "@/utils/downloadFile";

interface LightboxImage {
  url: string;
  fileName?: string;
}

interface Props {
  images: LightboxImage[];
  currentIndex: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

export default function ImageLightbox({
  images,
  currentIndex,
  onClose,
  onNavigate,
}: Props) {
  const current = images[currentIndex];
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < images.length - 1;

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft" && hasPrev) onNavigate(currentIndex - 1);
      if (e.key === "ArrowRight" && hasNext) onNavigate(currentIndex + 1);
    },
    [currentIndex, hasPrev, hasNext, onClose, onNavigate],
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [handleKeyDown]);

  return (
    <div
      className="fixed inset-0 z-999 flex items-center justify-center bg-black/90"
      onClick={onClose}
    >
      {/* Toolbar */}
      <div
        className="absolute top-0 left-0 right-0 flex items-center justify-between px-4 py-3 bg-linear-to-b from-black/60 to-transparent z-10"
        onClick={(e) => e.stopPropagation()}
      >
        <span className="text-white text-xs font-bold truncate max-w-[60%]">
          {current.fileName ?? "Ảnh"}
        </span>
        <div className="flex items-center gap-2">
          <span className="text-white/50 text-xs">
            {currentIndex + 1} / {images.length}
          </span>
          <button
            onClick={() =>
              downloadFile(current.url, current.fileName ?? "image.jpg")
            }
            className="w-8 h-8 flex items-center justify-center text-white hover:bg-white/20 transition-colors cursor-pointer"
          >
            <Download size={16} />
          </button>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center text-white hover:bg-white/20 transition-colors cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Prev button */}
      {hasPrev && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onNavigate(currentIndex - 1);
          }}
          className="absolute left-4 w-10 h-10 flex items-center justify-center bg-black/50 text-white hover:bg-black/80 transition-colors cursor-pointer z-10"
        >
          <ChevronLeft size={24} />
        </button>
      )}

      {/* Image */}
      <img
        src={current.url}
        alt={current.fileName ?? "image"}
        className="max-w-[90vw] max-h-[90vh] object-contain select-none"
        onClick={(e) => e.stopPropagation()}
        draggable={false}
      />

      {/* Next button */}
      {hasNext && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onNavigate(currentIndex + 1);
          }}
          className="absolute right-4 w-10 h-10 flex items-center justify-center bg-black/50 text-white hover:bg-black/80 transition-colors cursor-pointer z-10"
        >
          <ChevronRight size={24} />
        </button>
      )}

      {/* Bottom thumbnails nếu có nhiều ảnh */}
      {images.length > 1 && (
        <div
          className="absolute bottom-0 left-0 right-0 flex items-center justify-center gap-2 px-4 py-3 bg-linear-to-t from-black/60 to-transparent overflow-x-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => onNavigate(idx)}
              className={`w-12 h-12 shrink-0 border-2 transition-all cursor-pointer overflow-hidden
                ${idx === currentIndex
                  ? "border-white opacity-100"
                  : "border-transparent opacity-50 hover:opacity-80"
                }`}
            >
              <img
                src={img.url}
                className="w-full h-full object-cover"
                draggable={false}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}