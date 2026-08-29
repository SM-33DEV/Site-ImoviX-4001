import { useEffect, useRef, useState } from "react";
import { WHATSAPP_NUMBER, whatsappUrl } from "../../config/site";

/**
 * Botão flutuante de WhatsApp.
 *
 * Enquanto WHATSAPP_NUMBER for o placeholder, o botão NÃO abre o wa.me
 * (mandaria o cliente para um número inexistente): ele rola para a seção
 * #contato. No dia em que o número real entrar em config/site.ts, o botão
 * passa a abrir a conversa automaticamente — nenhuma outra mudança é
 * necessária. Mesmo ponto de troca para uma API futura.
 */
const PLACEHOLDER = "5511999999999";

export function WhatsappFab() {
  const ref = useRef<HTMLAnchorElement | null>(null);
  const [live, setLive] = useState(false);
  const numero: string = WHATSAPP_NUMBER;
  const isLive = numero !== PLACEHOLDER && numero.length > 10;

  // Aparece depois do primeiro trecho do hero, para não competir com a abertura.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onScroll = () => {
      setLive(window.scrollY > window.innerHeight * 0.9);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <a
      ref={ref}
      href={isLive ? whatsappUrl() : "#contato"}
      target={isLive ? "_blank" : undefined}
      rel={isLive ? "noopener noreferrer" : undefined}
      aria-label="Falar com a IMOVIX no WhatsApp"
      data-state={live ? "on" : "off"}
      className="group fixed bottom-6 left-6 z-40 inline-flex h-14 w-14 items-center justify-center rounded-full border border-[var(--hair-strong)] bg-ink-2/95 text-paper shadow-[0_18px_50px_-16px_rgba(0,0,0,0.9)] backdrop-blur-none transition-[opacity,transform,background-color,border-color] duration-500 ease-[var(--ease-out-expo)] hover:border-accent-soft hover:bg-accent hover:text-white data-[state=off]:pointer-events-none data-[state=off]:translate-y-3 data-[state=off]:opacity-0 sm:bottom-8 sm:left-8"
    >
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
        className="h-6 w-6 fill-current transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:scale-[1.06]"
      >
        <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.46 1.32 4.96L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.86 9.86 0 0 0 12.04 2Zm0 1.67c2.2 0 4.27.86 5.83 2.42a8.2 8.2 0 0 1 2.41 5.82c0 4.54-3.7 8.24-8.25 8.24a8.24 8.24 0 0 1-4.2-1.15l-.3-.18-3.12.82.83-3.04-.19-.31a8.19 8.19 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.25-8.24Zm-3.1 4.4c-.16 0-.42.06-.64.3-.22.24-.85.83-.85 2.02s.87 2.34.99 2.5c.12.16 1.68 2.69 4.13 3.66 2.03.8 2.44.64 2.88.6.44-.04 1.42-.58 1.62-1.15.2-.56.2-1.05.14-1.15-.06-.1-.22-.16-.46-.28-.24-.12-1.42-.7-1.64-.78-.22-.08-.38-.12-.54.12-.16.24-.62.78-.76.94-.14.16-.28.18-.52.06a6.7 6.7 0 0 1-1.97-1.21 7.4 7.4 0 0 1-1.36-1.7c-.14-.24-.02-.37.1-.49.1-.11.26-.3.4-.46.13-.15.19-.26.28-.44.1-.18.05-.34-.01-.46-.06-.12-.53-1.3-.73-1.77-.19-.46-.38-.4-.54-.4Z" />
      </svg>
      <span className="pointer-events-none absolute left-full ml-3 hidden whitespace-nowrap rounded-full border border-[var(--hair)] bg-ink-2 px-3.5 py-2 text-[0.5625rem] font-bold uppercase tracking-[0.22em] text-paper opacity-0 transition-opacity duration-400 group-hover:opacity-100 lg:block">
        WhatsApp
      </span>
    </a>
  );
}
