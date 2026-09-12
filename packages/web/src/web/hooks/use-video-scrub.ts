import { useEffect, useRef } from "react";

/** Never let the last frame be the black tail of the file. */
const END_EPSILON = 0.05;
/** Don't reseek for sub-perceptual differences. */
const SEEK_EPSILON = 0.01;
/** Time-based damping constant (higher = snappier). */
const DAMPING = 18;

type ProgressListener = (progress: number) => void;

/**
 * Scroll-driven video scrubbing.
 *
 * Invariants (see design.md):
 * - `video.play()` is called AT MOST ONCE, as a decoder activation ("prime"),
 *   and the element is paused again in the same microtask. Mobile Safari does
 *   not paint frames produced by `currentTime` seeks on a <video> that has
 *   never been played, so without the prime the hero stays frozen on the
 *   poster on real iPhones. Outside that single prime a `play` listener forces
 *   `pause()` back, so the video is never actually playing.
 * - ONE passive scroll listener writes a clamped target into a ref. Layout is
 *   measured once and re-measured only on resize / ResizeObserver.
 * - ONE rAF loop damps displayedTime -> targetTime and writes `currentTime`
 *   at most once per frame, skipping while a seek is still in flight.
 * - No React state is touched during scroll. Overlays subscribe via
 *   `onProgress` and mutate the DOM directly.
 */
export function useVideoScrub(options?: { video?: boolean }) {
  const hasVideo = options?.video !== false;
  const trackRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const targetTimeRef = useRef(0);
  const displayedTimeRef = useRef(0);
  const durationRef = useRef(0);
  const metricsRef = useRef({ start: 0, length: 1 });
  const listenersRef = useRef(new Set<ProgressListener>());
  const lastEmittedRef = useRef(-1);

  /** Subscribe to smoothed progress (0..1). Returns an unsubscribe fn. */
  const onProgress = useRef((listener: ProgressListener) => {
    listenersRef.current.add(listener);
    return () => {
      listenersRef.current.delete(listener);
    };
  }).current;

  useEffect(() => {
    const track = trackRef.current;
    const video = videoRef.current;
    if (!track) return;
    if (hasVideo && !video) return;

    let rafId = 0;
    let lastFrameAt = performance.now();
    let disposed = false;

    const reduceMotion =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const useFastSeek =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(hover: none) and (pointer: coarse)").matches &&
      typeof (video as (HTMLVideoElement & { fastSeek?: (t: number) => void }) | null)
        ?.fastSeek === "function";

    // Without a video element the timeline is synthetic: 1 unit long, so the
    // overlays still receive a 0..1 progress from the same rAF loop.
    if (!video) durationRef.current = 1 + END_EPSILON;

    const measure = () => {
      const rect = track.getBoundingClientRect();
      metricsRef.current = {
        start: rect.top + window.scrollY,
        length: Math.max(1, track.offsetHeight - window.innerHeight),
      };
      updateTarget();
    };

    const updateTarget = () => {
      const { start, length } = metricsRef.current;
      const raw = (window.scrollY - start) / length;
      const progress = raw < 0 ? 0 : raw > 1 ? 1 : raw;
      const usable = Math.max(0, durationRef.current - END_EPSILON);
      targetTimeRef.current = progress * usable;
    };

    // --- the single passive scroll listener -------------------------------
    const onScroll = () => updateTarget();
    window.addEventListener("scroll", onScroll, { passive: true });

    // --- keep the video paused, always ------------------------------------
    // `priming` opens a single window where the forced pause stands down, so
    // the activation play() survives long enough for a frame to decode.
    let priming = false;
    let primed = false;

    const forcePause = () => {
      if (video && !video.paused && !priming) video.pause();
    };

    /**
     * One-shot decoder activation for mobile Safari / some Android browsers:
     * play() muted, then pause immediately and restore the scrubbed position.
     * After this the element paints seeks normally.
     */
    const prime = () => {
      if (!video || primed) return;
      primed = true;
      priming = true;
      const settle = () => {
        priming = false;
        if (!video.paused) video.pause();
        const t = displayedTimeRef.current;
        if (Math.abs(video.currentTime - t) > SEEK_EPSILON) video.currentTime = t;
      };
      try {
        const p = video.play();
        if (p && typeof p.then === "function") {
          p.then(settle).catch(() => {
            priming = false;
            primed = false; // autoplay blocked: retry on the first gesture
          });
        } else {
          settle();
        }
      } catch {
        priming = false;
        primed = false;
      }
    };

    const onLoadedMetadata = () => {
      if (!video) return;
      durationRef.current = video.duration || 0;
      forcePause();
      measure();
      // Nudge the decoder so the first frame is painted instead of a blank box.
      if (video.currentTime === 0) video.currentTime = 0.001;
      prime();
    };

    if (video) {
      video.addEventListener("play", forcePause);
      video.addEventListener("playing", forcePause);
      video.addEventListener("loadedmetadata", onLoadedMetadata);
      video.addEventListener("loadeddata", onLoadedMetadata);
      if (video.readyState >= 1) onLoadedMetadata();
      // Fallback for iOS low-power mode, where muted autoplay is refused:
      // the first touch is a user gesture, which always unlocks playback.
      window.addEventListener("touchstart", prime, { passive: true });
      window.addEventListener("pointerdown", prime, { passive: true });
    }

    // --- the single rAF loop ----------------------------------------------
    const tick = (now: number) => {
      if (disposed) return;
      rafId = requestAnimationFrame(tick);

      const dt = Math.min(0.05, (now - lastFrameAt) / 1000);
      lastFrameAt = now;

      const target = targetTimeRef.current;
      let displayed = displayedTimeRef.current;

      if (reduceMotion) {
        displayed = target;
      } else {
        displayed += (target - displayed) * (1 - Math.exp(-DAMPING * dt));
        if (Math.abs(target - displayed) < 0.0004) displayed = target;
      }
      displayedTimeRef.current = displayed;

      // At most one currentTime write per frame; skip while a seek is pending
      // so rapid scrolling coalesces into the newest position.
      if (video && video.readyState >= 1 && !video.seeking) {
        if (Math.abs(video.currentTime - displayed) > SEEK_EPSILON) {
          // All-intra sources make fastSeek frame-exact, and it avoids the
          // seek stutter mobile Safari shows on precise `currentTime` writes.
          if (useFastSeek) video.fastSeek?.(displayed);
          else video.currentTime = displayed;
        }
      }

      const duration = durationRef.current;
      if (duration > 0 && listenersRef.current.size > 0) {
        const progress = Math.min(1, displayed / Math.max(0.001, duration - END_EPSILON));
        if (Math.abs(progress - lastEmittedRef.current) > 0.0005) {
          lastEmittedRef.current = progress;
          for (const listener of listenersRef.current) listener(progress);
        }
      }
    };
    rafId = requestAnimationFrame(tick);

    // --- cached measurements ----------------------------------------------
    const onResize = () => measure();
    window.addEventListener("resize", onResize);
    window.addEventListener("orientationchange", onResize);

    const resizeObserver =
      typeof ResizeObserver !== "undefined" ? new ResizeObserver(() => measure()) : null;
    resizeObserver?.observe(track);

    measure();

    return () => {
      disposed = true;
      cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("orientationchange", onResize);
      window.removeEventListener("touchstart", prime);
      window.removeEventListener("pointerdown", prime);
      video?.removeEventListener("play", forcePause);
      video?.removeEventListener("playing", forcePause);
      video?.removeEventListener("loadedmetadata", onLoadedMetadata);
      video?.removeEventListener("loadeddata", onLoadedMetadata);
      resizeObserver?.disconnect();
    };
  }, [hasVideo]);

  return { trackRef, videoRef, onProgress };
}

/** Trapezoid window: 0 outside [start,end], 1 while held in the middle. */
export function windowOpacity(progress: number, start: number, end: number, ramp = 0.25): number {
  if (progress <= start || progress >= end) return 0;
  const span = end - start;
  const t = (progress - start) / span;
  if (t < ramp) return t / ramp;
  if (t > 1 - ramp) return (1 - t) / ramp;
  return 1;
}
