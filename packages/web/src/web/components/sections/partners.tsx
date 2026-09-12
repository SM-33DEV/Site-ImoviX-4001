import { useState, type ReactNode } from "react";
import { Pause, Play } from "lucide-react";
import { useReveal } from "../../hooks/use-reveal";

// Concept identities for the preview only; replace with authorized client logos before launch.
type Partner = { name: string; sector: string; style: string; mark: ReactNode };
const PARTNERS: Partner[] = [
  {
    name: "VÉRTORA",
    sector: "CONSTRUTORA",
    style: "vertora",
    mark: (
      <>
        <path d="M4 9h10l10 30 10-30h10L28 55h-8z" fill="currentColor" />
        <path d="m24 9 5 15-5 15-5-15z" fill="currentColor" opacity=".4" />
      </>
    ),
  },
  {
    name: "MONTEVRA",
    sector: "ENGENHARIA",
    style: "montevra",
    mark: (
      <>
        <path d="M4 51V13l20 20 20-20v38H34V35L24 45 14 35v16z" fill="currentColor" />
        <path d="m14 13 10 10 10-10" fill="none" stroke="currentColor" strokeWidth="3" />
      </>
    ),
  },
  {
    name: "Arcavelle",
    sector: "INCORPORADORA",
    style: "arcavelle",
    mark: (
      <>
        <path
          d="M7 53V28a17 17 0 0 1 34 0v25M15 53V28a9 9 0 0 1 18 0v25"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
        />
        <path d="M3 53h42" stroke="currentColor" strokeWidth="3" />
      </>
    ),
  },
  {
    name: "ESTRAVO",
    sector: "OBRAS & ENGENHARIA",
    style: "estravo",
    mark: <path d="m5 14 38-7v10L15 22v6l23-4v9l-23 4v7l28-5v10L5 56z" fill="currentColor" />,
  },
  {
    name: "ALVORA",
    sector: "CONSTRUÇÕES",
    style: "alvora",
    mark: (
      <>
        <path d="M3 53 24 10l21 43H34L24 31 14 53z" fill="currentColor" />
        <path d="M20 48h8v5h-8z" fill="currentColor" />
      </>
    ),
  },
  {
    name: "PILARÉ",
    sector: "EMPREENDIMENTOS",
    style: "pilare",
    mark: (
      <>
        <path
          d="M7 15h34M7 49h34M12 15v34M24 15v34M36 15v34"
          fill="none"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path d="M7 8h34M7 56h34" stroke="currentColor" strokeWidth="2" />
      </>
    ),
  },
];
const LOOPS = [0, 1, 2] as const;

function Logo({ name, sector, style, mark, hidden }: Partner & { hidden: boolean }) {
  return (
    <li className={`studio-partner-logo studio-partner-${style}`} aria-hidden={hidden || undefined}>
      <svg viewBox="0 0 48 64" aria-hidden="true">
        {mark}
      </svg>
      <div>
        <span className="studio-partner-name">{name}</span>
        <span className="studio-partner-sector">{sector}</span>
      </div>
    </li>
  );
}

export function Partners() {
  const ref = useReveal<HTMLDivElement>(110);
  const [paused, setPaused] = useState(false);
  return (
    <section
      id="parceiros"
      aria-labelledby="partners-title"
      aria-describedby="partners-note"
      className="studio-partners"
    >
      <div ref={ref} className="studio-wrap reveal">
        <div className="studio-partners-heading">
          <h2 id="partners-title">Conexões que constroem.</h2>
        </div>
        <div className="studio-partners-rail">
          <div className="marquee-mask">
            <ul
              className="marquee-track"
              aria-label="Conceitos de marcas de construção"
              style={{ animationPlayState: paused ? "paused" : undefined }}
            >
              {LOOPS.map((loop) =>
                PARTNERS.map((partner) => (
                  <Logo key={`${partner.name}-${loop}`} {...partner} hidden={loop > 0} />
                )),
              )}
            </ul>
          </div>
        </div>
        <div className="studio-partners-bottom">
          <p id="partners-note" className="studio-partners-note">
            Marcas fictícias para demonstração visual. Não representam clientes ou parcerias reais.
          </p>
          <button
            className="studio-pause"
            onClick={() => setPaused(!paused)}
            aria-label={paused ? "Reproduzir esteira de marcas" : "Pausar esteira de marcas"}
            aria-pressed={paused}
          >
            {paused ? <Play size={13} /> : <Pause size={13} />}
            <span>{paused ? "Reproduzir" : "Pausar"}</span>
          </button>
        </div>
      </div>
    </section>
  );
}
