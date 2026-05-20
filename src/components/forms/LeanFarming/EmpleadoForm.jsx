import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { crearEmpleado } from "../../../services/leanfarming";

const ROLES = ["encargado", "auxiliar", "veterinario", "mecanico"];
const CUALIFICACIONES = ["VMS", "TMR", "veterinaria"];
const hoy = new Date().toISOString().split("T")[0];

const empleadoSchema = z.object({
  nombre: z.string().min(1, "El nombre es obligatorio"),
  apellidos: z.string().min(1, "Los apellidos son obligatorios"),
  rol: z.string().min(1, "Debes seleccionar un rol"),
  cualificaciones: z.array(z.string()).default([]), // Lista de textos
  telefono: z.string().max(20, "El número de teléfono es demasiado grande"),
  email: z.string().max(150, "El email es demasiado grande"),
  fecha_alta: z.string().min(1, "La fecha de alta es obligatoria"),
  fecha_baja: z.string().optional().or(z.literal("")), // Permite que venga vacío del input date
  activo: z.boolean().default(true),
});

export default function EmpleadoForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(empleadoSchema),
    defaultValues: {
      nombre: "",
      apellidos: "",
      rol: "",
      cualificaciones: [],
      telefono: "",
      email: "",
      fecha_alta: hoy,
      fecha_baja: "",
      activo: true,
    },
  });

  const onSubmit = async (datos) => {
    try {
      const resultado = await crearEmpleado(datos);
      console.log("Creado:", datos);
    } catch (err) {
      console.error("Error:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 w-full">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">
          Nuevo empleado
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
          {/* Nombre */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre
            </label>
            <input
              type="text"
              placeholder="Ej: María, Luis..."
              {...register("nombre")}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.nombre && (
              <p className="text-red-500 text-xs mt-1">
                {errors.nombre.message}
              </p>
            )}
          </div>

          {/* Apellidos */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Apellidos
            </label>
            <input
              type="text"
              placeholder="Ej: López, Fernández..."
              {...register("apellidos")}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.apellidos && (
              <p className="text-red-500 text-xs mt-1">
                {errors.apellidos.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Teléfono */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Teléfono{" "}
                <span className="text-gray-400 font-normal">(opcional)</span>
              </label>
              <input
                type="text"
                placeholder="Ej: 123453..."
                {...register("telefono")}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.telefono && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.telefono.message}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email{" "}
                <span className="text-gray-400 font-normal">(opcional)</span>
              </label>
              <input
                type="text"
                placeholder="Ej: cuenta@gmail.com, 123@..."
                {...register("email")}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>
          </div>

          {/* Rol */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Rol
            </label>
            <select
              {...register("rol")}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">— Selecciona un rol —</option>
              {ROLES.map((rol) => (
                <option key={rol} value={rol}>
                  {rol}
                </option>
              ))}
            </select>
            {errors.rol && (
              <p className="text-red-500 text-xs mt-1">{errors.rol.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Fecha de Alta */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha de Alta
              </label>
              <input
                type="date"
                {...register("fecha_alta")}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.fecha_alta && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.fecha_alta.message}
                </p>
              )}
            </div>

            {/* Fecha de Baja */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha de Baja{" "}
                <span className="text-gray-400 font-normal">(opcional)</span>
              </label>
              <input
                type="date"
                {...register("fecha_baja")}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Cualificaciones (Array de checkboxes) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cualificaciones{" "}
              <span className="text-gray-400 font-normal">(opcional)</span>
            </label>
            <div className="flex flex-wrap gap-3">
              {CUALIFICACIONES.map((c) => (
                <label
                  key={c}
                  className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    value={c}
                    {...register("cualificaciones")}
                    className="rounded border-gray-300 text-blue-500"
                  />
                  {c}
                </label>
              ))}
            </div>
          </div>

          {/* Activo (Boolean) */}
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              {...register("activo")}
              className="rounded border-gray-300 text-blue-500 w-4 h-4"
            />
            <span className="text-sm text-gray-700">Empleado activo?</span>
          </label>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 rounded-md transition-colors"
          >
            Guardar empleado
          </button>
        </form>
      </div>
    </div>
  );
}
