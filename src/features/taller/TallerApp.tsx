import { useState } from "react";
import { PresupuestoScreen } from "./screens/PresupuestoScreen";
import { StockScreen } from "./screens/StockScreen";

type Tab = "presupuesto" | "stock";

export function TallerApp() {
  const [tab, setTab] = useState<Tab>("presupuesto");

  return (
    <div className="app">
      <header className="app-bar">
        <strong>Taller — Chapa y Pintura</strong>
        <nav className="app-tabs">
          <button type="button" className={tab === "presupuesto" ? "is-active" : ""} onClick={() => setTab("presupuesto")}>
            Presupuesto
          </button>
          <button type="button" className={tab === "stock" ? "is-active" : ""} onClick={() => setTab("stock")}>
            Stock
          </button>
        </nav>
      </header>

      <main className="app-main">{tab === "presupuesto" ? <PresupuestoScreen /> : <StockScreen />}</main>
    </div>
  );
}
