import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const CUALIFICACIONES = ["VMS", "TMR", "veterinaria"];

const tareaCatalogoSchema = z.object({
  codigo: z
    .string()
    .min(1, "El código es obligatorio")
    .regex(
      /^[a-z]+_[a-z]+$/,
      "El formato debe ser 'palabra_palabra' (ej: lavado_robot)",
    ),
  nombre: z.string().min(1, "El nombre es obligatorio"),
  descripcion: z.string(),
  cualificacion_requerida: z.string(),
  duracion_estimada_min: z.coerce.number(),
  activa: z.boolean().default(true),
});

export default function TareasCatalogoForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(tareaCatalogoSchema),
    defaultValues: {
      codigo: "",
      nombre: "",
      descripcion: "",
      cualificacion_requerida: "",
      duracion_estimada_min: 0,
      activa: true,
    },
  });

  const onSubmit = (datos) => {
    console.log("Tarea: ", datos);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 w-full">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">
          Nueva Tarea del Catálogo
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
          {/* Código */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Código
            </label>
            <input
              type="text"
              {...register("codigo")}
              placeholder="Ej: lavado_robot, extraer_leche..."
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-400 mt-1">
              Solo minúsculas y guiones bajos. Este código no se puede cambiar
              después.
            </p>
            {errors.codigo && (
              <p className="text-red-500 text-xs mt-1">
                {errors.codigo.message}
              </p>
            )}
          </div>

          {/*Nombre*/}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre
            </label>
            <input
              type="text"
              {...register("nombre")}
              placeholder="Ej: Lavado, Análisis..."
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.nombre && (
              <p className="text-red-500 text-xs mt-1">
                {errors.nombre.message}
              </p>
            )}
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
              placeholder="Describe la tarea..."
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          {/*CUALIFICACION_REQUERIDA*/}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Cualificacion Requerida
            </label>
            <select
              {...register("cualificacion_requerida")}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">— Selecciona una —</option>
              {CUALIFICACIONES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-400 mt-1">
              Solo empleados con esta cualificación podrán ejecutar la tarea.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Duración estimada (en minutos)
            </label>
            <input
              type="number"
              {...register("duracion_estimada_min")}
              placeholder="Ej: 5, 20, 60..."
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/*Activa*/}
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              {...register("activa")}
              className="rounded border-gray-300 text-blue-500 w-4 h-4"
            />
            <span className="text-sm text-gray-700">Activa?</span>
          </label>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 rounded-md transition-colors"
          >
            Crear Tarea en Catálogo
          </button>
        </form>
      </div>
    </div>
  );
}
