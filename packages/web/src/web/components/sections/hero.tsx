import { useEffect, useRef, useState } from "react";
import { useFrameScrub, heroFramePath } from "../../hooks/use-frame-scrub";
import { useVideoScrub, windowOpacity } from "../../hooks/use-video-scrub";

const CHAPTERS = [
  { title: "Visualize", text: "Seu empreendimento antes mesmo de existir.", start: 0.14, end: 0.3 },
  { title: "Envolva", text: "Transforme arquitetura em experiência.", start: 0.3, end: 0.46 },
  { title: "Desperte", text: "Crie desejo antes da visita.", start: 0.46, end: 0.62 },
  { title: "Conecte", text: "Aproxime clientes do seu projeto.", start: 0.62, end: 0.78 },
  { title: "Converta", text: "Experiências digitais que geram negócios.", start: 0.78, end: 0.96 },
] as const;

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
  const [mode] = useState(pickHeroMode);
  const streamVideo = mode === "desktop";
  const useFrames = mode === "phone";
  const { trackRef, videoRef, onProgress } = useVideoScrub({ video: streamVideo });
  const framesRef = useFrameScrub({ enabled: useFrames, onProgress });
  const introRef = useRef<HTMLDivElement>(null);
  const chapterRefs = useRef<Array<HTMLDivElement | null>>([]);

  useEffect(() => {
    // The still/reduced-motion variant keeps the opening copy without movement.
    if (mode === "still") return;
    const apply = (element: HTMLDivElement | null, opacity: number, lift: number) => {
      if (!element) return;
      element.style.opacity = opacity.toFixed(3);
      element.style.transform = `translate3d(0, ${lift.toFixed(2)}px, 0)`;
      element.style.visibility = opacity < 0.01 ? "hidden" : "visible";
    };
    return onProgress((progress) => {
      // Reuse the original scroll windows and smoothstep; no independent timers.
      const out = Math.min(1, Math.max(0, (progress - 0.035) / (0.14 - 0.035)));
      const eased = out * out * (3 - 2 * out);
      apply(introRef.current, 1 - eased, -eased * 24);
      CHAPTERS.forEach((chapter, i) => {
        const fade = windowOpacity(progress, chapter.start, chapter.end, 0.22);
        const local = Math.min(
          1,
          Math.max(0, (progress - chapter.start) / (chapter.end - chapter.start)),
        );
        apply(chapterRefs.current[i] ?? null, fade * fade * (3 - 2 * fade), (0.5 - local) * 32);
      });
    });
  }, [mode, onProgress]);

  return (
    <section
      ref={trackRef}
      className="studio-hero relative h-[420vh] bg-ink md:h-[620vh]"
      data-still={mode === "still"}
      aria-label="Experiência cinematográfica IMOVIX"
    >
      <p className="sr-only">
        Explore o empreendimento rolando a página. O conteúdo do site está após o vídeo.
      </p>
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
            style={{ objectPosition: "center 42%", backgroundColor: "#0a2036" }}
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
            className="absolute inset-0 h-full w-full object-cover"
            style={{ objectPosition: "center 42%" }}
          />
        )}
        <div className="hero-editorial-shade" aria-hidden="true" />
        <div className="hero-editorial-layer">
          <div ref={introRef} className="hero-editorial-copy">
            <p className="hero-editorial-kicker">Arquitetura imaginada. Experiência real.</p>
            <h1 className="hero-editorial-title">
              Seu projeto.
              <br />
              Uma experiência real.
            </h1>
            <p className="hero-editorial-description">
              Imagens, filmes 3D e experiências digitais que revelam o potencial do seu projeto,
              antes da primeira obra.
            </p>
          </div>
        </div>
        {CHAPTERS.map((chapter, i) => (
          <div key={chapter.title} className="hero-editorial-layer">
            <div
              ref={(node) => {
                chapterRefs.current[i] = node;
              }}
              className="hero-editorial-copy"
              style={{ opacity: 0, visibility: "hidden" }}
            >
              <h2 className="hero-editorial-title hero-editorial-chapter">{chapter.title}</h2>
              <p className="hero-editorial-description">{chapter.text}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
