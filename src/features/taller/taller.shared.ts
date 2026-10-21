export function errorMessage(err: unknown, fallback: string) {
  return err instanceof Error ? err.message : fallback;
}

export function formatMoney(amount: number) {
  return `$${amount.toLocaleString("es-UY")}`;
}

export function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("es-UY", { day: "2-digit", month: "2-digit", year: "numeric" });
}
