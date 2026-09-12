/**
 * As duas marcas de prancha que mais se repetem no site.
 *
 * Estavam privadas dentro de `media-slot.tsx`. O tour precisa exatamente das
 * mesmas — e um encaixe de mídia pode conter um tour, o que faria o import
 * andar em círculo. Extrair para cá quebra o ciclo e mantém a hachura com uma
 * definição só: se o ângulo ou o passo mudar, muda em todo lugar de uma vez.
 */

/** Hachura diagonal — a marca de "área ainda não desenhada" numa prancha. */
export function Hachura() {
  return (
    <span
      aria-hidden="true"
      className="absolute inset-0 opacity-[0.55]"
      style={{
        backgroundImage:
          "repeating-linear-gradient(45deg, rgba(221,231,239,0.07) 0 1px, transparent 1px 11px)",
      }}
    />
  );
}

/** Cantoneiras de prancha, as mesmas do hero e dos projetos. */
export function Cantoneiras() {
  const base = "pointer-events-none absolute h-3 w-3 border-paper/50";
  return (
    <span aria-hidden="true">
      <span className={`${base} left-2 top-2 border-l border-t`} />
      <span className={`${base} right-2 top-2 border-r border-t`} />
      <span className={`${base} bottom-2 left-2 border-b border-l`} />
      <span className={`${base} bottom-2 right-2 border-b border-r`} />
    </span>
  );
}
