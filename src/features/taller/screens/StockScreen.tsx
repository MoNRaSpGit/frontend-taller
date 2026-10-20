import { useEffect, useState } from "react";
import { StockItemModal } from "../components/StockItemModal";
import { deleteStockItem, fetchStock } from "../taller.client";
import { errorMessage, formatMoney } from "../taller.shared";
import type { TallerStockItem } from "../taller.types";

const LOW_STOCK_THRESHOLD = 3;

export function StockScreen() {
  const [items, setItems] = useState<TallerStockItem[] | null>(null);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState<TallerStockItem | null>(null);
  const [showNew, setShowNew] = useState(false);

  function load() {
    fetchStock()
      .then(setItems)
      .catch((err) => setError(errorMessage(err, "No se pudo cargar el stock.")));
  }

  useEffect(() => {
    load();
  }, []);

  function handleDelete(item: TallerStockItem) {
    if (!window.confirm(`¿Eliminar "${item.name}" del stock?`)) return;
    deleteStockItem(item.id)
      .then(() => setItems((current) => current?.filter((row) => row.id !== item.id) ?? current))
      .catch((err) => setError(errorMessage(err, "No se pudo eliminar.")));
  }

  return (
    <section className="taller-screen">
      <header className="taller-screen-header">
        <h1>Stock</h1>
        <button type="button" className="button button-primary" onClick={() => setShowNew(true)}>
          + Nuevo
        </button>
      </header>

      {error && <p className="message message-error">{error}</p>}
      {items === null && !error && <p className="message">Cargando…</p>}

      {items && (
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Cantidad</th>
                <th>Precio unitario</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className={item.quantity <= LOW_STOCK_THRESHOLD ? "row-low-stock" : ""}>
                  <td>{item.name}</td>
                  <td>
                    {item.quantity} {item.unit}
                    {item.quantity <= LOW_STOCK_THRESHOLD && <span className="low-stock-tag">Poco stock</span>}
                  </td>
                  <td>{formatMoney(item.unitPrice)}</td>
                  <td className="table-actions">
                    <button type="button" className="button-link" onClick={() => setEditing(item)}>
                      Editar
                    </button>
                    <button type="button" className="button-link button-link--danger" onClick={() => handleDelete(item)}>
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr>
                  <td colSpan={4} className="table-empty">
                    Sin repuestos/materiales cargados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {(editing || showNew) && (
        <StockItemModal
          item={editing}
          onClose={() => {
            setEditing(null);
            setShowNew(false);
          }}
          onSaved={(saved) => {
            setItems((current) => {
              if (!current) return current;
              const exists = current.some((row) => row.id === saved.id);
              return exists ? current.map((row) => (row.id === saved.id ? saved : row)) : [...current, saved].sort((a, b) => a.name.localeCompare(b.name));
            });
            setEditing(null);
            setShowNew(false);
          }}
        />
      )}
    </section>
  );
}
