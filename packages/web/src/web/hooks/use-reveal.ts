import { useEffect, useRef } from "react";

/**
 * Adds `.is-visible` to the element (and to every `[data-reveal]` descendant,
 * staggered) the first time it enters the viewport. No React state, no rAF —
 * the scrub engine owns the only animation frame loop in the app.
 */
export function useReveal<T extends HTMLElement = HTMLDivElement>(stagger = 90) {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const targets = [el, ...Array.from(el.querySelectorAll<HTMLElement>("[data-reveal]"))];

    if (typeof IntersectionObserver === "undefined") {
      for (const t of targets) t.classList.add("is-visible");
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          targets.forEach((t, i) => {
            t.style.setProperty("--reveal-delay", `${i * stagger}ms`);
            t.classList.add("is-visible");
          });
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.12 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [stagger]);

  return ref;
}
