import type { ReactNode } from "react";

export function SectionHeading({
  eyebrow,
  title,
  text,
  align = "left",
  className = "",
}: {
  eyebrow?: string;
  title: ReactNode;
  text?: ReactNode;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <div className={`${align === "center" ? "mx-auto text-center" : ""} max-w-2xl ${className}`}>
      {eyebrow && <span className="eyebrow">{eyebrow}</span>}
      <h2 className={`font-display text-3xl font-bold tracking-tight sm:text-4xl ${eyebrow ? "mt-4" : ""}`}>{title}</h2>
      {text && <p className="mt-3 text-lg text-foreground/65">{text}</p>}
    </div>
  );
}
