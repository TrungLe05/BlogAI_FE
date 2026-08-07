interface Props {
  icon: React.ReactNode;
  label: string;
  value: string;
}

export default function SummaryPill({ icon, label, value }: Props) {
  return (
    <div className="flex items-center gap-2">
      <span className="flex items-center justify-center w-7 h-7 bg-[#d32f2f] text-white border-2 border-[#0d0d0d] dark:border-zinc-600">
        {icon}
      </span>
      <div>
        <p
          className="text-xs uppercase font-black tracking-widest leading-none text-[#888] dark:text-zinc-500 font-display"
          
        >
          {label}
        </p>
        <p
          className="font-black text-sm leading-tight text-[#0d0d0d] dark:text-zinc-200 font-display"
          
        >
          {value}
        </p>
      </div>
    </div>
  );
}
