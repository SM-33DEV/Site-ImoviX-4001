import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, ArrowRight, Plus, X, Menu } from "lucide-react";
import { EMAIL, isWhatsappLive, whatsappUrl } from "../config/site";
import { useReveal } from "../hooks/use-reveal";

const LINKS = [
  { label: "Soluções", href: "#solucoes" },
  { label: "Projetos", href: "#projetos" },
  { label: "Estúdio", href: "#sobre" },
];

export function StudioNav() {
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const el = dialog.current;
    if (!el) return;
    const close = () => {
      document.body.style.overflow = "";
      trigger.current?.focus();
    };
    el.addEventListener("close", close);
    return () => {
      el.removeEventListener("close", close);
      document.body.style.overflow = "";
    };
  }, []);
  return (
    <>
      <a className="studio-skip" href="#solucoes">
        Pular para o conteúdo
      </a>
      <header className="studio-nav">
        <a href="#topo" aria-label="IMOVIX — início">
          <img src="/brand/imovix-lockup-dark-v5.png" alt="IMOVIX" width="1198" height="360" />
        </a>
        <nav aria-label="Menu principal">
          {LINKS.map((link) => (
            <a key={link.href} href={link.href}>
              {link.label}
            </a>
          ))}
        </nav>
        <a className="studio-nav-cta" href="#contato">
          Vamos conversar <ArrowUpRight size={16} />
        </a>
        <button
          ref={trigger}
          className="studio-menu"
          aria-label="Abrir menu"
          aria-haspopup="dialog"
          onClick={() => {
            dialog.current?.showModal();
            document.body.style.overflow = "hidden";
          }}
        >
          <Menu size={22} />
        </button>
      </header>
      <dialog ref={dialog} className="studio-dialog" aria-label="Navegação">
        <button
          className="studio-close"
          aria-label="Fechar menu"
          onClick={() => dialog.current?.close()}
        >
          <X />
        </button>
        <p className="studio-eyebrow">IMOVIX / Explore</p>
        <nav>
          {[...LINKS, { label: "Contato", href: "#contato" }].map((link) => (
            <a key={link.href} href={link.href} onClick={() => dialog.current?.close()}>
              {link.label}
              <ArrowUpRight />
            </a>
          ))}
        </nav>
      </dialog>
    </>
  );
}

const SERVICES = [
  {
    name: "Filmes que despertam desejo.",
    tag: "Filmes 3D",
    text: "Luz, movimento e atmosfera para apresentar a arquitetura antes da primeira obra.",
    image: "/images/solutions/filmes-3d-v1.webp",
    alt: "Ilustração de filme 3D: residência contemporânea com piscina e iluminação cinematográfica ao pôr do sol",
  },
  {
    name: "Um empreendimento explorável.",
    tag: "Experiências digitais",
    text: "Sites imersivos e percursos digitais que aproximam o cliente de cada espaço.",
    image: "/images/solutions/experiencias-digitais-v1.webp",
    alt: "Ilustração de experiência digital: monitor e tablet exibem um tour imobiliário com pontos de navegação",
  },
  {
    name: "Cada detalhe, compreendido.",
    tag: "Visualização arquitetônica",
    text: "Plantas e imagens 3D que tornam os ambientes claros, tangíveis e desejáveis.",
    image: "/images/solutions/visualizacao-arquitetonica-v1.webp",
    alt: "Ilustração de visualização arquitetônica: planta tridimensional de apartamento mobiliado com varanda",
  },
  {
    name: "Da apresentação à oportunidade.",
    tag: "Tecnologia comercial",
    text: "Sistemas que conectam a experiência do empreendimento à rotina de atendimento.",
    image: "/images/solutions/tecnologia-comercial-v1.webp",
    alt: "Ilustração de tecnologia comercial: notebook com gestão de oportunidades e celular com atendimento imobiliário",
  },
];

export function StudioSolutions() {
  const [active, setActive] = useState(0);
  const [expanded, setExpanded] = useState(true);
  const [keyboard, setKeyboard] = useState(false);
  const ref = useReveal<HTMLDivElement>(55);
  return (
    <section id="solucoes" className="studio-section studio-services" data-keyboard={keyboard}>
      <div className="studio-wrap">
        <div ref={ref} className="studio-section-head reveal">
          <p className="studio-section-label">Para o seu empreendimento</p>
          <h2>
            Uma nova forma de
            <br />
            apresentar <em>o seu projeto.</em>
          </h2>
          <p>Da imagem à interação. Escolha a experiência que faz sentido para o seu lançamento.</p>
        </div>
        <div className="studio-service-grid">
          <div className="studio-service-image">
            {SERVICES.map((service, i) => (
              <img
                key={service.tag}
                src={service.image}
                srcSet={`${service.image.replace(".webp", "-small.webp")} 480w, ${service.image} 960w`}
                sizes="(max-width: 700px) calc(100vw - 88px), (max-width: 1000px) 45vw, 550px"
                alt={service.alt}
                loading="lazy"
                decoding="async"
                width="960"
                height="960"
                className={active === i ? "is-active" : ""}
                aria-hidden={active !== i}
              />
            ))}
            <span className="studio-image-index">{SERVICES[active].tag}</span>
          </div>
          <div className="studio-service-list">
            {SERVICES.map((service, i) => (
              <div
                key={service.tag}
                className={`studio-service ${active === i && expanded ? "is-active" : ""}`}
              >
                <button
                  aria-expanded={active === i && expanded}
                  aria-controls={`service-${i}`}
                  onClick={(event) => {
                    setKeyboard(event.detail === 0);
                    setExpanded(active === i ? !expanded : true);
                    setActive(i);
                  }}
                >
                  <span>{service.tag}</span>
                  <Plus size={20} />
                </button>
                <div id={`service-${i}`} hidden={active !== i || !expanded}>
                  <h3>{service.name}</h3>
                  <p>{service.text}</p>
                  <a href="#contato" className="studio-text-link">
                    Conversar sobre esta solução <ArrowUpRight size={17} />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

const PROJECTS = [
  {
    image: "/projects/projeto-02.jpg",
    title: "Arquitetura que aproxima.",
    kind: "Residencial / Visualização 3D",
    alt: "Residências e paisagismo representados em uma imagem 3D",
  },
  {
    image: "/projects/projeto-04.jpg",
    title: "O caminho até o próximo lar.",
    kind: "Espaços / Filme de lançamento",
    alt: "Alameda residencial com arquitetura e paisagismo",
  },
];

export function StudioProjects() {
  const ref = useReveal<HTMLDivElement>(55);
  return (
    <section id="projetos" className="studio-section studio-projects">
      <div className="studio-wrap">
        <div ref={ref} className="studio-section-head reveal">
          <p className="studio-section-label">Arquitetura em perspectiva</p>
          <h2>
            Antes da obra.
            <br />
            <em>Além da imaginação.</em>
          </h2>
          <p>Veja como transformamos espaços em experiências visuais.</p>
        </div>
        <div className="studio-project-grid">
          {PROJECTS.map((project) => (
            <a
              href="#contato"
              key={project.image}
              className="studio-project"
              aria-label={`${project.title} Conversar sobre um projeto assim`}
            >
              <div className="studio-project-photo">
                <img
                  src={project.image}
                  alt={project.alt}
                  width="1400"
                  height="1100"
                  loading="lazy"
                  decoding="async"
                />
                <span className="studio-project-arrow">
                  <ArrowUpRight />
                </span>
              </div>
              <div className="studio-project-caption">
                <div>
                  <p className="studio-eyebrow">{project.kind}</p>
                  <h3>{project.title}</h3>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

export function StudioAbout() {
  const ref = useReveal<HTMLDivElement>(55);
  return (
    <section id="sobre" className="studio-section studio-about">
      <div ref={ref} className="studio-wrap reveal">
        <p className="studio-section-label">Essência IMOVIX</p>
        <div className="studio-about-grid">
          <h2>
            Arquitetura, tecnologia
            <br />
            <em>e uma visão em comum.</em>
          </h2>
          <div>
            <p className="studio-about-lead">Tornar o potencial do seu empreendimento visível.</p>
            <p>
              Somos a IMOVIX. Criamos imagens, filmes e experiências digitais que aproximam pessoas
              de espaços que ainda vão existir.
            </p>
            <p className="studio-audience">Para construtoras, incorporadoras e imobiliárias.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export function StudioContact() {
  const ref = useReveal<HTMLDivElement>(55);
  const live = isWhatsappLive();
  return (
    <>
      <section id="contato" className="studio-section studio-contact">
        <div ref={ref} className="studio-wrap reveal">
          <p className="studio-eyebrow">Vamos conversar</p>
          <h2>
            Seu próximo lançamento
            <br />
            <em>começa com uma ideia.</em>
          </h2>
          <div className="studio-contact-bottom">
            <p>Conte com a gente para torná-la visível.</p>
            <a
              className="studio-button"
              href={live ? whatsappUrl() : `mailto:${EMAIL}`}
              {...(live ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            >
              Falar com a IMOVIX <ArrowUpRight size={20} />
            </a>
          </div>
        </div>
      </section>
    </>
  );
}

export function StudioFooter() {
  return (
    <footer className="studio-footer">
      <div className="studio-wrap">
        <a href="#topo" aria-label="IMOVIX — voltar ao início">
          <img src="/brand/imovix-lockup-dark-v5.png" alt="IMOVIX" width="1198" height="360" />
        </a>
        <p>Tecnologia e marketing imobiliário 3D.</p>
        <a href={`mailto:${EMAIL}`}>
          {EMAIL} <ArrowRight size={15} />
        </a>
        <span>© {new Date().getFullYear()} IMOVIX</span>
      </div>
    </footer>
  );
}
