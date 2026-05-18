import { data } from "autoprefixer";
import { useState, useEffect } from "react";

export default function MaquinariaForm() {
  const TIPOS = [
    "robot_ordeno",
    "carro_mezclador",
    "amamantadora",
    "bomba",
    "otro",
  ];
  const ESTADOS = ["operativo", "mantenimiento", "averiado", "baja"];

  const [form, setForm] = useState({
    nombre: "",
    tipo: "",
    zona_id: "",
    marca: "",
    modelo: "",
    numero_serie: "",
    fecha_instalacion: "",
    activa: true,
    notas: "",
  });

  const [errores, setErrores] = useState({});
  const [zonas, setZonas] = useState([]);

  useEffect(() => {
    // fetch('/api/zonas').then(r => r.json()).then(setZonas)
    setZonas([
      { id: "zona-1", nombre: "Sala de robots" },
      { id: "zona-2", nombre: "Becerrero" },
      { id: "zona-3", nombre: "Enfermería" },
      { id: "zona-4", nombre: "Alimentación" },
      { id: "zona-5", nombre: "Oficina" },
    ]);
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleBoolean = (e) => {
    setForm({ ...form, [e.target.name]: e.target.checked });
  };

  const validar = () => {
    const nuevosErrores = {};
    if (!form.nombre.trim()) nuevosErrores.nombre = "El nombre es obligatorio";
    if (!form.tipo) nuevosErrores.tipo = "El tipo es obligatorio";
    if (!form.zona_id) nuevosErrores.zona_id = "La zona es obligatoria";
    if (form.numero_serie.length > 100)
      nuevosErrores.numero_serie = "El número de serie es demasiado grande";
    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validar()) return;
    console.log("Maquinaria creada: ", form);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 w-full max-w-lg">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">
          Nueva Maquinaria
        </h2>

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
              placeholder="Ej: Robot 1, MQ213..."
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errores.nombre && (
              <p className="text-red-500 text-xs mt-1">{errores.nombre}</p>
            )}
          </div>

          {/* Número de Serie */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Número de Serie{" "}
              <span className="text-gray-400 font-normal">(opcional)</span>
            </label>
            <input
              type="text"
              name="numero_serie"
              value={form.numero_serie}
              onChange={handleChange}
              placeholder="Ej: Robot 1, MQ213..."
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errores.numero_serie && (
              <p className="text-red-500 text-xs mt-1">
                {errores.numero_serie}
              </p>
            )}
          </div>

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
              <option value="">— Selecciona un tipo —</option>
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

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Marca{" "}
                <span className="text-gray-400 font-normal">(opcional)</span>
              </label>
              <input
                type="text"
                name="marca"
                value={form.marca}
                onChange={handleChange}
                placeholder="Marca del modelo"
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Modelo{" "}
                <span className="text-gray-400 font-normal">(opcional)</span>
              </label>
              <input
                type="text"
                name="modelo"
                value={form.modelo}
                onChange={handleChange}
                placeholder="Modelo del robot"
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Fecha */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fecha de Instalación{" "}
              <span className="text-gray-400 font-normal">(opcional)</span>
            </label>
            <input
              type="date"
              name="fecha_instalacion"
              value={form.fecha_instalacion}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Zona de la Máquina
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
            {errores.zona_id && (
              <p className="text-red-500 text-xs mt-1">{errores.zona_id}</p>
            )}
          </div>

          {/* Notas */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notas sobre maquinaria{" "}
              <span className="text-gray-400 font-normal">(opcional)</span>
            </label>
            <textarea
              name="notas"
              value={form.notas}
              onChange={handleChange}
              rows={3}
              placeholder="Descripción o notas sobre maquinaria..."
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
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
            Crear Máquina
          </button>
        </form>
      </div>
    </div>
  );
}
