import { MATERIALES } from "../taller.mock";
import type { Cliente, Siniestro } from "../taller.types";
import { CANAL_LABEL, entregaTexto, etapaLabel, fechaCorta, fechaRelativa, MATERIAL_LABEL } from "../taller.utils";
import { EtapasStepper } from "./EtapasStepper";

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt>{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}

export function SiniestroDetalle({ siniestro, cliente }: { siniestro: Siniestro; cliente: Cliente }) {
  const materiales = MATERIALES.filter((item) => item.siniestroId === siniestro.id);

  return (
    <article className="card siniestro">
      <header className="siniestro-head">
        <div>
          <h3>{siniestro.tipo}</h3>
          <p className="muted">
            {siniestro.aseguradora} · N° {siniestro.numero}
          </p>
        </div>
        <span className={`badge badge-etapa badge-${siniestro.etapa}`}>{etapaLabel(siniestro.etapa)}</span>
      </header>

      <EtapasStepper etapa={siniestro.etapa} />

      {siniestro.alerta && <div className="alert">⚠ {siniestro.alerta}</div>}

      <section className="ia-box">
        <div className="ia-title">✨ Resumen del agente</div>
        <p>{siniestro.resumen}</p>
        <p className="ia-next">
          <strong>Próximo paso:</strong> {siniestro.proximoPaso}
        </p>
      </section>

      <p className="entrada">
        <strong>{cliente.nombre.split(" ")[0]}</strong> ingresó al taller el {fechaCorta(siniestro.ingreso)} por <strong>{siniestro.tipo.toLowerCase()}</strong>. Seguro: <strong>{siniestro.aseguradora}</strong>.
      </p>

      <dl className="facts">
        <Fact label="Vehículo" value={siniestro.vehiculo} />
        <Fact label="Matrícula" value={siniestro.patente} />
        <Fact label="Seguro" value={siniestro.aseguradora} />
        <Fact label="N° de siniestro" value={siniestro.numero} />
        <Fact label="Póliza" value={siniestro.poliza} />
        <Fact label="Perito" value={siniestro.perito} />
        <Fact label="Monto autorizado" value={siniestro.monto} />
        <Fact label="Deducible" value={siniestro.deducible} />
        <Fact label="Entrega estimada" value={entregaTexto(siniestro.entregaEstimada)} />
      </dl>

      <div className="detail-cols">
        <section>
          <h4>Materiales</h4>
          {materiales.length === 0 ? (
            <p className="muted">Sin materiales pedidos.</p>
          ) : (
            <ul className="mat-list">
              {materiales.map((item) => (
                <li key={item.id}>
                  <div>
                    <strong>{item.nombre}</strong>
                    <span className="muted">
                      {item.proveedor}
                      {item.eta && item.estado !== "llego" ? ` · llega ${fechaRelativa(item.eta).toLowerCase()}` : ""}
                    </span>
                  </div>
                  <span className={`badge badge-mat-${item.estado}`}>{MATERIAL_LABEL[item.estado]}</span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section>
          <h4>Qué fue pasando</h4>
          <ul className="timeline">
            {siniestro.eventos.map((evento) => (
              <li key={evento.id} className={`canal-${evento.canal}`}>
                <div className="timeline-meta">
                  <span className="timeline-canal">{CANAL_LABEL[evento.canal]}</span>
                  <span className="muted">{fechaRelativa(evento.fecha)}</span>
                </div>
                <strong>{evento.titulo}</strong>
                {evento.detalle && <p>{evento.detalle}</p>}
              </li>
            ))}
          </ul>
        </section>
      </div>
      <footer className="muted siniestro-foot">Cliente: {cliente.nombre}</footer>
    </article>
  );
}
