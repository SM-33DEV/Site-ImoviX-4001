import { useReveal } from "../../hooks/use-reveal";
import { SheetLabel } from "../ui/sheet-label";

export function About() {
  const ref = useReveal<HTMLDivElement>(110);

  return (
    <section id="sobre" className="relative bg-ink py-28 sm:py-36 lg:py-48">
      <div ref={ref} className="reveal mx-auto max-w-[1400px] px-6 sm:px-10 lg:px-16">
        <div className="grid gap-16 lg:grid-cols-[1fr_1fr] lg:gap-24">
          <div>
            <SheetLabel code="A-08">Sobre a IMOVIX</SheetLabel>
            <h2
              className="display d2 mt-7 max-w-[12ch] text-paper"
              data-reveal
            >
              Não somos apenas marketing.
            </h2>
          </div>

          <div className="lg:pt-14">
            <p
              className="display d4 font-semibold leading-snug text-paper"
              data-reveal
            >
              Somos tecnologia aplicada ao mercado imobiliário.
            </p>
            <div className="mt-10 h-px w-16 bg-accent" data-reveal aria-hidden="true" />
            <p className="mt-10 max-w-[46ch] leading-relaxed text-muted" data-reveal>
              A IMOVIX nasceu para aproximar arquitetura, tecnologia e comercialização.
            </p>
            <p className="mt-6 max-w-[46ch] leading-relaxed text-muted" data-reveal>
              Criamos experiências digitais que ajudam pessoas a visualizar, compreender e desejar
              aquilo que ainda está sendo construído.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
