import { useReveal } from "../../hooks/use-reveal";
import { BlueprintPlan, Massing3D } from "../visuals/arch";

const STEPS = [
  { index: "01", title: "Visualize", body: "Mostre o que ainda não existe." },
  { index: "02", title: "Envolva", body: "Crie conexão antes da visita." },
  { index: "03", title: "Converta", body: "Transforme interesse em negócio." },
] as const;

const FLOW = ["Projeto", "Visualização", "Experiência", "Decisão"] as const;

export function Journey() {
  const headRef = useReveal<HTMLDivElement>(100);
  const railRef = useReveal<HTMLDivElement>(120);

  return (
    <section className="relative overflow-hidden bg-ink py-24 sm:py-32 lg:py-40">
      <div ref={headRef} className="reveal mx-auto max-w-[1400px] px-6 sm:px-10 lg:px-16">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="label" data-reveal>
              Jornada
            </p>
            <h2
              className="display d2 mt-7 uppercase text-paper"
              data-reveal
            >
              Da visualização
              <br />
              <span className="text-accent-soft">à decisão.</span>
            </h2>
          </div>
          <p className="max-w-[36ch] leading-relaxed text-muted" data-reveal>
            Cada etapa existe para encurtar a distância entre o projeto no papel e a decisão de
            compra.
          </p>
        </div>
      </div>

      {/* ---------------- the blue line ---------------- */}
      <div ref={railRef} className="reveal mx-auto mt-20 max-w-[1400px] px-6 sm:mt-24 sm:px-10 lg:px-16">
        <div className="relative">
          <span aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-[var(--hair)]" />
          <span aria-hidden="true" className="reveal-bar absolute inset-x-0 top-0 h-px bg-accent" />

          <div className="grid gap-14 pt-0 sm:gap-16 lg:grid-cols-3 lg:gap-10">
            {STEPS.map((step, i) => (
              <Stage key={step.index} step={step} position={i} />
            ))}
          </div>
        </div>

        {/* flow readout */}
        <div className="mt-20 flex flex-wrap items-center gap-x-4 gap-y-3 border-t border-[var(--hair)] pt-8" data-reveal>
          {FLOW.map((node, i) => (
            <span key={node} className="flex items-center gap-4">
              {i > 0 && <span aria-hidden="true" className="h-px w-6 bg-accent/70 sm:w-12" />}
              <span className="text-[0.625rem] font-bold uppercase tracking-[0.2em] text-muted sm:text-[0.6875rem]">
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

function Stage({ step, position }: { step: (typeof STEPS)[number]; position: number }) {
  const ref = useReveal<HTMLDivElement>(120);

  return (
    <div ref={ref} className="relative">
      {/* node on the line */}
      <span
        aria-hidden="true"
        className="absolute -top-[5px] left-0 h-2.5 w-2.5 rotate-45 border border-accent bg-ink transition-colors duration-1000"
        style={{ transitionDelay: `${position * 160}ms` }}
      />

      <div className="pt-10">
        <span className="text-[0.6875rem] font-bold tracking-[0.22em] text-accent">{step.index}</span>
        <h3 className="display d3 mt-5 uppercase text-paper">
          {step.title}
        </h3>
        <p className="mt-4 max-w-[26ch] leading-relaxed text-muted">{step.body}</p>

        <div className="reveal-img mt-9 aspect-[4/3] w-full overflow-hidden border border-[var(--hair)] bg-ink-2">
          {position === 0 && <VisualizeArt />}
          {position === 1 && <EngageArt />}
          {position === 2 && <ConvertArt />}
        </div>
      </div>
    </div>
  );
}

/* 01 — blueprint gains volume and becomes 3D architecture ------------ */
function VisualizeArt() {
  const ref = useReveal<HTMLDivElement>(0);

  return (
    <div ref={ref} className="relative h-full w-full">
      <div className="morph-a absolute inset-0">
        <BlueprintPlan className="h-full w-full p-5 text-accent-soft sm:p-7" bare />
      </div>
      <div className="morph-b absolute inset-0" data-active="true">
        <Massing3D className="h-full w-full p-5 text-accent-soft sm:p-7" />
      </div>
    </div>
  );
}

/* 02 — someone exploring the development through a device ------------ */
function EngageArt() {
  return (
    <div className="relative h-full w-full">
      <img
        src="/scenes/envolva.jpg"
        alt="Pessoa explorando um empreendimento por notebook e tablet"
        loading="lazy"
        decoding="async"
        className="h-full w-full object-cover opacity-80"
      />
      <span aria-hidden="true" className="absolute inset-0 bg-ink/35" />

      {/* floating 3D interface over the scene */}
      <div className="absolute inset-x-5 bottom-5 border border-accent/40 bg-ink/80 p-3 backdrop-blur-[2px] sm:inset-x-7 sm:bottom-7 sm:p-4">
        <div className="flex items-center justify-between">
          <span className="text-[0.5625rem] font-bold tracking-[0.2em] text-accent-soft sm:text-[0.625rem]">
            TOUR 3D
          </span>
          <span aria-hidden="true" className="flex gap-1">
            <span className="h-1 w-1 bg-paper/30" />
            <span className="h-1 w-1 bg-paper/30" />
            <span className="h-1 w-1 bg-accent" />
          </span>
        </div>
        <div className="mt-3 flex items-end gap-1.5" aria-hidden="true">
          {[38, 62, 48, 80, 56, 70, 44, 88, 52].map((h, i) => (
            <span
              key={i}
              className="reveal-bar w-full bg-accent/70"
              style={{ height: `${h * 0.22}px`, "--reveal-delay": `${i * 70}ms` } as React.CSSProperties}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

/* 03 — development plus a conversion interface ----------------------- */
function ConvertArt() {
  return (
    <div className="relative h-full w-full">
      <img
        src="/scenes/incorporadoras.jpg"
        alt="Empreendimento premium com interface de contato"
        loading="lazy"
        decoding="async"
        className="h-full w-full object-cover opacity-70"
      />
      <span aria-hidden="true" className="absolute inset-0 bg-ink/55" />

      <div className="absolute inset-x-5 bottom-5 sm:inset-x-7 sm:bottom-7">
        <div className="border border-[var(--hair-strong)] bg-ink/85 p-4 backdrop-blur-[2px]">
          <p className="text-[0.5625rem] font-bold tracking-[0.2em] text-paper/55 sm:text-[0.625rem]">
            OPORTUNIDADE
          </p>
          <p className="display d4 mt-2 text-paper">
            Quero conhecer o projeto
          </p>
          <span className="mt-4 flex items-center gap-3">
            <span className="reveal-bar h-8 flex-1 bg-accent" />
            <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 text-accent-soft" fill="none" stroke="currentColor" strokeWidth="1.6">
              <path d="M3 8h10M9 4l4 4-4 4" />
            </svg>
          </span>
        </div>
      </div>
    </div>
  );
}
