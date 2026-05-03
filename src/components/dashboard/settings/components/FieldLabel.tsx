export function FieldLabel({ children }: { children: string }) {
  return (
    <label
      style={{
        display: "block",
        fontFamily: "var(--font-display)",
        fontWeight: 700,
        fontSize: "0.68rem",
        letterSpacing: "0.1em",
        textTransform: "uppercase" as const,
        color: "#5b403d",
        marginBottom: 6,
      }}
    >
      {children}
    </label>
  );
}
