import { CLIENTES, CORREOS, MATERIALES, SINIESTROS } from "../taller.mock";
import { ETAPAS, type Siniestro } from "../taller.types";
import { entregaTexto } from "../taller.utils";

interface Props {
  onOpen: (siniestro: Siniestro) => void;
}

export function PanelScreen({ onOpen }: Props) {
  const enTaller = SINIESTROS.filter((item) => item.etapa !== "listo");
  const listos = SINIESTROS.filter((item) => item.etapa === "listo");
  const conAlerta = SINIESTROS.filter((item) => item.alerta);
  const correosNuevos = CORREOS.filter((item) => !item.leido).length;
  const materialesPorLlegar = MATERIALES.filter((item) => item.estado === "en_camino" || item.estado === "pedido").length;
  const nombreDe = (id: string) => CLIENTES.find((item) => item.id === id)?.nombre ?? "";

  return (
    <div className="screen">
      <div className="screen-title">
        <h2>Panel del taller</h2>
        <p className="muted">Todo lo que está pasando hoy, resumido por tu agente.</p>
      </div>

      <div className="kpis">
        <div className="card kpi">
          <span className="kpi-num">{enTaller.length}</span>
          <span>Autos en el taller</span>
        </div>
        <div className="card kpi kpi-warn">
          <span className="kpi-num">{conAlerta.length}</span>
          <span>Requieren atención</span>
        </div>
        <div className="card kpi">
          <span className="kpi-num">{materialesPorLlegar}</span>
          <span>Materiales por llegar</span>
        </div>
        <div className="card kpi">
          <span className="kpi-num">{correosNuevos}</span>
          <span>Correos nuevos</span>
        </div>
      </div>

      {conAlerta.length > 0 && (
        <section>
          <h3 className="section-title">Requieren atención</h3>
          <div className="attention-list">
            {conAlerta.map((item) => (
              <button type="button" key={item.id} className="card attention" onClick={() => onOpen(item)}>
                <span className="attention-icon">⚠</span>
                <span>
                  <strong>{nombreDe(item.clienteId)}</strong> · {item.vehiculo}
                  <span className="muted block">{item.alerta}</span>
                </span>
              </button>
            ))}
          </div>
        </section>
      )}

      <section>
        <h3 className="section-title">Autos por etapa</h3>
        <div className="board">
          {ETAPAS.map((etapa) => {
            const items = SINIESTROS.filter((item) => item.etapa === etapa.key);
            return (
              <div className="board-col" key={etapa.key}>
                <div className="board-col-head">
                  <span>{etapa.label}</span>
                  <span className="board-count">{items.length}</span>
                </div>
                {items.length === 0 && <div className="board-empty">—</div>}
                {items.map((item) => (
                  <button type="button" key={item.id} className="card board-card" onClick={() => onOpen(item)}>
                    <strong>{nombreDe(item.clienteId)}</strong>
                    <span>{item.vehiculo}</span>
                    <span className="muted">
                      {item.aseguradora} · entrega {entregaTexto(item.entregaEstimada).toLowerCase()}
                    </span>
                    {item.alerta && <span className="chip-warn">⚠ {item.alerta}</span>}
                  </button>
                ))}
              </div>
            );
          })}
        </div>
        {listos.length > 0 && <p className="muted">{listos.length} listo(s) para entregar.</p>}
      </section>
    </div>
  );
}
