import { useReveal } from "../../hooks/use-reveal";
import { isWhatsappLive, whatsappUrl } from "../../config/site";

/**
 * Vitrine de projetos — trilho horizontal.
 *
 * Cada card é um LINK, não uma imagem inerte. Antes eram quatro fotos sem
 * nenhum elemento focável: o trilho escondia ~975px na horizontal e quem
 * navegava por teclado nunca chegava nos projetos. Pior, o visitante que se
 * interessava por um deles não tinha o que fazer — via o trabalho no momento
 * de maior interesse e não encontrava saída.
 *
 * Agora cada card leva à conversa já dizendo qual projeto chamou a atenção,
 * o que também qualifica o contato do outro lado. Enquanto o número for o
 * placeholder, o destino é #contato — mesma regra do botão flutuante, agora
 * centralizada em `isWhatsappLive()`.
 *
 * Tornar os cards focáveis conserta o trilho de quebra: o navegador rola o
 * container sozinho ao dar Tab num filho fora de vista, sem tabindex no
 * container nem listener de teclado.
 */

const PROJECTS = [
  {
    index: "01",
    image: "/projects/projeto-01.jpg",
    title: "Portaria\nCinematográfica",
    kind: "Experiência digital 3D",
  },
  {
    index: "02",
    image: "/projects/projeto-02.jpg",
    title: "Residencial\nPremium",
    kind: "Visualização arquitetônica",
  },
  {
    index: "03",
    image: "/projects/projeto-03.jpg",
    title: "Área\nde Lazer",
    kind: "Tour imersivo",
  },
  {
    index: "04",
    image: "/projects/projeto-04.jpg",
    title: "Alameda\nResidencial",
    kind: "Filme 3D de lançamento",
  },
] as const;

export function Showcase() {
  const ref = useReveal<HTMLDivElement>(90);
  const live = isWhatsappLive();

  return (
    <section id="projetos" className="relative bg-ink-2 py-28 sm:py-36 lg:py-44">
      <div ref={ref} className="reveal">
        <div className="mx-auto max-w-[1400px] px-6 sm:px-10 lg:px-16">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="label" data-reveal>
                Projetos
              </p>
              <h2 className="display d2 mt-7 max-w-[15ch] text-paper" data-reveal>
                Empreendimentos vividos antes de existir.
              </h2>
            </div>
            {/* Antes era `hidden lg:block`: no celular, justamente onde arrastar
                não é óbvio, a dica não aparecia. Agora acompanha o gesto certo
                de cada entrada. */}
            <p className="label max-w-[26ch] text-muted" data-reveal>
              <span className="lg:hidden">Arraste para o lado →</span>
              <span className="hidden lg:inline">Role para o lado →</span>
            </p>
          </div>
        </div>

        <ul
          className="no-scrollbar mt-16 flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth px-6 pb-6 sm:mt-20 sm:gap-8 sm:px-10 lg:px-16"
          data-reveal
        >
          {PROJECTS.map((project) => {
            const nome = project.title.replace("\n", " ");
            return (
              <li
                key={project.index}
                className="w-[82vw] shrink-0 snap-start sm:w-[62vw] lg:w-[46vw] xl:w-[38vw]"
              >
                <a
                  href={
                    live
                      ? whatsappUrl(
                          `Olá! Vi o projeto ${nome} no site da IMOVIX e quero algo assim para o meu empreendimento.`,
                        )
                      : "#contato"
                  }
                  {...(live ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  aria-label={`${nome} — ${project.kind}. Falar sobre um projeto assim`}
                  className="group block rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent-soft"
                >
                  <div
                    className="reveal-img relative aspect-[4/5] overflow-hidden rounded-sm bg-surface sm:aspect-[3/4]"
                    data-reveal
                  >
                    <img
                      src={project.image}
                      alt={`${nome} — projeto IMOVIX`}
                      loading="lazy"
                      decoding="async"
                      width={1600}
                      height={2000}
                      className="h-full w-full object-cover opacity-90 transition-[opacity,transform] duration-[1200ms] ease-[var(--ease-out-expo)] group-hover:scale-[1.03] group-hover:opacity-100 group-focus-visible:scale-[1.03] group-focus-visible:opacity-100"
                    />
                    <div
                      className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#050914]/85 via-transparent to-transparent"
                      aria-hidden="true"
                    />
                    <span className="absolute left-6 top-6 label text-paper/70">
                      Projeto {project.index}
                    </span>
                    <div className="absolute inset-x-6 bottom-6">
                      <h3 className="display d3 whitespace-pre-line uppercase text-paper">
                        {project.title}
                      </h3>
                      <p className="label mt-4 text-accent-soft">{project.kind}</p>
                    </div>
                  </div>
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
