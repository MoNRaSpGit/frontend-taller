import { useState, type FormEvent } from "react";
import { createStockItem, updateStockItem } from "../taller.client";
import { errorMessage } from "../taller.shared";
import type { TallerStockItem } from "../taller.types";

export function StockItemModal({
  item,
  onClose,
  onSaved
}: {
  item: TallerStockItem | null;
  onClose: () => void;
  onSaved: (item: TallerStockItem) => void;
}) {
  const [name, setName] = useState(item?.name ?? "");
  const [quantity, setQuantity] = useState(item ? String(item.quantity) : "");
  const [unitPrice, setUnitPrice] = useState(item ? String(item.unitPrice) : "");
  const [unit, setUnit] = useState(item?.unit ?? "unidad");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (name.trim().length < 2) {
      setError("Ingresá el nombre del repuesto/material.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const saved = item
        ? await updateStockItem(item.id, { name: name.trim(), quantity: Number(quantity) || 0, unitPrice: Number(unitPrice) || 0, unit })
        : await createStockItem({ name: name.trim(), quantity: Number(quantity) || 0, unitPrice: Number(unitPrice) || 0, unit });
      onSaved(saved);
    } catch (err) {
      setError(errorMessage(err, "No se pudo guardar."));
      setSaving(false);
    }
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <form className="modal" onClick={(event) => event.stopPropagation()} onSubmit={handleSubmit}>
        <h2>{item ? "Editar repuesto/material" : "Nuevo repuesto/material"}</h2>

        <label className="field">
          <span>Nombre</span>
          <input value={name} onChange={(event) => setName(event.target.value)} maxLength={120} autoFocus />
        </label>
        <div className="field-row">
          <label className="field">
            <span>Cantidad</span>
            <input value={quantity} onChange={(event) => setQuantity(event.target.value.replace(/[^\d.]/g, ""))} inputMode="decimal" />
          </label>
          <label className="field">
            <span>Precio unitario</span>
            <input value={unitPrice} onChange={(event) => setUnitPrice(event.target.value.replace(/[^\d.]/g, ""))} inputMode="decimal" />
          </label>
        </div>
        <label className="field">
          <span>Unidad</span>
          <input value={unit} onChange={(event) => setUnit(event.target.value)} maxLength={30} placeholder="unidad, litro, kg…" />
        </label>

        {error && <p className="message message-error">{error}</p>}

        <div className="modal-actions">
          <button type="button" className="button button-secondary" onClick={onClose} disabled={saving}>
            Cancelar
          </button>
          <button type="submit" className="button button-primary" disabled={saving}>
            {saving ? "Guardando…" : "Guardar"}
          </button>
        </div>
      </form>
    </div>
  );
}
