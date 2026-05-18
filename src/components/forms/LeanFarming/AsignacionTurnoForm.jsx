import { useState, useEffect } from "react";

export default function AsignacionTurnoForm({ turnoId }) {
  const [form, setForm] = useState({
    turno_id: turnoId || "",
    empleado_id: "",
    zona_id: "",
    rol: "",
  });

  const [errores, setErrores] = useState({});
  const [empleados, setEmpleados] = useState([]);
  const [zonas, setZonas] = useState([]);

  useEffect(() => {
    // fetch('/api/empleados').then(r => r.json()).then(setEmpleados)
    setEmpleados([
      { id: "emp-1", nombre: "María", apellidos: "López" },
      { id: "emp-2", nombre: "Carlos", apellidos: "Méndez" },
      { id: "emp-3", nombre: "Ana", apellidos: "Rodríguez" },
    ]);

    // fetch('/api/zonas').then(r => r.json()).then(setZonas)
    setZonas([
      { id: "zona-1", nombre: "Nave" },
      { id: "zona-2", nombre: "Becerrero" },
      { id: "zona-3", nombre: "Enfermería" },
      { id: "zona-4", nombre: "Oficina" },
      { id: "zona-5", nombre: "General" },
    ]);
  }, []);

  // Si el padre nos pasa un turnoId nuevo, actualizamos el form
  useEffect(() => {
    setForm((f) => ({ ...f, turno_id: turnoId || "" }));
  }, [turnoId]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validar = () => {
    const nuevosErrores = {};
    if (!form.turno_id)
      nuevosErrores.turno_id = "No hay ningún turno seleccionado";
    if (!form.empleado_id) nuevosErrores.empleado_id = "Selecciona un empleado";
    if (form.rol.length > 80)
      nuevosErrores.rol = "El tamaño del rol es demasiado grande";
    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validar()) return;

    const datos = {
      ...form,
      zona_id: form.zona_id || null,
      rol: form.rol || null,
    };

    console.log("Asignación a crear:", datos);
    // fetch('/api/asignaciones-turno', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(datos)
    // })
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 w-full max-w-lg">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">
          Asignar empleado al turno
        </h2>

        {form.turno_id ? (
          <p className="text-sm text-gray-500 mb-4">
            Turno ID:{" "}
            <span className="font-mono text-gray-800">{form.turno_id}</span>
          </p>
        ) : (
          <p className="text-sm text-red-500 mb-4">
            Crea primero un turno para poder asignar empleados.
          </p>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* Empleado — obligatorio */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Empleado
            </label>
            <select
              name="empleado_id"
              value={form.empleado_id}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">— Selecciona un empleado —</option>
              {empleados.map((emp) => (
                // Mostramos nombre + apellidos para identificar mejor
                <option key={emp.id} value={emp.id}>
                  {emp.nombre} {emp.apellidos}
                </option>
              ))}
            </select>
            {errores.empleado_id && (
              <p className="text-red-500 text-xs mt-1">{errores.empleado_id}</p>
            )}
          </div>

          {/* Zona — opcional */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Zona <span className="text-gray-400 font-normal">(opcional)</span>
            </label>
            <select
              name="zona_id"
              value={form.zona_id}
              onChange={handleChange}
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

          {/* Rol — texto libre opcional, VARCHAR(80) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Rol en el turno{" "}
              <span className="text-gray-400 font-normal">(opcional)</span>
            </label>
            <input
              type="text"
              name="rol"
              value={form.rol}
              onChange={handleChange}
              placeholder="Ej: responsable robots, apoyo becerrero..."
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {errores.rol && <p className="text-red-500 text-xs">{errores.rol}</p>}

          <button
            type="submit"
            disabled={!form.turno_id}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white text-sm font-medium py-2 rounded-md transition-colors"
          >
            Asignar empleado
          </button>
        </form>
      </div>
    </div>
  );
}
