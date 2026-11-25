import { API_BASE_URL } from "../../shared/config/api";

// Por ahora la app es una maqueta con datos de ejemplo (taller.mock.ts).
// Lo unico que habla con el backend es el registro de visitas de "Entrar".
export async function recordEntrada() {
  const response = await fetch(`${API_BASE_URL}/api/v1/taller/entrada`, { method: "POST" });
  if (!response.ok) throw new Error("No se pudo registrar la entrada.");
}
