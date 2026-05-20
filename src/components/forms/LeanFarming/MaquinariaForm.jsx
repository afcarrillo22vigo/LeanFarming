import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { crearMaquinaria, getZonas } from "../../../services/leanfarming";

const TIPOS = [
  "robot_ordeno",
  "carro_mezclador",
  "amamantadora",
  "bomba",
  "otro",
];

// 1. Esquema de validación con Zod
const maquinariaSchema = z.object({
  nombre: z.string().min(1, "El nombre es obligatorio"),
  tipo: z.string().min(1, "El tipo es obligatorio"),
  zona_id: z.string().min(1, "La zona es obligatoria"),
  numero_serie: z.string().max(100, "El número de serie es demasiado grande"),
  marca: z.string(),
  modelo: z.string(),
  fecha_instalacion: z.string().optional().or(z.literal("")),
  activa: z.boolean().default(true),
  notas: z.string(),
});

export default function MaquinariaForm() {
  const [zonas, setZonas] = useState([]);

  // 2. Inicialización de React Hook Form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(maquinariaSchema),
    defaultValues: {
      nombre: "",
      tipo: "",
      zona_id: "",
      numero_serie: "",
      marca: "",
      modelo: "",
      fecha_instalacion: "",
      activa: true,
      notas: "",
    },
  });

  useEffect(() => {
    // fetch('/api/zonas').then(r => r.json()).then(setZonas)
    getZonas().then(setZonas);
  }, []);

  const onSubmit = async (datos) => {
    try {
      const resultado = await crearMaquinaria(datos);
      console.log("Maquinaria creada: ", datos);
    } catch (err) {
      console.error("Error:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 w-full">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">
          Nueva Maquinaria
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
          {/* Nombre */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre
            </label>
            <input
              type="text"
              placeholder="Ej: Robot 1, MQ213..."
              {...register("nombre")}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.nombre && (
              <p className="text-red-500 text-xs mt-1">
                {errors.nombre.message}
              </p>
            )}
          </div>

          {/* Número de Serie */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Número de Serie{" "}
              <span className="text-gray-400 font-normal">(opcional)</span>
            </label>
            <input
              type="text"
              placeholder="Ej: Robot 1, MQ213..."
              {...register("numero_serie")}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.numero_serie && (
              <p className="text-red-500 text-xs mt-1">
                {errors.numero_serie.message}
              </p>
            )}
          </div>

          {/* Tipo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tipo
            </label>
            <select
              {...register("tipo")}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">— Selecciona un tipo —</option>
              {TIPOS.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
            {errors.tipo && (
              <p className="text-red-500 text-xs mt-1">{errors.tipo.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Marca */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Marca{" "}
                <span className="text-gray-400 font-normal">(opcional)</span>
              </label>
              <input
                type="text"
                placeholder="Marca del modelo"
                {...register("marca")}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Modelo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Modelo{" "}
                <span className="text-gray-400 font-normal">(opcional)</span>
              </label>
              <input
                type="text"
                placeholder="Modelo del robot"
                {...register("modelo")}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Fecha de Instalación */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fecha de Instalación{" "}
              <span className="text-gray-400 font-normal">(opcional)</span>
            </label>
            <input
              type="date"
              {...register("fecha_instalacion")}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Zona de la Máquina */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Zona de la Máquina
            </label>
            <select
              {...register("zona_id")}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">— Selecciona una zona —</option>
              {zonas.map((z) => (
                <option key={z.id} value={z.id}>
                  {z.nombre}
                </option>
              ))}
            </select>
            {errors.zona_id && (
              <p className="text-red-500 text-xs mt-1">
                {errors.zona_id.message}
              </p>
            )}
          </div>

          {/* Notas */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notas sobre maquinaria{" "}
              <span className="text-gray-400 font-normal">(opcional)</span>
            </label>
            <textarea
              rows={3}
              placeholder="Descripción o notas sobre maquinaria..."
              {...register("notas")}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          {/* Activa */}
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
            Crear Máquina
          </button>
        </form>
      </div>
    </div>
  );
}
