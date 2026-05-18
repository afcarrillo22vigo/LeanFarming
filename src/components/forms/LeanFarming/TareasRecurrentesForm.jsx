import { useState, useEffect } from "react";

// Atajos de expresiones cron comunes en este dominio
// El usuario puede elegir uno o escribir el suyo propio
const FRECUENCIAS_COMUNES = [
  { label: "Cada día", valor: "0 6 * * *" },
  { label: "Lunes y jueves", valor: "0 22 * * 1,4" },
  { label: "Martes y viernes", valor: "0 22 * * 2,5" },
  { label: "Lunes, miércoles y viernes", valor: "0 10 * * 1,3,5" },
  { label: "Cada semana (lunes)", valor: "0 6 * * 1" },
  { label: "Personalizada", valor: "" },
];

export default function TareaRecurrenteForm() {
  const [form, setForm] = useState({
    catalogo_id: "",
    frecuencia_expr: "",
    zona_id: "",
    maquinaria_id: "",
    descripcion_frecuencia: "",
    activa: true,
    fecha_inicio: "",
    fecha_fin: "",
    notas: "",
  });

  const [errores, setErrores] = useState({});
  const [catalogos, setCatalogos] = useState([]);
  const [zonas, setZonas] = useState([]);
  const [maquinaria, setMaquinaria] = useState([]);

  // Cargamos catálogo y zonas al montar — no dependen de nada
  useEffect(() => {
    // fetch('/api/tareas-catalogo').then(r => r.json()).then(setCatalogos)
    setCatalogos([
      { id: "cat-1", codigo: "lavado_robot", nombre: "Lavado de robot VMS" },
      {
        id: "cat-2",
        codigo: "limpieza_bebederos",
        nombre: "Limpieza de bebederos",
      },
      {
        id: "cat-3",
        codigo: "desinfeccion_camas",
        nombre: "Desinfección de camas",
      },
    ]);

    // fetch('/api/zonas').then(r => r.json()).then(setZonas)
    setZonas([
      { id: "zona-1", nombre: "Sala de robots" },
      { id: "zona-2", nombre: "Becerrero" },
      { id: "zona-3", nombre: "Alimentación" },
    ]);
  }, []);

  // Select encadenado: cuando zona_id cambia, cargamos la maquinaria de esa zona
  useEffect(() => {
    // Si no hay zona seleccionada, vaciamos la maquinaria y salimos
    if (!form.zona_id) {
      setMaquinaria([]);
      return;
    }

    // fetch(`/api/maquinaria?zona_id=${form.zona_id}`)
    //   .then(r => r.json())
    //   .then(setMaquinaria)

    // Datos simulados filtrados por zona
    const todasLasMaquinas = [
      { id: "maq-1", nombre: "VMS 1", zona_id: "zona-1" },
      { id: "maq-2", nombre: "VMS 2", zona_id: "zona-1" },
      { id: "maq-3", nombre: "VMS 3", zona_id: "zona-1" },
      { id: "maq-4", nombre: "Carro TMR", zona_id: "zona-3" },
    ];
    setMaquinaria(todasLasMaquinas.filter((m) => m.zona_id === form.zona_id));
  }, [form.zona_id]); // se re-ejecuta solo cuando zona_id cambia

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Cuando cambia la zona, reseteamos maquinaria_id
    // porque la máquina anterior puede no pertenecer a la nueva zona
    if (name === "zona_id") {
      setForm({ ...form, zona_id: value, maquinaria_id: "" });
      return;
    }

    setForm({ ...form, [name]: value });
  };

  // Cuando el usuario elige una frecuencia común, rellena el campo cron
  const handleFrecuenciaComun = (e) => {
    setForm({ ...form, frecuencia_expr: e.target.value });
  };

  const validar = () => {
    const nuevosErrores = {};
    if (!form.catalogo_id)
      nuevosErrores.catalogo_id = "Selecciona una tarea del catálogo";
    if (!form.frecuencia_expr.trim())
      nuevosErrores.frecuencia_expr = "La frecuencia es obligatoria";
    if (!form.fecha_inicio)
      nuevosErrores.fecha_inicio = "La Fecha de Inicio es obligatoria";
    if (
      form.fecha_inicio &&
      form.fecha_fin &&
      form.fecha_inicio >= form.fecha_fin
    )
      nuevosErrores.fecha_fin =
        "La fecha de fin debe ser posterior a la de inicio";
    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validar()) return;
    const datos = {
      ...form,
      zona_id: form.zona_id || null,
      maquinaria_id: form.maquinaria_id || null,
      descripcion_frecuencia: form.descripcion_frecuencia || null,
      notas: form.notas || null,
    };
    console.log("Tarea recurrente a crear:", datos);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 w-full max-w-lg">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">
          Nueva tarea recurrente
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* Tarea del catálogo */}
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

          {/* Frecuencia — atajos + campo manual */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Frecuencia
            </label>

            {/* Atajos para no tener que escribir cron a mano */}
            <select
              onChange={handleFrecuenciaComun}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
            >
              <option value="">— Elige una frecuencia común —</option>
              {FRECUENCIAS_COMUNES.map((f) => (
                <option key={f.label} value={f.valor}>
                  {f.label}
                </option>
              ))}
            </select>

            {/* Campo manual para expresión cron personalizada */}
            <input
              type="text"
              name="frecuencia_expr"
              value={form.frecuencia_expr}
              onChange={handleChange}
              placeholder="Ej: 0 22 * * 1,4"
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-400 mt-1">
              Formato cron: minuto hora día mes día_semana (0=domingo,
              1=lunes...)
            </p>
            {errores.frecuencia_expr && (
              <p className="text-red-500 text-xs mt-1">
                {errores.frecuencia_expr}
              </p>
            )}
          </div>

          {/* Descripción Frecuencia */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descripción de la Frecuencia{" "}
              <span className="text-gray-400 font-normal">(opcional)</span>
            </label>
            <textarea
              name="descripcion_frecuencia"
              value={form.descripcion_frecuencia}
              onChange={handleChange}
              rows={3}
              placeholder="Describe la frecuencia con detalle..."
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          {/* Fechas — dos campos en la misma fila */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha Inicio
              </label>
              <input
                type="date"
                name="fecha_inicio"
                value={form.fecha_inicio}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errores.fecha_inicio && (
                <p className="text-red-500 text-xs mt-1">
                  {errores.fecha_inicio}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha Fin{" "}
                <span className="text-gray-400 font-normal">(opcional)</span>
              </label>
              <input
                type="date"
                name="fecha_fin"
                value={form.fecha_fin}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errores.fecha_fin && (
                <p className="text-red-500 text-xs mt-1">{errores.fecha_fin}</p>
              )}
            </div>
          </div>

          {/* Zona */}
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
              <option value="">— Selecciona una zona —</option>
              {zonas.map((z) => (
                <option key={z.id} value={z.id}>
                  {z.nombre}
                </option>
              ))}
            </select>
          </div>

          {/* Maquinaria — se filtra según la zona elegida */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Maquinaria{" "}
              <span className="text-gray-400 font-normal">(opcional)</span>
            </label>
            <select
              name="maquinaria_id"
              value={form.maquinaria_id}
              onChange={handleChange}
              disabled={!form.zona_id} // deshabilitado hasta que haya zona
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

          {/* Notas */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Posibles notas{" "}
              <span className="text-gray-400 font-normal">(opcional)</span>
            </label>
            <textarea
              name="notas"
              value={form.notas}
              onChange={handleChange}
              rows={3}
              placeholder="..."
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 rounded-md transition-colors"
          >
            Crear tarea recurrente
          </button>
        </form>
      </div>
    </div>
  );
}
