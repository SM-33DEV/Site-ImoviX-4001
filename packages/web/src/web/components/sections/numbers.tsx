import { useCallback, useRef } from "react";
import { SheetLabel } from "../ui/sheet-label";
import { useReveal } from "../../hooks/use-reveal";
import { useCountUp } from "../../hooks/use-count-up";

const TOTAL = 7_200_000;

const brl = new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 0 });

export function Numbers() {
  const headRef = useReveal<HTMLDivElement>(110);
  const railRef = useRef<HTMLSpanElement | null>(null);

  // O contador empurra o preenchimento do trilho — sem segundo loop de animação.
  const onProgress = useCallback((progress: number) => {
    const rail = railRef.current;
    if (rail) rail.style.transform = `scaleX(${progress})`;
  }, []);

  const valueRef = useCountUp<HTMLSpanElement>({
    to: TOTAL,
    duration: 2100,
    delay: 120,
    format: (v) => brl.format(Math.round(v)),
    onProgress,
  });

  return (
    <section
      id="numeros"
      aria-label="IMOVIX em números"
      className="relative border-y border-[var(--hair)] bg-ink-2"
    >
      {/* Halo azul discreto atrás do número, dentro da paleta. */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(78% 120% at 22% 0%, rgba(23,98,255,0.16) 0%, rgba(5,9,20,0) 62%)",
        }}
      />

      <div
        ref={headRef}
        className="reveal relative mx-auto max-w-[1400px] px-6 py-16 sm:px-10 sm:py-20 lg:px-16 lg:py-24"
      >
        <SheetLabel code="A-01">IMOVIX em números</SheetLabel>

        <div className="mt-9 grid gap-x-16 gap-y-10 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
          <div data-reveal>
            <p className="display d1 flex flex-wrap items-baseline gap-x-3 text-paper">
              <span className="text-accent-soft">R$</span>
              <span ref={valueRef} className="tabular-nums" aria-hidden="true">
                0
              </span>
              <span className="sr-only">{brl.format(TOTAL)}</span>
            </p>
            <p className="lead mt-5 max-w-[34ch] text-muted">
              Total captado por nossos clientes em vendas imobiliárias com os produtos IMOVIX.
            </p>
          </div>

          <p
            className="label-xs max-w-[30ch] leading-[1.9] text-paper/45 lg:text-right"
            data-reveal
          >
            Captação acumulada · projetos entregues pela IMOVIX
          </p>
        </div>

        {/* Trilho que preenche junto com a contagem. */}
        <div className="mt-12 h-px w-full overflow-hidden bg-[var(--hair)]" data-reveal>
          <span
            ref={railRef}
            className="block h-px w-full origin-left bg-accent"
            style={{ transform: "scaleX(0)" }}
          />
        </div>
      </div>
    </section>
  );
}
