import { useState } from "react";
import { EntrarScreen } from "./components/EntrarScreen";
import { PresupuestoScreen } from "./screens/PresupuestoScreen";
import { StockScreen } from "./screens/StockScreen";

type Tab = "presupuesto" | "stock";

const ENTERED_STORAGE_KEY = "taller-entered";

function loadEntered() {
  if (typeof window === "undefined") return false;
  try {
    return window.sessionStorage.getItem(ENTERED_STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

export function TallerApp() {
  const [tab, setTab] = useState<Tab>("presupuesto");
  const [entered, setEntered] = useState(loadEntered);

  if (!entered) {
    return (
      <EntrarScreen
        onEntrar={() => {
          try {
            window.sessionStorage.setItem(ENTERED_STORAGE_KEY, "1");
          } catch {
            // ignore
          }
          setEntered(true);
        }}
      />
    );
  }

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
