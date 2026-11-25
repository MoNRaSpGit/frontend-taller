import type { Cliente, Correo, Material, Siniestro } from "./taller.types";

// Datos de EJEMPLO para mostrarle la maqueta al cliente. Cuando conectemos el
// agente de IA, esto se reemplaza por lo que el agente lea de mails y WhatsApp.
function d(daysFromToday: number, hour = 10, minute = 0) {
  const date = new Date();
  date.setDate(date.getDate() + daysFromToday);
  date.setHours(hour, minute, 0, 0);
  return date.toISOString();
}

export const CLIENTES: Cliente[] = [
  { id: "c1", nombre: "Juan Pérez", telefono: "099 123 456" },
  { id: "c2", nombre: "María Rodríguez", telefono: "098 765 432" },
  { id: "c3", nombre: "Carlos Fernández", telefono: "094 222 333" },
  { id: "c4", nombre: "Lucía Techera", telefono: "091 555 010" },
  { id: "c5", nombre: "Gonzalo Acosta", telefono: "099 808 707" },
  { id: "c6", nombre: "Patricia Silva", telefono: "092 333 444" },
  { id: "c7", nombre: "Diego Martínez", telefono: "099 411 220" },
  { id: "c8", nombre: "Valentina Cabrera", telefono: "098 120 330" },
  { id: "c9", nombre: "Santiago Núñez", telefono: "094 700 815" },
  { id: "c10", nombre: "Florencia Ramos", telefono: "091 280 094" },
  { id: "c11", nombre: "Matías Olivera", telefono: "099 655 301" },
  { id: "c12", nombre: "Andrea Bentancor", telefono: "092 908 177" },
  { id: "c13", nombre: "Rodrigo Sosa", telefono: "098 344 562" },
  { id: "c14", nombre: "Camila Ferreira", telefono: "094 018 266" }
];

export const SINIESTROS: Siniestro[] = [
  {
    id: "s1",
    clienteId: "c1",
    numero: "BSE-2026-48213",
    poliza: "POL-5521904",
    monto: "$48.300",
    perito: "Ing. Rivero",
    deducible: "$4.800",
    aseguradora: "BSE",
    tipo: "Choque frontal",
    vehiculo: "Volkswagen Gol Trend 2019",
    patente: "SBC 4821",
    etapa: "repuestos",
    ingreso: d(-9),
    entregaEstimada: d(8),
    resumen:
      "El perito del BSE aprobó el presupuesto el lunes. Falta que llegue el paragolpes delantero y el faro derecho (el proveedor confirmó envío para mañana). El cliente preguntó dos veces por el auto y está tranquilo con el plazo.",
    proximoPaso: "Avisar a Juan cuando llegue el paragolpes y arrancar la chapa.",
    alerta: "Paragolpes con 1 día de demora",
    eventos: [
      { id: "e1", fecha: d(0, 9, 12), canal: "mail", titulo: "Proveedor confirmó envío", detalle: "Repuestos Del Sur: paragolpes y faro salen mañana a primera hora." },
      { id: "e2", fecha: d(-1, 16, 40), canal: "whatsapp", titulo: "Juan preguntó por su auto", detalle: "Consulta cuándo estaría listo. El agente respondió el plazo estimado." },
      { id: "e3", fecha: d(-3, 11, 5), canal: "aseguradora", titulo: "BSE aprobó el presupuesto", detalle: "Autorización por $48.300. Se pidieron los repuestos ese mismo día." },
      { id: "e4", fecha: d(-5, 15, 30), canal: "taller", titulo: "Peritaje realizado", detalle: "El perito revisó el daño en el taller y pidió fotos adicionales del radiador." },
      { id: "e5", fecha: d(-9, 9, 0), canal: "taller", titulo: "Ingresó al taller", detalle: "Recibido con daño en frente, capot y paragolpes." }
    ]
  },
  {
    id: "s2",
    clienteId: "c2",
    numero: "SUR-884120",
    poliza: "POL-7733120",
    monto: "$31.900",
    perito: "Cr. Méndez",
    deducible: "$3.200",
    aseguradora: "Sura",
    tipo: "Golpe lateral",
    vehiculo: "Chevrolet Onix 2021",
    patente: "SCD 1190",
    etapa: "pintura",
    ingreso: d(-14),
    entregaEstimada: d(2),
    resumen:
      "Chapa terminada el jueves. Hoy entró a cabina de pintura la puerta trasera y el guardabarros. La pintura base ya está preparada. Si no hay imprevistos queda lista pasado mañana.",
    proximoPaso: "Pulido y control de color el miércoles.",
    eventos: [
      { id: "e1", fecha: d(0, 8, 30), canal: "taller", titulo: "Entró a cabina de pintura" },
      { id: "e2", fecha: d(-2, 17, 0), canal: "taller", titulo: "Chapa terminada", detalle: "Puerta trasera y guardabarros enderezados y masillados." },
      { id: "e3", fecha: d(-6, 10, 20), canal: "mail", titulo: "Sura autorizó la reparación", detalle: "Monto aprobado $31.900." },
      { id: "e4", fecha: d(-14, 9, 40), canal: "taller", titulo: "Ingresó al taller" }
    ]
  },
  {
    id: "s3",
    clienteId: "c3",
    numero: "MAP-70934",
    poliza: "POL-4410028",
    monto: "$72.500",
    perito: "Ing. Olivera",
    deducible: "$7.000",
    aseguradora: "Mapfre",
    tipo: "Granizo",
    vehiculo: "Renault Duster 2018",
    patente: "SAB 7732",
    etapa: "autorizacion",
    ingreso: d(-4),
    entregaEstimada: d(18),
    resumen:
      "Daño por granizo en techo, capot y baúl. El presupuesto está enviado a Mapfre desde hace 3 días y todavía no contestan. Carlos pregunta seguido.",
    proximoPaso: "Insistir con Mapfre: el agente ya mandó un recordatorio, conviene llamar.",
    alerta: "Mapfre sin responder hace 3 días",
    eventos: [
      { id: "e1", fecha: d(0, 9, 0), canal: "mail", titulo: "Recordatorio enviado a Mapfre", detalle: "Segundo mail pidiendo la autorización del presupuesto." },
      { id: "e2", fecha: d(-1, 12, 15), canal: "whatsapp", titulo: "Carlos pidió novedades", detalle: "Se le explicó que se espera la autorización de la aseguradora." },
      { id: "e3", fecha: d(-3, 14, 0), canal: "mail", titulo: "Presupuesto enviado a Mapfre", detalle: "Techo, capot y baúl. Total $72.500." },
      { id: "e4", fecha: d(-4, 10, 30), canal: "taller", titulo: "Ingresó al taller" }
    ]
  },
  {
    id: "s4",
    clienteId: "c4",
    numero: "POR-33291",
    poliza: "POL-9902317",
    monto: "$26.400",
    perito: "Cr. Duarte",
    deducible: "$2.600",
    aseguradora: "Porto Seguro",
    tipo: "Choque trasero",
    vehiculo: "Fiat Cronos 2022",
    patente: "SEF 3345",
    etapa: "listo",
    ingreso: d(-18),
    entregaEstimada: d(0),
    resumen: "Reparación terminada y revisada. Lucía fue avisada ayer y quedó en pasar hoy a la tarde a retirarlo.",
    proximoPaso: "Entregar hoy a la tarde y cerrar el siniestro con Porto Seguro.",
    eventos: [
      { id: "e1", fecha: d(-1, 18, 10), canal: "whatsapp", titulo: "Se avisó que el auto está listo", detalle: "Lucía confirmó que pasa hoy a la tarde." },
      { id: "e2", fecha: d(-1, 16, 0), canal: "taller", titulo: "Control de calidad aprobado" },
      { id: "e3", fecha: d(-18, 9, 15), canal: "taller", titulo: "Ingresó al taller" }
    ]
  },
  {
    id: "s5",
    clienteId: "c5",
    numero: "BSE-2026-48790",
    poliza: "POL-5530871",
    monto: "$38.200",
    perito: "Ing. Rivero",
    deducible: "$3.800",
    aseguradora: "BSE",
    tipo: "Rotura de parabrisas y puerta",
    vehiculo: "Toyota Hilux 2020",
    patente: "SFG 9021",
    etapa: "peritaje",
    ingreso: d(-1),
    entregaEstimada: d(12),
    resumen: "Ingresó ayer. El perito del BSE viene mañana a las 10:00 a revisarlo. Ya se tomaron las fotos y se armó el presupuesto preliminar.",
    proximoPaso: "Perito el miércoles 10:00. Tener el presupuesto impreso.",
    eventos: [
      { id: "e1", fecha: d(0, 8, 45), canal: "aseguradora", titulo: "BSE coordinó el peritaje", detalle: "Perito asignado: mañana 10:00 en el taller." },
      { id: "e2", fecha: d(-1, 15, 20), canal: "taller", titulo: "Ingresó al taller", detalle: "Fotos y datos cargados." }
    ]
  },
  {
    id: "s6",
    clienteId: "c6",
    numero: "SUR-885003",
    poliza: "POL-7740455",
    monto: "$22.100",
    perito: "Cr. Méndez",
    deducible: "$2.200",
    aseguradora: "Sura",
    tipo: "Daño en costado",
    vehiculo: "Ford Ka 2017",
    patente: "SCA 6610",
    etapa: "reparacion",
    ingreso: d(-7),
    entregaEstimada: d(5),
    resumen: "Se está enderezando la puerta delantera izquierda y el zócalo. Ya llegó todo el material, sin pendientes con proveedores.",
    proximoPaso: "Terminar chapa y pasar a pintura el jueves.",
    eventos: [
      { id: "e1", fecha: d(-2, 9, 30), canal: "taller", titulo: "Empezó la chapa" },
      { id: "e2", fecha: d(-3, 13, 0), canal: "mail", titulo: "Llegaron los repuestos", detalle: "Puerta y moldura entregadas por el proveedor." },
      { id: "e3", fecha: d(-7, 11, 0), canal: "taller", titulo: "Ingresó al taller" }
    ]
  },
  {
    id: "s7",
    clienteId: "c2",
    numero: "SUR-870122",
    poliza: "POL-7733120",
    monto: "$9.800",
    perito: "—",
    deducible: "$1.000",
    aseguradora: "Sura",
    tipo: "Raspón en paragolpes",
    vehiculo: "Chevrolet Onix 2021",
    patente: "SCD 1190",
    etapa: "recepcion",
    ingreso: d(0, 8, 0),
    entregaEstimada: d(6),
    resumen: "Segundo siniestro de María este año. Llegó hoy temprano; falta cargar fotos y pedir el peritaje.",
    proximoPaso: "Cargar fotos y pedir peritaje a Sura.",
    eventos: [{ id: "e1", fecha: d(0, 8, 0), canal: "taller", titulo: "Ingresó al taller" }]
  },
  {
    id: "s8",
    clienteId: "c7",
    numero: "SAN-2026-10458",
    poliza: "POL-3301982",
    monto: "$54.700",
    perito: "Ing. Pereira",
    deducible: "$5.500",
    aseguradora: "Santander Seguros",
    tipo: "Choque en esquina",
    vehiculo: "Peugeot 208 2020",
    patente: "SDE 2210",
    etapa: "reparacion",
    ingreso: d(-8),
    entregaEstimada: d(6),
    resumen: "Diego ingresó hace 8 días por un choque en esquina con otro vehículo. Santander Seguros autorizó el presupuesto completo y los repuestos ya están en el taller. La chapa del guardabarros y la puerta delantera va al 60%.",
    proximoPaso: "Terminar chapa y pasar a pintura el viernes.",
    eventos: [
      { id: "e1", fecha: d(-1, 16, 0), canal: "taller", titulo: "Avance de chapa al 60%", detalle: "Guardabarros enderezado, falta puerta delantera." },
      { id: "e2", fecha: d(-4, 11, 0), canal: "mail", titulo: "Llegaron los repuestos", detalle: "Puerta, espejo y moldura recibidos." },
      { id: "e3", fecha: d(-6, 10, 0), canal: "aseguradora", titulo: "Santander Seguros autorizó el presupuesto", detalle: "Autorización por $54.700." },
      { id: "e4", fecha: d(-8, 9, 0), canal: "taller", titulo: "Ingresó al taller", detalle: "Siniestro con tercero. Parte de choque adjunto." }
    ]
  },
  {
    id: "s9",
    clienteId: "c8",
    numero: "SAN-2026-10733",
    poliza: "POL-3318440",
    monto: "$18.900",
    perito: "Cr. Duarte",
    deducible: "$1.900",
    aseguradora: "Santander Seguros",
    tipo: "Rotura de espejo y rayón",
    vehiculo: "Kia Rio 2019",
    patente: "SBH 5102",
    etapa: "peritaje",
    ingreso: d(-2),
    entregaEstimada: d(9),
    resumen: "Siniestro menor. Santander Seguros pidió fotos del rayón completo antes de asignar al perito.",
    proximoPaso: "Enviar las fotos que pide Santander hoy.",
    alerta: "Falta enviar fotos a la aseguradora",
    eventos: [
      { id: "e1", fecha: d(0, 9, 0), canal: "mail", titulo: "Santander pidió fotos adicionales" },
      { id: "e2", fecha: d(-2, 15, 0), canal: "taller", titulo: "Ingresó al taller" }
    ]
  },
  {
    id: "s10",
    clienteId: "c9",
    numero: "BSE-2026-49002",
    poliza: "POL-5544310",
    monto: "$63.400",
    perito: "Ing. Rivero",
    deducible: "$6.300",
    aseguradora: "BSE",
    tipo: "Vuelco leve",
    vehiculo: "Suzuki Vitara 2022",
    patente: "SGA 1187",
    etapa: "repuestos",
    ingreso: d(-11),
    entregaEstimada: d(10),
    resumen: "Daño en techo y puertas del lado derecho. BSE autorizó hace 6 días; faltan el techo y una puerta que vienen importados.",
    proximoPaso: "Seguir al proveedor: techo con demora de 5 días.",
    alerta: "Techo importado con demora",
    eventos: [
      { id: "e1", fecha: d(-1, 12, 0), canal: "mail", titulo: "Proveedor informó demora", detalle: "El techo llega en 5 días hábiles." },
      { id: "e2", fecha: d(-5, 11, 0), canal: "aseguradora", titulo: "BSE autorizó la reparación" },
      { id: "e3", fecha: d(-11, 10, 0), canal: "taller", titulo: "Ingresó al taller" }
    ]
  },
  {
    id: "s11",
    clienteId: "c10",
    numero: "POR-33540",
    poliza: "POL-9911207",
    monto: "$14.300",
    perito: "Cr. Duarte",
    deducible: "$1.400",
    aseguradora: "Porto Seguro",
    tipo: "Golpe de portón",
    vehiculo: "Honda Fit 2018",
    patente: "SAC 3394",
    etapa: "pintura",
    ingreso: d(-10),
    entregaEstimada: d(1),
    resumen: "Portón reparado y masillado. Hoy sale de cabina con la primera mano de color; mañana barniz y pulido.",
    proximoPaso: "Barniz y pulido mañana. Avisar a Florencia que queda lista pasado.",
    eventos: [
      { id: "e1", fecha: d(0, 9, 0), canal: "taller", titulo: "Primera mano de color aplicada" },
      { id: "e2", fecha: d(-3, 17, 0), canal: "taller", titulo: "Chapa terminada" },
      { id: "e3", fecha: d(-10, 11, 0), canal: "taller", titulo: "Ingresó al taller" }
    ]
  },
  {
    id: "s12",
    clienteId: "c11",
    numero: "MAP-71120",
    poliza: "POL-4421193",
    monto: "$41.800",
    perito: "Ing. Olivera",
    deducible: "$4.200",
    aseguradora: "Mapfre",
    tipo: "Choque trasero",
    vehiculo: "Nissan Versa 2021",
    patente: "SEA 7716",
    etapa: "autorizacion",
    ingreso: d(-3),
    entregaEstimada: d(14),
    resumen: "Presupuesto enviado a Mapfre ayer. Esperando autorización; mientras tanto se avanzó con el desarme.",
    proximoPaso: "Esperar respuesta de Mapfre (suelen demorar 2-3 días).",
    eventos: [
      { id: "e1", fecha: d(-1, 13, 0), canal: "mail", titulo: "Presupuesto enviado a Mapfre", detalle: "Total $41.800." },
      { id: "e2", fecha: d(-3, 10, 0), canal: "taller", titulo: "Ingresó al taller" }
    ]
  },
  {
    id: "s13",
    clienteId: "c12",
    numero: "SUR-885340",
    poliza: "POL-7751208",
    monto: "$27.600",
    perito: "Cr. Méndez",
    deducible: "$2.700",
    aseguradora: "Sura",
    tipo: "Daño por granizo",
    vehiculo: "Chevrolet Tracker 2020",
    patente: "SDB 9013",
    etapa: "listo",
    ingreso: d(-16),
    entregaEstimada: d(0),
    resumen: "Todo terminado y pulido. Andrea confirmó que lo retira mañana a las 9.",
    proximoPaso: "Entregar mañana 9:00. Cobrar deducible $2.700.",
    eventos: [
      { id: "e1", fecha: d(-1, 10, 0), canal: "whatsapp", titulo: "Andrea confirmó retiro", detalle: "Pasa mañana a las 9:00." },
      { id: "e2", fecha: d(-2, 18, 0), canal: "taller", titulo: "Control de calidad aprobado" },
      { id: "e3", fecha: d(-16, 9, 0), canal: "taller", titulo: "Ingresó al taller" }
    ]
  },
  {
    id: "s14",
    clienteId: "c13",
    numero: "SAN-2026-10590",
    poliza: "POL-3302155",
    monto: "$33.900",
    perito: "Ing. Pereira",
    deducible: "$3.400",
    aseguradora: "Santander Seguros",
    tipo: "Choque lateral",
    vehiculo: "Volkswagen Polo 2022",
    patente: "SGC 4408",
    etapa: "recepcion",
    ingreso: d(0),
    entregaEstimada: d(12),
    resumen: "Ingresó esta mañana. Falta cargar fotos y el número de siniestro definitivo de Santander.",
    proximoPaso: "Fotos del daño y pedir peritaje.",
    eventos: [
      { id: "e1", fecha: d(0, 9, 0), canal: "taller", titulo: "Ingresó al taller" }
    ]
  },
  {
    id: "s15",
    clienteId: "c14",
    numero: "POR-33612",
    poliza: "POL-9918834",
    monto: "$21.200",
    perito: "Cr. Duarte",
    deducible: "$2.100",
    aseguradora: "Porto Seguro",
    tipo: "Raspón en puerta y paragolpes",
    vehiculo: "Fiat Argo 2023",
    patente: "SFD 6620",
    etapa: "reparacion",
    ingreso: d(-5),
    entregaEstimada: d(3),
    resumen: "Reparación en marcha; sin pendientes de material. Camila preguntó el plazo y se le respondió que queda lista el jueves.",
    proximoPaso: "Pasar a pintura mañana.",
    eventos: [
      { id: "e1", fecha: d(-1, 12, 0), canal: "whatsapp", titulo: "Camila consultó el plazo" },
      { id: "e2", fecha: d(-5, 10, 0), canal: "taller", titulo: "Ingresó al taller" }
    ]
  }
];

export const MATERIALES: Material[] = [
  { id: "m1", siniestroId: "s1", nombre: "Paragolpes delantero VW Gol Trend", proveedor: "Repuestos Del Sur", cantidad: 1, estado: "en_camino", eta: d(1) },
  { id: "m2", siniestroId: "s1", nombre: "Faro delantero derecho", proveedor: "Repuestos Del Sur", cantidad: 1, estado: "en_camino", eta: d(1) },
  { id: "m3", siniestroId: "s1", nombre: "Kit de clips y grampas", proveedor: "Autopartes Central", cantidad: 1, estado: "llego" },
  { id: "m4", siniestroId: "s2", nombre: "Pintura base gris metalizado (1 L)", proveedor: "Pinturas del Plata", cantidad: 1, estado: "llego" },
  { id: "m5", siniestroId: "s2", nombre: "Barniz poliuretano (1 L)", proveedor: "Pinturas del Plata", cantidad: 1, estado: "llego" },
  { id: "m6", siniestroId: "s3", nombre: "Chapa de techo Renault Duster", proveedor: "Repuestos Del Sur", cantidad: 1, estado: "pendiente" },
  { id: "m7", siniestroId: "s3", nombre: "Tapa de baúl", proveedor: "Autopartes Central", cantidad: 1, estado: "pendiente" },
  { id: "m8", siniestroId: "s6", nombre: "Puerta delantera izquierda Ford Ka", proveedor: "Autopartes Central", cantidad: 1, estado: "llego" },
  { id: "m9", siniestroId: "s6", nombre: "Moldura lateral", proveedor: "Autopartes Central", cantidad: 1, estado: "llego" },
  { id: "m10", siniestroId: "s5", nombre: "Parabrisas Toyota Hilux", proveedor: "Cristales Montevideo", cantidad: 1, estado: "pedido", eta: d(4) },
  { id: "m11", siniestroId: "s5", nombre: "Puerta delantera derecha", proveedor: "Repuestos Del Sur", cantidad: 1, estado: "pedido", eta: d(5) },
  { id: "m12", siniestroId: "s10", nombre: "Techo Suzuki Vitara (importado)", proveedor: "Importadora Cono Sur", cantidad: 1, estado: "pedido", eta: d(5) },
  { id: "m13", siniestroId: "s10", nombre: "Puerta trasera derecha", proveedor: "Repuestos Del Sur", cantidad: 1, estado: "en_camino", eta: d(2) },
  { id: "m14", siniestroId: "s8", nombre: "Puerta delantera Peugeot 208", proveedor: "Autopartes Central", cantidad: 1, estado: "llego" },
  { id: "m15", siniestroId: "s11", nombre: "Pintura base blanco perlado (1 L)", proveedor: "Pinturas del Plata", cantidad: 1, estado: "llego" },
  { id: "m16", siniestroId: "s12", nombre: "Paragolpes trasero Nissan Versa", proveedor: "Repuestos Del Sur", cantidad: 1, estado: "pendiente" },
  { id: "m17", siniestroId: "s9", nombre: "Espejo exterior Kia Rio", proveedor: "Autopartes Central", cantidad: 1, estado: "pendiente" },
  { id: "m18", siniestroId: "s15", nombre: "Kit de pintura Fiat Argo gris", proveedor: "Pinturas del Plata", cantidad: 1, estado: "pedido", eta: d(1) }
];

export const CORREOS: Correo[] = [
  {
    id: "mail1",
    siniestroId: "s1",
    de: "ventas@repuestosdelsur.com.uy",
    asunto: "Re: Pedido #2231 – paragolpes y faro",
    fecha: d(0, 9, 12),
    resumenIA: "El proveedor confirma que el paragolpes y el faro salen mañana a primera hora. Antes decían que llegaban hoy.",
    accion: "Avisar a Juan que se corre un día.",
    leido: false
  },
  {
    id: "mail2",
    siniestroId: "s3",
    de: "siniestros@mapfre.com.uy",
    asunto: "Consulta presupuesto MAP-70934",
    fecha: d(0, 8, 20),
    resumenIA: "Mapfre pide una foto más del techo con medidas antes de autorizar. No dicen plazo.",
    accion: "Sacar la foto y enviarla hoy.",
    leido: false
  },
  {
    id: "mail3",
    siniestroId: "s5",
    de: "peritajes@bse.com.uy",
    asunto: "Coordinación de peritaje BSE-2026-48790",
    fecha: d(0, 8, 45),
    resumenIA: "Peritaje confirmado para mañana a las 10:00 en el taller.",
    accion: "Dejar el presupuesto impreso.",
    leido: true
  },
  {
    id: "mail4",
    siniestroId: "s2",
    de: "ventas@pinturasdelplata.com",
    asunto: "Factura 0045-3321",
    fecha: d(-1, 17, 5),
    resumenIA: "Factura de pintura base y barniz por $6.840. Ya fue recibido el material.",
    leido: true
  },
  {
    id: "mail5",
    de: "contacto@cristalesmvd.com",
    asunto: "Cotización parabrisas Hilux",
    fecha: d(-1, 12, 0),
    resumenIA: "Cotizan el parabrisas en $11.200 con entrega en 4 días.",
    accion: "Confirmar pedido (ya cargado en materiales).",
    leido: true
  }
];
