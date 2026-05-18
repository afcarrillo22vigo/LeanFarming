import { useState } from "react";

const ROLES = ["encargado", "auxiliar", "veterinario", "mecanico"];
const CUALIFICACIONES = ["VMS", "TMR", "veterinaria"];

const hoy = new Date().toISOString().split("T")[0];

export default function EmpleadoForm() {
  const [form, setForm] = useState({
    nombre: "",
    apellidos: "",
    rol: "",
    cualificaciones: [],
    telefono: "",
    email: "",
    fecha_alta: hoy,
    fecha_baja: "",
    activo: true,
  });

  const [errores, setErrores] = useState({});

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCheckbox = (e) => {
    const valor = e.target.value;
    const yaEsta = form.cualificaciones.includes(valor);
    setForm({
      ...form,
      cualificaciones: yaEsta
        ? form.cualificaciones.filter((c) => c !== valor)
        : [...form.cualificaciones, valor],
    });
  };

  const handleBoolean = (e) => {
    setForm({ ...form, [e.target.name]: e.target.checked });
  };

  const validar = () => {
    const nuevosErrores = {};
    if (!form.nombre.trim()) nuevosErrores.nombre = "El nombre es obligatorio";
    if (!form.apellidos.trim())
      nuevosErrores.apellidos = "Los apellidos son obligatorios";
    if (!form.rol) nuevosErrores.rol = "Debes seleccionar un rol";
    if (form.telefono.length > 20)
      nuevosErrores.telefono = "El numero de teléfono es demasiado grande";
    if (form.email.length > 150)
      nuevosErrores.email = "El email es demasiado grande";
    if (!form.fecha_alta)
      nuevosErrores.fecha_alta = "La fecha de alta es obligatoria";
    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validar()) return;
    console.log("Datos a enviar:", form);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 w-full max-w-lg">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">
          Nuevo empleado
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="grid grid-cols-2 gap-4">
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
                placeholder="Ej: María, Luis..."
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errores.nombre && (
                <p className="text-red-500 text-xs mt-1">{errores.nombre}</p>
              )}
            </div>

            {/* Apellidos */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Apellidos
              </label>
              <input
                type="text"
                name="apellidos"
                value={form.apellidos}
                onChange={handleChange}
                placeholder="Ej: López, Fernández..."
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errores.apellidos && (
                <p className="text-red-500 text-xs mt-1">{errores.apellidos}</p>
              )}
            </div>
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
                maxLength={20}
                name="telefono"
                value={form.telefono}
                onChange={handleChange}
                placeholder="Ej: 123453..."
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errores.telefono && (
                <p className="text-red-500 text-xs mt-1">{errores.telefono}</p>
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
                name="email"
                value={form.email}
                maxLength={150}
                onChange={handleChange}
                placeholder="Ej: cuenta@gmail.com, 123@..."
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errores.email && (
                <p className="text-red-500 text-xs mt-1">{errores.email}</p>
              )}
            </div>
          </div>

          {/* Rol */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Rol
            </label>
            <select
              name="rol"
              value={form.rol}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">— Selecciona un rol —</option>
              {ROLES.map((rol) => (
                <option key={rol} value={rol}>
                  {rol}
                </option>
              ))}
            </select>
            {errores.rol && (
              <p className="text-red-500 text-xs mt-1">{errores.rol}</p>
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
                name="fecha_alta"
                value={form.fecha_alta}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Fecha de Baja */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha de Baja{" "}
                <span className="text-gray-400 font-normal">(opcional)</span>
              </label>
              <input
                type="date"
                name="fecha_baja"
                value={form.fecha_baja}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Cualificaciones */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cualificaciones{" "}
              <span className="text-gray-400 font-normal">(opcional)</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              {CUALIFICACIONES.map((c) => (
                <label
                  key={c}
                  className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    value={c}
                    checked={form.cualificaciones.includes(c)}
                    onChange={handleCheckbox}
                    className="rounded border-gray-300 text-blue-500"
                  />
                  {c}
                </label>
              ))}
            </div>
          </div>

          {/* Activo */}
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              name="activo"
              checked={form.activo}
              onChange={handleBoolean}
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
