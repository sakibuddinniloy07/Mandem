"use client";

import Link from "next/link";
import clsx from "clsx";
import { useEffect, useRef, type ButtonHTMLAttributes, type ReactNode, type Ref } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";

type Variant = "primary" | "secondary" | "ghost" | "outline";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 font-display uppercase tracking-wide transition-colors duration-150 disabled:opacity-40 disabled:pointer-events-none";

const variants: Record<Variant, string> = {
  primary: "bg-ink text-paper hover:bg-concrete-800",
  secondary: "bg-paper text-ink border border-ink hover:bg-concrete-100",
  ghost: "bg-transparent text-ink hover:bg-concrete-100",
  outline: "bg-transparent text-paper border border-paper hover:bg-paper hover:text-ink",
};

const sizes: Record<Size, string> = {
  sm: "text-xs px-4 py-2",
  md: "text-sm px-6 py-3",
  lg: "text-base px-8 py-4",
};

type CommonProps = {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
  /** Button drifts a few px toward the cursor on hover, then springs back. */
  magnetic?: boolean;
};

type ButtonProps = CommonProps &
  ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };

type LinkProps = CommonProps & {
  href: string;
  target?: string;
  onClick?: () => void;
};

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  href,
  magnetic = false,
  ...props
}: ButtonProps | LinkProps) {
  const cls = clsx(base, variants[variant], sizes[size], className);
  const ref = useRef<HTMLAnchorElement | HTMLButtonElement>(null);

  useEffect(() => {
    if (!magnetic || prefersReducedMotion()) return;
    const el = ref.current;
    if (!el) return;
    const target: HTMLElement = el;

    const xTo = gsap.quickTo(el, "x", { duration: 0.4, ease: "power3.out" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.4, ease: "power3.out" });

    function handleMove(e: MouseEvent) {
      const rect = el!.getBoundingClientRect();
      const relX = e.clientX - (rect.left + rect.width / 2);
      const relY = e.clientY - (rect.top + rect.height / 2);
      xTo(relX * 0.25);
      yTo(relY * 0.3);
    }
    function handleLeave() {
      xTo(0);
      yTo(0);
    }

    target.addEventListener("mousemove", handleMove);
    target.addEventListener("mouseleave", handleLeave);
    return () => {
      target.removeEventListener("mousemove", handleMove);
      target.removeEventListener("mouseleave", handleLeave);
      gsap.set(el, { x: 0, y: 0 });
    };
  }, [magnetic]);

  if (href) {
    const { target, onClick } = props as LinkProps;
    return (
      <Link
        ref={ref as Ref<HTMLAnchorElement>}
        href={href}
        target={target}
        onClick={onClick}
        className={cls}
      >
        {children}
      </Link>
    );
  }
  return (
    <button
      ref={ref as Ref<HTMLButtonElement>}
      className={cls}
      {...(props as ButtonHTMLAttributes<HTMLButtonElement>)}
    >
      {children}
    </button>
  );
}
