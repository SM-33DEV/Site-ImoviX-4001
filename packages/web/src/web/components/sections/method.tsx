import { useReveal } from "../../hooks/use-reveal";
import { SheetLabel } from "../ui/sheet-label";
import { useSteppedFocus } from "../../hooks/use-stage";
import { BlueprintPlan, Massing3D } from "../visuals/arch";

const STEPS = [
  {
    index: "01",
    title: "Estratégia",
    body: "Entendemos o empreendimento, público e objetivo comercial.",
    state: "BLUEPRINT",
  },
  {
    index: "02",
    title: "Visualização",
    body: "Transformamos arquitetura em experiências digitais.",
    state: "MODELO 3D",
  },
  {
    index: "03",
    title: "Tecnologia",
    body: "Construímos plataformas e sistemas para apresentar o projeto.",
    state: "EXPERIÊNCIA DIGITAL",
  },
  {
    index: "04",
    title: "Conversão",
    body: "Criamos experiências orientadas a gerar oportunidades comerciais.",
    state: "NEGÓCIO",
  },
] as const;

export function Method() {
  const headRef = useReveal<HTMLDivElement>(110);
  const { active, setRef } = useSteppedFocus(STEPS.length);

  return (
    <section id="metodo" className="relative overflow-x-clip bg-ink py-24 sm:py-32 lg:py-40">
      <div ref={headRef} className="reveal mx-auto max-w-[1400px] px-6 sm:px-10 lg:px-16">
        <SheetLabel code="A-06">Método IMOVIX</SheetLabel>
        <h2 className="display d2 mt-7 uppercase text-paper" data-reveal>
          Do projeto
          <br />
          <span className="text-accent-soft">à experiência.</span>
        </h2>
      </div>

      <div className="mx-auto mt-16 max-w-[1400px] px-6 sm:mt-20 sm:px-10 lg:grid lg:grid-cols-2 lg:gap-16 lg:px-16">
        {/* sticky architectural stage — desktop only */}
        <div className="hidden lg:block">
          <div className="sticky top-24">
            <MethodStage active={active} />
          </div>
        </div>

        {/* steps */}
        <ol>
          {STEPS.map((step, i) => (
            <li
              key={step.index}
              ref={setRef(i)}
              className="border-t border-[var(--hair)] py-12 last:border-b sm:py-16 lg:min-h-[58vh] lg:border-b-0 lg:py-0 lg:flex lg:flex-col lg:justify-center"
            >
              <StepBody step={step} isActive={i === active} />
              {/* inline stage on small screens */}
              <div className="mt-9 lg:hidden">
                <MethodStage active={i} compact />
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function StepBody({ step, isActive }: { step: (typeof STEPS)[number]; isActive: boolean }) {
  const ref = useReveal<HTMLDivElement>(90);

  return (
    <div ref={ref} className="reveal">
      <div className="flex items-center gap-4" data-reveal>
        <span
          className="text-[0.6875rem] font-bold tracking-[0.22em] transition-colors duration-700"
          style={{ color: isActive ? "var(--color-accent-soft)" : "var(--color-muted)" }}
        >
          {step.index}
        </span>
        <span
          className="h-px flex-1 transition-colors duration-700"
          style={{ background: isActive ? "var(--color-accent)" : "var(--hair)" }}
        />
        <span className="text-[0.5625rem] font-bold tracking-[0.2em] text-paper/35">{step.state}</span>
      </div>

      <h3
        className="display d3 mt-6 uppercase transition-colors duration-700"
        style={{ color: isActive ? "var(--color-paper)" : "rgba(221, 231, 239,0.55)" }}
        data-reveal
      >
        {step.title}
      </h3>
      <p className="mt-5 max-w-[34ch] leading-relaxed text-muted" data-reveal>
        {step.body}
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* The stage: one development that keeps evolving                      */
/* ------------------------------------------------------------------ */

function MethodStage({ active, compact = false }: { active: number; compact?: boolean }) {
  return (
    <div
      className={`relative w-full overflow-hidden border border-[var(--hair)] bg-ink-2 ${compact ? "aspect-[4/3]" : "aspect-square"}`}
      data-active="true"
    >
      {/* 01 blueprint */}
      <Phase visible={active === 0}>
        <BlueprintPlan className="h-full w-full p-6 text-accent-soft sm:p-10" />
      </Phase>

      {/* 02 massing */}
      <Phase visible={active === 1}>
        <Massing3D className="h-full w-full p-6 text-accent-soft sm:p-10" />
      </Phase>

      {/* 03 model inside a digital interface */}
      <Phase visible={active === 2}>
        <div className="flex h-full w-full flex-col p-5 sm:p-8">
          <div className="flex items-center justify-between border-b border-[var(--hair)] pb-3">
            <span className="text-[0.5625rem] font-bold tracking-[0.2em] text-paper/50 sm:text-[0.625rem]">
              IMOVIX / PLATAFORMA
            </span>
            <span className="flex gap-1" aria-hidden="true">
              <span className="h-1 w-1 bg-paper/25" />
              <span className="h-1 w-1 bg-paper/25" />
              <span className="h-1 w-1 bg-accent" />
            </span>
          </div>
          <div className="relative flex-1">
            <Massing3D className="h-full w-full p-2 text-accent-soft" />
            <span
              aria-hidden="true"
              className="pointer-events-none absolute left-0 top-1/2 h-px w-full bg-accent/30"
            />
          </div>
          <div className="flex items-center gap-2 border-t border-[var(--hair)] pt-3" aria-hidden="true">
            {["PLANTAS", "UNIDADES", "TOUR"].map((tab, i) => (
              <span
                key={tab}
                className="px-2 py-1 text-[0.5625rem] font-bold tracking-[0.2em] sm:text-[0.625rem]"
                style={{
                  color: i === 0 ? "var(--color-paper)" : "rgba(221, 231, 239,0.35)",
                  borderBottom: i === 0 ? "1px solid var(--color-accent)" : "1px solid transparent",
                }}
              >
                {tab}
              </span>
            ))}
          </div>
        </div>
      </Phase>

      {/* 04 commercial experience */}
      <Phase visible={active === 3}>
        <div className="relative h-full w-full">
          <Massing3D className="h-full w-full p-6 text-accent-soft sm:p-10" lit />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink via-transparent to-transparent"
          />
          <div className="absolute inset-x-5 bottom-5 border border-accent/45 bg-ink/85 p-4 sm:inset-x-8 sm:bottom-8">
            <p className="text-[0.5625rem] font-bold tracking-[0.2em] text-accent-soft sm:text-[0.625rem]">
              OPORTUNIDADE
            </p>
            <p className="display d4 mt-2 text-paper">
              Experiência pronta para vender.
            </p>
            <span aria-hidden="true" className="mt-4 flex items-center gap-3">
              <span className="h-px flex-1 bg-accent" />
              <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 text-accent-soft" fill="none" stroke="currentColor" strokeWidth="1.6">
                <path d="M3 8h10M9 4l4 4-4 4" />
              </svg>
            </span>
          </div>
        </div>
      </Phase>

      {/* stage chrome */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 flex gap-1 p-4 sm:p-6">
        {STEPS.map((s, i) => (
          <span
            key={s.index}
            className="h-px flex-1 transition-colors duration-700"
            style={{ background: i === active ? "var(--color-accent)" : "var(--hair)" }}
          />
        ))}
      </div>
    </div>
  );
}

function Phase({ visible, children }: { visible: boolean; children: React.ReactNode }) {
  return (
    <div
      aria-hidden={!visible}
      data-active={visible}
      className="absolute inset-0 transition-[opacity,filter,transform] duration-[1100ms] ease-[var(--ease-out-expo)]"
      style={{
        opacity: visible ? 1 : 0,
        filter: visible ? "blur(0px)" : "blur(5px)",
        transform: visible ? "none" : "translateY(10px)",
      }}
    >
      {children}
    </div>
  );
}
