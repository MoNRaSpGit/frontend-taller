import { ETAPAS, type Etapa } from "../taller.types";
import { etapaIndex } from "../taller.utils";

export function EtapasStepper({ etapa }: { etapa: Etapa }) {
  const actual = etapaIndex(etapa);
  return (
    <ol className="stepper" aria-label="Progreso del siniestro">
      {ETAPAS.map((item, index) => (
        <li key={item.key} className={index < actual ? "is-done" : index === actual ? "is-current" : ""}>
          <span className="stepper-dot">{index < actual ? "✓" : index + 1}</span>
          <span className="stepper-label">{item.short}</span>
        </li>
      ))}
    </ol>
  );
}
