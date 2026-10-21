import { useEffect, useMemo, useState } from "react";
import { createQuote, fetchStock } from "../taller.client";
import { errorMessage, formatDate, formatMoney } from "../taller.shared";
import { LABOR_CATEGORY_LABELS, LABOR_PRESETS } from "../taller.types";
import type { TallerLaborCategory, TallerLaborItem, TallerQuote, TallerStockItem } from "../taller.types";

const CUSTOM_PRESET_VALUE = "__custom__";

type PartLine = { stockId: number; name: string; quantity: number; unitPrice: number; availableAfter: number };

// Logo generico para la boleta (pedido explicito, 21/10/2026: "ponle un
// logo tmb cualquiera y luego lo cambiamos") -- mismo auto + chorro de
// pintura del icono PWA (public/logo.svg), redibujado sin el fondo para
// que combine con el papel blanco del recibo.
function TallerLogoMark() {
  return (
    <svg className="quote-receipt__logo" viewBox="0 0 128 128" aria-hidden="true">
      <path
        d="M22 84 C22 72 28 66 38 64 L46 50 C49 45 54 42 60 42 L78 42 C85 42 91 46 94 53 L98 64 C106 66 110 72 110 82 V86 C110 90 107 93 103 93 H97 C96 97 92 100 88 100 C84 100 80 97 79 93 H51 C50 97 46 100 42 100 C38 100 34 97 33 93 H27 C24 93 22 90 22 86 Z"
        fill="#1e293b"
      />
      <circle cx="42" cy="93" r="7" fill="#fff" />
      <circle cx="88" cy="93" r="7" fill="#fff" />
      <path
        d="M80 18 C80 18 86 28 86 34 C86 38.4 83.1 42 79.5 42 C75.9 42 73 38.4 73 34 C73 28 80 18 80 18 Z"
        fill="#ea580c"
      />
      <circle cx="92" cy="26" r="4" fill="#ea580c" />
    </svg>
  );
}

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
        <div className="quote-receipt">
          <header className="quote-receipt__brand">
            <TallerLogoMark />
            <div>
              <strong className="quote-receipt__brand-name">Taller Chapa y Pintura</strong>
              <span className="quote-receipt__brand-tagline">Reparación y pintura automotriz</span>
            </div>
          </header>

          <div className="quote-receipt__meta">
            <span>
              Presupuesto <strong>N° {String(result.id).padStart(6, "0")}</strong>
            </span>
            <span>{formatDate(result.createdAt)}</span>
          </div>

          <div className="quote-receipt__info">
            <span>
              <span className="quote-receipt__info-label">Vehículo</span>
              {result.vehicleInfo}
            </span>
            {result.clientName && (
              <span>
                <span className="quote-receipt__info-label">Cliente</span>
                {result.clientName}
              </span>
            )}
          </div>

          {result.laborItems.length > 0 && (
            <>
              <h2 className="quote-receipt__section">Mano de obra</h2>
              <ul className="quote-receipt__list">
                {result.laborItems.map((item, index) => (
                  <li key={index}>
                    <span>
                      <span className="quote-receipt__badge">{LABOR_CATEGORY_LABELS[item.category]}</span> {item.description}
                    </span>
                    <strong>{formatMoney(item.price)}</strong>
                  </li>
                ))}
              </ul>
            </>
          )}

          {result.parts.length > 0 && (
            <>
              <h2 className="quote-receipt__section">Repuestos / materiales</h2>
              <ul className="quote-receipt__list">
                {result.parts.map((part, index) => (
                  <li key={index}>
                    <span>
                      {part.quantity}× {part.name}
                    </span>
                    <strong>{formatMoney(part.unitPrice * part.quantity)}</strong>
                  </li>
                ))}
              </ul>
            </>
          )}

          <div className="quote-receipt__total">
            <span>Total</span>
            <strong>{formatMoney(result.total)}</strong>
          </div>

          <p className="quote-receipt__footer">Presupuesto sin validez fiscal · Precios sujetos a confirmación</p>
        </div>

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
