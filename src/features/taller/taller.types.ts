export type TallerLaborCategory = "chapa" | "pintura" | "otro";

export type TallerLaborItem = {
  category: TallerLaborCategory;
  description: string;
  price: number;
};

export type TallerStockItem = {
  id: number;
  name: string;
  quantity: number;
  unitPrice: number;
  unit: string;
};

export type TallerQuotePart = {
  stockId: number;
  name: string;
  quantity: number;
  unitPrice: number;
};

export type TallerQuote = {
  id: number;
  vehicleInfo: string;
  clientName: string | null;
  laborItems: TallerLaborItem[];
  parts: TallerQuotePart[];
  total: number;
  createdAt: string;
};

export const LABOR_CATEGORY_LABELS: Record<TallerLaborCategory, string> = {
  chapa: "Chapa",
  pintura: "Pintura",
  otro: "Otro"
};

export type TallerLaborPreset = { description: string; price: number };

// Tareas tipicas con precio ya puesto (inventado, 21/10/2026, pedido
// explicito: "pone como ya predeterminado el precio... pone vos,
// inventalo vos" -- el presupuesto es ficticio, estos valores se ajustan
// despues con el cliente real). Elegir una tarea autocompleta
// descripcion + precio, pero se puede seguir editando igual.
export const LABOR_PRESETS: Record<TallerLaborCategory, TallerLaborPreset[]> = {
  chapa: [
    { description: "Enderezado de puerta", price: 2500 },
    { description: "Enderezado de guardabarros", price: 2200 },
    { description: "Enderezado de capot", price: 3200 },
    { description: "Enderezado de paragolpe", price: 2800 },
    { description: "Enderezado de techo", price: 4500 },
    { description: "Enderezado de lateral / zócalo", price: 3000 }
  ],
  pintura: [
    { description: "Pintura de puerta", price: 1800 },
    { description: "Pintura de guardabarros", price: 1600 },
    { description: "Pintura de capot", price: 2200 },
    { description: "Pintura de paragolpe", price: 1500 },
    { description: "Pintura de techo", price: 3000 },
    { description: "Pintura general (auto completo)", price: 18000 }
  ],
  otro: [
    { description: "Pulido y lustrado", price: 1200 },
    { description: "Enderezado de chasis", price: 5500 },
    { description: "Cambio de parabrisas", price: 4000 },
    { description: "Desarmado y armado", price: 1000 }
  ]
};
