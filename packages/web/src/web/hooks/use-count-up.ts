import { useEffect, useRef } from "react";

type Options = {
  /** Final value the counter settles on. */
  to: number;
  /** Total run time in ms. */
  duration?: number;
  /** Delay after the element enters the viewport, in ms. */
  delay?: number;
  /** Turns the running value into the string painted on screen. */
  format: (value: number) => string;
  /** Optional bar/rail that fills from 0% to 100% alongside the number. */
  onProgress?: (progress: number) => void;
};

// easeOutExpo — fast out of the gate, long settle. Same curve as --ease-out-expo.
const ease = (t: number) => (t >= 1 ? 1 : 1 - 2 ** (-10 * t));

/**
 * Counts a number up from zero the first time it scrolls into view.
 *
 * Deliberately built on IntersectionObserver + setInterval and writes straight
 * into `node.textContent`: the hero scrub owns the app's only rAF loop, and a
 * per-frame setState here would re-render the tree 60x a second.
 */
export function useCountUp<T extends HTMLElement = HTMLSpanElement>({
  to,
  duration = 1900,
  delay = 0,
  format,
  onProgress,
}: Options) {
  const ref = useRef<T | null>(null);
  const cbRef = useRef({ format, onProgress });
  cbRef.current = { format, onProgress };

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const paint = (progress: number) => {
      node.textContent = cbRef.current.format(to * progress);
      cbRef.current.onProgress?.(progress);
    };

    const reduced =
      typeof matchMedia === "function" && matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduced || typeof IntersectionObserver === "undefined") {
      paint(1);
      return;
    }

    paint(0);

    let timer: ReturnType<typeof setInterval> | undefined;
    let starter: ReturnType<typeof setTimeout> | undefined;

    const run = () => {
      const start = Date.now();
      timer = setInterval(() => {
        const t = Math.min((Date.now() - start) / duration, 1);
        paint(ease(t));
        if (t >= 1 && timer) clearInterval(timer);
      }, 1000 / 60);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          observer.disconnect();
          starter = setTimeout(run, delay);
        }
      },
      { threshold: 0.35 },
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
      if (timer) clearInterval(timer);
      if (starter) clearTimeout(starter);
    };
  }, [to, duration, delay]);

  return ref;
}
