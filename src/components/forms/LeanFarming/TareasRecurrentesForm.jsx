import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  crearTareaRecurrente,
  getMaquinaria,
  getTareasCatalogo,
  getZonas,
} from "../../../services/leanfarming";

// Atajos de expresiones cron comunes en este dominio
// El usuario puede elegir uno o escribir el suyo propio
const FRECUENCIAS_COMUNES = [
  { label: "Cada día", valor: "0 6 * * *" },
  { label: "Lunes y jueves", valor: "0 22 * * 1,4" },
  { label: "Martes y viernes", valor: "0 22 * * 2,5" },
  { label: "Lunes, miércoles y viernes", valor: "0 10 * * 1,3,5" },
  { label: "Cada semana (lunes)", valor: "0 6 * * 1" },
  { label: "Personalizada", valor: "" },
];

const tareaRecurrenteSchema = z
  .object({
    catalogo_id: z.string().min(1, "Selecciona una tarea del catálogo"),
    frecuencia_expr: z.string().min(1, "La frecuencia es obligatoria"),
    zona_id: z.string(),
    maquinaria_id: z.string(),
    descripcion_frecuencia: z.string(),
    activa: z.boolean().default(true),
    fecha_inicio: z.string().min(1, "La fecha de inicio es obligatoria"),
    fecha_fin: z.string(),
    notas: z.string(),
  })
  .refine(
    (datos) => {
      if (!datos.fecha_fin) return true;
      return datos.fecha_inicio < datos.fecha_fin;
    },
    {
      error: "La fecha de fin debe ser posterior a la de inicio",
      path: ["fecha_fin"],
    },
  );

export default function TareaRecurrenteForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm({
    resolver: zodResolver(tareaRecurrenteSchema),
    defaultValues: {
      catalogo_id: "",
      frecuencia_expr: "",
      zona_id: "",
      maquinaria_id: "",
      descripcion_frecuencia: "",
      activa: true,
      fecha_inicio: "",
      fecha_fin: "",
      notas: "",
    },
  });

  const zonaSeleccionada = watch("zona_id");

  const [catalogos, setCatalogos] = useState([]);
  const [zonas, setZonas] = useState([]);
  const [maquinaria, setMaquinaria] = useState([]);

  // Cargamos catálogo y zonas al montar — no dependen de nada
  useEffect(() => {
    // fetch('/api/tareas-catalogo').then(r => r.json()).then(setCatalogos)
    getTareasCatalogo().then(setCatalogos);

    // fetch('/api/zonas').then(r => r.json()).then(setZonas)
    getZonas().then(setZonas);
  }, []);

  // Select encadenado: cuando zona_id cambia, cargamos la maquinaria de esa zona
  useEffect(() => {
    // Si no hay zona seleccionada, vaciamos la maquinaria y salimos
    if (!zonaSeleccionada) {
      setMaquinaria([]);
      return;
    }

    // fetch(`/api/maquinaria?zona_id=${form.zona_id}`)
    //   .then(r => r.json())
    //   .then(setMaquinaria)

    // Datos simulados filtrados por zona
    getMaquinaria(zonaSeleccionada).then(setMaquinaria);
  }, [zonaSeleccionada]); // se re-ejecuta solo cuando zona_id cambia

  const onSubmit = async (datos) => {
    try {
      const respuesta = await crearTareaRecurrente(datos);
      console.log("Tarea recurrente a crear:", datos);
    } catch (err) {
      console.error("Error:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 w-full">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">
          Nueva tarea recurrente
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
          {/* Tarea del catálogo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tarea
            </label>
            <select
              {...register("catalogo_id")}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">— Selecciona una tarea —</option>
              {catalogos.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nombre}
                </option>
              ))}
            </select>
            {errors.catalogo_id && (
              <p className="text-red-500 text-xs mt-1">
                {errors.catalogo_id.message}
              </p>
            )}
          </div>

          {/* Frecuencia — Atajos + campo manual */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Frecuencia
            </label>

            <select
              onChange={(e) => setValue("frecuencia_expr", e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
            >
              <option value="">— Elige una frecuencia común —</option>
              {FRECUENCIAS_COMUNES.map((f) => (
                <option key={f.label} value={f.valor}>
                  {f.label}
                </option>
              ))}
            </select>

            <input
              type="text"
              placeholder="Ej: 0 22 * * 1,4"
              {...register("frecuencia_expr")}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-400 mt-1">
              Formato cron: minuto hora día mes día_semana (0=domingo,
              1=lunes...)
            </p>
            {errors.frecuencia_expr && (
              <p className="text-red-500 text-xs mt-1">
                {errors.frecuencia_expr.message}
              </p>
            )}
          </div>

          {/* Descripción Frecuencia */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descripción de la Frecuencia{" "}
              <span className="text-gray-400 font-normal">(opcional)</span>
            </label>
            <textarea
              {...register("descripcion_frecuencia")}
              rows={3}
              placeholder="Describe la frecuencia con detalle..."
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          {/* Fechas */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha Inicio
              </label>
              <input
                type="date"
                {...register("fecha_inicio")}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.fecha_inicio && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.fecha_inicio.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha Fin{" "}
                <span className="text-gray-400 font-normal">(opcional)</span>
              </label>
              <input
                type="date"
                {...register("fecha_fin")}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.fecha_fin && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.fecha_fin.message}
                </p>
              )}
            </div>
          </div>

          {/* Zona */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Zona <span className="text-gray-400 font-normal">(opcional)</span>
            </label>
            <select
              {...register("zona_id", {
                onChange: () => setValue("maquinaria_id", ""),
              })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">— Selecciona una zona —</option>
              {zonas.map((z) => (
                <option key={z.id} value={z.id}>
                  {z.nombre}
                </option>
              ))}
            </select>
          </div>

          {/* Maquinaria */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Maquinaria{" "}
              <span className="text-gray-400 font-normal">(opcional)</span>
            </label>
            <select
              {...register("maquinaria_id")}
              disabled={!zonaSeleccionada}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-400"
            >
              <option value="">— Ninguna —</option>
              {maquinaria.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.nombre}
                </option>
              ))}
            </select>
            {!zonaSeleccionada && (
              <p className="text-xs text-gray-400 mt-1">
                Selecciona primero una zona.
              </p>
            )}
          </div>

          {/* Notas */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Posibles notas{" "}
              <span className="text-gray-400 font-normal">(opcional)</span>
            </label>
            <textarea
              {...register("notas")}
              rows={3}
              placeholder="..."
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 rounded-md transition-colors"
          >
            Crear tarea recurrente
          </button>
        </form>
      </div>
    </div>
  );
}
