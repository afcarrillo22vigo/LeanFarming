import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useForm } from "react-hook-form";

const TIPOS_TURNO = ["manana", "tarde"];

const turnoSchema = z
  .object({
    fecha: z.string().min(1, "La fecha s obligatoria"),
    tipo_turno: z.string().min(1, "Selecciona un tipo de turno"),
    hora_inicio: z.string().min(1, "La hora de inicio es obligatoria"),
    hora_fin: z.string().min(1, "La hora de fin es obligatoria"),
    notas: z.string(),
  })
  .refine(
    (datos) => {
      if (!datos.hora_inicio || !datos.hora_fin) return true;
      return datos.hora_inicio < datos.hora_fin;
    },
    {
      error: "La hora de fin debe ser posterior a la de inicio",
      path: ["hora_fin"],
    },
  );

export default function TurnoForm({ onTurnoCreado }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(turnoSchema),
    defaultValues: {
      fecha: "",
      tipo_turno: "",
      hora_inicio: "",
      hora_fin: "",
      notas: "",
    },
  });

  const onSubmit = (datos) => {
    const turnoSimulado = {
      ...datos,
      id: "turno-" + Date.now(), // Mantenemos tu id temporal simulado para el mock
    };
    console.log("Turno a crear: ", datos);
    onTurnoCreado(turnoSimulado.id);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 w-full">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Nuevo turno</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
        {/* Fecha */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Fecha
          </label>
          <input
            type="date"
            {...register("fecha")}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.fecha && (
            <p className="text-red-500 text-xs mt-1">{errors.fecha.message}</p>
          )}
        </div>

        {/* Tipo de turno */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tipo de turno
          </label>
          <select
            {...register("tipo_turno")}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">— Selecciona un tipo —</option>
            {TIPOS_TURNO.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
          {errors.tipo_turno && (
            <p className="text-red-500 text-xs mt-1">
              {errors.tipo_turno.message}
            </p>
          )}
        </div>

        {/* Horas — dos campos en la misma fila */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Hora inicio
            </label>
            <input
              type="time"
              {...register("hora_inicio")}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.hora_inicio && (
              <p className="text-red-500 text-xs mt-1">
                {errors.hora_inicio.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Hora fin
            </label>
            <input
              type="time"
              {...register("hora_fin")}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.hora_fin && (
              <p className="text-red-500 text-xs mt-1">
                {errors.hora_fin.message}
              </p>
            )}
          </div>
        </div>

        {/* Notas */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Notas sobre el turno{" "}
            <span className="text-gray-400 font-normal">(opcional)</span>
          </label>
          <textarea
            {...register("notas")}
            rows={3}
            placeholder="Posibles notas sobre el turno"
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 rounded-md transition-colors"
        >
          Crear turno
        </button>
      </form>
    </div>
  );
}
