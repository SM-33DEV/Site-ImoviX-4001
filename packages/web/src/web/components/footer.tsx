import { EMAIL, SITE_URL, whatsappUrl } from "../config/site";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative bg-ink pt-24 pb-12 sm:pt-32">
      <div className="mx-auto max-w-[1400px] px-6 sm:px-10 lg:px-16">
        <p className="display d2 uppercase text-paper">
          Experiências que geram negócios.
        </p>

        <div className="mt-24 hairline" />

        <div className="mt-10 flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <img
                src="/brand/imovix-lockup-v5.png"
                alt="IMOVIX"
                width={1198}
                height={360}
                loading="lazy"
                decoding="async"
                className="h-9 w-auto"
              />
            </div>
            <p className="mt-5 text-[0.625rem] font-bold uppercase tracking-[0.2em] text-muted">
              Tecnologia e marketing
              <br />
              imobiliário 3D
            </p>
          </div>

          <div className="flex flex-col gap-3 text-[0.6875rem] font-bold uppercase tracking-[0.2em] lg:items-end">
            <a
              href={whatsappUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="text-paper transition-colors duration-500 hover:text-accent-soft"
            >
              WhatsApp
            </a>
            <a
              href={`mailto:${EMAIL}`}
              className="text-muted transition-colors duration-500 hover:text-accent-soft"
            >
              {EMAIL}
            </a>
            <span className="text-muted">{SITE_URL}</span>
          </div>
        </div>

        <p className="mt-16 text-[0.625rem] font-medium uppercase tracking-[0.2em] text-muted/70">
          © {year} IMOVIX. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
}
