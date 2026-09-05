import type { ReactNode } from "react";
import { SheetLabel } from "../ui/sheet-label";
import { useReveal } from "../../hooks/use-reveal";

/**
 * Esteira de parceiros.
 *
 * ⚠️ CONTEÚDO FICTÍCIO — estas empresas não existem. A seção está aqui para
 * fechar o layout enquanto os parceiros reais não chegam. Troque os nomes e
 * as marcas antes de publicar: exibir parceria inexistente em site comercial
 * é afirmação falsa sobre o negócio.
 *
 * PROPORÇÃO — as duas regras que fazem a fileira parecer alinhada:
 *
 * 1. Toda marca é desenhada dentro da mesma CAIXA ÓPTICA: x e y de 5 a 27 num
 *    viewBox de 32. Sem isso uma torre alta e um grid baixo têm a mesma altura
 *    de caixa mas massas visuais diferentes, e a fileira "dança" — foi o que
 *    aconteceu na primeira versão.
 * 2. O símbolo fica em ~1.7x a altura do wordmark. Acima disso o desenho
 *    domina o nome e o conjunto lê como ícone, não como marca.
 *
 * As marcas são SVG inline: herdam a cor do texto (é o que faz a logo inteira
 * clarear no hover), ficam nítidas em qualquer tela e não pesam no bundle.
 *
 * A animação é CSS puro (`imovi-marquee` em styles.css). Nenhum rAF novo,
 * nenhum listener, nenhum setState: o motor de scrub do hero segue dono do
 * único loop de animação do app.
 */

type Partner = {
  name: string;
  mark: ReactNode;
};

const line = { fill: "none", stroke: "currentColor", strokeWidth: 1.5 } as const;
const solid = { fill: "currentColor" } as const;

const PARTNERS: Partner[] = [
  {
    // Três torres, bases alinhadas — verticalidade de incorporadora.
    name: "Vertta",
    mark: (
      <>
        <rect x="6" y="13" width="5" height="14" {...solid} />
        <rect x="13.5" y="5" width="5" height="22" {...solid} />
        <rect x="21.75" y="17.75" width="4.5" height="8.5" {...line} />
      </>
    ),
  },
  {
    // Sol sólido nascendo sobre o horizonte.
    name: "Solaris",
    mark: (
      <>
        <path d="M5 27h22" {...line} strokeLinecap="round" />
        <path d="M9 27a7 7 0 0 1 14 0z" {...solid} />
        <path d="M16 5v4M7.8 9.3l2.6 2.6M24.2 9.3l-2.6 2.6" {...line} strokeLinecap="round" />
      </>
    ),
  },
  {
    // Losango vazado com núcleo cheio.
    name: "Noval",
    mark: (
      <>
        <path d="M16 5l11 11-11 11L5 16z" {...line} strokeLinejoin="round" />
        <path d="M16 11l5 5-5 5-5-5z" {...solid} />
      </>
    ),
  },
  {
    // Telhado sobre bloco, com vão de porta.
    name: "Habitat Prime",
    mark: (
      <>
        <path d="M5 16.5L16 6l11 10.5" {...line} strokeLinejoin="round" />
        <path d="M9 17h14v10H9z" {...solid} />
        <rect x="14" y="21" width="4" height="6" fill="var(--color-ink)" />
      </>
    ),
  },
  {
    // Três ondas — orla, litoral.
    name: "Orla",
    mark: (
      <>
        <path d="M5 11c3.7-3 6.9-3 10.5 0s6.8 3 10.5 0" {...line} strokeLinecap="round" />
        <path d="M5 17c3.7-3 6.9-3 10.5 0s6.8 3 10.5 0" {...line} strokeLinecap="round" />
        <path d="M5 23c3.7-3 6.9-3 10.5 0s6.8 3 10.5 0" {...line} strokeLinecap="round" />
      </>
    ),
  },
  {
    // Grid 2x2 com um quadrante cheio — malha urbana.
    name: "Terrano",
    mark: (
      <>
        <rect x="5" y="5" width="10" height="10" {...solid} />
        <rect x="17.75" y="5.75" width="8.5" height="8.5" {...line} />
        <rect x="5.75" y="17.75" width="8.5" height="8.5" {...line} />
        <rect x="17.75" y="17.75" width="8.5" height="8.5" {...line} />
      </>
    ),
  },
  {
    // Arco sobre vão sólido — átrio.
    name: "Átrio",
    mark: (
      <>
        <path d="M5 27V16a11 11 0 0 1 22 0v11" {...line} />
        <path d="M11.5 27v-11a4.5 4.5 0 0 1 9 0v11z" {...solid} />
      </>
    ),
  },
  {
    // Núcleo cheio irradiando — luz.
    name: "Lumina",
    mark: (
      <>
        <circle cx="16" cy="16" r="3.5" {...solid} />
        <circle cx="16" cy="16" r="7" {...line} />
        <circle cx="16" cy="16" r="11" {...line} strokeDasharray="2 4.5" />
      </>
    ),
  },
];

/**
 * Três voltas, não duas: uma volta mede pouco mais que a faixa visível, então
 * com duas cópias sobrava uma fresta no instante do loop. Com três, o trecho
 * que cobre a tela depois do deslocamento é sempre o dobro da lista.
 */
const LOOPS = [0, 1, 2] as const;

function Logo({ name, mark, hidden }: Partner & { hidden?: boolean }) {
  return (
    <li
      aria-hidden={hidden || undefined}
      className="flex shrink-0 items-center gap-3 px-9 text-paper/40 transition-colors duration-500 hover:text-paper/90"
    >
      <svg viewBox="0 0 32 32" className="h-8 w-8 shrink-0" aria-hidden="true">
        {mark}
      </svg>
      <span className="label-lg whitespace-nowrap text-current">{name}</span>
    </li>
  );
}

export function Partners() {
  const ref = useReveal<HTMLDivElement>(110);

  return (
    <section
      id="parceiros"
      aria-label="Empresas parceiras"
      className="relative border-b border-[var(--hair)] bg-ink-2"
    >
      <div ref={ref} className="reveal mx-auto max-w-[1400px] px-6 pt-0 pb-16 sm:px-10 sm:pb-20 lg:px-16">
        <SheetLabel code="A-02">Parceiros</SheetLabel>

        <div className="marquee-mask mt-3 overflow-hidden" data-reveal>
          <ul className="marquee-track flex w-max items-center">
            {LOOPS.map((loop) =>
              PARTNERS.map((partner) => (
                <Logo key={`${partner.name}-${loop}`} {...partner} hidden={loop > 0} />
              )),
            )}
          </ul>
        </div>
      </div>
    </section>
  );
}
