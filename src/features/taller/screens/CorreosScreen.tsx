import { CLIENTES, CORREOS, SINIESTROS } from "../taller.mock";
import { fechaRelativa } from "../taller.utils";

interface Props {
  onOpenSiniestro: (siniestroId: string) => void;
}

export function CorreosScreen({ onOpenSiniestro }: Props) {
  return (
    <div className="screen">
      <div className="screen-title">
        <h2>Correos</h2>
        <p className="muted">Tu agente los leyó y te dice qué importa de cada uno.</p>
      </div>
      <div className="mail-list">
        {CORREOS.map((mail) => {
          const siniestro = SINIESTROS.find((s) => s.id === mail.siniestroId);
          const cliente = CLIENTES.find((c) => c.id === siniestro?.clienteId);
          return (
            <article key={mail.id} className={`card mail ${mail.leido ? "" : "is-unread"}`}>
              <div className="mail-top">
                <strong>{mail.asunto}</strong>
                <span className="muted">{fechaRelativa(mail.fecha)}</span>
              </div>
              <span className="muted">{mail.de}</span>
              <div className="ia-box">
                <div className="ia-title">✨ Resumen del agente</div>
                <p>{mail.resumenIA}</p>
                {mail.accion && (
                  <p className="ia-next">
                    <strong>Qué hacer:</strong> {mail.accion}
                  </p>
                )}
              </div>
              {siniestro && (
                <button type="button" className="link" onClick={() => onOpenSiniestro(siniestro.id)}>
                  Ver siniestro de {cliente?.nombre} →
                </button>
              )}
            </article>
          );
        })}
      </div>
    </div>
  );
}
