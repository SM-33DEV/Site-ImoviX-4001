import { useCallback, useRef } from "react";
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
      className="studio-results"
    >

      <div
        ref={headRef}
        className="studio-wrap reveal"
      >
        <p className="studio-eyebrow">Experiências que se tornam resultados</p>

        <div className="studio-results-grid">
          <div data-reveal>
            <p className="studio-total">
              <span className="studio-currency">R$</span>
              <span ref={valueRef} className="tabular-nums" aria-hidden="true">
                0
              </span>
              <span className="sr-only">{brl.format(TOTAL)}</span>
            </p>
          </div>

          <div className="studio-results-copy" data-reveal><h2>Visão que gera valor.</h2><p>Total captado por nossos clientes em vendas imobiliárias com os produtos IMOVIX.</p><span>Captação acumulada</span></div>
        </div>

        {/* Trilho que preenche junto com a contagem. */}
        <div className="studio-result-rail" data-reveal>
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
