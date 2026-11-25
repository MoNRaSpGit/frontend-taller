import { ETAPAS, type Canal, type Cliente, type EstadoMaterial, type Etapa } from "./taller.types";

export function etapaLabel(etapa: Etapa) {
  return ETAPAS.find((item) => item.key === etapa)?.label ?? etapa;
}

export function etapaIndex(etapa: Etapa) {
  return ETAPAS.findIndex((item) => item.key === etapa);
}

export function iniciales(nombre: string) {
  return nombre
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");
}

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
}

export function diasDesde(iso: string) {
  return Math.round((startOfDay(new Date()) - startOfDay(new Date(iso))) / 86_400_000);
}

export function fechaCorta(iso: string) {
  return new Date(iso).toLocaleDateString("es-UY", { day: "numeric", month: "short" });
}

export function fechaRelativa(iso: string) {
  const dias = diasDesde(iso);
  const hora = new Date(iso).toLocaleTimeString("es-UY", { hour: "2-digit", minute: "2-digit" });
  if (dias === 0) return `Hoy ${hora}`;
  if (dias === 1) return `Ayer ${hora}`;
  if (dias === -1) return `Mañana`;
  if (dias < 0) return `En ${-dias} días`;
  if (dias < 7) return `Hace ${dias} días`;
  return fechaCorta(iso);
}

export function entregaTexto(iso: string) {
  const dias = -diasDesde(iso);
  if (dias === 0) return "Hoy";
  if (dias === 1) return "Mañana";
  if (dias > 1) return `En ${dias} días (${fechaCorta(iso)})`;
  return `Hace ${-dias} días`;
}

export const CANAL_LABEL: Record<Canal, string> = {
  mail: "Correo",
  whatsapp: "WhatsApp",
  taller: "Taller",
  aseguradora: "Aseguradora"
};

export const MATERIAL_LABEL: Record<EstadoMaterial, string> = {
  pendiente: "Por pedir",
  pedido: "Pedido",
  en_camino: "En camino",
  llego: "Llegó"
};

export function whatsappLink(cliente: Cliente) {
  const digits = cliente.telefono.replace(/\D/g, "").replace(/^0/, "");
  return `https://wa.me/598${digits}`;
}
