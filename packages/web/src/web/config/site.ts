// Único lugar para editar contatos do site.
// TROQUE PELO NÚMERO REAL — formato internacional, só dígitos: 55 + DDD + número.
export const WHATSAPP_NUMBER = "5511999999999";

export const EMAIL = "contato@imovi.site";

export const SITE_URL = "imovi.site";

const DEFAULT_MESSAGE =
  "Olá! Vim pelo site da IMOVIX e quero transformar meu empreendimento em uma experiência digital.";

export function whatsappUrl(message: string = DEFAULT_MESSAGE): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export const NAV_LINKS = [
  { label: "Soluções", href: "#solucoes" },
  { label: "Projetos", href: "#projetos" },
  { label: "Sobre", href: "#sobre" },
  { label: "Contato", href: "#contato" },
] as const;
