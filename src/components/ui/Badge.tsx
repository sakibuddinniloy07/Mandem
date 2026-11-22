import clsx from "clsx";

export function Badge({
  children,
  tone = "dark",
  className,
}: {
  children: React.ReactNode;
  tone?: "dark" | "light" | "accent";
  className?: string;
}) {
  return (
    <span
      className={clsx(
        "font-display text-[11px] uppercase tracking-wider px-2.5 py-1 inline-block",
        tone === "dark" && "bg-ink text-paper",
        tone === "light" && "bg-paper text-ink border border-ink",
        tone === "accent" && "bg-accent text-ink",
        className
      )}
    >
      {children}
    </span>
  );
}
