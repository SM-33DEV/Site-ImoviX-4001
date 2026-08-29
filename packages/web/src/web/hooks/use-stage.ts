import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Drives a "layer stage" — one big visual that swaps as the user moves
 * between items.
 *
 * - Auto-advances while the section is on screen and untouched, so the
 *   story plays itself on first read (and on touch, where hover is absent).
 * - The first hover / tap locks it to manual control.
 *
 * Uses an IntersectionObserver + a single interval. No scroll listener and
 * no animation frame — the hero scrub engine owns the only rAF in the app.
 */
export function useStage(count: number, intervalMs = 4200) {
  const [active, setActive] = useState(0);
  const [locked, setLocked] = useState(false);
  const [inView, setInView] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) setInView(entry.isIntersecting);
      },
      { threshold: 0.25 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (locked || !inView || count < 2) return;
    if (typeof window.matchMedia === "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }
    const id = window.setInterval(() => {
      setActive((current) => (current + 1) % count);
    }, intervalMs);
    return () => window.clearInterval(id);
  }, [locked, inView, count, intervalMs]);

  const select = useCallback((index: number) => {
    setLocked(true);
    setActive(index);
  }, []);

  return { active, select, ref, inView };
}

/**
 * Reports which item of a stepped sequence is currently the "reading focus",
 * based on IntersectionObserver only. Used by the sticky method stage.
 */
export function useSteppedFocus(count: number) {
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLElement | null)[]>([]);

  const setRef = useCallback(
    (index: number) => (node: HTMLElement | null) => {
      refs.current[index] = node;
    },
    [],
  );

  useEffect(() => {
    const nodes = refs.current.slice(0, count).filter((n): n is HTMLElement => Boolean(n));
    if (nodes.length === 0 || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const index = refs.current.indexOf(entry.target as HTMLElement);
          if (index >= 0) setActive(index);
        }
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 },
    );

    for (const node of nodes) observer.observe(node);
    return () => observer.disconnect();
  }, [count]);

  return { active, setRef };
}
