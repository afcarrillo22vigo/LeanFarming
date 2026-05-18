import { useState, useEffect } from "react";

// ENUM de estados del pedido — valores fijos de la base de datos
const ESTADOS = ["pendiente", "aprobado", "enviado", "recibido", "cancelado"];

export default function PedidoForm() {
  const [form, setForm] = useState({
    insumo: "",
    cantidad: "",
    unidad: "",
    estado: "pendiente", // valor por defecto — un pedido nuevo siempre empieza así
    solicitante_id: "", // FK → empleados
  });

  const [errores, setErrores] = useState({});

  // Lista de empleados cargada del backend
  // useEffect es el hook para hacer cosas "al montar el componente" — como un fetch inicial
  const [empleados, setEmpleados] = useState([]);

  useEffect(() => {
    // Cuando tengas el endpoint, esto será:
    // fetch('/api/empleados').then(r => r.json()).then(data => setEmpleados(data))

    // Por ahora, datos de ejemplo:
    setEmpleados([
      { id: "uuid-1", nombre: "María López" },
      { id: "uuid-2", nombre: "Carlos Méndez" },
      { id: "uuid-3", nombre: "Ana Rodríguez" },
    ]);
  }, []); // [] significa "ejecuta esto solo una vez, al montar el componente"

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validar = () => {
    const nuevosErrores = {};
    if (!form.insumo.trim()) nuevosErrores.insumo = "El insumo es obligatorio";
    if (!form.cantidad || isNaN(form.cantidad) || Number(form.cantidad) <= 0)
      nuevosErrores.cantidad = "Introduce una cantidad válida";
    if (!form.solicitante_id)
      nuevosErrores.solicitante_id = "Debes seleccionar un solicitante";
    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validar()) return;

    // Convertimos cantidad a número antes de enviar — viene como string del input
    const datos = { ...form, cantidad: Number(form.cantidad) };
    console.log("Pedido a enviar:", datos);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 w-full max-w-lg">
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">
            Nuevo pedido
          </h2>

          {/* Qué se pide */}
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
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errores.insumo && (
              <p className="text-red-500 text-xs mt-1">{errores.insumo}</p>
            )}
          </div>

          {/* Cantidad + unidad juntos — dos campos, mismo handler */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Cantidad
            </label>
            <input
              type="number"
              name="cantidad"
              placeholder="10, 25, 50..."
              value={form.cantidad}
              onChange={handleChange}
              min="0"
              step="0.1"
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errores.cantidad && (
              <p className="text-red-500 text-xs mt-1">{errores.cantidad}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Unidad
            </label>
            <input
              type="text"
              name="unidad"
              value={form.unidad}
              onChange={handleChange}
              placeholder="kg, litros, sacos..."
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* ENUM de estado */}
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

          {/* FK → empleados: se puebla con datos del backend */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Solicitante
            </label>
            <select
              name="solicitante_id"
              value={form.solicitante_id}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">— Selecciona un empleado —</option>
              {empleados.map((emp) => (
                // value es el UUID (lo que se guarda en la BD)
                // el texto visible es el nombre (lo que ve el usuario)
                <option key={emp.id} value={emp.id}>
                  {emp.nombre}
                </option>
              ))}
            </select>
            {errores.solicitante_id && <p>{errores.solicitante_id}</p>}
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
