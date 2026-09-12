// ---------------------------------------------------------------------------
// MANIFESTO DE MÍDIA — o único lugar para registrar peças do portfólio.
//
// COMO ADICIONAR UMA PEÇA
//
//   1. Coloque o arquivo em `packages/web/public/media/`.
//      (Regra do projeto: todo asset estático vive em public/ e é
//      referenciado por caminho absoluto. O lint reprova arquivo de mídia
//      dentro de src/.)
//
//   2. Preencha o encaixe correspondente aqui embaixo, trocando `null`
//      pelo objeto da peça.
//
//   3. Pronto. A seção passa a exibir a peça sozinha — nenhum componente
//      precisa ser alterado.
//
// Enquanto o encaixe for `null`, o site desenha uma PRANCHA EM BRANCO no
// lugar: moldura, hachura e o código do encaixe. É proposital — num jogo de
// desenho, a folha ainda não desenhada é uma folha legítima, não um erro.
// Assim o site nunca fica quebrado enquanto o material não chega.
//
// VÍDEO: nada é baixado até o visitante clicar. O hero já custa 14 MB; se
// cada seção carregasse vídeo sozinha, a página ficaria impraticável no
// celular. Por isso todo vídeo exige um `poster` — é ele que aparece até o
// play, e é ele que o visitante vê se decidir não clicar.
// ---------------------------------------------------------------------------

import type { TourId } from "./tour";

/** O que o encaixe está exibindo. */
export type TipoDePeca = "video" | "imagem" | "tour";

/** O que toda peça tem, seja ela arquivo ou percurso. */
type PecaBase = {
  /** Texto alternativo. Descreva o que se vê, não o formato do arquivo. */
  alt: string;
  /** Legenda curta sob a peça. Opcional. */
  legenda?: string;
  /** Empreendimento a que a peça pertence, se fizer sentido nomear. */
  empreendimento?: string;
};

/** Peça que é um ARQUIVO: vídeo, imagem, ou walkthrough gravado. */
type PecaArquivo = PecaBase & {
  tipo: TipoDePeca;
  /** Caminho absoluto a partir de public/ — ex.: "/media/aurora-tour.mp4". */
  src: string;
  /**
   * Imagem de capa. OBRIGATÓRIA em vídeo e tour: é o que carrega de imediato,
   * enquanto o arquivo pesado só desce se o visitante pedir.
   */
  poster?: string;
};

/**
 * Peça que é um PERCURSO navegável, descrito em `config/tour.ts`.
 *
 * Não tem `src` — e essa ausência é o ponto. As duas coisas se chamam "tour"
 * no mercado: o walkthrough gravado, que é um arquivo de vídeo, e o percurso
 * clicável, que é um grafo de ambientes. Um campo `src` opcional deixaria os
 * dois representáveis pelo mesmo objeto, e um tour navegável apontando para
 * um .mp4 fantasma compilaria sem reclamar. Separados, não compilam.
 */
type PecaTour = PecaBase & {
  tipo: "tour";
  /** Qual percurso de `config/tour.ts` este encaixe exibe. */
  tour: TourId;
};

export type Peca = PecaArquivo | PecaTour;

/** Distingue as duas leituras de "tour" sem depender de campo opcional. */
export function ehTourNavegavel(p: Peca): p is PecaTour {
  return p.tipo === "tour" && "tour" in p;
}

/**
 * Os encaixes, nomeados pelo código da prancha em que aparecem — o mesmo que
 * o selo do canto exibe. `A-03.02` é a segunda peça da folha A-03 (Soluções).
 *
 * A chave descreve ONDE a peça entra; o objeto descreve O QUE ela é. Trocar
 * uma peça de lugar é trocar de chave, e nada mais.
 */
export type Encaixe =
  | "A-03.01" // Soluções · Vídeos 3D
  | "A-03.02" // Soluções · Sites 3D imersivos
  | "A-03.03" // Soluções · Plantas e visualização 3D
  | "A-03.04" // Soluções · Sistemas e experiências digitais
  | "A-06.01" // Método · Estratégia
  | "A-06.02" // Método · Visualização
  | "A-06.03" // Método · Tecnologia
  | "A-06.04" // Método · Conversão
  | "A-07.01" // Projetos · prancha 01
  | "A-07.02" // Projetos · prancha 02
  | "A-07.03" // Projetos · prancha 03
  | "A-07.04"; // Projetos · prancha 04

/**
 * Registro das peças. `null` = prancha em branco.
 *
 * EXEMPLO — assim fica um encaixe preenchido:
 *
 *   "A-03.01": {
 *     tipo: "video",
 *     src: "/media/aurora-filme.mp4",
 *     poster: "/media/aurora-filme-capa.jpg",
 *     alt: "Filme de lançamento do Residencial Aurora, tomada aérea ao entardecer",
 *     legenda: "Filme de lançamento · 90s",
 *     empreendimento: "Residencial Aurora",
 *   },
 */
export const PECAS: Record<Encaixe, Peca | null> = {
  "A-03.01": null,
  // O único encaixe que não espera arquivo: o percurso já existe em
  // `config/tour.ts` e navega desde agora, com os ambientes em prancha branca.
  // Cada render que chegar preenche um `null` de lá, e este encaixe melhora
  // sozinho — sem nunca ter passado por um estado quebrado.
  "A-03.02": {
    tipo: "tour",
    tour: "aurora",
    alt: "Tour navegável pelo apartamento tipo e pela área de lazer do Residencial Aurora",
    legenda: "Tour navegável · 8 ambientes",
    empreendimento: "Residencial Aurora",
  },
  "A-03.03": null,
  "A-03.04": null,
  "A-06.01": null,
  "A-06.02": null,
  "A-06.03": null,
  "A-06.04": null,
  "A-07.01": null,
  "A-07.02": null,
  "A-07.03": null,
  "A-07.04": null,
};

/** A peça de um encaixe, ou null enquanto a prancha estiver em branco. */
export function peca(encaixe: Encaixe): Peca | null {
  return PECAS[encaixe];
}

/** Quantos encaixes já têm material — útil para saber o quanto falta. */
export function pecasPreenchidas(): number {
  return Object.values(PECAS).filter(Boolean).length;
}
