import type { ReactNode } from "react";

/**
 * Chamada de prancha — o rótulo de abertura de cada seção.
 *
 *     A-03 ──── SOLUÇÕES IMOVIX
 *
 * Substitui o `<p className="label">` solto que abria cada seção. O código
 * não é enfeite: é o mesmo que o selo do canto exibe quando aquela seção
 * está em leitura, então o leitor sabe sempre em que folha do jogo está.
 * É o que transforma dez seções soltas num documento com sumário.
 *
 * O fio entre o código e o texto vem do desenho técnico, onde a chamada
 * sempre aponta para o que descreve.
 */
export function SheetLabel({
  code,
  children,
  className = "",
}: {
  code: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <p className={`label flex items-center gap-3 ${className}`} data-reveal>
      <span className="text-accent-soft tabular-nums">{code}</span>
      <span aria-hidden="true" className="h-px w-6 shrink-0 bg-[var(--hair-strong)]" />
      <span>{children}</span>
    </p>
  );
}
