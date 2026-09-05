import { useReveal } from "../../hooks/use-reveal";
import { SheetLabel } from "../ui/sheet-label";
import { MagneticCta } from "../ui/magnetic-cta";
import { EMAIL, whatsappUrl } from "../../config/site";

export function Cta() {
  const ref = useReveal<HTMLDivElement>(110);

  return (
    <section
      id="contato"
      className="relative overflow-hidden bg-ink-2 py-32 sm:py-40 lg:py-52"
    >
      <div
        className="pointer-events-none absolute left-1/2 top-0 h-px w-[min(90%,1400px)] -translate-x-1/2 bg-[var(--hair)]"
        aria-hidden="true"
      />
      <div ref={ref} className="reveal mx-auto max-w-[1400px] px-6 sm:px-10 lg:px-16">
        <SheetLabel code="A-09">Contato</SheetLabel>
        <h2
          className="display d1 mt-8 max-w-[18ch] text-paper"
          data-reveal
        >
          Seu próximo empreendimento pode ser vivido antes de existir.
        </h2>

        <p className="lead mt-9 max-w-[46ch] text-muted" data-reveal>
          Vamos transformar seu projeto em uma experiência digital.
        </p>

        <div className="mt-14 flex flex-col gap-4 sm:flex-row sm:items-center" data-reveal>
          <MagneticCta href={whatsappUrl()} external>
            Falar com um especialista
          </MagneticCta>
          <MagneticCta href="#sobre" variant="ghost">
            Conhecer a IMOVIX
          </MagneticCta>
        </div>

        <a
          href={`mailto:${EMAIL}`}
          className="mt-14 inline-block text-[0.6875rem] font-bold uppercase tracking-[0.2em] text-muted transition-colors duration-500 hover:text-accent-soft"
          data-reveal
        >
          {EMAIL}
        </a>
      </div>
    </section>
  );
}
