import { useEffect, useRef, useState } from "react";
import { useFrameScrub, heroFramePath } from "../../hooks/use-frame-scrub";
import { useVideoScrub, windowOpacity } from "../../hooks/use-video-scrub";
import { MagneticCta } from "../ui/magnetic-cta";
import { whatsappUrl } from "../../config/site";

const CHAPTERS = [
  { index: "01", title: "Visualize", lines: ["Seu empreendimento", "antes mesmo", "de existir."] },
  { index: "02", title: "Envolva", lines: ["Transforme arquitetura", "em experiência."] },
  { index: "03", title: "Desperte", lines: ["Crie desejo antes", "da visita."] },
  { index: "04", title: "Conecte", lines: ["Aproxime clientes", "do seu projeto."] },
  { index: "05", title: "Converta", lines: ["Experiências digitais", "que geram negócios."] },
] as const;

/** Non-overlapping progress windows for each chapter. */
const WINDOWS: Array<[number, number]> = [
  [0.14, 0.3],
  [0.3, 0.46],
  [0.46, 0.62],
  [0.62, 0.78],
  [0.78, 0.96],
];

/** The opening headline holds through the first stretch, then leaves. */
const INTRO_WINDOW: [number, number] = [0, 0.13];

/**
 * Duas técnicas para o mesmo tour: vídeo no desktop, sequência de frames no celular.
 *
 * `desktop` → `hero-scrub-v2.mp4` (1600px, 40 fps, 403 frames, 14 MB), all-intra,
 * reencodado direto do master 1904x1080/60fps. Ponteiro fino tem seek confiável.
 *
 * `phone` → **sequência de 96 frames WebP** (900px, 2,7 MB no total) trocados por
 * `img.src`. Nenhum encode de vídeo resolve o celular: no iOS cada escrita em
 * `currentTime` é um seek assíncrono do pipeline de mídia, e durante o momentum
 * do toque o decoder é limitado — o frame chega depois do dedo ou não chega.
 * Trocar o src de um `<img>` já decodificado é síncrono e acompanha o dedo.
 *
 * A escolha acontece uma vez, antes do primeiro paint, então o celular nunca
 * baixa o mp4 e o desktop nunca baixa os frames.
 *
 * O poster estático só entra em três casos honestos: `prefers-reduced-motion`,
 * modo economia de dados e conexão 2G — aí nenhum vídeo é requisitado.
 */
type HeroMode = "desktop" | "phone" | "still";

const DESKTOP_SRC = "/video/hero-scrub-v2.mp4";

function pickHeroMode(): HeroMode {
  if (typeof window === "undefined") return "still";
  const canMatch = typeof window.matchMedia === "function";
  if (canMatch && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return "still";

  const conn = (
    navigator as Navigator & {
      connection?: { saveData?: boolean; effectiveType?: string };
    }
  ).connection;
  if (conn?.saveData) return "still";
  if (conn?.effectiveType && /(^|-)(slow-)?2g/.test(conn.effectiveType)) return "still";

  const phone =
    canMatch &&
    (window.matchMedia("(max-width: 900px)").matches ||
      window.matchMedia("(hover: none) and (pointer: coarse)").matches);
  return phone ? "phone" : "desktop";
}

export function Hero() {
  // Decided once, before the first paint, so only one file is ever requested.
  const [mode] = useState(pickHeroMode);
  const streamVideo = mode === "desktop";
  const useFrames = mode === "phone";
  // Sem <video>, o hook usa a timeline sintética: mesmo rAF, mesmo onProgress.
  const { trackRef, videoRef, onProgress } = useVideoScrub({ video: streamVideo });
  const framesRef = useFrameScrub({ enabled: useFrames, onProgress });
  const introRef = useRef<HTMLDivElement | null>(null);
  const chapterRefs = useRef<Array<HTMLDivElement | null>>([]);
  const railRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const scrollHintRef = useRef<HTMLDivElement | null>(null);
  const vignetteRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const reduceMotion =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const apply = (el: HTMLElement | null, opacity: number, lift: number) => {
      if (!el) return;
      el.style.opacity = opacity.toFixed(3);
      if (reduceMotion) {
        el.style.transform = "";
        el.style.filter = "";
      } else {
        el.style.transform = `translate3d(0, ${lift.toFixed(2)}px, 0)`;
        el.style.filter = opacity > 0.985 ? "none" : `blur(${((1 - opacity) * 6).toFixed(2)}px)`;
      }
      el.style.visibility = opacity < 0.01 ? "hidden" : "visible";
    };

    return onProgress((progress) => {
      // Intro headline: fully visible at the start, leaves upward.
      const introOut = Math.min(1, Math.max(0, (progress - INTRO_WINDOW[0]) / INTRO_WINDOW[1]));
      apply(introRef.current, 1 - introOut, -introOut * 40);

      if (scrollHintRef.current) {
        scrollHintRef.current.style.opacity = (1 - Math.min(1, progress / 0.05)).toFixed(3);
      }

      // Chapters: fade in, hold, leave upward.
      for (let i = 0; i < WINDOWS.length; i += 1) {
        const win = WINDOWS[i];
        if (!win) continue;
        const [start, end] = win;
        const opacity = windowOpacity(progress, start, end, 0.28);
        const local = (progress - start) / (end - start);
        const lift = (0.5 - Math.min(1, Math.max(0, local))) * 56;
        apply(chapterRefs.current[i] ?? null, opacity, lift);

        const dot = railRefs.current[i];
        if (dot) {
          const active = progress >= start && progress < end;
          dot.style.transform = `scaleX(${active ? 1 : 0.16})`;
          dot.style.opacity = active ? "1" : "0.35";
        }
      }

      // Darken the footage slightly while chapters are on screen.
      if (vignetteRef.current) {
        const density = progress > 0.1 ? 0.34 : 0.34 - (0.1 - progress) * 0.6;
        vignetteRef.current.style.opacity = Math.max(0.18, density).toFixed(3);
      }
    });
  }, [onProgress]);

  return (
    <section
      ref={trackRef}
      className="relative h-[420vh] bg-ink md:h-[620vh]"
      aria-label="Experiência cinematográfica IMOVIX"
    >
      <div className="sticky top-0 h-[100svh] w-full overflow-hidden">
        {useFrames ? (
          <img
            ref={framesRef}
            src={heroFramePath(0)}
            alt=""
            aria-hidden="true"
            fetchPriority="high"
            decoding="async"
            width={900}
            height={510}
            className="absolute inset-0 h-full w-full object-cover"
            style={{ objectPosition: "center 42%", backgroundColor: "#050914" }}
          />
        ) : streamVideo ? (
          <video
            ref={videoRef}
            className="absolute inset-0 h-full w-full object-cover"
            style={{ objectPosition: "center 42%" }}
            poster="/video/hero-poster.jpg"
            src={DESKTOP_SRC}
            preload="auto"
            muted
            playsInline
            disablePictureInPicture
            aria-hidden="true"
            tabIndex={-1}
          />
        ) : (
          <img
            src="/video/hero-poster.jpg"
            alt=""
            aria-hidden="true"
            fetchPriority="high"
            decoding="async"
            className="drift absolute inset-0 h-full w-full object-cover"
            style={{ objectPosition: "center 42%" }}
          />
        )}

        {/* Legibility layers — never hide the architecture completely. */}
        <div
          ref={vignetteRef}
          className="pointer-events-none absolute inset-0"
          style={{
            opacity: 0.34,
            background:
              "linear-gradient(180deg, rgba(5,9,20,0.86) 0%, rgba(5,9,20,0.14) 34%, rgba(5,9,20,0.22) 62%, rgba(5,9,20,0.92) 100%)",
          }}
        />
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(120% 80% at 50% 50%, rgba(5,9,20,0) 38%, rgba(5,9,20,0.55) 100%)",
          }}
        />
        {/* Left scrim — keeps the copy readable over bright architecture. */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(90deg, rgba(5,9,20,0.78) 0%, rgba(5,9,20,0.52) 26%, rgba(5,9,20,0.16) 56%, rgba(5,9,20,0) 78%)",
          }}
        />

        {/* Intro */}
        <div className="pointer-events-none absolute inset-0 flex items-center">
          <div
            ref={introRef}
            className="pointer-events-auto mx-auto w-full max-w-[1400px] px-6 sm:px-10 lg:px-16"
            style={{ willChange: "opacity, transform" }}
          >
            <p className="label mb-6 text-paper/70">Tecnologia e marketing imobiliário 3D</p>
            <h1 className="display d1 max-w-[19ch] text-paper">
              Transformamos projetos imobiliários em experiências que vendem.
            </h1>
            <p className="lead mt-7 max-w-[48ch] text-paper/70">
              Unimos tecnologia, visualização 3D e estratégia para ajudar construtoras,
              incorporadoras e imobiliárias a vender e alugar mais.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <MagneticCta href="#solucoes">Conhecer a IMOVIX</MagneticCta>
              <MagneticCta href={whatsappUrl()} variant="ghost" external>
                Falar com um especialista
              </MagneticCta>
            </div>
          </div>
        </div>

        {/* Chapters */}
        {CHAPTERS.map((chapter, i) => (
          <div
            key={chapter.index}
            ref={(node) => {
              chapterRefs.current[i] = node;
            }}
            className="pointer-events-none absolute inset-0 flex items-center"
            style={{ opacity: 0, visibility: "hidden", willChange: "opacity, transform" }}
          >
            <div className="mx-auto w-full max-w-[1400px] px-6 sm:px-10 lg:px-16">
              <div className="flex items-baseline gap-5">
                <span className="text-[0.6875rem] font-bold tracking-[0.22em] text-accent-soft">
                  {chapter.index}
                </span>
                <span className="h-px w-16 bg-[var(--hair-strong)]" />
              </div>
              <h2 className="display d2 mt-6 uppercase text-paper">
                {chapter.title}
              </h2>
              <p className="d4 mt-5 max-w-[30ch] font-medium leading-snug text-paper/80">
                {chapter.lines.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </p>
            </div>
          </div>
        ))}

        {/* Chapter rail */}
        <div className="pointer-events-none absolute bottom-10 left-6 hidden items-center gap-2 sm:left-10 lg:left-16 md:flex">
          {CHAPTERS.map((chapter, i) => (
            <span
              key={chapter.index}
              ref={(node) => {
                railRefs.current[i] = node;
              }}
              className="block h-px w-10 origin-left bg-accent-soft"
              style={{ transform: "scaleX(0.16)", opacity: 0.35, transition: "transform .5s var(--ease-out-expo), opacity .5s" }}
            />
          ))}
        </div>

        {/* Scroll hint */}
        <div
          ref={scrollHintRef}
          className="pointer-events-none absolute bottom-9 left-1/2 -translate-x-1/2 text-center"
        >
          <span className="label text-paper/50">Role para percorrer</span>
        </div>
      </div>
    </section>
  );
}
