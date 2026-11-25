import { useState } from "react";
import { EntrarScreen } from "./components/EntrarScreen";
import { ClientesScreen } from "./screens/ClientesScreen";
import { CorreosScreen } from "./screens/CorreosScreen";
import { MaterialesScreen } from "./screens/MaterialesScreen";
import { PanelScreen } from "./screens/PanelScreen";
import { SINIESTROS } from "./taller.mock";
import type { Siniestro } from "./taller.types";

type Tab = "panel" | "clientes" | "materiales" | "correos";

const TABS: { key: Tab; label: string; icon: string }[] = [
  { key: "clientes", label: "Clientes", icon: "☺" },
  { key: "panel", label: "Panel", icon: "▦" },
  { key: "materiales", label: "Materiales", icon: "▤" },
  { key: "correos", label: "Correos", icon: "✉" }
];

const ENTERED_STORAGE_KEY = "taller-entered";

function loadEntered() {
  try {
    return window.sessionStorage.getItem(ENTERED_STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

export function TallerApp() {
  const [tab, setTab] = useState<Tab>("clientes");
  const [clienteId, setClienteId] = useState<string | null>(() =>
    typeof window !== "undefined" && window.innerWidth > 760 ? SINIESTROS[0].clienteId : null
  );
  const [siniestroId, setSiniestroId] = useState<string | null>(null);
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

  function openSiniestro(siniestro: Siniestro) {
    setClienteId(siniestro.clienteId);
    setSiniestroId(siniestro.id);
    setTab("clientes");
  }

  function openSiniestroById(id: string) {
    const siniestro = SINIESTROS.find((item) => item.id === id);
    if (siniestro) openSiniestro(siniestro);
  }

  return (
    <div className="shell">
      <aside className="sidebar">
        <div className="brand">
          <img src={`${import.meta.env.BASE_URL}logo.svg`} alt="" />
          <span>Taller</span>
        </div>
        <nav>
          {TABS.map((item) => (
            <button type="button" key={item.key} className={tab === item.key ? "is-active" : ""} onClick={() => setTab(item.key)}>
              <span className="nav-icon">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
        <p className="sidebar-note">Vista de ejemplo con datos ficticios</p>
      </aside>

      <main className="content">
        {tab === "panel" && <PanelScreen onOpen={openSiniestro} />}
        {tab === "clientes" && (
          <ClientesScreen
            selectedId={clienteId}
            selectedSiniestroId={siniestroId}
            onSelect={(id, sid) => {
              setClienteId(id);
              setSiniestroId(sid ?? null);
            }}
          />
        )}
        {tab === "materiales" && <MaterialesScreen onOpenSiniestro={openSiniestroById} />}
        {tab === "correos" && <CorreosScreen onOpenSiniestro={openSiniestroById} />}
      </main>
    </div>
  );
}
