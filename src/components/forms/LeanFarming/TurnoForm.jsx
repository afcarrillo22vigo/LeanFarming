import { useState } from "react";

const TIPOS_TURNO = ["manana", "tarde"];

export default function TurnoForm({ onTurnoCreado }) {
  const [form, setForm] = useState({
    fecha: "",
    tipo_turno: "",
    hora_inicio: "",
    hora_fin: "",
    notas: "",
  });

  const [errores, setErrores] = useState({});

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validar = () => {
    const nuevosErrores = {};
    if (!form.fecha) nuevosErrores.fecha = "La fecha es obligatoria";
    if (!form.tipo_turno)
      nuevosErrores.tipo_turno = "Selecciona un tipo de turno";
    if (!form.hora_inicio)
      nuevosErrores.hora_inicio = "La hora de inicio es obligatoria";
    if (!form.hora_fin)
      nuevosErrores.hora_fin = "La hora de fin es obligatoria";
    if (form.hora_inicio && form.hora_fin && form.hora_inicio >= form.hora_fin)
      nuevosErrores.hora_fin =
        "La hora de fin debe ser posterior a la de inicio";
    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validar()) return;
    const turnoSimulado = {
      ...form,
      id: "turno-" + Date.now(), // id temporal hasta que haya backend
    };
    console.log("Turno a crear:", form);
    onTurnoCreado(turnoSimulado.id);
    // fetch('/api/turnos', { method: 'POST', body: JSON.stringify(form) })
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 w-full max-w-lg">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">
          Nuevo turno
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* Fecha */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fecha
            </label>
            <input
              type="date"
              name="fecha"
              value={form.fecha}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errores.fecha && (
              <p className="text-red-500 text-xs mt-1">{errores.fecha}</p>
            )}
          </div>

          {/* Tipo de turno */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tipo de turno
            </label>
            <select
              name="tipo_turno"
              value={form.tipo_turno}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">— Selecciona un tipo —</option>
              {TIPOS_TURNO.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
            {errores.tipo_turno && (
              <p className="text-red-500 text-xs mt-1">{errores.tipo_turno}</p>
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
                name="hora_inicio"
                value={form.hora_inicio}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errores.hora_inicio && (
                <p className="text-red-500 text-xs mt-1">
                  {errores.hora_inicio}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Hora fin
              </label>
              <input
                type="time"
                name="hora_fin"
                value={form.hora_fin}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errores.hora_fin && (
                <p className="text-red-500 text-xs mt-1">{errores.hora_fin}</p>
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
              name="notas"
              value={form.notas}
              onChange={handleChange}
              rows={3}
              placeholder="Posibles notas sobre el turno"
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
            {errores.descripcion && (
              <p className="text-red-500 text-xs mt-1">{errores.descripcion}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 rounded-md transition-colors"
          >
            Crear turno
          </button>
        </form>
      </div>
    </div>
  );
}
