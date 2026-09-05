import { useReveal } from "../../hooks/use-reveal";
import { SheetLabel } from "../ui/sheet-label";
import { BlueprintPlan } from "../visuals/arch";

const CHAIN = ["Visão", "Experiência", "Negócio"] as const;

export function Editorial() {
  const headRef = useReveal<HTMLDivElement>(120);
  const outroRef = useReveal<HTMLDivElement>(140);

  return (
    <section id="editorial" className="relative overflow-hidden py-28 sm:py-36 lg:py-48" style={{ backgroundColor: "#030610" }}>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 h-[560px] w-[900px] -translate-x-1/2"
        style={{ background: "radial-gradient(ellipse at top, rgba(37, 137, 201,0.16), transparent 65%)" }}
      />

      {/* ---------------- statement ---------------- */}
      <div ref={headRef} className="reveal relative mx-auto max-w-[1400px] px-6 text-center sm:px-10 lg:px-16">
        <SheetLabel code="A-04">O que está realmente em jogo</SheetLabel>
        <h2
          className="display d1 mx-auto mt-8 max-w-[18ch] uppercase text-paper"
          data-reveal
        >
          Você não <span className="text-accent-soft">vende</span>
          <br />
          apenas metros
          <br />
          quadrados.
        </h2>
      </div>

      {/* ---------------- vertical narrative ---------------- */}
      <div className="relative mx-auto mt-24 max-w-[1400px] px-6 sm:mt-32 sm:px-10 lg:px-16">
        {STEPS.map((step, i) => (
          <NarrativeStep key={step.word} step={step} index={i} />
        ))}
      </div>

      {/* ---------------- outro ---------------- */}
      <div ref={outroRef} className="reveal relative mx-auto mt-8 max-w-[1400px] px-6 text-center sm:px-10 lg:px-16">
        <span
          aria-hidden="true"
          className="mx-auto block h-24 w-px origin-top bg-gradient-to-b from-accent to-transparent"
        />
        <h3
          className="display d2 mx-auto mt-9 max-w-[22ch] uppercase text-paper"
          data-reveal
        >
          A IMOVIX transforma essa visão em experiência.
        </h3>

        <div className="mt-14 flex flex-wrap items-center justify-center gap-x-5 gap-y-4" data-reveal>
          {CHAIN.map((node, i) => (
            <span key={node} className="flex items-center gap-5">
              {i > 0 && (
                <span aria-hidden="true" className="h-px w-10 bg-accent sm:w-20" />
              )}
              <span className="label-xs text-paper/80">
                {node}
              </span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */

type Step = {
  word: string;
  body: string;
  visual: "blueprint" | "image" | "panel";
  src?: string;
  alt?: string;
};

const STEPS: readonly Step[] = [
  {
    word: "Visão",
    body: "O projeto ainda é linha, cota e intenção.",
    visual: "blueprint",
  },
  {
    word: "Desejo",
    body: "A arquitetura ganha luz, matéria e atmosfera.",
    visual: "image",
    src: "/scenes/desejo.jpg",
    alt: "Renderização cinematográfica de um empreendimento em golden hour",
  },
  {
    word: "Confiança",
    body: "Cada detalhe do empreendimento fica explorável.",
    visual: "panel",
  },
  {
    word: "Possibilidade",
    body: "O empreendimento existe antes de existir.",
    visual: "image",
    src: "/scenes/possibilidade.jpg",
    alt: "Empreendimento residencial completo iluminado no fim de tarde",
  },
];

function NarrativeStep({ step, index }: { step: Step; index: number }) {
  const ref = useReveal<HTMLDivElement>(160);
  const flip = index % 2 === 1;

  return (
    <div
      ref={ref}
      className="reveal grid grid-cols-[22px_minmax(0,1fr)] gap-x-5 gap-y-6 pb-16 sm:gap-x-8 sm:pb-24 lg:grid-cols-[minmax(0,1fr)_88px_minmax(0,1fr)] lg:items-center lg:gap-x-0 lg:pb-28"
    >
      {/* spine */}
      <div className="relative col-start-1 row-span-2 flex justify-center lg:col-start-2 lg:row-span-1 lg:self-stretch">
        <span aria-hidden="true" className="absolute inset-y-0 w-px bg-[var(--hair)]" />
        <span
          aria-hidden="true"
          className="reveal-img absolute inset-y-0 w-px bg-gradient-to-b from-accent via-accent to-transparent"
          style={{ clipPath: "inset(0 0 100% 0)" }}
        />
        <span
          aria-hidden="true"
          className="absolute top-1 h-2 w-2 -translate-y-1/2 rotate-45 bg-accent lg:top-1/2"
        />
      </div>

      {/* text */}
      <div
        className={`col-start-2 lg:row-start-1 ${flip ? "lg:col-start-3 lg:pl-14" : "lg:col-start-1 lg:pr-14 lg:text-right"}`}
        data-reveal
      >
        <p className="text-[0.625rem] font-bold tracking-[0.22em] text-accent">
          {String(index + 1).padStart(2, "0")}
        </p>
        <h3 className="display d2 mt-4 uppercase text-paper">{step.word}</h3>
        <p className={`mt-5 max-w-[30ch] leading-relaxed text-muted ${flip ? "" : "lg:ml-auto"}`}>{step.body}</p>
      </div>

      {/* visual */}
      <div
        className={`col-start-2 lg:row-start-1 ${flip ? "lg:col-start-1 lg:pr-14" : "lg:col-start-3 lg:pl-14"}`}
        data-reveal
      >
        <div className="reveal-img relative aspect-[16/10] w-full overflow-hidden border border-[var(--hair)] bg-ink-2">
          {step.visual === "blueprint" && (
            <BlueprintPlan className="h-full w-full p-5 text-accent-soft sm:p-8" />
          )}

          {step.visual === "image" && step.src && (
            <>
              <img
                src={step.src}
                alt={step.alt ?? ""}
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover"
              />
              <span aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-ink/55 to-transparent" />
            </>
          )}

          {step.visual === "panel" && <DetailPanel />}

          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-accent/60"
          />
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */

const PANEL_ROWS = ["Plantas", "Unidades", "Lazer", "Localização"] as const;

/** Interface showing the depth of a development — no invented figures. */
function DetailPanel() {
  return (
    <div className="flex h-full w-full flex-col justify-between p-5 sm:p-7">
      <div className="flex items-center justify-between">
        <span className="text-[0.5625rem] font-bold tracking-[0.2em] text-paper/55">EMPREENDIMENTO</span>
        <span className="flex gap-1" aria-hidden="true">
          <span className="h-1 w-1 bg-paper/25" />
          <span className="h-1 w-1 bg-paper/25" />
          <span className="h-1 w-1 bg-accent" />
        </span>
      </div>

      <ul className="space-y-3">
        {PANEL_ROWS.map((row, i) => (
          <li key={row} className="flex items-center gap-4">
            <span className="w-[9ch] shrink-0 text-[0.625rem] font-bold uppercase tracking-[0.2em] text-paper/70">
              {row}
            </span>
            <span className="relative h-px flex-1 bg-[var(--hair)]">
              <span
                className="reveal-bar absolute inset-y-0 left-0 bg-accent"
                style={{
                  width: `${[72, 54, 88, 40][i]}%`,
                  "--reveal-delay": `${i * 140}ms`,
                } as React.CSSProperties}
              />
            </span>
            <svg viewBox="0 0 12 12" className="h-2.5 w-2.5 text-paper/40" fill="none" stroke="currentColor" strokeWidth="1.4">
              <path d="M3 2l5 4-5 4" />
            </svg>
          </li>
        ))}
      </ul>

      <div className="flex items-end justify-between">
        <span className="text-[0.5625rem] font-bold tracking-[0.2em] text-paper/35">EXPLORAR</span>
        <span className="h-px w-16 bg-accent" />
      </div>
    </div>
  );
}
