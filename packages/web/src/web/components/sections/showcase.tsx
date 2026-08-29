import { useReveal } from "../../hooks/use-reveal";

const PROJECTS = [
  {
    index: "01",
    image: "/projects/projeto-01.jpg",
    title: "Portaria\nCinematográfica",
    kind: "Experiência digital 3D",
  },
  {
    index: "02",
    image: "/projects/projeto-02.jpg",
    title: "Residencial\nPremium",
    kind: "Visualização arquitetônica",
  },
  {
    index: "03",
    image: "/projects/projeto-03.jpg",
    title: "Área\nde Lazer",
    kind: "Tour imersivo",
  },
  {
    index: "04",
    image: "/projects/projeto-04.jpg",
    title: "Alameda\nResidencial",
    kind: "Filme 3D de lançamento",
  },
] as const;

export function Showcase() {
  const ref = useReveal<HTMLDivElement>(90);

  return (
    <section id="projetos" className="relative bg-ink-2 py-28 sm:py-36 lg:py-44">
      <div ref={ref} className="reveal">
        <div className="mx-auto max-w-[1400px] px-6 sm:px-10 lg:px-16">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="label" data-reveal>
                Projetos
              </p>
              <h2
                className="display d2 mt-7 max-w-[15ch] text-paper"
                data-reveal
              >
                Empreendimentos vividos antes de existir.
              </h2>
            </div>
            <p
              className="hidden max-w-[26ch] text-[0.6875rem] font-bold uppercase tracking-[0.2em] text-muted lg:block"
              data-reveal
            >
              Arraste para o lado →
            </p>
          </div>
        </div>

        <div
          className="no-scrollbar mt-16 flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth px-6 pb-6 sm:mt-20 sm:gap-8 sm:px-10 lg:px-16"
          data-reveal
        >
          {PROJECTS.map((project) => (
            <article
              key={project.index}
              className="group relative w-[82vw] shrink-0 snap-start sm:w-[62vw] lg:w-[46vw] xl:w-[38vw]"
            >
              <div
                className="reveal-img relative aspect-[4/5] overflow-hidden rounded-sm bg-surface sm:aspect-[3/4]"
                data-reveal
              >
                <img
                  src={project.image}
                  alt={`${project.title.replace("\n", " ")} — projeto IMOVIX`}
                  loading="lazy"
                  decoding="async"
                  width={1600}
                  height={2000}
                  className="h-full w-full object-cover opacity-90 transition-[opacity,transform] duration-[1200ms] ease-[var(--ease-out-expo)] group-hover:scale-[1.03] group-hover:opacity-100"
                />
                <div
                  className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#050914]/85 via-transparent to-transparent"
                  aria-hidden="true"
                />
                <span className="absolute left-6 top-6 text-[0.6875rem] font-bold tracking-[0.22em] text-paper/70">
                  PROJETO {project.index}
                </span>
                <div className="absolute inset-x-6 bottom-6">
                  <h3 className="display d3 whitespace-pre-line uppercase text-paper">
                    {project.title}
                  </h3>
                  <p className="mt-4 text-[0.625rem] font-bold uppercase tracking-[0.22em] text-accent-soft">
                    {project.kind}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
