import { useState } from "react";

export default function ZonaForm() {
  const [form, setForm] = useState({
    nombre: "",
    codigo: "",
    descripcion: "",
    tiene_pantalla_tv: false, // booleano, no string
    tiene_tablet: false,
  });

  const [errores, setErrores] = useState({});

  // Handler para inputs de texto — igual que siempre
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handler para booleanos
  // e.target.checked es true/false, no e.target.value
  const handleBoolean = (e) => {
    setForm({ ...form, [e.target.name]: e.target.checked });
  };

  const validar = () => {
    const nuevosErrores = {};
    if (!form.nombre.trim()) nuevosErrores.nombre = "El nombre es obligatorio";
    if (!form.codigo.trim()) nuevosErrores.codigo = "El codigo es obligatorio";
    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validar()) return;
    console.log("Zona a crear:", form);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 w-full max-w-lg">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">Nueva zona</h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* Nombre */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre
            </label>
            <input
              type="text"
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              placeholder="Ej: Sala de robots, Becerrero..."
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errores.nombre && (
              <p className="text-red-500 text-xs mt-1">{errores.nombre}</p>
            )}
          </div>

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
              placeholder="Ej: z-1, zon_3..."
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errores.codigo && (
              <p className="text-red-500 text-xs mt-1">{errores.codigo}</p>
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
              placeholder="Describe la zona..."
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          {/* Booleanos — cada uno es un checkbox independiente */}
          <div className="flex flex-col gap-3">
            <label className="block text-sm font-medium text-gray-700">
              Equipamiento
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="tiene_pantalla_tv"
                checked={form.tiene_pantalla_tv} // checked, no value
                onChange={handleBoolean} // handler específico para booleanos
                className="rounded border-gray-300 text-blue-500 w-4 h-4"
              />
              <span className="text-sm text-gray-700">Tiene pantalla TV</span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="tiene_tablet"
                checked={form.tiene_tablet}
                onChange={handleBoolean}
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
