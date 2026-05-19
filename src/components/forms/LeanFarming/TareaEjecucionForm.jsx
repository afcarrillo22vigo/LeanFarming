import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  tareasCatalogo as mockCatalogo,
  tareasRecurrentes as mockRecurrentes,
  empleados as mockEmpleados,
  zonas as mockZonas,
  maquinaria as mockMaquinaria,
} from "../../../mock/mock";
import * as z from "zod";

const ESTADOS = ["pendiente", "en_curso", "completada", "vencida", "cancelada"];

const tareaEjecucionSchema = z
  .object({
    catalogo_id: z.string().min(1, "Selecciona una tarea"),
    recurrente_id: z.string(),
    empleado_id: z.string(),
    zona_id: z.string(),
    maquinaria_id: z.string(),
    estado: z.string().min(1, "El estado de la tarea es obligatorio"),
    ts_planificada: z.string().min(1, "La fecha planificada es obligatoria"),
    ts_inicio: z.string(),
    ts_fin: z.string(),
    notas: z.string(),
  })
  .refine(
    (datos) => {
      if (!datos.ts_inicio || !datos.ts_fin) return true;
      return datos.ts_fin > datos.ts_inicio;
    },
    {
      error: "La fecha de fin debe ser posterior a la fecha de inicio",
      path: ["ts_fin"],
    },
  );

export default function TareaEjecucionForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm({
    resolver: zodResolver(tareaEjecucionSchema),
    defaultValues: {
      catalogo_id: "",
      recurrente_id: "",
      empleado_id: "",
      zona_id: "",
      maquinaria_id: "",
      estado: "pendiente",
      ts_planificada: "",
      ts_inicio: "",
      ts_fin: "",
      notas: "",
    },
  });

  const [catalogos, setCatalogos] = useState([]);
  const [recurrentes, setRecurrentes] = useState([]); // filtradas por catálogo
  const [empleados, setEmpleados] = useState([]);
  const [zonas, setZonas] = useState([]);
  const [maquinaria, setMaquinaria] = useState([]); // filtradas por zona

  // Cargamos catálogos, empleados y zonas al montar
  useEffect(() => {
    setCatalogos(mockCatalogo);
    setEmpleados(mockEmpleados);
    setZonas(mockZonas);
  }, []);

  const catalogoSeleccionado = watch("catalogo_id");

  // Encadenado 1: catálogo + recurrentes
  // Cuando cambia el catálogo, cargamos solo las tareas recurrentes de ese catálogo
  useEffect(() => {
    if (!catalogoSeleccionado) {
      setRecurrentes([]);
      return;
    }

    // fetch(`/api/tareas-recurrentes?catalogo_id=${form.catalogo_id}`)
    //   .then(r => r.json()).then(setRecurrentes)

    setRecurrentes(
      mockRecurrentes.filter((r) => r.catalogo_id === catalogoSeleccionado),
    );
  }, [catalogoSeleccionado]);

  const zonaSeleccionada = watch("zona_id");

  // Encadenado 2: zona con maquinaria
  useEffect(() => {
    if (!zonaSeleccionada) {
      setMaquinaria([]);
      return;
    }

    // fetch(`/api/maquinaria?zona_id=${form.zona_id}`)
    //   .then(r => r.json()).then(setMaquinaria)

    setMaquinaria(mockMaquinaria.filter((m) => m.zona_id === zonaSeleccionada));
  }, [zonaSeleccionada]);

  const onSubmit = (datos) => {
    console.log("Ejecución a crear", datos);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 w-full">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">
          Nueva ejecución de tarea
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
          {/* Catálogo — obligatorio */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tarea
            </label>
            <select
              {...register("catalogo_id", {
                // Reiniciamos recurrente_id al cambiar la tarea
                onChange: () => setValue("recurrente_id", ""),
              })}
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

          {/* Recurrente — filtrada por catálogo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Frecuencia{" "}
              <span className="text-gray-400 font-normal">(opcional)</span>
            </label>
            <select
              {...register("recurrente_id")}
              disabled={!catalogoSeleccionado}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-400"
            >
              <option value="">— Sin frecuencia asociada —</option>
              {recurrentes.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.descripcion_frecuencia}
                </option>
              ))}
            </select>
            {!catalogoSeleccionado && (
              <p className="text-xs text-gray-400 mt-1">
                Selecciona primero una tarea.
              </p>
            )}
          </div>

          {/* Estado */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Estado
            </label>
            <select
              {...register("estado")}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {ESTADOS.map((e) => (
                <option key={e} value={e}>
                  {e}
                </option>
              ))}
            </select>
          </div>

          {/* Empleado */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Empleado{" "}
              <span className="text-gray-400 font-normal">(opcional)</span>
            </label>
            <select
              {...register("empleado_id")}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">— Sin asignar —</option>
              {empleados.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.nombre} {e.apellidos}
                </option>
              ))}
            </select>
          </div>

          {/* Zona encadenado con maquinaria */}
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
              <option value="">— Sin zona —</option>
              {zonas.map((z) => (
                <option key={z.id} value={z.id}>
                  {z.nombre}
                </option>
              ))}
            </select>
          </div>

          {/* Maquinaria — filtrada por zona */}
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

          {/* Timestamps — los tres en orden lógico */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fecha planificada
            </label>
            <input
              type="datetime-local"
              {...register("ts_planificada")}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.ts_planificada && (
              <p className="text-red-500 text-xs mt-1">
                {errors.ts_planificada.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Inicio real{" "}
                <span className="text-gray-400 font-normal">(opcional)</span>
              </label>
              <input
                type="datetime-local"
                {...register("ts_inicio")}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fin real{" "}
                <span className="text-gray-400 font-normal">(opcional)</span>
              </label>
              <input
                type="datetime-local"
                {...register("ts_fin")}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.ts_fin && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.ts_fin.message}
                </p>
              )}
            </div>
          </div>

          {/* Notas */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notas{" "}
              <span className="text-gray-400 font-normal">(opcional)</span>
            </label>
            <textarea
              {...register("notas")}
              rows={3}
              placeholder="Observaciones sobre la ejecución..."
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 rounded-md transition-colors"
          >
            Registrar ejecución
          </button>
        </form>
      </div>
    </div>
  );
}
