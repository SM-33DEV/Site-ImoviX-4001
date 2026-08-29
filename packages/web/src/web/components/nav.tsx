import { useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import { NAV_LINKS, whatsappUrl } from "../config/site";

export function Nav() {
  const [open, setOpen] = useState(false);
  const barRef = useRef<HTMLElement | null>(null);

  // Solid background after the first viewport — direct DOM write, no state
  // churn on every scroll event.
  useEffect(() => {
    const bar = barRef.current;
    if (!bar) return;
    let solid = false;

    const onScroll = () => {
      const shouldBeSolid = window.scrollY > 80;
      if (shouldBeSolid === solid) return;
      solid = shouldBeSolid;
      bar.style.backgroundColor = solid ? "rgba(5,9,20,0.88)" : "transparent";
      bar.style.borderBottomColor = solid ? "var(--hair)" : "transparent";
      bar.style.backdropFilter = solid ? "blur(14px)" : "none";
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header
        ref={barRef}
        className="fixed inset-x-0 top-0 z-50 border-b border-transparent transition-[background-color,border-color] duration-500"
      >
        <nav className="mx-auto flex h-[68px] max-w-[1400px] items-center justify-between px-6 sm:px-10 lg:px-16">
          <a href="#topo" className="flex items-center gap-2.5" aria-label="IMOVIX — início">
            <img
              src="/brand/imovix-lockup-v5.png"
              alt="IMOVIX"
              width={1198}
              height={360}
              className="h-9 w-auto"
            />
          </a>

          <div className="hidden items-center gap-9 md:flex">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="group relative text-[0.6875rem] font-semibold uppercase tracking-[0.2em] text-paper/70 transition-colors duration-300 hover:text-paper"
              >
                {link.label}
                <span className="absolute -bottom-1.5 left-0 h-px w-0 bg-accent-soft transition-[width] duration-500 ease-[var(--ease-out-expo)] group-hover:w-full" />
              </a>
            ))}
          </div>

          <div className="flex items-center gap-2.5">
            <a
              href={whatsappUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden rounded-full border border-[var(--hair-strong)] px-5 py-2.5 text-[0.625rem] font-bold uppercase tracking-[0.2em] text-paper transition-colors duration-400 hover:border-accent hover:bg-accent hover:text-white md:inline-flex"
            >
              Falar com um especialista
            </a>
            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-label="Abrir menu"
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[var(--hair-strong)] text-paper md:hidden"
            >
              <Menu className="h-4.5 w-4.5" strokeWidth={1.5} />
            </button>
          </div>
        </nav>
      </header>

      {open && (
        <div className="fixed inset-0 z-[60] flex flex-col bg-ink md:hidden">
          <div className="flex h-[68px] items-center justify-between px-6">
            <span className="flex items-center gap-2.5">
              <img
                src="/brand/imovix-lockup-v5.png"
                alt="IMOVIX"
                width={1198}
                height={360}
                className="h-9 w-auto"
              />
            </span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Fechar menu"
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[var(--hair-strong)] text-paper"
            >
              <X className="h-4.5 w-4.5" strokeWidth={1.5} />
            </button>
          </div>

          <div className="flex flex-1 flex-col justify-center gap-2 px-6">
            {NAV_LINKS.map((link, i) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="display d2 border-b border-[var(--hair)] py-5 text-paper"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="px-6 pb-10">
            <a
              href={whatsappUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center justify-center rounded-full bg-accent px-6 py-4 text-[0.6875rem] font-bold uppercase tracking-[0.2em] text-white"
            >
              Falar com um especialista
            </a>
          </div>
        </div>
      )}
    </>
  );
}
