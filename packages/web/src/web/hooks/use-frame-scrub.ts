import { useEffect, useRef } from "react";

/**
 * Scrub por sequência de frames — a técnica do hero no celular.
 *
 * Por quê não vídeo: o Safari do iPhone trata cada escrita em `currentTime`
 * como um seek assíncrono do pipeline de mídia. Durante o momentum do toque o
 * navegador limita o decoder, então o frame chega centenas de ms depois do dedo
 * (ou não chega). Nenhum encode resolve isso — é o pipeline, não o arquivo.
 * Trocar o `src` de um `<img>` já decodificado é síncrono e roda no compositor:
 * a imagem acompanha o dedo quadro a quadro. É a mesma abordagem que a Apple
 * usa nas páginas de produto.
 *
 * Invariáveis preservados: nenhum listener de scroll novo (o progresso vem do
 * `onProgress` do `useVideoScrub`, que roda no único rAF do app), nenhum
 * `setState` durante o scroll, nenhum canvas, nenhum segundo rAF.
 */

/** Quantos frames existem em `public/frames/hero/`. */
export const HERO_FRAME_COUNT = 96;

/** Quantas requisições simultâneas no preload — não afogar o 4G. */
const PRELOAD_CONCURRENCY = 6;

export function heroFramePath(index: number): string {
  return `/frames/hero/f${String(index + 1).padStart(3, "0")}.webp`;
}

type Options = {
  enabled: boolean;
  count?: number;
  onProgress: (listener: (progress: number) => void) => () => void;
};

export function useFrameScrub({ enabled, count = HERO_FRAME_COUNT, onProgress }: Options) {
  const imgRef = useRef<HTMLImageElement | null>(null);
  /** Frames já decodificados: trocar o src para um deles é instantâneo. */
  const readyRef = useRef<Array<boolean>>([]);
  const shownRef = useRef(-1);

  useEffect(() => {
    const img = imgRef.current;
    if (!enabled || !img) return;

    let disposed = false;
    readyRef.current = new Array(count).fill(false);

    // --- preload em ordem de aparição, com concorrência limitada -----------
    // O primeiro frame entra na frente de tudo para o hero nunca ficar vazio.
    let next = 0;
    const loadOne = (index: number) =>
      new Promise<void>((resolve) => {
        const loader = new Image();
        loader.decoding = "async";
        loader.onload = () => {
          readyRef.current[index] = true;
          // Se o dedo já passou por esse frame, mostra agora que ele existe.
          if (!disposed && index === shownRef.current) img.src = loader.src;
          resolve();
        };
        loader.onerror = () => resolve();
        loader.src = heroFramePath(index);
      });

    const worker = async (): Promise<void> => {
      while (!disposed && next < count) {
        const index = next;
        next += 1;
        await loadOne(index);
      }
    };
    for (let i = 0; i < PRELOAD_CONCURRENCY; i += 1) void worker();

    // --- troca de frame, dirigida pelo rAF do useVideoScrub ---------------
    const unsubscribe = onProgress((progress) => {
      const clamped = progress < 0 ? 0 : progress > 1 ? 1 : progress;
      const index = Math.min(count - 1, Math.round(clamped * (count - 1)));
      if (index === shownRef.current) return;
      shownRef.current = index;
      // Frame ainda não baixado: mantém o atual em tela (melhor que piscar).
      if (!readyRef.current[index]) return;
      img.src = heroFramePath(index);
    });

    return () => {
      disposed = true;
      unsubscribe();
    };
  }, [enabled, count, onProgress]);

  return imgRef;
}
