import { useState } from "react";
import { recordEntrada } from "../taller.client";

interface Props {
  onEntrar: () => void;
}

// Sin usuario ni contraseña (pedido explicito, 21/10/2026: "que solo diga
// entrar nada mas, es para ver cuando entro alguien") -- un boton solo
// para dejar constancia de quien abre la app y cuando. Se consulta con
// backend/scripts/inspect-taller-access.js, no hay pantalla para verlo
// adentro de la app.
export function EntrarScreen({ onEntrar }: Props) {
  const [loading, setLoading] = useState(false);

  function handleEntrar() {
    if (loading) return;
    setLoading(true);
    recordEntrada()
      .catch(() => {
        // Si falla el registro, igual se deja entrar: no es un bloqueo real.
      })
      .finally(() => {
        setLoading(false);
        onEntrar();
      });
  }

  return (
    <div className="entrar-screen">
      <div className="entrar-card">
        <strong>Taller — Chapa y Pintura</strong>
        <button type="button" className="button button-primary button-block" onClick={handleEntrar} disabled={loading}>
          {loading ? "Entrando…" : "Entrar"}
        </button>
      </div>
    </div>
  );
}
