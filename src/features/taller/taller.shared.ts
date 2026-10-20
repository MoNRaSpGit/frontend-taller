export function errorMessage(err: unknown, fallback: string) {
  return err instanceof Error ? err.message : fallback;
}

export function formatMoney(amount: number) {
  return `$${amount.toLocaleString("es-UY")}`;
}
