interface Props {
  tag: string;
  onClick?: (e: any) => void;
  size?: "sm" | "md";
}

export default function TagPill({ tag, onClick, size = "sm" }: Props) {
  const padding = size === "md" ? "px-3 py-1" : "px-2 py-0.5";

  return (
    <span
      onClick={onClick}
      className={`inline-block ${padding} text-xs font-black uppercase tracking-widest text-white bg-[#d32f2f] border-2 border-[#0d0d0d] ${onClick ? "cursor-pointer hover:opacity-80 transition-opacity" : ""}`}
    >
      {tag}
    </span>
  );
}