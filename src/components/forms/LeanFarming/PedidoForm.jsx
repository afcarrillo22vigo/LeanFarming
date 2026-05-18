import { useState, useEffect } from "react";

const ESTADOS = [
  "solicitado",
  "aprobado",
  "en_transito",
  "recibido",
  "cancelado",
];

export default function PedidoForm() {
  const [form, setForm] = useState({
    insumo: "",
    descripcion: "",
    cantidad: "",
    unidad: "",
    estado: "solicitado", // default del SQL
    solicitante_id: "",
    ts_aprobacion: "",
    ts_recepcion: "",
    proveedor: "",
    coste_estimado: "",
    coste_real: "",
    notas: "",
  });

  const [errores, setErrores] = useState({});
  const [empleados, setEmpleados] = useState([]);

  useEffect(() => {
    // fetch('/api/empleados').then(r => r.json()).then(setEmpleados)
    setEmpleados([
      { id: "emp-1", nombre: "María", apellidos: "López" },
      { id: "emp-2", nombre: "Carlos", apellidos: "Méndez" },
      { id: "emp-3", nombre: "Ana", apellidos: "Rodríguez" },
    ]);
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validar = () => {
    const nuevosErrores = {};
    if (!form.insumo.trim()) nuevosErrores.insumo = "El insumo es obligatorio";
    if (!form.cantidad) nuevosErrores.cantidad = "La cantidad es obligatoria";
    if (Number(form.cantidad) <= 0)
      nuevosErrores.cantidad = "La cantidad debe ser mayor que 0";
    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validar()) return;

    const datos = {
      ...form,
      // NUMERIC → Number, campos opcionales vacíos → null
      cantidad: Number(form.cantidad),
      coste_estimado: form.coste_estimado ? Number(form.coste_estimado) : null,
      coste_real: form.coste_real ? Number(form.coste_real) : null,
      solicitante_id: form.solicitante_id || null,
      ts_aprobacion: form.ts_aprobacion || null,
      ts_recepcion: form.ts_recepcion || null,
      descripcion: form.descripcion || null,
      unidad: form.unidad || null,
      proveedor: form.proveedor || null,
      notas: form.notas || null,
    };

    console.log("Pedido a crear:", datos);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 w-full max-w-lg">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">
          Nuevo pedido
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* Insumo — obligatorio */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Insumo
            </label>
            <input
              type="text"
              name="insumo"
              value={form.insumo}
              onChange={handleChange}
              placeholder="Ej: Paja de cebada, Desinfectante..."
              maxLength={200}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errores.insumo && (
              <p className="text-red-500 text-xs mt-1">{errores.insumo}</p>
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
              rows={2}
              placeholder="Detalles adicionales del pedido..."
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          {/* Cantidad + Unidad */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cantidad
              </label>
              <input
                type="number"
                name="cantidad"
                value={form.cantidad}
                onChange={handleChange}
                min="0"
                step="0.01" // NUMERIC(10,2) → dos decimales
                placeholder="Ej: 500"
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errores.cantidad && (
                <p className="text-red-500 text-xs mt-1">{errores.cantidad}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Unidad{" "}
                <span className="text-gray-400 font-normal">(opcional)</span>
              </label>
              <input
                type="text"
                name="unidad"
                value={form.unidad}
                onChange={handleChange}
                placeholder="kg, litros, sacos..."
                maxLength={30}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
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

          {/* Solicitante */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Solicitante{" "}
              <span className="text-gray-400 font-normal">(opcional)</span>
            </label>
            <select
              name="solicitante_id"
              value={form.solicitante_id}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">— Sin solicitante —</option>
              {empleados.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.nombre} {e.apellidos}
                </option>
              ))}
            </select>
          </div>

          {/* Proveedor */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Proveedor{" "}
              <span className="text-gray-400 font-normal">(opcional)</span>
            </label>
            <input
              type="text"
              name="proveedor"
              value={form.proveedor}
              onChange={handleChange}
              placeholder="Ej: Agroquímicos S.L..."
              maxLength={150}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Costes */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Coste estimado (€){" "}
                <span className="text-gray-400 font-normal">(opcional)</span>
              </label>
              <input
                type="number"
                name="coste_estimado"
                value={form.coste_estimado}
                onChange={handleChange}
                min="0"
                step="0.01"
                placeholder="0.00"
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Coste real (€){" "}
                <span className="text-gray-400 font-normal">(opcional)</span>
              </label>
              <input
                type="number"
                name="coste_real"
                value={form.coste_real}
                onChange={handleChange}
                min="0"
                step="0.01"
                placeholder="0.00"
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Timestamps opcionales */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha aprobación{" "}
                <span className="text-gray-400 font-normal">(opcional)</span>
              </label>
              <input
                type="datetime-local"
                name="ts_aprobacion"
                value={form.ts_aprobacion}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha recepción{" "}
                <span className="text-gray-400 font-normal">(opcional)</span>
              </label>
              <input
                type="datetime-local"
                name="ts_recepcion"
                value={form.ts_recepcion}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
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
              rows={2}
              placeholder="Observaciones adicionales..."
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 rounded-md transition-colors"
          >
            Crear pedido
          </button>
        </form>
      </div>
    </div>
  );
}
