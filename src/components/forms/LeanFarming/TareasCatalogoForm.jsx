import { useState } from "react";

const CUALIFICACIONES = ["VMS", "TMR", "veterinaria"];

export default function TareasCatalogoForm() {
  const [form, setForm] = useState({
    codigo: "",
    nombre: "",
    descripcion: "",
    cualificacion_requerida: "",
    duracion_estimada_min: 0,
    activa: true,
  });

  const [errores, setErrores] = useState({});

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleBoolean = (e) => {
    setForm({ ...form, [e.target.name]: e.target.checked });
  };

  const validar = () => {
    const nuevosErrores = {};
    if (!form.codigo.trim()) nuevosErrores.codigo = "El codigo es obligatorio";
    if (form.codigo && !/^[a-z_]+$/.test(form.codigo))
      nuevosErrores.codigo =
        "Solo letras minúsculas y guiones bajos (ej: lavado_robot)";
    if (!form.nombre.trim()) nuevosErrores.nombre = "El nombre es obligatorio";
    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validar()) return;

    const datos = {
      ...form,
      cualificacion_requerida: form.cualificacion_requerida || null,
      duracion_estimada_min: form.duracion_estimada_min
        ? Number(form.duracion_estimada_min)
        : null,
    };

    console.log("Tarea: ", datos);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 w-full max-w-lg">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">
          Nueva Tarea del Catálogo
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* Código */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Código
            </label>
            <input
              type="text"
              name="codigo"
              value={form.codigo}
              onChange={handleChange}
              placeholder="Ej: lavado_robot, extraer_leche..."
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-400 mt-1">
              Solo minúsculas y guiones bajos. Este código no se puede cambiar
              después.
            </p>
            {errores.codigo && (
              <p className="text-red-500 text-xs mt-1">{errores.codigo}</p>
            )}
          </div>

          {/*Nombre*/}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre
            </label>
            <input
              type="text"
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              placeholder="Ej: Lavado, Análisis..."
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errores.nombre && (
              <p className="text-red-500 text-xs mt-1">{errores.nombre}</p>
            )}
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descripción{" "}
              <span className="text-gray-400 font-normal">(opcional)</span>
            </label>
            <textarea
              name="descripcion"
              value={form.descripcion}
              onChange={handleChange}
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
              name="cualificacion_requerida"
              value={form.cualificacion_requerida}
              onChange={handleChange}
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
              name="duracion_estimada_min"
              value={form.duracion_estimada_min}
              onChange={handleChange}
              placeholder="Ej: 5, 20, 60..."
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/*Activa*/}
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              name="activa"
              checked={form.activa}
              onChange={handleBoolean}
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
