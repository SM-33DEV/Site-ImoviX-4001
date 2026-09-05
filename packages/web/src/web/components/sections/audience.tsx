import { useReveal } from "../../hooks/use-reveal";
import { SheetLabel } from "../ui/sheet-label";

const SCENES = [
  {
    index: "01",
    title: "Construtoras",
    lines: ["Apresente empreendimentos", "com mais impacto."],
    image: "/scenes/construtoras.jpg",
    alt: "Grande empreendimento residencial em construção ao entardecer",
  },
  {
    index: "02",
    title: "Incorporadoras",
    lines: ["Valorize projetos e", "potencialize lançamentos."],
    image: "/scenes/incorporadoras.jpg",
    alt: "Lançamento imobiliário premium iluminado no fim de tarde",
  },
  {
    index: "03",
    title: "Imobiliárias",
    lines: ["Crie experiências que", "ajudam seus clientes a decidir."],
    image: "/scenes/imobiliarias.jpg",
    alt: "Consultor apresentando um imóvel por uma experiência digital",
  },
  {
    index: "04",
    title: "Investidores e\nempreendedores",
    lines: ["Apresente oportunidades", "com clareza e percepção de valor."],
    image: "/scenes/investidores.jpg",
    alt: "Maquete de empreendimento com dados projetados em luz azul",
  },
] as const;

export function Audience() {
  const headRef = useReveal<HTMLDivElement>(110);

  return (
    <section id="publicos" className="relative overflow-hidden bg-ink-2 py-24 sm:py-32 lg:py-40">
      <div ref={headRef} className="reveal mx-auto max-w-[1400px] px-6 sm:px-10 lg:px-16">
        <SheetLabel code="A-05">Para quem</SheetLabel>
        <h2 className="display d2 mt-7 uppercase text-paper" data-reveal>
          Feito para quem
          <br />
          <span className="text-accent-soft">constrói o futuro.</span>
        </h2>
      </div>

      <div className="mx-auto mt-16 max-w-[1400px] px-6 sm:mt-24 sm:px-10 lg:px-16">
        {SCENES.map((scene, i) => (
          <Scene key={scene.index} scene={scene} flip={i % 2 === 1} />
        ))}
      </div>
    </section>
  );
}

function Scene({ scene, flip }: { scene: (typeof SCENES)[number]; flip: boolean }) {
  const ref = useReveal<HTMLDivElement>(140);

  return (
    <article
      ref={ref}
      className="reveal group relative grid gap-8 border-t border-[var(--hair)] py-12 sm:py-16 lg:grid-cols-12 lg:items-center lg:gap-10 lg:py-20"
    >
      {/* image */}
      <div
        className={`relative lg:col-span-8 ${flip ? "lg:order-2 lg:col-start-5" : "lg:order-1"}`}
        data-reveal
      >
        <div className="reveal-img relative aspect-[4/3] w-full overflow-hidden bg-ink">
          <img
            src={scene.image}
            alt={scene.alt}
            loading="lazy"
            decoding="async"
            width={1024}
            height={768}
            className="h-full w-full object-cover opacity-80 transition-[transform,opacity] duration-[1600ms] ease-[var(--ease-out-expo)] group-hover:scale-[1.035] group-hover:opacity-100"
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/10 to-transparent"
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-ink/25 transition-opacity duration-1000 group-hover:opacity-0"
          />
          {/* blue line that appears on hover */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute bottom-0 left-0 h-px w-0 bg-accent transition-[width] duration-[1400ms] ease-[var(--ease-out-expo)] group-hover:w-full"
          />
        </div>
      </div>

      {/* typography */}
      <div
        className={`lg:col-span-4 ${flip ? "lg:order-1 lg:col-start-1 lg:pr-6" : "lg:order-2 lg:pl-6"}`}
        data-reveal
      >
        <span className="text-[0.6875rem] font-bold tracking-[0.22em] text-accent">{scene.index}</span>
        <h3 className="display d3 mt-5 whitespace-pre-line uppercase text-paper transition-transform duration-1000 ease-[var(--ease-out-expo)] group-hover:translate-x-1.5">
          {scene.title}
        </h3>
        <span
          aria-hidden="true"
          className="mt-6 block h-px w-10 bg-accent transition-[width] duration-1000 ease-[var(--ease-out-expo)] group-hover:w-24"
        />
        <p className="hover-reveal mt-6 max-w-[28ch] leading-relaxed text-muted">
          {scene.lines.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </p>
      </div>
    </article>
  );
}
