interface Props {
  icon: React.ReactNode;
  label: string;
}

export default function StatChip({ icon, label }: Props) {
  return (
    <span
      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#ccc]"
      style={{ fontFamily: "var(--font-display)" }}
    >
      {icon}
      {label}
    </span>
  );
}
