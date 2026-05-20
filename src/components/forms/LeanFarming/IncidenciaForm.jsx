import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useForm, useFieldArray } from "react-hook-form";
import {
  zonas as mockZonas,
  empleados as mockEmpleados,
  maquinaria as mockMaquinaria,
  animales as mockAnimales,
} from "../../../mock/mock";
import {
  getEmpleados,
  getZonas,
  getMaquinaria,
  crearIncidencia,
} from "../../../services/leanfarming";
import { getAnimales } from "../../../services/zootecnico";

const TIPOS = [
  "averia_maquinaria",
  "infraestructura",
  "sanidad_animal",
  "calidad_leche",
  "alimentacion",
  "pedidos",
];

const SEVERIDADES = ["baja", "media", "alta"];
const ESTADOS = ["abierta", "en_gestion", "resuelta", "cerrada"];

const accionSchema = z.object({
  timestamp: z.string(),
  accion: z.string().min(1, "Describe la acción"),
  responsable_id: z.string(),
});

const incidenciaSchema = z.object({
  tipo: z.string().min(1, "El tipo es obligatorio"),
  subtipo: z.string().optional(),
  severidad: z.string(),
  estado: z.string(),
  titulo: z.string().min(1, "El titulo es obligatorio"),
  descripcion: z.string().optional(),
  zona_id: z.string().optional(),
  maquinaria_id: z.string().optional(),
  animal_id: z.string().optional(),
  reportado_por: z.string().optional(),
  asignado_a: z.string().optional(),
  foto_url: z.string().optional(),
  acciones: z.array(accionSchema).default([]),
});

export default function IncidenciaForm() {
  const {
    register,
    control, // Necesario para useFieldArray
    handleSubmit,
    watch,
    setValue, // Permite forzar el valor de un campo
    formState: { errors },
  } = useForm({
    resolver: zodResolver(incidenciaSchema),
    defaultValues: {
      tipo: "",
      subtipo: "",
      severidad: "media",
      estado: "abierta",
      titulo: "",
      descripcion: "",
      zona_id: "",
      maquinaria_id: "",
      animal_id: "",
      reportado_por: "",
      asignado_a: "",
      foto_url: "",
      acciones: [],
    },
  });

  const [zonas, setZonas] = useState([]);
  const [maquinaria, setMaquinaria] = useState([]);
  const [empleados, setEmpleados] = useState([]);
  const [animales, setAnimales] = useState([]);

  useEffect(() => {
    getZonas().then(setZonas);
    getEmpleados().then(setEmpleados);
    getAnimales().then(setAnimales);
  }, []);

  // Configuración de useFieldArray para JSONB
  const { fields, append, remove } = useFieldArray({
    control,
    name: "acciones", // nombre exacto de la propiedad en el formulario
  });

  const zonaSeleccionada = watch("zona_id");

  // Select encadenado zona con maquinaria
  useEffect(() => {
    if (!zonaSeleccionada) {
      setMaquinaria([]);
      return;
    }

    getMaquinaria(zonaSeleccionada).then(setMaquinaria);
  }, [zonaSeleccionada]);

  const onSubmit = async (datos) => {
    try {
      const resultado = await crearIncidencia(datos);
      console.log("Incidencia a crear:", datos);
    } catch (err) {
      console.error("Error:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 w-full">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">
          Nueva incidencia
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
          {/* Título */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Título
            </label>
            <input
              type="text"
              {...register("titulo")}
              placeholder="Ej: VMS 1 parado por fallo de sensor"
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.titulo && (
              <p className="text-red-500 text-xs mt-1">
                {errors.titulo.message}
              </p>
            )}
          </div>

          {/* Tipo + Subtipo */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipo
              </label>
              <select
                {...register("tipo")}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">— Selecciona —</option>
                {TIPOS.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
              {errors.tipo && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.tipo.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Subtipo{" "}
                <span className="text-gray-400 font-normal">(opcional)</span>
              </label>
              <input
                type="text"
                {...register("subtipo")}
                placeholder="Ej: sensor_fallo..."
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Severidad + Estado */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Severidad
              </label>
              <select
                {...register("severidad")}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {SEVERIDADES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
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
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descripción{" "}
              <span className="text-gray-400 font-normal">(opcional)</span>
            </label>
            <textarea
              {...register("descripcion")}
              rows={3}
              placeholder="Describe la incidencia con detalle..."
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          {/* Zona (Encadenada) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Zona <span className="text-gray-400 font-normal">(opcional)</span>
            </label>
            <select
              {...register("zona_id", {
                // Al cambiar la zona, vaciamos el ID de la máquina automáticamente
                onChange: () => setValue("maquinaria_id", ""),
              })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">— Ninguna —</option>
              {zonas.map((z) => (
                <option key={z.id} value={z.id}>
                  {z.nombre}
                </option>
              ))}
            </select>
          </div>

          {/* Maquinaria (Filtrada) */}
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

          {/* Animal */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Animal{" "}
              <span className="text-gray-400 font-normal">(opcional)</span>
            </label>
            <select
              {...register("animal_id")}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">— Ninguno —</option>
              {animales.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.crotal_oficial} — {a.nombre}
                </option>
              ))}
            </select>
          </div>

          {/* Reportado por + Asignado a */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Reportado por{" "}
                <span className="text-gray-400 font-normal">(opcional)</span>
              </label>
              <select
                {...register("reportado_por")}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">— Ninguno —</option>
                {empleados.map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.nombre} {e.apellidos}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Asignado a{" "}
                <span className="text-gray-400 font-normal">(opcional)</span>
              </label>
              <select
                {...register("asignado_a")}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">— Ninguno —</option>
                {empleados.map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.nombre} {e.apellidos}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* URL de foto */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              URL de foto{" "}
              <span className="text-gray-400 font-normal">(opcional)</span>
            </label>
            <input
              type="text"
              {...register("foto_url")}
              placeholder="https://..."
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Acciones (JSONB) usando useFieldArray */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Acciones
              </label>
              <button
                type="button"
                onClick={() =>
                  append({
                    timestamp: new Date().toISOString().slice(0, 16),
                    accion: "",
                    responsable_id: "",
                  })
                }
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                + Añadir acción
              </button>
            </div>

            {fields.length === 0 && (
              <p className="text-sm text-gray-400 italic">
                No hay acciones registradas aún.
              </p>
            )}

            {fields.map((field, index) => (
              <div
                key={field.id}
                className="border border-gray-200 rounded-md p-3 mb-3 flex flex-col gap-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-gray-500">
                    Acción {index + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="text-xs text-red-400 hover:text-red-600"
                  >
                    Eliminar
                  </button>
                </div>

                <div>
                  <label className="block text-xs text-gray-600 mb-1">
                    Fecha y hora
                  </label>
                  <input
                    type="datetime-local"
                    {...register(`acciones.${index}.timestamp`)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs text-gray-600 mb-1">
                    Acción realizada
                  </label>
                  <input
                    type="text"
                    placeholder="Ej: Se reinició el robot..."
                    {...register(`acciones.${index}.accion`)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {errors?.acciones?.[index]?.accion && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.acciones[index].accion.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs text-gray-600 mb-1">
                    Responsable
                  </label>
                  <select
                    {...register(`acciones.${index}.responsable_id`)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">— Selecciona —</option>
                    {empleados.map((e) => (
                      <option key={e.id} value={e.id}>
                        {e.nombre} {e.apellidos}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            ))}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 rounded-md transition-colors"
          >
            Registrar incidencia
          </button>
        </form>
      </div>
    </div>
  );
}
