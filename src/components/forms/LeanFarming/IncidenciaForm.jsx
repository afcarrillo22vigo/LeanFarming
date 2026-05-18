import { useState, useEffect } from "react";

const TIPOS = [
  "averia_maquinaria",
  "infraestructura",
  "sanidad_animal",
  "calidad_leche",
  "alimentacion",
  "pedidos",
];
const SEVERIDADES = ["baja", "media", "alta"];
const ESTADOS = ["abierta", "en_gestion", "resuelta", "cerrada"];

export default function IncidenciaForm() {
  const [form, setForm] = useState({
    tipo: "",
    subtipo: "",
    severidad: "media", // default del SQL
    estado: "abierta", // default del SQL
    titulo: "",
    descripcion: "",
    zona_id: "",
    maquinaria_id: "",
    animal_id: "",
    reportado_por: "",
    asignado_a: "",
    foto_url: "",
    acciones: [],
  });

  const [errores, setErrores] = useState({});
  const [zonas, setZonas] = useState([]);
  const [maquinaria, setMaquinaria] = useState([]);
  const [empleados, setEmpleados] = useState([]);
  const [animales, setAnimales] = useState([]);

  // Cargamos datos maestros al montar
  useEffect(() => {
    setZonas([
      { id: "zona-1", nombre: "Nave" },
      { id: "zona-2", nombre: "Becerrero" },
      { id: "zona-3", nombre: "Enfermería" },
      { id: "zona-4", nombre: "Oficina" },
      { id: "zona-5", nombre: "General" },
    ]);
    setEmpleados([
      { id: "emp-1", nombre: "María", apellidos: "López" },
      { id: "emp-2", nombre: "Carlos", apellidos: "Méndez" },
    ]);
    setAnimales([
      { id: "ani-1", crotal_oficial: "ES001", nombre: "Lola" },
      { id: "ani-2", crotal_oficial: "ES002", nombre: "Mora" },
    ]);
  }, []);

  // Select encadenado zona →con maquinaria
  useEffect(() => {
    if (!form.zona_id) {
      setMaquinaria([]);
      return;
    }

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
    if (name === "zona_id") {
      setForm({ ...form, zona_id: value, maquinaria_id: "" });
      return;
    }
    setForm({ ...form, [name]: value });
  };

  // Handler para acciones dinámicas (JSONB)
  const handleAccionChange = (indice, campo, valor) => {
    const nuevasAcciones = form.acciones.map((accion, i) =>
      i === indice ? { ...accion, [campo]: valor } : accion,
    );
    setForm({ ...form, acciones: nuevasAcciones });
  };

  const añadirAccion = () => {
    setForm({
      ...form,
      acciones: [
        ...form.acciones,
        {
          timestamp: new Date().toISOString().slice(0, 16),
          accion: "",
          responsable_id: "",
        },
      ],
    });
  };

  const eliminarAccion = (indice) => {
    setForm({
      ...form,
      acciones: form.acciones.filter((_, i) => i !== indice),
    });
  };

  const validar = () => {
    const nuevosErrores = {};
    if (!form.titulo.trim()) nuevosErrores.titulo = "El título es obligatorio";
    if (!form.tipo) nuevosErrores.tipo = "El tipo es obligatorio";
    if (!form.severidad)
      nuevosErrores.severidad = "La severidad es obligatoria";
    form.acciones.forEach((accion, i) => {
      if (!accion.accion.trim())
        nuevosErrores[`accion_${i}`] = "Describe la acción";
    });
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
      animal_id: form.animal_id || null,
      reportado_por: form.reportado_por || null,
      asignado_a: form.asignado_a || null,
      foto_url: form.foto_url || null,
      subtipo: form.subtipo || null,
      descripcion: form.descripcion || null,
    };
    console.log("Incidencia a crear:", datos);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 w-full max-w-lg">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">
          Nueva incidencia
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* Título */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Título
            </label>
            <input
              type="text"
              name="titulo"
              value={form.titulo}
              onChange={handleChange}
              placeholder="Ej: VMS 1 parado por fallo de sensor"
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errores.titulo && (
              <p className="text-red-500 text-xs mt-1">{errores.titulo}</p>
            )}
          </div>

          {/* Tipo + Subtipo */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipo
              </label>
              <select
                name="tipo"
                value={form.tipo}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">— Selecciona —</option>
                {TIPOS.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
              {errores.tipo && (
                <p className="text-red-500 text-xs mt-1">{errores.tipo}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Subtipo{" "}
                <span className="text-gray-400 font-normal">(opcional)</span>
              </label>
              <input
                type="text"
                name="subtipo"
                value={form.subtipo}
                onChange={handleChange}
                placeholder="Ej: sensor_fallo..."
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Severidad + Estado */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Severidad
              </label>
              <select
                name="severidad"
                value={form.severidad}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {SEVERIDADES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              {errores.severidad && (
                <p className="text-red-500 text-xs mt-1">{errores.severidad}</p>
              )}
            </div>
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
              placeholder="Describe la incidencia con detalle..."
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
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
              <option value="">— Ninguna —</option>
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

          {/* Animal */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Animal{" "}
              <span className="text-gray-400 font-normal">(opcional)</span>
            </label>
            <select
              name="animal_id"
              value={form.animal_id}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">— Ninguno —</option>
              {animales.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.crotal_oficial} — {a.nombre}
                </option>
              ))}
            </select>
          </div>

          {/* Reportado por + Asignado a */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Reportado por{" "}
                <span className="text-gray-400 font-normal">(opcional)</span>
              </label>
              <select
                name="reportado_por"
                value={form.reportado_por}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">— Ninguno —</option>
                {empleados.map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.nombre} {e.apellidos}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Asignado a{" "}
                <span className="text-gray-400 font-normal">(opcional)</span>
              </label>
              <select
                name="asignado_a"
                value={form.asignado_a}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">— Ninguno —</option>
                {empleados.map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.nombre} {e.apellidos}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* URL de foto */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              URL de foto{" "}
              <span className="text-gray-400 font-normal">(opcional)</span>
            </label>
            <input
              type="text"
              name="foto_url"
              value={form.foto_url}
              onChange={handleChange}
              placeholder="https://..."
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Acciones dinámicas — JSONB */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Acciones
              </label>
              <button
                type="button"
                onClick={añadirAccion}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                + Añadir acción
              </button>
            </div>

            {form.acciones.length === 0 && (
              <p className="text-sm text-gray-400 italic">
                No hay acciones registradas aún.
              </p>
            )}

            {form.acciones.map((accion, indice) => (
              <div
                key={indice}
                className="border border-gray-200 rounded-md p-3 mb-3 flex flex-col gap-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-gray-500">
                    Acción {indice + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => eliminarAccion(indice)}
                    className="text-xs text-red-400 hover:text-red-600"
                  >
                    Eliminar
                  </button>
                </div>

                <div>
                  <label className="block text-xs text-gray-600 mb-1">
                    Fecha y hora
                  </label>
                  <input
                    type="datetime-local"
                    value={accion.timestamp}
                    onChange={(e) =>
                      handleAccionChange(indice, "timestamp", e.target.value)
                    }
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs text-gray-600 mb-1">
                    Acción realizada
                  </label>
                  <input
                    type="text"
                    value={accion.accion}
                    onChange={(e) =>
                      handleAccionChange(indice, "accion", e.target.value)
                    }
                    placeholder="Ej: Se reinició el robot, Se llamó al técnico..."
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {errores[`accion_${indice}`] && (
                    <p className="text-red-500 text-xs mt-1">
                      {errores[`accion_${indice}`]}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs text-gray-600 mb-1">
                    Responsable
                  </label>
                  <select
                    value={accion.responsable_id}
                    onChange={(e) =>
                      handleAccionChange(
                        indice,
                        "responsable_id",
                        e.target.value,
                      )
                    }
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">— Selecciona —</option>
                    {empleados.map((e) => (
                      <option key={e.id} value={e.id}>
                        {e.nombre}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            ))}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 rounded-md transition-colors"
          >
            Registrar incidencia
          </button>
        </form>
      </div>
    </div>
  );
}
