import { API_BASE_URL } from "../../shared/config/api";
import type { TallerLaborItem, TallerQuote, TallerStockItem } from "./taller.types";

function buildUrl(path: string) {
  return `${API_BASE_URL}/api/v1/taller${path}`;
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(buildUrl(path), {
    ...init,
    headers: {
      ...(init?.body ? { "Content-Type": "application/json" } : {}),
      ...init?.headers
    }
  });

  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new Error(body?.message || "No se pudo completar la operación.");
  }
  return response.json() as Promise<T>;
}

export function fetchStock() {
  return request<TallerStockItem[]>("/stock");
}

export function createStockItem(input: { name: string; quantity: number; unitPrice: number; unit?: string }) {
  return request<TallerStockItem>("/stock", { method: "POST", body: JSON.stringify(input) });
}

export function updateStockItem(id: number, input: Partial<{ name: string; quantity: number; unitPrice: number; unit: string }>) {
  return request<TallerStockItem>(`/stock/${id}`, { method: "PATCH", body: JSON.stringify(input) });
}

export function deleteStockItem(id: number) {
  return request<void>(`/stock/${id}`, { method: "DELETE" });
}

export function fetchQuotes() {
  return request<TallerQuote[]>("/quotes");
}

export function createQuote(input: {
  vehicleInfo: string;
  clientName?: string;
  laborItems: TallerLaborItem[];
  parts: Array<{ stockId: number; quantity: number }>;
}) {
  return request<TallerQuote>("/quotes", { method: "POST", body: JSON.stringify(input) });
}
