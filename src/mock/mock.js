// simulacion de archivos reales provenientes de api

export const empleados = [
  {
    id: "emp-1",
    nombre: "María",
    apellidos: "López",
    rol: "encargado",
    cualificaciones: ["VMS", "TMR"],
    activo: true,
  },
  {
    id: "emp-2",
    nombre: "Carlos",
    apellidos: "Méndez",
    rol: "auxiliar",
    cualificaciones: ["TMR"],
    activo: true,
  },
  {
    id: "emp-3",
    nombre: "Ana",
    apellidos: "Rodríguez",
    rol: "veterinario",
    cualificaciones: ["veterinaria"],
    activo: true,
  },
  {
    id: "emp-4",
    nombre: "Pedro",
    apellidos: "Gómez",
    rol: "mecanico",
    cualificaciones: ["VMS"],
    activo: false,
  },
];

export const zonas = [
  {
    id: "zona-1",
    codigo: "nave",
    nombre: "Nave",
    tiene_pantalla_tv: true,
    tiene_tablet: false,
  },
  {
    id: "zona-2",
    codigo: "becerrero",
    nombre: "Becerrero",
    tiene_pantalla_tv: false,
    tiene_tablet: true,
  },
  {
    id: "zona-3",
    codigo: "enfermeria",
    nombre: "Enfermería",
    tiene_pantalla_tv: false,
    tiene_tablet: false,
  },
  {
    id: "zona-4",
    codigo: "oficina",
    nombre: "Oficina",
    tiene_pantalla_tv: true,
    tiene_tablet: true,
  },
  {
    id: "zona-5",
    codigo: "general",
    nombre: "General",
    tiene_pantalla_tv: false,
    tiene_tablet: false,
  },
];

export const maquinaria = [
  {
    id: "maq-1",
    nombre: "VMS 1",
    tipo: "robot_ordeno",
    zona_id: "zona-1",
    marca: "Lely",
    modelo: "Astronaut A5",
    activa: true,
  },
  {
    id: "maq-2",
    nombre: "VMS 2",
    tipo: "robot_ordeno",
    zona_id: "zona-1",
    marca: "Lely",
    modelo: "Astronaut A5",
    activa: true,
  },
  {
    id: "maq-3",
    nombre: "VMS 3",
    tipo: "robot_ordeno",
    zona_id: "zona-1",
    marca: "DeLaval",
    modelo: "VMS V300",
    activa: false,
  },
  {
    id: "maq-4",
    nombre: "Carro TMR",
    tipo: "carro_mezclador",
    zona_id: "zona-5",
    marca: "Strautmann",
    modelo: "Verti-Mix",
    activa: true,
  },
];

export const animales = [
  {
    id: "ani-1",
    crotal_oficial: "ES001",
    nombre: "Lola",
    especie: "vaca",
    sexo: "hembra",
    estado: "activo",
    zona_id: "zona-1",
  },
  {
    id: "ani-2",
    crotal_oficial: "ES002",
    nombre: "Mora",
    especie: "vaca",
    sexo: "hembra",
    estado: "activo",
    zona_id: "zona-1",
  },
  {
    id: "ani-3",
    crotal_oficial: "ES003",
    nombre: "Blanca",
    especie: "vaca",
    sexo: "hembra",
    estado: "activo",
    zona_id: "zona-1",
  },
  {
    id: "ani-4",
    crotal_oficial: "ES004",
    nombre: "Torin",
    especie: "ternero",
    sexo: "macho",
    estado: "activo",
    zona_id: "zona-2",
  },
];

export const tareasCatalogo = [
  {
    id: "cat-1",
    codigo: "lavado_robot",
    nombre: "Lavado de robot VMS",
    cualificacion_requerida: "VMS",
    duracion_estimada_min: 45,
    activa: true,
  },
  {
    id: "cat-2",
    codigo: "preparacion_racion",
    nombre: "Preparación ración unifeed (TMR)",
    cualificacion_requerida: "TMR",
    duracion_estimada_min: 40,
    activa: true,
  },
  {
    id: "cat-3",
    codigo: "control_tratamientos",
    nombre: "Control y administración tratamientos",
    cualificacion_requerida: "veterinaria",
    duracion_estimada_min: 20,
    activa: true,
  },
];

export const tareasRecurrentes = [
  {
    id: "rec-1",
    catalogo_id: "cat-1",
    frecuencia_expr: "0 22 * * 1,4",
    descripcion_frecuencia: "Lunes y jueves a las 22:00",
    zona_id: "zona-1",
    maquinaria_id: "maq-1",
    activa: true,
  },
  {
    id: "rec-2",
    catalogo_id: "cat-1",
    frecuencia_expr: "0 22 * * 2,5",
    descripcion_frecuencia: "Martes y viernes a las 22:00",
    zona_id: "zona-1",
    maquinaria_id: "maq-2",
    activa: true,
  },
  {
    id: "rec-3",
    catalogo_id: "cat-2",
    frecuencia_expr: "0 10 * * 1,3,5",
    descripcion_frecuencia: "Lunes, miércoles y viernes a las 10:00",
    zona_id: "zona-5",
    maquinaria_id: "maq-4",
    activa: true,
  },
];
