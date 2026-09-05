// Único lugar para editar contatos do site.
// TROQUE PELO NÚMERO REAL — formato internacional, só dígitos: 55 + DDD + número.
export const WHATSAPP_NUMBER = "5511999999999";

/** Valor de fábrica. Enquanto o número for este, nada deve abrir o wa.me. */
export const WHATSAPP_PLACEHOLDER = "5511999999999";

/**
 * O WhatsApp já está valendo?
 *
 * Componentes que oferecem contato devem checar isto ANTES de mandar o
 * visitante para o wa.me: abrir conversa com número inexistente é pior que
 * não ter botão. Enquanto retornar false, o destino correto é #contato.
 *
 * No dia em que o número real entrar acima, todos os pontos de contato do
 * site passam a funcionar sozinhos — nenhuma outra alteração é necessária.
 */
export function isWhatsappLive(): boolean {
  return WHATSAPP_NUMBER !== WHATSAPP_PLACEHOLDER && WHATSAPP_NUMBER.length > 10;
}

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
