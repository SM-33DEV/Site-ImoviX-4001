import { useEffect, useState } from "react";

/**
 * Moldura de prancha — o enquadramento que faz a página ler como documento
 * técnico, e não como landing page recolorida.
 *
 * Duas peças fixas na viewport:
 *
 * 1. A MARGEM. Um fio a 14px da borda, com as marcas de dobra que toda prancha
 *    impressa tem. Decorativa: `aria-hidden`, `pointer-events: none`.
 *
 * 2. O SELO. O bloco de título do canto inferior esquerdo. O campo PRANCHA não
 *    é enfeite — ele informa em que folha do jogo o leitor está, como o carimbo
 *    de uma prancha informa qual folha você tem na mão.
 *
 * Fica à ESQUERDA porque o FAB de WhatsApp e o RunableBadge disputam o canto
 * direito. z-30: abaixo do nav (50) e do overlay mobile (60).
 *
 * NOTA DE IMPLEMENTAÇÃO — a primeira versão escrevia direto no DOM via refs,
 * para evitar re-render. Não funcionava: o observer entregava uma vez e parava.
 * Esta usa `useState`, no mesmo formato do `useSteppedFocus` que já roda na
 * seção Método. O custo é um re-render por folha que entra em tela — seis no
 * documento inteiro. A regra da casa proíbe `setState` no scroll do hero, que
 * roda a 60fps; seis re-renders na leitura toda não são a mesma coisa.
 */

const SHEETS = [
  { id: "numeros", code: "A-01" },
  { id: "parceiros", code: "A-02" },
  { id: "solucoes", code: "A-03" },
  { id: "editorial", code: "A-04" },
  { id: "publicos", code: "A-05" },
  { id: "metodo", code: "A-06" },
  { id: "projetos", code: "A-07" },
  { id: "sobre", code: "A-08" },
  { id: "contato", code: "A-09" },
] as const;

export function SheetChrome() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;

    const nodes = SHEETS.map((s) => document.getElementById(s.id)).filter(
      (n): n is HTMLElement => Boolean(n),
    );
    if (nodes.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const i = SHEETS.findIndex((s) => s.id === entry.target.id);
          if (i >= 0) setActive(i);
        }
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 },
    );

    for (const node of nodes) observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const sheet = SHEETS[active];

  return (
    <>
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-[14px] z-30 border border-[var(--hair)]"
      >
        <span className="absolute -left-px top-9 h-px w-3 bg-[var(--hair-strong)]" />
        <span className="absolute -right-px bottom-9 h-px w-3 bg-[var(--hair-strong)]" />
      </div>

      <div
        aria-hidden="true"
        className="fixed bottom-[15px] left-[15px] z-30 hidden border border-b-0 border-l-0 border-[var(--hair)] bg-ink-2/92 backdrop-blur-[2px] sm:flex"
      >
        <Cell k="Projeto" v="IMOVIX" />
        <Cell k="Prancha" v={sheet.code} />
        <Cell k="Escala" v="1:1" />
        <Cell k="Folha" v={`${String(active + 1).padStart(2, "0")}/09`} last />
      </div>
    </>
  );
}

function Cell({ k, v, last }: { k: string; v: string; last?: boolean }) {
  return (
    <div
      className={`flex flex-col gap-0.5 px-3 py-1.5 ${last ? "" : "border-r border-[var(--hair)]"}`}
    >
      <span className="label-xs text-muted">{k}</span>
      <span className="label text-paper tabular-nums">{v}</span>
    </div>
  );
}
