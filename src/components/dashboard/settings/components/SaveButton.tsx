import { useState } from "react";
import { Check, Loader2 } from "lucide-react";

export function SaveButton({
  onClick,
  loading,
  label = "Save Changes",
}: {
  onClick: () => void;
  loading?: boolean;
  label?: string;
}) {
  const [hov, setHov] = useState(false);

  return (
    <button
      onClick={onClick}
      disabled={loading}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      className={`
        inline-flex items-center justify-center gap-2 w-full px-5.5 py-2.75
        
        font-display font-black text-[0.75rem] 
        tracking-widest uppercase text-white
        
        border-[3px] border-[#0d0d0d] dark:border-zinc-600 transition-all duration-150
        ${loading ? "bg-[#888] cursor-not-allowed" : "bg-[#af101a] cursor-pointer"}
        
        ${
          hov && !loading
            ? "shadow-[6px_6px_0_#0d0d0d] dark:shadow-[6px_6px_0_#52525b] -translate-x-0.5 -translate-y-0.5"
            : "shadow-[4px_4px_0_#0d0d0d] dark:shadow-[4px_4px_0_#52525b] translate-x-0 translate-y-0"
        }
      `}
    >
      {loading ? (
        <>
          <Loader2 size={14} className="animate-spin" />
          <span>Saving...</span>
        </>
      ) : (
        <>
          <Check size={14} />
          <span>{label}</span>
        </>
      )}
    </button>
  );
}