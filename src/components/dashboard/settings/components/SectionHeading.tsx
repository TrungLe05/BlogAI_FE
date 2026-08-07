export function SectionHeading({
  icon,
  children,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        borderBottom: "3px solid #0d0d0d",
        paddingBottom: 14,
        marginBottom: 24,
      }}
    >
      <span
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: 30,
          height: 30,
          background: "#af101a",
          color: "white",
          flexShrink: 0,
        }}
      >
        {icon}
      </span>
      <h2
        className="font-display" style={{ fontWeight: 900,
          fontSize: "1rem",
          color: "#0d0d0d",
          margin: 0,
          letterSpacing: "-0.01em" }}
      >
        {children}
      </h2>
    </div>
  );
}
