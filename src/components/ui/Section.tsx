import Link from "next/link";
import type { ReactNode } from "react";
import { Reveal } from "@/components/motion/Reveal";

export function Section({
  title,
  subtitle,
  viewAllHref,
  children,
  className,
}: {
  title: string;
  subtitle?: string;
  viewAllHref?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`container-max px-4 md:px-6 py-14 md:py-20 ${className ?? ""}`}>
      <Reveal className="flex items-end justify-between mb-8 md:mb-10">
        <div>
          <h2 className="font-display uppercase text-2xl md:text-4xl tracking-tight">{title}</h2>
          {subtitle && <p className="text-concrete-600 text-sm md:text-base mt-1.5">{subtitle}</p>}
        </div>
        {viewAllHref && (
          <Link
            href={viewAllHref}
            className="font-display uppercase text-xs md:text-sm tracking-wide underline underline-offset-4 shrink-0 ml-4"
          >
            View All
          </Link>
        )}
      </Reveal>
      {children}
    </section>
  );
}
