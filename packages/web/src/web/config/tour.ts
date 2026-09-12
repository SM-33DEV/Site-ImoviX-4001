// ---------------------------------------------------------------------------
// MANIFESTO DE TOUR — o único lugar para descrever um passeio navegável.
//
// Irmão de `config/media.ts`, e pela mesma razão: quem registra material não
// deveria precisar abrir componente nenhum. Lá se registra UMA peça por
// encaixe; aqui se descreve um percurso — ambientes, as passagens entre eles
// e onde cada um cai na planta.
//
// O QUE ESTE TOUR É, E O QUE NÃO É
//
// Não é 360° panorâmico. Panorâmica equirretangular exige proporção 2:1 exata,
// continuidade nas bordas e distorção polar correta — coisa que sai de câmera
// 360 ou de render panorâmico, não de imagem avulsa. Emenda errada aparece
// como uma costura no meio da parede, e o visitante percebe.
//
// É um tour por ESTAÇÕES: cada ambiente é um render fixo, e as passagens são
// pontos clicáveis sobre a imagem. É o formato que a maioria dos lançamentos
// usa, funciona com o material que já existe, e não promete um movimento que
// o acervo não sustenta.
//
// A IMAGEM PODE FALTAR. `imagem: null` não quebra nada: o quadro vira prancha
// em branco com o nome do ambiente, e a navegação continua funcionando. Dá
// para montar o percurso inteiro — passagens, planta, ordem de leitura — e
// validar o caminho ANTES de existir um único render. Quando a imagem chega,
// troca-se o `null` pelo caminho e o mesmo tour vira fotorrealista.
//
// CONSISTÊNCIA É O RISCO REAL. Ambientes renderizados sem âncora comum viram
// apartamentos diferentes a cada clique — muda o piso, muda o caixilho, muda
// o pé-direito. Quem produzir as imagens precisa partir da mesma referência.
// Isso é problema de produção, não deste arquivo; mas é aqui que fica visível,
// porque é aqui que os ambientes ficam lado a lado.
// ---------------------------------------------------------------------------

/** Chave de um ambiente dentro de um tour. */
export type AmbienteId = string;

/** Chave de uma planta dentro de um tour. */
export type PlantaId = string;

/**
 * Uma passagem: o ponto clicável que leva deste ambiente a outro.
 *
 * `x` e `y` são porcentagens SOBRE A IMAGEM (0–100, da esquerda e do topo).
 * Porcentagem e não pixel porque o mesmo quadro é lido em 380px no celular e
 * em 1200px no desktop — coordenada absoluta descolaria do batente da porta.
 */
export type Passagem = {
  para: AmbienteId;
  x: number;
  y: number;
  /** Texto do ponto. Sem isso, usa o nome do ambiente de destino. */
  rotulo?: string;
};

export type Ambiente = {
  nome: string;
  /**
   * Render do ambiente, caminho absoluto a partir de public/.
   * `null` = ainda não desenhado: prancha em branco, navegação viva.
   */
  imagem: string | null;
  /** Descreva o que se vê. Sem isso, monta a partir do nome. */
  alt?: string;
  /** Em qual planta este ambiente aparece, e onde nela (0–100). */
  planta: { em: PlantaId; x: number; y: number };
  passagens: Passagem[];
  /** Linha curta sob o quadro — metragem, orientação solar, o que ajudar. */
  legenda?: string;
};

export type Planta = {
  nome: string;
  /**
   * Planta baixa como imagem de fundo do minimapa.
   * `null` = minimapa esquemático: só os pontos e os fios entre eles.
   */
  imagem: string | null;
};

export type Tour = {
  nome: string;
  empreendimento?: string;
  /**
   * Mais de uma planta porque lazer e apartamento quase nunca estão no mesmo
   * pavimento. O minimapa segue o ambiente ativo: você vê a planta do andar
   * em que está, não um mapa geral em que ninguém se acha.
   */
  plantas: Record<PlantaId, Planta>;
  /** Onde o tour começa. */
  entrada: AmbienteId;
  ambientes: Record<AmbienteId, Ambiente>;
};

export type TourId = "aurora";

/**
 * PERCURSO DE EXEMPLO — Residencial Aurora.
 *
 * Todas as imagens em `null`: o tour já navega como wireframe, e é assim que
 * se testa o caminho. Trocar cada `null` pelo render é o passo seguinte.
 *
 * A travessia entre apartamento e lazer sai da VARANDA, não da sala. É de lá
 * que se olha para baixo e se vê a piscina — a passagem acompanha o que a
 * pessoa faria de pé no ambiente.
 */
export const TOURS: Record<TourId, Tour> = {
  aurora: {
    nome: "Apartamento tipo e lazer",
    empreendimento: "Residencial Aurora",
    entrada: "varanda",
    plantas: {
      tipo: { nome: "Pavimento tipo", imagem: null },
      lazer: { nome: "Pavimento lazer", imagem: null },
    },
    ambientes: {
      varanda: {
        nome: "Varanda gourmet",
        imagem: null,
        planta: { em: "tipo", x: 50, y: 86 },
        legenda: "Churrasqueira e vista para o vale",
        passagens: [
          { para: "sala", x: 50, y: 52, rotulo: "Entrar na sala" },
          { para: "piscina", x: 16, y: 74, rotulo: "Ver a área de lazer" },
        ],
      },
      sala: {
        nome: "Sala de estar e jantar",
        imagem: null,
        planta: { em: "tipo", x: 50, y: 64 },
        legenda: "Living integrado, 32 m²",
        passagens: [
          { para: "varanda", x: 78, y: 58, rotulo: "Varanda" },
          { para: "cozinha", x: 20, y: 55 },
          { para: "suite", x: 62, y: 48 },
          { para: "quarto2", x: 42, y: 47 },
        ],
      },
      cozinha: {
        nome: "Cozinha",
        imagem: null,
        planta: { em: "tipo", x: 20, y: 60 },
        passagens: [{ para: "sala", x: 60, y: 58, rotulo: "Voltar à sala" }],
      },
      suite: {
        nome: "Suíte máster",
        imagem: null,
        planta: { em: "tipo", x: 76, y: 36 },
        legenda: "Com closet e banho privativo",
        passagens: [{ para: "sala", x: 24, y: 60, rotulo: "Voltar à sala" }],
      },
      quarto2: {
        nome: "Dormitório 2",
        imagem: null,
        planta: { em: "tipo", x: 26, y: 28 },
        passagens: [{ para: "sala", x: 70, y: 60, rotulo: "Voltar à sala" }],
      },
      piscina: {
        nome: "Piscina",
        imagem: null,
        planta: { em: "lazer", x: 32, y: 44 },
        legenda: "Raia de 25 m e deck molhado",
        passagens: [
          { para: "academia", x: 74, y: 44 },
          { para: "salao", x: 50, y: 70 },
          { para: "varanda", x: 12, y: 30, rotulo: "Voltar ao apartamento" },
        ],
      },
      academia: {
        nome: "Academia",
        imagem: null,
        planta: { em: "lazer", x: 70, y: 30 },
        passagens: [{ para: "piscina", x: 26, y: 58, rotulo: "Voltar à piscina" }],
      },
      salao: {
        nome: "Salão de festas",
        imagem: null,
        planta: { em: "lazer", x: 58, y: 72 },
        passagens: [{ para: "piscina", x: 30, y: 56, rotulo: "Voltar à piscina" }],
      },
    },
  },
};

/** O tour de um id. */
export function tour(id: TourId): Tour {
  return TOURS[id];
}

/** Quantos ambientes já têm render — útil para saber o quanto falta produzir. */
export function ambientesRenderizados(id: TourId): number {
  return Object.values(TOURS[id].ambientes).filter((a) => a.imagem).length;
}
