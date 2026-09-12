import { useEffect, useState } from "react";
import { tour, type Ambiente, type AmbienteId, type PlantaId, type TourId } from "../../config/tour";
import { Cantoneiras, Hachura } from "./prancha";

/**
 * Tour navegável — o visitante anda pelo empreendimento clicando de ambiente
 * em ambiente, com a planta mostrando onde ele está.
 *
 * O percurso inteiro vem de `config/tour.ts`. Este arquivo não sabe o nome de
 * nenhum ambiente: recebe o id do tour e desenha o que estiver registrado.
 *
 * TRÊS DECISÕES QUE VALEM O COMENTÁRIO
 *
 * 1. SEM RENDER, AINDA NAVEGA. Ambiente com `imagem: null` vira prancha em
 *    branco, mas as passagens continuam clicáveis. Dá para validar o caminho —
 *    se a sala leva mesmo aos quartos, se o retorno existe, se ninguém fica
 *    preso num cômodo — antes de encomendar a primeira imagem. Percurso errado
 *    descoberto depois de oito renders prontos custa os oito.
 *
 * 2. NADA BAIXA ANTES DA HORA, MAS O VIZINHO BAIXA. Só a imagem do ambiente
 *    ativo entra pela marcação; ao chegar num ambiente, os DESTINOS dele são
 *    pré-carregados por `new Image()`. É o meio-termo entre baixar o
 *    empreendimento inteiro na abertura — que no celular seria inviável, o
 *    hero já custa 14 MB — e piscar um quadro vazio a cada clique. Quem
 *    percorre paga só o caminho que percorreu.
 *
 * 3. O MINIMAPA SEGUE O PAVIMENTO. Lazer e apartamento quase nunca estão no
 *    mesmo andar; um mapa geral com tudo junto não localiza ninguém. A planta
 *    exibida é sempre a do ambiente ativo, e troca sozinha quando o visitante
 *    muda de pavimento.
 *
 * INVARIÁVEIS DA CASA: nenhum `requestAnimationFrame`, nenhum listener de
 * scroll, nenhum `setState` durante a rolagem. O estado aqui muda por clique,
 * e só. O motor de scrub do hero segue dono do único loop de animação do app.
 */

export function Tour3D({
  tourId,
  proporcao = "16/10",
  className = "",
}: {
  tourId: TourId;
  proporcao?: "16/10" | "4/3" | "3/4" | "1/1";
  className?: string;
}) {
  const t = tour(tourId);
  const [ativoId, setAtivoId] = useState<AmbienteId>(t.entrada);

  const ativo = t.ambientes[ativoId] ?? t.ambientes[t.entrada];

  // Pré-carrega só para onde dá para ir a partir daqui. Ver decisão 2.
  useEffect(() => {
    for (const passagem of ativo.passagens) {
      const destino = t.ambientes[passagem.para];
      if (!destino?.imagem) continue;
      const img = new Image();
      img.src = destino.imagem;
    }
  }, [t, ativo]);

  const planta = t.plantas[ativo.planta.em];
  const alt = ativo.alt ?? `${ativo.nome} — ${t.empreendimento ?? t.nome}`;

  return (
    <figure className={`m-0 ${className}`}>
      <div
        className="relative overflow-hidden border border-[var(--hair-strong)] bg-surface"
        style={{ aspectRatio: proporcao.replace("/", " / ") }}
        data-tour={tourId}
        data-ambiente={ativoId}
      >
        {ativo.imagem ? (
          <img
            key={ativoId}
            src={ativo.imagem}
            alt={alt}
            loading="lazy"
            decoding="async"
            className="tour-fade h-full w-full object-cover"
          />
        ) : (
          <div key={ativoId} className="tour-fade absolute inset-0">
            <Hachura />
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 px-6 text-center">
              <span className="display d3 uppercase text-paper/80">{ativo.nome}</span>
              <span className="label-xs text-muted">Prancha em branco · render a produzir</span>
            </div>
          </div>
        )}

        {/* Sombra na base: sustenta a legibilidade das passagens sobre renders
            claros, sem escurecer o ambiente inteiro. */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent"
        />

        {ativo.passagens.map((passagem) => {
          const destino = t.ambientes[passagem.para];
          if (!destino) return null;
          return (
            <button
              key={passagem.para}
              type="button"
              onClick={() => setAtivoId(passagem.para)}
              aria-label={`Ir para ${destino.nome}`}
              className="group absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-2 border-0 bg-transparent p-0"
              style={{ left: `${passagem.x}%`, top: `${passagem.y}%` }}
            >
              <span className="relative flex h-9 w-9 items-center justify-center rounded-full border border-paper/60 bg-ink/55 transition-colors duration-500 group-hover:border-accent-soft group-hover:bg-accent/70 group-focus-visible:border-accent-soft">
                <span
                  aria-hidden="true"
                  className="tour-pulso absolute inset-0 rounded-full border border-accent-soft/70"
                />
                <svg viewBox="0 0 24 24" className="h-4 w-4 text-paper" fill="currentColor">
                  <path d="M12 2 4 12h5v10h6V12h5z" />
                </svg>
              </span>
              <span className="label-xs whitespace-nowrap bg-ink/80 px-2 py-1 text-paper/90">
                {passagem.rotulo ?? destino.nome}
              </span>
            </button>
          );
        })}

        <Minimapa
          nomePlanta={planta.nome}
          imagem={planta.imagem}
          pontos={pontosDaPlanta(t.ambientes, ativo.planta.em)}
          fios={fiosDaPlanta(t.ambientes, ativo.planta.em)}
          ativoId={ativoId}
        />

        <Cantoneiras />

        <span className="pointer-events-none absolute left-0 top-0 flex gap-2 border-b border-r border-[var(--hair)] bg-ink/80 px-3 py-1.5">
          <span className="label text-accent-soft">Tour 3D</span>
          <span className="label text-muted">{planta.nome}</span>
        </span>
      </div>

      <Indice tourId={tourId} ativoId={ativoId} onIr={setAtivoId} />

      <figcaption className="mt-3 flex flex-wrap gap-x-3 gap-y-1">
        {t.empreendimento ? <span className="label text-paper/70">{t.empreendimento}</span> : null}
        <span className="label text-muted">{ativo.nome}</span>
        {ativo.legenda ? <span className="label text-muted">{ativo.legenda}</span> : null}
      </figcaption>
    </figure>
  );
}

/* -------------------------------------------------------------------------- */

type Ponto = { id: AmbienteId; x: number; y: number };
type Fio = { chave: string; de: Ponto; para: Ponto };

function pontosDaPlanta(
  ambientes: Record<AmbienteId, Ambiente>,
  plantaId: PlantaId,
): Ponto[] {
  return Object.entries(ambientes)
    .filter(([, a]) => a.planta.em === plantaId)
    .map(([id, a]) => ({ id, x: a.planta.x, y: a.planta.y }));
}

/**
 * Os fios entre ambientes do mesmo pavimento — a leitura de "dá para ir daqui
 * até lá". Cada par é desenhado UMA vez: a ida e a volta entre sala e cozinha
 * são a mesma passagem, e duas linhas sobrepostas engrossariam o traço num
 * lugar arbitrário.
 */
function fiosDaPlanta(ambientes: Record<AmbienteId, Ambiente>, plantaId: PlantaId): Fio[] {
  const vistos = new Set<string>();
  const fios: Fio[] = [];

  for (const [id, a] of Object.entries(ambientes)) {
    if (a.planta.em !== plantaId) continue;

    for (const passagem of a.passagens) {
      const outro = ambientes[passagem.para];
      if (!outro || outro.planta.em !== plantaId) continue;

      const chave = [id, passagem.para].sort().join("|");
      if (vistos.has(chave)) continue;
      vistos.add(chave);

      fios.push({
        chave,
        de: { id, x: a.planta.x, y: a.planta.y },
        para: { id: passagem.para, x: outro.planta.x, y: outro.planta.y },
      });
    }
  }

  return fios;
}

/** A caixa do minimapa é 100 × 72 — o `y` do manifesto vem em 0–100. */
const ESCALA_Y = 0.72;

/**
 * Minimapa. Decorativo por decisão: a navegação de verdade está nas passagens
 * sobre a imagem e no índice abaixo do quadro, ambos focáveis por teclado. Um
 * terceiro conjunto de alvos repetiria os mesmos destinos na ordem do Tab sem
 * acrescentar caminho nenhum — por isso `aria-hidden`.
 */
function Minimapa({
  nomePlanta,
  imagem,
  pontos,
  fios,
  ativoId,
}: {
  nomePlanta: string;
  imagem: string | null;
  pontos: Ponto[];
  fios: Fio[];
  ativoId: AmbienteId;
}) {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute bottom-3 right-3 hidden w-40 border border-[var(--hair-strong)] bg-ink/85 backdrop-blur-[2px] sm:block lg:w-52"
    >
      <span className="block border-b border-[var(--hair)] px-2 py-1 label-xs text-muted">
        {nomePlanta}
      </span>
      <div className="relative">
        {imagem ? <img src={imagem} alt="" className="block w-full opacity-40" /> : null}
        <svg
          viewBox="0 0 100 72"
          className={imagem ? "absolute inset-0 h-full w-full" : "block h-full w-full"}
        >
          {imagem ? null : (
            <rect
              x="4"
              y="4"
              width="92"
              height="64"
              fill="none"
              stroke="var(--hair)"
              strokeWidth="0.6"
            />
          )}
          {fios.map((fio) => (
            <line
              key={fio.chave}
              x1={fio.de.x}
              y1={fio.de.y * ESCALA_Y}
              x2={fio.para.x}
              y2={fio.para.y * ESCALA_Y}
              stroke="var(--hair-strong)"
              strokeWidth="0.5"
              strokeDasharray="2 2"
            />
          ))}
          {pontos.map((ponto) => {
            const ativo = ponto.id === ativoId;
            return (
              <circle
                key={ponto.id}
                cx={ponto.x}
                cy={ponto.y * ESCALA_Y}
                r={ativo ? 3.4 : 2}
                fill={ativo ? "var(--color-accent-soft)" : "var(--color-muted)"}
                opacity={ativo ? 1 : 0.55}
              />
            );
          })}
        </svg>
      </div>
    </div>
  );
}

/**
 * Índice de ambientes — o atalho para quem não quer percorrer o caminho todo.
 *
 * Existe por dois motivos ao mesmo tempo. Quem já conhece o apartamento quer
 * ir direto ao quarto que interessa; e um tour em que os ambientes só se
 * alcançam em cadeia esconde metade do material de quem navega por teclado.
 * Aqui todo ambiente está a um Tab de distância, agrupado por pavimento.
 */
function Indice({
  tourId,
  ativoId,
  onIr,
}: {
  tourId: TourId;
  ativoId: AmbienteId;
  onIr: (id: AmbienteId) => void;
}) {
  const t = tour(tourId);

  return (
    <nav className="mt-4 flex flex-col gap-3" aria-label="Ambientes do tour">
      {Object.entries(t.plantas).map(([plantaId, planta]) => {
        const ambientes = Object.entries(t.ambientes).filter(([, a]) => a.planta.em === plantaId);
        if (ambientes.length === 0) return null;

        return (
          <div key={plantaId} className="flex flex-wrap items-center gap-x-2 gap-y-2">
            <span className="label-xs text-muted">{planta.nome}</span>
            {ambientes.map(([id, a]) => {
              const ativo = id === ativoId;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => onIr(id)}
                  aria-current={ativo ? "true" : undefined}
                  className={`label-xs border px-2 py-1 transition-colors duration-300 ${
                    ativo
                      ? "border-accent-soft bg-accent/25 text-paper"
                      : "border-[var(--hair)] text-muted hover:border-accent-soft hover:text-paper"
                  }`}
                >
                  {a.nome}
                </button>
              );
            })}
          </div>
        );
      })}
    </nav>
  );
}
