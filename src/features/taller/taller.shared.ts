// Datos del taller que salen en el encabezado de la boleta (ficticios por
// ahora, pedido explicito 21/10/2026: "ponle un logo cualquiera, despues
// lo cambiamos"). El logo es public/logo.svg -- mismo archivo que usa el
// icono de la PWA.
export const EMPRESA_LOGO_URL = `${import.meta.env.BASE_URL}logo.svg`;

export const EMPRESA = {
  name: "Taller Chapa y Pintura",
  legend: "Presupuestos y reparaciones",
  phone: "099 000 000"
};

export function errorMessage(err: unknown, fallback: string) {
  return err instanceof Error ? err.message : fallback;
}

export function formatMoney(amount: number) {
  return `$${amount.toLocaleString("es-UY")}`;
}

export function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("es-UY", { day: "2-digit", month: "2-digit", year: "numeric" });
}
