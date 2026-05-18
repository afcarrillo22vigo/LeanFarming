import { useState, useEffect } from "react";

const ESTADOS = ["pendiente", "en_curso", "completada", "vencida", "cancelada"];

export default function TareaEjecucionForm() {
  const [form, setForm] = useState({
    catalogo_id: "",
    recurrente_id: "",
    empleado_id: "",
    zona_id: "",
    maquinaria_id: "",
    estado: "pendiente",
    ts_planificada: "",
    ts_inicio: "",
    ts_fin: "",
    notas: "",
  });

  const [errores, setErrores] = useState({});
  const [catalogos, setCatalogos] = useState([]);
  const [recurrentes, setRecurrentes] = useState([]); // filtradas por catálogo
  const [empleados, setEmpleados] = useState([]);
  const [zonas, setZonas] = useState([]);
  const [maquinaria, setMaquinaria] = useState([]); // filtradas por zona

  // Cargamos catálogos, empleados y zonas al montar
  useEffect(() => {
    setCatalogos([
      { id: "cat-1", nombre: "Lavado de robot VMS" },
      { id: "cat-2", nombre: "Limpieza de bebederos" },
      { id: "cat-3", nombre: "Desinfección de camas" },
    ]);
    setEmpleados([
      { id: "emp-1", nombre: "María", apellidos: "López" },
      { id: "emp-2", nombre: "Carlos", apellidos: "Méndez" },
    ]);
    setZonas([
      { id: "zona-1", nombre: "Nave" },
      { id: "zona-2", nombre: "Becerrero" },
      { id: "zona-3", nombre: "Enfermería" },
    ]);
  }, []);

  // Encadenado 1: catálogo + recurrentes
  // Cuando cambia el catálogo, cargamos solo las tareas recurrentes de ese catálogo
  useEffect(() => {
    if (!form.catalogo_id) {
      setRecurrentes([]);
      return;
    }

    // fetch(`/api/tareas-recurrentes?catalogo_id=${form.catalogo_id}`)
    //   .then(r => r.json()).then(setRecurrentes)

    const todasLasRecurrentes = [
      {
        id: "rec-1",
        descripcion_frecuencia: "Lunes y jueves a las 22:00",
        catalogo_id: "cat-1",
      },
      {
        id: "rec-2",
        descripcion_frecuencia: "Martes y viernes a las 22:00",
        catalogo_id: "cat-1",
      },
      {
        id: "rec-3",
        descripcion_frecuencia: "Lunes, miércoles y viernes a las 10:00",
        catalogo_id: "cat-2",
      },
    ];
    setRecurrentes(
      todasLasRecurrentes.filter((r) => r.catalogo_id === form.catalogo_id),
    );
  }, [form.catalogo_id]);

  // Encadenado 2: zona → maquinaria
  useEffect(() => {
    if (!form.zona_id) {
      setMaquinaria([]);
      return;
    }

    // fetch(`/api/maquinaria?zona_id=${form.zona_id}`)
    //   .then(r => r.json()).then(setMaquinaria)

    const todasLasMaquinas = [
      { id: "maq-1", nombre: "VMS 1", zona_id: "zona-1" },
      { id: "maq-2", nombre: "VMS 2", zona_id: "zona-1" },
      { id: "maq-3", nombre: "VMS 3", zona_id: "zona-1" },
      { id: "maq-4", nombre: "Carro TMR", zona_id: "zona-1" },
    ];
    setMaquinaria(todasLasMaquinas.filter((m) => m.zona_id === form.zona_id));
  }, [form.zona_id]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Al cambiar catálogo reseteamos recurrente
    if (name === "catalogo_id") {
      setForm({ ...form, catalogo_id: value, recurrente_id: "" });
      return;
    }

    // Al cambiar zona reseteamos maquinaria
    if (name === "zona_id") {
      setForm({ ...form, zona_id: value, maquinaria_id: "" });
      return;
    }

    setForm({ ...form, [name]: value });
  };

  const validar = () => {
    const nuevosErrores = {};
    if (!form.catalogo_id)
      nuevosErrores.catalogo_id = "La tarea es obligatoria";
    if (!form.ts_planificada)
      nuevosErrores.ts_planificada = "La fecha planificada es obligatoria";
    // ts_fin debe ser posterior a ts_inicio si ambos están rellenos
    if (form.ts_inicio && form.ts_fin && form.ts_fin <= form.ts_inicio)
      nuevosErrores.ts_fin =
        "La fecha de fin debe ser posterior a la de inicio";
    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validar()) return;

    const datos = {
      ...form,
      recurrente_id: form.recurrente_id || null,
      empleado_id: form.empleado_id || null,
      zona_id: form.zona_id || null,
      maquinaria_id: form.maquinaria_id || null,
      ts_inicio: form.ts_inicio || null,
      ts_fin: form.ts_fin || null,
      notas: form.notas || null,
    };

    console.log("Ejecución a crear:", datos);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 w-full max-w-lg">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">
          Nueva ejecución de tarea
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* Catálogo — obligatorio */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tarea
            </label>
            <select
              name="catalogo_id"
              value={form.catalogo_id}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">— Selecciona una tarea —</option>
              {catalogos.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nombre}
                </option>
              ))}
            </select>
            {errores.catalogo_id && (
              <p className="text-red-500 text-xs mt-1">{errores.catalogo_id}</p>
            )}
          </div>

          {/* Recurrente — filtrada por catálogo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Frecuencia{" "}
              <span className="text-gray-400 font-normal">(opcional)</span>
            </label>
            <select
              name="recurrente_id"
              value={form.recurrente_id}
              onChange={handleChange}
              disabled={!form.catalogo_id}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-400"
            >
              <option value="">— Sin frecuencia asociada —</option>
              {recurrentes.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.descripcion_frecuencia}
                </option>
              ))}
            </select>
            {!form.catalogo_id && (
              <p className="text-xs text-gray-400 mt-1">
                Selecciona primero una tarea.
              </p>
            )}
          </div>

          {/* Estado */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Estado
            </label>
            <select
              name="estado"
              value={form.estado}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {ESTADOS.map((e) => (
                <option key={e} value={e}>
                  {e}
                </option>
              ))}
            </select>
          </div>

          {/* Empleado */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Empleado{" "}
              <span className="text-gray-400 font-normal">(opcional)</span>
            </label>
            <select
              name="empleado_id"
              value={form.empleado_id}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">— Sin asignar —</option>
              {empleados.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.nombre} {e.apellidos}
                </option>
              ))}
            </select>
          </div>

          {/* Zona → encadenado con maquinaria */}
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
              <option value="">— Sin zona —</option>
              {zonas.map((z) => (
                <option key={z.id} value={z.id}>
                  {z.nombre}
                </option>
              ))}
            </select>
          </div>

          {/* Maquinaria — filtrada por zona */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Maquinaria{" "}
              <span className="text-gray-400 font-normal">(opcional)</span>
            </label>
            <select
              name="maquinaria_id"
              value={form.maquinaria_id}
              onChange={handleChange}
              disabled={!form.zona_id}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-400"
            >
              <option value="">— Ninguna —</option>
              {maquinaria.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.nombre}
                </option>
              ))}
            </select>
            {!form.zona_id && (
              <p className="text-xs text-gray-400 mt-1">
                Selecciona primero una zona.
              </p>
            )}
          </div>

          {/* Timestamps — los tres en orden lógico */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fecha planificada
            </label>
            <input
              type="datetime-local"
              name="ts_planificada"
              value={form.ts_planificada}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errores.ts_planificada && (
              <p className="text-red-500 text-xs mt-1">
                {errores.ts_planificada}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Inicio real{" "}
                <span className="text-gray-400 font-normal">(opcional)</span>
              </label>
              <input
                type="datetime-local"
                name="ts_inicio"
                value={form.ts_inicio}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fin real{" "}
                <span className="text-gray-400 font-normal">(opcional)</span>
              </label>
              <input
                type="datetime-local"
                name="ts_fin"
                value={form.ts_fin}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errores.ts_fin && (
                <p className="text-red-500 text-xs mt-1">{errores.ts_fin}</p>
              )}
            </div>
          </div>

          {/* Notas */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notas{" "}
              <span className="text-gray-400 font-normal">(opcional)</span>
            </label>
            <textarea
              name="notas"
              value={form.notas}
              onChange={handleChange}
              rows={3}
              placeholder="Observaciones sobre la ejecución..."
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 rounded-md transition-colors"
          >
            Registrar ejecución
          </button>
        </form>
      </div>
    </div>
  );
}
