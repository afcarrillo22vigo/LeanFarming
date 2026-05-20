import { API } from "../config/api";
import {
  zonas as mockZonas,
  empleados as mockEmpleados,
  maquinaria as mockMaquinaria,
  tareasCatalogo as mockCatalogos,
  tareasRecurrentes as mockRecurrentes,
  animales as mockAnimales,
} from "../mock/mock";

// Zonas
export async function getZonas() {
  if (!API.leanfarming) return mockZonas;
  const res = await fetch(`${API.leanfarming}/zonas`);
  return res.json();
}

// Maquinaria
export async function getMaquinaria(zonaId = null) {
  if (!API.leanfarming) {
    if (!zonaId) return mockMaquinaria;
    return mockMaquinaria.filter((m) => m.zona_id === zonaId);
  }
  const url = zonaId
    ? `${API.leanfarming}/maquinaria?zona_id=${zonaId}`
    : `${API.leanfarming}/maquinaria`;
  return fetch(url).then((r) => r.json());
}

// Empleados
export async function getEmpleados() {
  if (!API.leanfarming) return mockEmpleados;
  return fetch(`${API.leanfarming}/empleados`).then((r) => r.json());
}

// Catálogo de tareas
export async function getTareasCatalogo() {
  if (!API.leanfarming) return mockCatalogos;
  return fetch(`${API.leanfarming}/tareas-catalogo`).then((r) => r.json());
}

// Tareas recurrentes
export async function getTareasRecurrentes(catalogoId = null) {
  if (!API.leanfarming) {
    if (!catalogoId) return mockRecurrentes;
    return mockRecurrentes.filter((r) => r.catalogo_id === catalogoId);
  }
  const url = catalogoId
    ? `${API.leanfarming}/tareas-recurrentes?catalogo_id=${catalogoId}`
    : `${API.leanfarming}/tareas-recurrentes`;
  return fetch(url).then((r) => r.json());
}

// POSTS
export async function crearEmpleado(datos) {
  if (!API.leanfarming) {
    console.log("[MOCK] Crear empleado:", datos);
    return { id: "mock-" + Date.now(), ...datos };
  }
  return fetch(`${API.leanfarming}/empleados`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(datos),
  }).then((r) => r.json());
}

export async function crearZona(datos) {
  if (!API.leanfarming) {
    console.log("[MOCK] Crear zona:", datos);
    return { id: "mock-" + Date.now(), ...datos };
  }
  return fetch(`${API.leanfarming}/zonas`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(datos),
  }).then((r) => r.json());
}

export async function crearMaquinaria(datos) {
  if (!API.leanfarming) {
    console.log("[MOCK] Crear maquinaria:", datos);
    return { id: "mock-" + Date.now(), ...datos };
  }
  return fetch(`${API.leanfarming}/maquinaria`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(datos),
  }).then((r) => r.json());
}

export async function crearTurno(datos) {
  if (!API.leanfarming) {
    console.log("[MOCK] Crear turno:", datos);
    return { id: "mock-" + Date.now(), ...datos };
  }
  return fetch(`${API.leanfarming}/turnos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(datos),
  }).then((r) => r.json());
}

export async function crearAsignacionTurno(datos) {
  if (!API.leanfarming) {
    console.log("[MOCK] Crear asignación turno:", datos);
    return { id: "mock-" + Date.now(), ...datos };
  }
  return fetch(`${API.leanfarming}/asignaciones-turno`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(datos),
  }).then((r) => r.json());
}

export async function crearPedido(datos) {
  if (!API.leanfarming) {
    console.log("[MOCK] Crear pedido:", datos);
    return { id: "mock-" + Date.now(), ...datos };
  }
  return fetch(`${API.leanfarming}/pedidos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(datos),
  }).then((r) => r.json());
}

export async function crearIncidencia(datos) {
  if (!API.leanfarming) {
    console.log("[MOCK] Crear incidencia:", datos);
    return { id: "mock-" + Date.now(), ...datos };
  }
  return fetch(`${API.leanfarming}/incidencias`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(datos),
  }).then((r) => r.json());
}

export async function crearTareaCatalogo(datos) {
  if (!API.leanfarming) {
    console.log("[MOCK] Crear tarea catálogo:", datos);
    return { id: "mock-" + Date.now(), ...datos };
  }
  return fetch(`${API.leanfarming}/tareas-catalogo`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(datos),
  }).then((r) => r.json());
}

export async function crearTareaRecurrente(datos) {
  if (!API.leanfarming) {
    console.log("[MOCK] Crear tarea recurrente:", datos);
    return { id: "mock-" + Date.now(), ...datos };
  }
  return fetch(`${API.leanfarming}/tareas-recurrentes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(datos),
  }).then((r) => r.json());
}

export async function crearTareaEjecucion(datos) {
  if (!API.leanfarming) {
    console.log("[MOCK] Crear ejecución:", datos);
    return { id: "mock-" + Date.now(), ...datos };
  }
  return fetch(`${API.leanfarming}/tareas-ejecuciones`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(datos),
  }).then((r) => r.json());
}
