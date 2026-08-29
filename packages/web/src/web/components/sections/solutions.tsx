import { useReveal } from "../../hooks/use-reveal";
import { useStage } from "../../hooks/use-stage";
import { DeviceStack, FilmFrame, SystemGraph } from "../visuals/interfaces";
import { PlanMorph } from "../visuals/plan-morph";

const SOLUTIONS = [
  {
    index: "01",
    title: "Vídeos 3D",
    body: "Vídeos cinematográficos que apresentam empreendimentos antes mesmo de existirem.",
    meta: "CINEMA / 3D",
  },
  {
    index: "02",
    title: "Sites 3D imersivos",
    body: "Experiências digitais que permitem explorar o empreendimento e transformar interesse em oportunidade.",
    meta: "WEB / IMERSIVO",
  },
  {
    index: "03",
    title: "Plantas e visualização 3D",
    body: "Apresente imóveis, ambientes e plantas de forma interativa e intuitiva.",
    meta: "2D → 3D",
  },
  {
    index: "04",
    title: "Sistemas e experiências digitais",
    body: "Tecnologia integrada para apoiar apresentação, captação e comercialização imobiliária.",
    meta: "PLATAFORMA",
  },
] as const;

export function Solutions() {
  const revealRef = useReveal<HTMLDivElement>(70);
  const { ref: stageRef, active, select } = useStage(SOLUTIONS.length);
  const current = SOLUTIONS[active] ?? SOLUTIONS[0];

  return (
    <section id="solucoes" className="relative overflow-x-clip bg-ink py-24 sm:py-32 lg:py-40">
      {/* electric horizon */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px"
        style={{ background: "linear-gradient(90deg, transparent, rgba(23,98,255,0.55), transparent)" }}
      />

      <div ref={revealRef} className="reveal mx-auto max-w-[1400px] px-6 sm:px-10 lg:px-16">
        <p className="label" data-reveal>
          Soluções IMOVIX
        </p>
        <h2
          className="display d2 mt-7 uppercase text-paper"
          data-reveal
        >
          Tecnologia para
          <br />
          transformar visão
          <br />
          <span className="text-accent-soft">em negócio.</span>
        </h2>
      </div>

      <div
        ref={stageRef}
        className="mx-auto mt-16 grid max-w-[1400px] gap-10 px-6 sm:mt-20 sm:px-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:items-start lg:gap-16 lg:px-16"
      >
        {/* ---------------- stage ---------------- */}
        <div className="order-1 lg:order-2 lg:sticky lg:top-28">
          <div className="relative aspect-[4/3] w-full overflow-hidden border border-[var(--hair)] bg-ink-2">
            {/* layer 01 — cinematic frame */}
            <Layer active={active === 0}>
              <FilmFrame
                src="/projects/projeto-01.jpg"
                alt="Frame cinematográfico de um empreendimento em 3D"
                timecode="00:00:04:12"
                live={active === 0}
                hud={false}
                className="h-full w-full"
              />
            </Layer>

            {/* layer 02 — immersive site */}
            <Layer active={active === 1}>
              <div className="flex h-full w-full items-center justify-center p-4 text-accent-soft sm:p-8">
                <DeviceStack className="h-full w-full" />
              </div>
            </Layer>

            {/* layer 03 — 2D → 3D → real */}
            <Layer active={active === 2}>
              <PlanMorph active={active === 2} />
            </Layer>

            {/* layer 04 — digital system */}
            <Layer active={active === 3}>
              <div className="flex h-full w-full items-center justify-center p-4 text-paper sm:p-8">
                <SystemGraph className="h-full w-full" />
              </div>
            </Layer>

            {/* stage chrome */}
            <div className="pointer-events-none absolute inset-x-0 top-0 flex items-center justify-between px-4 py-3 text-[0.5625rem] font-bold tracking-[0.2em] text-paper/45 sm:px-6">
              <span>CAMADA {current.index}</span>
              <span>{current.meta}</span>
            </div>
            <div className="pointer-events-none absolute inset-x-0 bottom-0 flex gap-1 px-4 pb-4 sm:px-6">
              {SOLUTIONS.map((s, i) => (
                <span
                  key={s.index}
                  className="h-px flex-1 transition-colors duration-700"
                  style={{ background: i === active ? "var(--color-accent)" : "var(--hair)" }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* ---------------- layer list ---------------- */}
        <ul className="order-2 lg:order-1">
          {SOLUTIONS.map((solution, i) => {
            const isActive = i === active;
            return (
              <li key={solution.index} className="border-t border-[var(--hair)] last:border-b">
                <button
                  type="button"
                  onMouseEnter={() => select(i)}
                  onFocus={() => select(i)}
                  onClick={() => select(i)}
                  aria-pressed={isActive}
                  className="group relative block w-full cursor-pointer py-7 text-left sm:py-8"
                >
                  <span
                    aria-hidden="true"
                    className="absolute left-0 top-0 h-px bg-accent transition-[width] duration-1000 ease-[var(--ease-out-expo)]"
                    style={{ width: isActive ? "100%" : "0%" }}
                  />
                  <span className="flex items-baseline gap-5 sm:gap-7">
                    <span
                      className="text-[0.6875rem] font-bold tracking-[0.22em] transition-colors duration-500"
                      style={{ color: isActive ? "var(--color-accent-soft)" : "var(--color-muted)" }}
                    >
                      {solution.index}
                    </span>
                    <span
                      className="display d3 block transition-[color,transform] duration-700 ease-[var(--ease-out-expo)]"
                      style={{
                        color: isActive ? "var(--color-paper)" : "rgba(242,244,247,0.42)",
                        transform: isActive ? "translateX(6px)" : "none",
                      }}
                    >
                      {solution.title}
                    </span>
                  </span>
                  <span
                    className="grid transition-[grid-template-rows,opacity] duration-700 ease-[var(--ease-out-expo)]"
                    style={{
                      gridTemplateRows: isActive ? "1fr" : "0fr",
                      opacity: isActive ? 1 : 0,
                    }}
                  >
                    <span className="overflow-hidden">
                      <span className="block max-w-[46ch] pt-4 pl-10 leading-relaxed text-muted sm:pl-[3.4rem]">
                        {solution.body}
                      </span>
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

function Layer({ active, children }: { active: boolean; children: React.ReactNode }) {
  return (
    <div
      data-active={active}
      aria-hidden={!active}
      className="absolute inset-0 transition-[opacity,transform,filter] duration-[1100ms] ease-[var(--ease-out-expo)]"
      style={{
        opacity: active ? 1 : 0,
        transform: active ? "none" : "translateY(14px)",
        filter: active ? "blur(0px)" : "blur(6px)",
        pointerEvents: active ? "auto" : "none",
      }}
    >
      {children}
    </div>
  );
}
