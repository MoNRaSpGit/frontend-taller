import { useState } from "react";
import { CLIENTES, MATERIALES, SINIESTROS } from "../taller.mock";
import type { EstadoMaterial } from "../taller.types";
import { fechaRelativa, MATERIAL_LABEL } from "../taller.utils";

const FILTROS: { key: EstadoMaterial | "todos"; label: string }[] = [
  { key: "todos", label: "Todos" },
  { key: "pendiente", label: "Por pedir" },
  { key: "pedido", label: "Pedidos" },
  { key: "en_camino", label: "En camino" },
  { key: "llego", label: "Llegaron" }
];

interface Props {
  onOpenSiniestro: (siniestroId: string) => void;
}

export function MaterialesScreen({ onOpenSiniestro }: Props) {
  const [filtro, setFiltro] = useState<EstadoMaterial | "todos">("todos");
  const items = MATERIALES.filter((item) => filtro === "todos" || item.estado === filtro);

  return (
    <div className="screen">
      <div className="screen-title">
        <h2>Materiales</h2>
        <p className="muted">Repuestos y pintura de todos los autos, en un solo lugar.</p>
      </div>
      <div className="filters">
        {FILTROS.map((item) => (
          <button type="button" key={item.key} className={filtro === item.key ? "is-active" : ""} onClick={() => setFiltro(item.key)}>
            {item.label}
          </button>
        ))}
      </div>
      <div className="card table-card">
        {items.map((item) => {
          const siniestro = SINIESTROS.find((s) => s.id === item.siniestroId);
          const cliente = CLIENTES.find((c) => c.id === siniestro?.clienteId);
          return (
            <button type="button" key={item.id} className="mat-row" onClick={() => onOpenSiniestro(item.siniestroId)}>
              <span className="mat-main">
                <strong>{item.nombre}</strong>
                <span className="muted">
                  Para {cliente?.nombre} · {siniestro?.vehiculo} · {item.proveedor}
                </span>
              </span>
              <span className="mat-eta muted">{item.eta && item.estado !== "llego" ? `Llega ${fechaRelativa(item.eta).toLowerCase()}` : ""}</span>
              <span className={`badge badge-mat-${item.estado}`}>{MATERIAL_LABEL[item.estado]}</span>
            </button>
          );
        })}
        {items.length === 0 && <p className="muted empty">Nada en esta categoría.</p>}
      </div>
    </div>
  );
}
