import { useEffect, useMemo, useState } from "react";
import { createQuote, fetchStock } from "../taller.client";
import { EMPRESA, EMPRESA_LOGO_URL, errorMessage, formatDate, formatMoney } from "../taller.shared";
import { LABOR_CATEGORY_LABELS, LABOR_PRESETS } from "../taller.types";
import type { TallerLaborCategory, TallerLaborItem, TallerQuote, TallerStockItem } from "../taller.types";

const CUSTOM_PRESET_VALUE = "__custom__";

type PartLine = { stockId: number; name: string; quantity: number; unitPrice: number; availableAfter: number };

export function PresupuestoScreen() {
  const [vehicleInfo, setVehicleInfo] = useState("");
  const [clientName, setClientName] = useState("");

  const [laborCategory, setLaborCategory] = useState<TallerLaborCategory>("chapa");
  const [laborPresetIndex, setLaborPresetIndex] = useState(0);
  const [laborDescription, setLaborDescription] = useState(LABOR_PRESETS.chapa[0].description);
  const [laborPrice, setLaborPrice] = useState(String(LABOR_PRESETS.chapa[0].price));
  const [laborItems, setLaborItems] = useState<TallerLaborItem[]>([]);

  const [stock, setStock] = useState<TallerStockItem[]>([]);
  const [selectedStockId, setSelectedStockId] = useState<string>("");
  const [partQuantity, setPartQuantity] = useState("1");
  const [parts, setParts] = useState<PartLine[]>([]);

  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [result, setResult] = useState<TallerQuote | null>(null);

  function loadStock() {
    fetchStock()
      .then(setStock)
      .catch((err) => setError(errorMessage(err, "No se pudo cargar el stock.")));
  }

  useEffect(() => {
    loadStock();
  }, []);

  const laborTotal = laborItems.reduce((sum, item) => sum + item.price, 0);
  const partsTotal = parts.reduce((sum, part) => sum + part.unitPrice * part.quantity, 0);
  const total = laborTotal + partsTotal;

  const stockUsed = useMemo(() => {
    const map = new Map<number, number>();
    parts.forEach((part) => map.set(part.stockId, (map.get(part.stockId) ?? 0) + part.quantity));
    return map;
  }, [parts]);

  function handleCategoryChange(category: TallerLaborCategory) {
    setLaborCategory(category);
    setLaborPresetIndex(0);
    setLaborDescription(LABOR_PRESETS[category][0].description);
    setLaborPrice(String(LABOR_PRESETS[category][0].price));
  }

  function handlePresetChange(value: string) {
    if (value === CUSTOM_PRESET_VALUE) {
      setLaborPresetIndex(-1);
      setLaborDescription("");
      setLaborPrice("");
      return;
    }
    const index = Number(value);
    const preset = LABOR_PRESETS[laborCategory][index];
    if (!preset) return;
    setLaborPresetIndex(index);
    setLaborDescription(preset.description);
    setLaborPrice(String(preset.price));
  }

  function handleAddLabor() {
    const price = Number(laborPrice);
    if (!laborDescription.trim() || !Number.isFinite(price) || price <= 0) return;
    setLaborItems((current) => [...current, { category: laborCategory, description: laborDescription.trim(), price }]);
    setLaborPresetIndex(0);
    setLaborDescription(LABOR_PRESETS[laborCategory][0].description);
    setLaborPrice(String(LABOR_PRESETS[laborCategory][0].price));
  }

  function handleRemoveLabor(index: number) {
    setLaborItems((current) => current.filter((_, i) => i !== index));
  }

  function handleAddPart() {
    const stockItem = stock.find((item) => item.id === Number(selectedStockId));
    const quantity = Number(partQuantity);
    if (!stockItem || !Number.isFinite(quantity) || quantity <= 0) return;

    const alreadyUsed = stockUsed.get(stockItem.id) ?? 0;
    const availableAfter = stockItem.quantity - alreadyUsed - quantity;
    if (availableAfter < 0) {
      setError(`No hay suficiente stock de "${stockItem.name}" (quedan ${stockItem.quantity - alreadyUsed}).`);
      return;
    }

    setError("");
    setParts((current) => [
      ...current,
      { stockId: stockItem.id, name: stockItem.name, quantity, unitPrice: stockItem.unitPrice, availableAfter }
    ]);
    setPartQuantity("1");
  }

  function handleRemovePart(index: number) {
    setParts((current) => current.filter((_, i) => i !== index));
  }

  function handleGenerate() {
    if (!vehicleInfo.trim() || (laborItems.length === 0 && parts.length === 0) || saving) return;
    setSaving(true);
    setError("");
    createQuote({
      vehicleInfo: vehicleInfo.trim(),
      clientName: clientName.trim() || undefined,
      laborItems,
      parts: parts.map((part) => ({ stockId: part.stockId, quantity: part.quantity }))
    })
      .then((quote) => {
        setResult(quote);
        loadStock();
      })
      .catch((err) => setError(errorMessage(err, "No se pudo generar el presupuesto.")))
      .finally(() => setSaving(false));
  }

  function handleNuevo() {
    setResult(null);
    setVehicleInfo("");
    setClientName("");
    setLaborItems([]);
    setParts([]);
    setError("");
  }

  if (result) {
    return (
      <section className="taller-screen">
        <article className="boleta">
          <header className="boleta-header">
            <div className="boleta-empresa">
              <img src={EMPRESA_LOGO_URL} alt="" />
              <div>
                <strong>{EMPRESA.name}</strong>
                <span>{EMPRESA.legend}</span>
                <span>Tel. {EMPRESA.phone}</span>
              </div>
            </div>
            <div className="boleta-numero">
              <strong>PRESUPUESTO</strong>
              <span>N.º {String(result.id).padStart(6, "0")}</span>
              <span>{formatDate(result.createdAt)}</span>
            </div>
          </header>

          <section className="boleta-cliente">
            <div>
              <span className="boleta-label">Vehículo</span>
              <strong>{result.vehicleInfo}</strong>
            </div>
            {result.clientName && (
              <div>
                <span className="boleta-label">Cliente</span>
                <span>{result.clientName}</span>
              </div>
            )}
          </section>

          <table className="boleta-tabla">
            <thead>
              <tr>
                <th className="num">Cant.</th>
                <th>Descripción</th>
                <th className="num">P. unit.</th>
                <th className="num">Importe</th>
              </tr>
            </thead>
            <tbody>
              {result.laborItems.map((item, index) => (
                <tr key={`labor-${index}`}>
                  <td className="num">1</td>
                  <td>
                    <span className="quote-receipt__badge">{LABOR_CATEGORY_LABELS[item.category]}</span> {item.description}
                  </td>
                  <td className="num">{formatMoney(item.price)}</td>
                  <td className="num">{formatMoney(item.price)}</td>
                </tr>
              ))}
              {result.parts.map((part, index) => (
                <tr key={`part-${index}`}>
                  <td className="num">{part.quantity}</td>
                  <td>{part.name}</td>
                  <td className="num">{formatMoney(part.unitPrice)}</td>
                  <td className="num">{formatMoney(part.unitPrice * part.quantity)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <footer className="boleta-pie">
            <p className="boleta-nota">Presupuesto sin validez fiscal · Precios sujetos a confirmación</p>
            <dl className="boleta-totales">
              <div className="boleta-total">
                <dt>TOTAL</dt>
                <dd>{formatMoney(result.total)}</dd>
              </div>
            </dl>
          </footer>
        </article>

        <button type="button" className="button button-primary button-block" onClick={handleNuevo}>
          Nuevo presupuesto
        </button>
      </section>
    );
  }

  return (
    <section className="taller-screen">
      <h1>Nuevo presupuesto</h1>
      {error && <p className="message message-error">{error}</p>}

      <div className="field-row">
        <label className="field">
          <span>Vehículo</span>
          <input value={vehicleInfo} onChange={(event) => setVehicleInfo(event.target.value)} placeholder="Fiat Cronos - ABC1234" maxLength={160} />
        </label>
        <label className="field">
          <span>Cliente (opcional)</span>
          <input value={clientName} onChange={(event) => setClientName(event.target.value)} maxLength={120} />
        </label>
      </div>

      <h2 className="section-title">Mano de obra</h2>
      <div className="add-row">
        <select value={laborCategory} onChange={(event) => handleCategoryChange(event.target.value as TallerLaborCategory)}>
          <option value="chapa">Chapa</option>
          <option value="pintura">Pintura</option>
          <option value="mecanica">Mecánica</option>
          <option value="electricidad">Electricidad</option>
          <option value="tapiceria">Tapicería</option>
          <option value="otro">Otro</option>
        </select>
        <select
          className="add-row__description"
          value={laborPresetIndex === -1 ? CUSTOM_PRESET_VALUE : String(laborPresetIndex)}
          onChange={(event) => handlePresetChange(event.target.value)}
        >
          {LABOR_PRESETS[laborCategory].map((preset, index) => (
            <option key={preset.description} value={index}>
              {preset.description} — {formatMoney(preset.price)}
            </option>
          ))}
          <option value={CUSTOM_PRESET_VALUE}>Personalizado…</option>
        </select>
        {laborPresetIndex === -1 && (
          <input
            className="add-row__description"
            placeholder="Descripción (ej. puerta izquierda)"
            value={laborDescription}
            onChange={(event) => setLaborDescription(event.target.value)}
            maxLength={160}
          />
        )}
        <input
          className="add-row__price"
          placeholder="$"
          value={laborPrice}
          onChange={(event) => setLaborPrice(event.target.value.replace(/[^\d.]/g, ""))}
          inputMode="decimal"
        />
        <button type="button" className="button button-secondary" onClick={handleAddLabor}>
          Agregar
        </button>
      </div>

      {laborItems.length > 0 && (
        <ul className="quote-line-list">
          {laborItems.map((item, index) => (
            <li key={index}>
              <span>
                <span className="quote-receipt__badge">{LABOR_CATEGORY_LABELS[item.category]}</span> {item.description}
              </span>
              <strong>{formatMoney(item.price)}</strong>
              <button type="button" className="button-link button-link--danger" onClick={() => handleRemoveLabor(index)}>
                Quitar
              </button>
            </li>
          ))}
        </ul>
      )}

      <h2 className="section-title">Repuestos / materiales (de stock)</h2>
      <div className="add-row">
        <select value={selectedStockId} onChange={(event) => setSelectedStockId(event.target.value)}>
          <option value="">Elegir del stock…</option>
          {stock.map((item) => {
            const used = stockUsed.get(item.id) ?? 0;
            return (
              <option key={item.id} value={item.id} disabled={item.quantity - used <= 0}>
                {item.name} — {formatMoney(item.unitPrice)} ({item.quantity - used} disponibles)
              </option>
            );
          })}
        </select>
        <input
          className="add-row__price"
          placeholder="Cant."
          value={partQuantity}
          onChange={(event) => setPartQuantity(event.target.value.replace(/[^\d.]/g, ""))}
          inputMode="decimal"
        />
        <button type="button" className="button button-secondary" onClick={handleAddPart}>
          Agregar
        </button>
      </div>

      {parts.length > 0 && (
        <ul className="quote-line-list">
          {parts.map((part, index) => (
            <li key={index}>
              <span>
                {part.quantity}× {part.name}
              </span>
              <strong>{formatMoney(part.unitPrice * part.quantity)}</strong>
              <button type="button" className="button-link button-link--danger" onClick={() => handleRemovePart(index)}>
                Quitar
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="taller-bottom-bar">
        <div>
          <span className="message">Total</span>
          <strong className="taller-bottom-bar__total">{formatMoney(total)}</strong>
        </div>
        <button
          type="button"
          className="button button-primary"
          onClick={handleGenerate}
          disabled={saving || !vehicleInfo.trim() || (laborItems.length === 0 && parts.length === 0)}
        >
          {saving ? "Generando…" : "Generar presupuesto"}
        </button>
      </div>
    </section>
  );
}
