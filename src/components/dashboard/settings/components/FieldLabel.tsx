export function FieldLabel({ children }: { children: string }) {
  return (
    <label
      className="block font-bold text-[0.68rem] tracking-widest text-[#5b403d] dark:text-white mb-1.5 uppercase"
      style={{
        fontFamily: "var(--font-display)",
      }}
    >
      {children}
    </label>
  );
}
