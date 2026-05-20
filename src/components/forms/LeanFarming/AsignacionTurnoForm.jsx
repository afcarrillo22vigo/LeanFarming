import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useForm } from "react-hook-form";
import {
  crearAsignacionTurno,
  getEmpleados,
  getZonas,
} from "../../../services/leanfarming";

const asignacionTurnoSchema = z.object({
  turno_id: z.string().min(1, "No hay ningún torno seleccionado"),
  empleado_id: z.string().min(1, "Seleccione un empleado"),
  zona_id: z.string(),
  rol: z.string().max(80, "El tamaño del rol es demasiado grande"),
});

export default function AsignacionTurnoForm({ turnoId }) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(asignacionTurnoSchema),
    defaultValues: {
      turno_id: turnoId || "",
      empleado_id: "",
      zona_id: "",
      rol: "",
    },
  });

  const [empleados, setEmpleados] = useState([]);
  const [zonas, setZonas] = useState([]);

  useEffect(() => {
    getEmpleados().then(setEmpleados);
    getZonas().then(setZonas);
  }, []);

  const currentTurnoId = watch("turno_id");

  // Si el padre nos pasa un turnoId nuevo, actualizamos el form
  useEffect(() => {
    if (turnoId) {
      setValue("turno_id", turnoId);
    }
  }, [turnoId, setValue]);

  const onSubmit = async (datos) => {
    try {
      const resultado = await crearAsignacionTurno(datos);
      console.log("Asignación a crear: ", datos);
    } catch (err) {
      console.error("Error:", err);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 w-full">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">
        Asignar empleado al turno
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
        {/* Campo oculto para almacenar el ID del turno actual */}
        <input type="hidden" {...register("turno_id")} />

        {/* Información sobre el turno actual */}
        {currentTurnoId ? (
          <div className="bg-green-50 border border-green-200 rounded-md p-3 text-sm text-green-800">
            Turno vinculado listo para asignar:{" "}
            <span className="font-mono font-bold">{currentTurnoId}</span>
          </div>
        ) : (
          <div className="bg-amber-50 border border-amber-200 rounded-md p-3 text-sm text-amber-800">
            Primero debes crear un turno en el formulario de la izquierda.
          </div>
        )}

        {/* Empleado */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Empleado
          </label>
          <select
            {...register("empleado_id")}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">— Selecciona un empleado —</option>
            {empleados.map((e) => (
              <option key={e.id} value={e.id}>
                {e.nombre} {e.apellidos}
              </option>
            ))}
          </select>
          {errors.empleado_id && (
            <p className="text-red-500 text-xs mt-1">
              {errors.empleado_id.message}
            </p>
          )}
        </div>

        {/* Zona */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Zona de trabajo{" "}
            <span className="text-gray-400 font-normal">(opcional)</span>
          </label>
          <select
            {...register("zona_id")}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">— Sin zona asignada —</option>
            {zonas.map((z) => (
              <option key={z.id} value={z.id}>
                {z.nombre}
              </option>
            ))}
          </select>
        </div>

        {/* Rol */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Rol en el turno{" "}
            <span className="text-gray-400 font-normal">(opcional)</span>
          </label>
          <input
            type="text"
            placeholder="Ej: responsable robots, apoyo becerrero..."
            {...register("rol")}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.rol && (
            <p className="text-red-500 text-xs mt-1">{errors.rol.message}</p>
          )}
        </div>

        {/* Botón de Submit — bloqueado si no hay un turno previo */}
        <button
          type="submit"
          disabled={!currentTurnoId}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 rounded-md transition-colors disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed"
        >
          Asignar al turno
        </button>
      </form>
    </div>
  );
}
