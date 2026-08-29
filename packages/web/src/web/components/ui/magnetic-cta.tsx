import { useEffect, useRef } from "react";
import { cn } from "../../lib/utils";

type Variant = "primary" | "ghost";

interface MagneticCtaProps {
  href: string;
  children: React.ReactNode;
  variant?: Variant;
  external?: boolean;
  className?: string;
  onClick?: () => void;
}

const base =
  "group relative inline-flex items-center justify-center gap-3 rounded-full px-7 py-3.5 text-[0.6875rem] font-bold uppercase tracking-[0.2em] will-change-transform";

const variants: Record<Variant, string> = {
  primary:
    "bg-accent text-white shadow-[0_0_0_0_rgba(23,98,255,0)] hover:bg-accent-soft hover:shadow-[0_10px_40px_-8px_rgba(23,98,255,0.65)]",
  ghost:
    "border border-[var(--hair-strong)] text-paper hover:border-accent-soft hover:text-accent-soft",
};

/**
 * Magnetic button: the element eases toward the pointer on fine-pointer
 * devices. Uses direct style writes on pointermove — no rAF, no state.
 */
export function MagneticCta({
  href,
  children,
  variant = "primary",
  external = false,
  className,
  onClick,
}: MagneticCtaProps) {
  const ref = useRef<HTMLAnchorElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof window.matchMedia !== "function") return;
    if (!window.matchMedia("(pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const strength = 0.28;

    const onMove = (event: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      const dx = event.clientX - (rect.left + rect.width / 2);
      const dy = event.clientY - (rect.top + rect.height / 2);
      el.style.transform = `translate3d(${dx * strength}px, ${dy * strength}px, 0)`;
    };

    const onLeave = () => {
      el.style.transform = "translate3d(0, 0, 0)";
    };

    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <a
      ref={ref}
      href={href}
      onClick={onClick}
      className={cn(base, variants[variant], className)}
      style={{ transition: "transform 500ms var(--ease-out-expo), background-color 500ms, color 500ms, border-color 500ms, box-shadow 500ms" }}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      {children}
    </a>
  );
}
