import { Loader2 } from "lucide-react";

// components/ui/LoadingSpinner.tsx
export default function LoadingSpinner() {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "rgba(13,13,13,0.6)", backdropFilter: "blur(2px)" }}
    >
      <div
        className="flex flex-col items-center gap-4 p-8 bg-white"
        style={{ border: "3px solid #0d0d0d", boxShadow: "6px 6px 0 #d32f2f" }}
      >
        <Loader2
          size={32}
          className="animate-spin"
          style={{ color: "#d32f2f" }}
        />
        <p
          className="font-black text-sm uppercase tracking-widest font-display"
          
        >
          Loading...
        </p>
      </div>
    </div>
  );
}
