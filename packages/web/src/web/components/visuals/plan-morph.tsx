import { BlueprintPlan, Massing3D } from "./arch";
import { useStage } from "../../hooks/use-stage";

const PHASES = ["2D", "3D", "REAL"] as const;

/**
 * A floor plan that walks 2D → 3D → realistic environment on a loop while
 * the parent stage is active. Cross-fade only, no scaling or rotation.
 */
export function PlanMorph({ active }: { active: boolean }) {
  const { ref, active: phase } = useStage(active ? 3 : 1, 2600);

  return (
    <div ref={ref} className="absolute inset-0">
      <div
        className="absolute inset-0 transition-opacity duration-[900ms] ease-[var(--ease-out-expo)]"
        style={{ opacity: phase === 0 ? 1 : 0 }}
        data-active={active && phase === 0}
      >
        <BlueprintPlan className="h-full w-full p-6 text-accent-soft sm:p-10" />
      </div>

      <div
        className="absolute inset-0 transition-opacity duration-[900ms] ease-[var(--ease-out-expo)]"
        style={{ opacity: phase === 1 ? 1 : 0 }}
        data-active={active && phase === 1}
      >
        <Massing3D className="h-full w-full p-6 text-accent-soft sm:p-10" />
      </div>

      <div
        className="absolute inset-0 transition-opacity duration-[900ms] ease-[var(--ease-out-expo)]"
        style={{ opacity: phase === 2 ? 1 : 0 }}
      >
        <img
          src="/scenes/desejo.jpg"
          alt="Fase final do ciclo: o mesmo empreendimento renderizado como imagem real"
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover opacity-85"
        />
        <span aria-hidden="true" className="absolute inset-0 bg-ink/25" />
      </div>

      {/* phase readout */}
      <div className="pointer-events-none absolute bottom-4 left-4 flex items-center gap-2 sm:bottom-6 sm:left-6">
        {PHASES.map((label, i) => (
          <span
            key={label}
            className="label-xs transition-colors duration-500"
            style={{ color: phase === i ? "var(--color-accent-soft)" : "rgba(242,244,247,0.28)" }}
          >
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}
