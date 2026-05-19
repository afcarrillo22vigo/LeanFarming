import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { empleados as mockEmpleados } from "../../../mock/mock";

const ESTADOS = [
  "solicitado",
  "aprobado",
  "en_transito",
  "recibido",
  "cancelado",
];

const pedidoSchema = z.object({
  insumo: z.string().min(1, "El insumo es obligatorio"),
  descripcion: z.string().optional(),
  cantidad: z.coerce.number().min(1, "La cantidad es obligatoria"),
  unidad: z.string().optional(),
  estado: z.string(), // default del SQL
  solicitante_id: z.string().optional(),
  ts_aprobacion: z.string().optional(),
  ts_recepcion: z.string().optional(),
  proveedor: z.string().optional(),
  coste_estimado: z.coerce.number().optional(),
  coste_real: z.coerce.number().optional(),
  notas: z.string().optional(),
});

export default function PedidoForm() {
  const [empleados, setEmpleados] = useState([]);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(pedidoSchema),
    defaultValues: {
      insumo: "",
      descripcion: "",
      cantidad: "",
      unidad: "",
      estado: "solicitado", // default del SQL
      solicitante_id: "",
      ts_aprobacion: "",
      ts_recepcion: "",
      proveedor: "",
      coste_estimado: "",
      coste_real: "",
      notas: "",
    },
  });

  useEffect(() => {
    // fetch('/api/empleados').then(r => r.json()).then(setEmpleados)
    setEmpleados(mockEmpleados);
  }, []);

  const onSubmit = (datos) => {
    console.log("Pedido a crear: ", datos);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 w-full">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">
          Nuevo pedido
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
          {/* Insumo — obligatorio */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Insumo
            </label>
            <input
              type="text"
              placeholder="Ej: Paja de cebada, Desinfectante..."
              {...register("insumo")}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.insumo && (
              <p className="text-red-500 text-xs mt-1">
                {errors.insumo.message}
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
              rows={2}
              placeholder="Detalles adicionales del pedido..."
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          {/* Cantidad + Unidad */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cantidad
              </label>
              <input
                type="number"
                {...register("cantidad")}
                min="0"
                step="0.01" // NUMERIC(10,2) → dos decimales
                placeholder="Ej: 500"
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.cantidad && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.cantidad.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Unidad{" "}
                <span className="text-gray-400 font-normal">(opcional)</span>
              </label>
              <input
                type="text"
                {...register("unidad")}
                placeholder="kg, litros, sacos..."
                maxLength={30}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
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

          {/* Solicitante */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Solicitante{" "}
              <span className="text-gray-400 font-normal">(opcional)</span>
            </label>
            <select
              {...register("solicitante_id")}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">— Sin solicitante —</option>
              {empleados.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.nombre} {e.apellidos}
                </option>
              ))}
            </select>
          </div>

          {/* Proveedor */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Proveedor{" "}
              <span className="text-gray-400 font-normal">(opcional)</span>
            </label>
            <input
              type="text"
              {...register("proveedor")}
              placeholder="Ej: Agroquímicos S.L..."
              maxLength={150}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Costes */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Coste estimado (€){" "}
                <span className="text-gray-400 font-normal">(opcional)</span>
              </label>
              <input
                type="number"
                {...register("coste_estimado")}
                min="0"
                step="0.01"
                placeholder="0.00"
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Coste real (€){" "}
                <span className="text-gray-400 font-normal">(opcional)</span>
              </label>
              <input
                type="number"
                {...register("coste_real")}
                min="0"
                step="0.01"
                placeholder="0.00"
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Timestamps opcionales */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha aprobación{" "}
                <span className="text-gray-400 font-normal">(opcional)</span>
              </label>
              <input
                type="datetime-local"
                {...register("ts_aprobacion")}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha recepción{" "}
                <span className="text-gray-400 font-normal">(opcional)</span>
              </label>
              <input
                type="datetime-local"
                {...register("ts_recepcion")}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
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
              rows={2}
              placeholder="Observaciones adicionales..."
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 rounded-md transition-colors"
          >
            Crear pedido
          </button>
        </form>
      </div>
    </div>
  );
}
