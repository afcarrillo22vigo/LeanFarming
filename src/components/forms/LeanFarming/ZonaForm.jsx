import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

// 1. Esquema de validación con Zod
const zonaSchema = z.object({
  nombre: z.string().min(1, "El nombre es obligatorio"),
  codigo: z.string().min(1, "El código es obligatorio"),
  descripcion: z.string().optional(),
  tiene_pantalla_tv: z.boolean().default(false),
  tiene_tablet: z.boolean().default(false),
});

export default function ZonaForm() {
  // 2. Configuración de React Hook Form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(zonaSchema),
    defaultValues: {
      nombre: "",
      codigo: "",
      descripcion: "",
      tiene_pantalla_tv: false,
      tiene_tablet: false,
    },
  });

  // 3. El submit ya solo se ejecuta si la validación pasa
  const onSubmit = (datos) => {
    console.log("Zona a crear:", datos);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 w-full">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">Nueva zona</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
          {/* Nombre */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre
            </label>
            {/* register("nombre_del_campo") reemplaza a name, value y onChange */}
            <input
              type="text"
              placeholder="Ej: Sala de robots, Becerrero..."
              {...register("nombre")}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {/* Inyección de mensajes de Zod con RHF */}
            {errors.nombre && (
              <p className="text-red-500 text-xs mt-1">
                {errors.nombre.message}
              </p>
            )}
          </div>

          {/* Código */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Código
            </label>
            <input
              type="text"
              placeholder="Ej: z-1, zon_3..."
              {...register("codigo")}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.codigo && (
              <p className="text-red-500 text-xs mt-1">
                {errors.codigo.message}
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
              rows={3}
              placeholder="Describe la zona..."
              {...register("descripcion")}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          {/* Booleanos */}
          <div className="flex flex-col gap-3">
            <label className="block text-sm font-medium text-gray-700">
              Equipamiento
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                {...register("tiene_pantalla_tv")}
                className="rounded border-gray-300 text-blue-500 w-4 h-4"
              />
              <span className="text-sm text-gray-700">Tiene pantalla TV</span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                {...register("tiene_tablet")}
                className="rounded border-gray-300 text-blue-500 w-4 h-4"
              />
              <span className="text-sm text-gray-700">Tiene tablet</span>
            </label>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 rounded-md transition-colors"
          >
            Crear zona
          </button>
        </form>
      </div>
    </div>
  );
}
