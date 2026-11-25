export type Etapa = "recepcion" | "peritaje" | "autorizacion" | "repuestos" | "reparacion" | "pintura" | "listo";

export const ETAPAS: { key: Etapa; label: string; short: string }[] = [
  { key: "recepcion", label: "Recepción", short: "Recepción" },
  { key: "peritaje", label: "Peritaje", short: "Peritaje" },
  { key: "autorizacion", label: "Autorización", short: "Autoriz." },
  { key: "repuestos", label: "Repuestos", short: "Repuestos" },
  { key: "reparacion", label: "Chapa", short: "Chapa" },
  { key: "pintura", label: "Pintura", short: "Pintura" },
  { key: "listo", label: "Listo para entregar", short: "Listo" }
];

export type Canal = "mail" | "whatsapp" | "taller" | "aseguradora";

export interface Evento {
  id: string;
  fecha: string; // ISO
  canal: Canal;
  titulo: string;
  detalle?: string;
}

export type EstadoMaterial = "pendiente" | "pedido" | "en_camino" | "llego";

export interface Material {
  id: string;
  siniestroId: string;
  nombre: string;
  proveedor: string;
  cantidad: number;
  estado: EstadoMaterial;
  eta?: string; // ISO
}

export interface Siniestro {
  id: string;
  clienteId: string;
  numero: string;
  poliza: string;
  monto: string; // monto autorizado
  perito: string;
  deducible: string;
  aseguradora: string;
  tipo: string;
  vehiculo: string;
  patente: string;
  etapa: Etapa;
  ingreso: string; // ISO
  entregaEstimada: string; // ISO
  resumen: string; // lo que escribe el agente de IA
  proximoPaso: string;
  alerta?: string;
  eventos: Evento[];
}

export interface Cliente {
  id: string;
  nombre: string;
  telefono: string;
}

export interface Correo {
  id: string;
  siniestroId?: string;
  de: string;
  asunto: string;
  fecha: string; // ISO
  resumenIA: string;
  accion?: string;
  leido: boolean;
}
