import { useState } from "react";
import { peca, type Encaixe } from "../../config/media";

/**
 * Encaixe de mídia — o lugar onde uma peça do portfólio entra numa seção.
 *
 * Registrada em `config/media.ts`, a peça aparece aqui. Enquanto não houver
 * material, desenha uma PRANCHA EM BRANCO: moldura, hachura diagonal e o
 * código do encaixe. Isso é proposital — num jogo de desenho a folha ainda
 * não desenhada é uma folha legítima. O site nunca fica com buraco.
 *
 * VÍDEO NÃO BAIXA SOZINHO. Até o clique existe só o `poster`; o `<video>` é
 * criado no clique, com `preload="none"`. Com o hero já custando 14 MB, um
 * vídeo por seção carregando automático tornaria a página impraticável no
 * celular — e a maioria dos visitantes nunca assiste a todos.
 *
 * INVARIÁVEIS DA CASA: nenhum `requestAnimationFrame`, nenhum listener de
 * scroll, nenhum `setState` durante a rolagem. O único estado aqui muda
 * quando alguém clica em play. O motor de scrub do hero segue dono do único
 * loop de animação do app.
 */

export function MediaSlot({
  encaixe,
  proporcao = "16/10",
  className = "",
  fallback,
}: {
  encaixe: Encaixe;
  /** Proporção do quadro. A seção manda, porque é ela que conhece seu layout. */
  proporcao?: "16/10" | "4/3" | "3/4" | "1/1";
  className?: string;
  /**
   * O que mostrar enquanto o encaixe estiver vazio.
   *
   * Onde já existe uma ilustração autoral boa — as camadas do palco de
   * Soluções, por exemplo — a peça real deve SUBSTITUIR a ilustração quando
   * chegar, não abrir um buraco antes disso. Passe a ilustração aqui e o
   * site melhora conforme o material entra, sem nunca piorar.
   *
   * Sem `fallback`, o vazio vira prancha em branco.
   */
  fallback?: React.ReactNode;
}) {
  const p = peca(encaixe);
  const [tocando, setTocando] = useState(false);

  const moldura =
    "relative overflow-hidden border border-[var(--hair-strong)] bg-surface " + className;
  const estilo = { aspectRatio: proporcao.replace("/", " / ") };

  // --- vazio, mas com ilustração no lugar ----------------------------------
  if (!p && fallback) return <>{fallback}</>;

  // --- prancha em branco: ainda sem material -------------------------------
  if (!p) {
    return (
      <div className={moldura} style={estilo} data-slot={encaixe} data-estado="vazio">
        <Hachura />
        <Cantoneiras />
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 px-6 text-center">
          <span className="label text-accent-soft">{encaixe}</span>
          <span className="label-xs text-muted">Prancha em branco</span>
        </div>
      </div>
    );
  }

  // --- vídeo: poster até o clique ------------------------------------------
  if (p.tipo === "video" || p.tipo === "tour") {
    return (
      <figure className="m-0">
        <div className={moldura} style={estilo} data-slot={encaixe} data-estado="peca">
          {tocando ? (
            <video
              src={p.src}
              poster={p.poster}
              controls
              autoPlay
              playsInline
              preload="none"
              className="h-full w-full object-cover"
            >
              <track kind="captions" />
            </video>
          ) : (
            <button
              type="button"
              onClick={() => setTocando(true)}
              aria-label={`Reproduzir: ${p.alt}`}
              className="group h-full w-full cursor-pointer border-0 bg-transparent p-0"
            >
              {p.poster ? (
                <img
                  src={p.poster}
                  alt={p.alt}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover opacity-90 transition-opacity duration-700 group-hover:opacity-100"
                />
              ) : (
                <Hachura />
              )}
              <span className="pointer-events-none absolute inset-0 bg-ink/25 transition-colors duration-500 group-hover:bg-ink/10" />
              <PlayMark />
            </button>
          )}
          <Cantoneiras />
          <Selo encaixe={encaixe} tipo={p.tipo} />
        </div>
        <Legenda peca={p} />
      </figure>
    );
  }

  // --- imagem ---------------------------------------------------------------
  return (
    <figure className="m-0">
      <div className={moldura} style={estilo} data-slot={encaixe} data-estado="peca">
        <img
          src={p.src}
          alt={p.alt}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover"
        />
        <Cantoneiras />
        <Selo encaixe={encaixe} tipo={p.tipo} />
      </div>
      <Legenda peca={p} />
    </figure>
  );
}

/* -------------------------------------------------------------------------- */

/** Hachura diagonal — a marca de "área ainda não desenhada" numa prancha. */
function Hachura() {
  return (
    <span
      aria-hidden="true"
      className="absolute inset-0 opacity-[0.55]"
      style={{
        backgroundImage:
          "repeating-linear-gradient(45deg, rgba(221,231,239,0.07) 0 1px, transparent 1px 11px)",
      }}
    />
  );
}

/** Cantoneiras de prancha, as mesmas do hero e dos projetos. */
function Cantoneiras() {
  const base = "pointer-events-none absolute h-3 w-3 border-paper/50";
  return (
    <span aria-hidden="true">
      <span className={`${base} left-2 top-2 border-l border-t`} />
      <span className={`${base} right-2 top-2 border-r border-t`} />
      <span className={`${base} bottom-2 left-2 border-b border-l`} />
      <span className={`${base} bottom-2 right-2 border-b border-r`} />
    </span>
  );
}

const ROTULO: Record<string, string> = {
  video: "Vídeo",
  tour: "Tour 3D",
  imagem: "Imagem",
};

function Selo({ encaixe, tipo }: { encaixe: Encaixe; tipo: string }) {
  return (
    <span className="pointer-events-none absolute left-0 top-0 flex gap-2 border-b border-r border-[var(--hair)] bg-ink/80 px-3 py-1.5">
      <span className="label text-accent-soft">{encaixe}</span>
      <span className="label text-muted">{ROTULO[tipo] ?? tipo}</span>
    </span>
  );
}

function PlayMark() {
  return (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-paper/60 bg-ink/55 transition-colors duration-500 group-hover:border-accent-soft group-hover:bg-accent/70"
    >
      <svg viewBox="0 0 24 24" className="ml-0.5 h-5 w-5" fill="currentColor">
        <path d="M8 5v14l11-7z" />
      </svg>
    </span>
  );
}

function Legenda({ peca: p }: { peca: { legenda?: string; empreendimento?: string } }) {
  if (!p.legenda && !p.empreendimento) return null;
  return (
    <figcaption className="mt-3 flex flex-wrap gap-x-3 gap-y-1">
      {p.empreendimento ? <span className="label text-paper/70">{p.empreendimento}</span> : null}
      {p.legenda ? <span className="label text-muted">{p.legenda}</span> : null}
    </figcaption>
  );
}
