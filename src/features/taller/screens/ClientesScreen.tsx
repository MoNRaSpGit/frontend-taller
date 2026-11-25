import { useMemo, useState } from "react";
import { SiniestroDetalle } from "../components/SiniestroDetalle";
import { CLIENTES, SINIESTROS } from "../taller.mock";
import { etapaLabel, iniciales, whatsappLink } from "../taller.utils";

interface Props {
  selectedId: string | null;
  selectedSiniestroId: string | null;
  onSelect: (clienteId: string | null, siniestroId?: string | null) => void;
}

export function ClientesScreen({ selectedId, selectedSiniestroId, onSelect }: Props) {
  const [query, setQuery] = useState("");
  const [filtro, setFiltro] = useState<"todos" | "proceso" | "atencion" | "listos">("todos");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return CLIENTES.filter((cliente) => {
      const autos = SINIESTROS.filter((s) => s.clienteId === cliente.id);
      if (filtro === "proceso" && !autos.some((s) => s.etapa !== "listo")) return false;
      if (filtro === "atencion" && !autos.some((s) => s.alerta)) return false;
      if (filtro === "listos" && !autos.some((s) => s.etapa === "listo")) return false;
      if (!q) return true;
      return (
        cliente.nombre.toLowerCase().includes(q) ||
        autos.some((s) => s.patente.toLowerCase().includes(q) || s.vehiculo.toLowerCase().includes(q) || s.numero.toLowerCase().includes(q))
      );
    });
  }, [query, filtro]);

  const cliente = CLIENTES.find((item) => item.id === selectedId) ?? null;
  const siniestros = cliente ? SINIESTROS.filter((item) => item.clienteId === cliente.id) : [];
  const activo = siniestros.find((item) => item.id === selectedSiniestroId) ?? siniestros[0];

  return (
    <div className={`clientes ${cliente ? "has-detail" : ""}`}>
      <aside className="clientes-list">
        <input
          className="search"
          type="search"
          placeholder="Buscar cliente, matrícula o N° de siniestro"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        <div className="filters filters-sm">
          {(
            [
              ["todos", "Todos"],
              ["proceso", "En proceso"],
              ["atencion", "Atención"],
              ["listos", "Listos"]
            ] as const
          ).map(([key, label]) => (
            <button type="button" key={key} className={filtro === key ? "is-active" : ""} onClick={() => setFiltro(key)}>
              {label}
            </button>
          ))}
        </div>
        <ul>
          {filtered.map((item) => {
            const autos = SINIESTROS.filter((s) => s.clienteId === item.id);
            return (
              <li key={item.id}>
                <button type="button" className={`cliente-row ${item.id === selectedId ? "is-active" : ""}`} onClick={() => onSelect(item.id)}>
                  <span className="avatar">{iniciales(item.nombre)}</span>
                  <span className="cliente-row-text">
                    <strong>{item.nombre}</strong>
                    <span className="muted">
                      {autos[0] ? `${autos[0].aseguradora} · ${autos[0].vehiculo.split(" ").slice(0, 2).join(" ")}` : ""}
                      {autos.length > 1 ? ` · +${autos.length - 1}` : ""}
                    </span>
                  </span>
                  {autos[0] && <span className={`mini-badge mini-${autos[0].etapa}`}>{autos[0].alerta ? "⚠ " : ""}{autos[0].etapa === "listo" ? "Listo" : etapaLabel(autos[0].etapa)}</span>}
                </button>
              </li>
            );
          })}
          {filtered.length === 0 && <li className="muted empty">No hay resultados.</li>}
        </ul>
      </aside>

      <section className="cliente-detail">
        {!cliente ? (
          <div className="empty-detail">
            <span>👈</span>
            <p>Elegí un cliente para ver su siniestro, los materiales y todo lo que fue pasando.</p>
          </div>
        ) : (
          <>
            <button type="button" className="back" onClick={() => onSelect(null)}>
              ← Clientes
            </button>
            <header className="card cliente-head">
              <span className="avatar avatar-lg">{iniciales(cliente.nombre)}</span>
              <div>
                <h2>{cliente.nombre}</h2>
                <p className="muted">{cliente.telefono}</p>
              </div>
              <div className="cliente-actions">
                <a className="btn" href={`tel:${cliente.telefono.replace(/\s/g, "")}`}>
                  Llamar
                </a>
                <a className="btn btn-wa" href={whatsappLink(cliente)} target="_blank" rel="noreferrer">
                  WhatsApp
                </a>
              </div>
            </header>

            {siniestros.length > 1 && (
              <div className="siniestro-tabs">
                {siniestros.map((item) => (
                  <button type="button" key={item.id} className={item.id === activo?.id ? "is-active" : ""} onClick={() => onSelect(cliente.id, item.id)}>
                    {item.tipo}
                  </button>
                ))}
              </div>
            )}

            {activo && <SiniestroDetalle siniestro={activo} cliente={cliente} />}
          </>
        )}
      </section>
    </div>
  );
}
