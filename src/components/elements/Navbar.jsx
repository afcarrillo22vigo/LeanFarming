import { NavLink } from "react-router-dom";

// NavLink es como <a> pero añade la clase "active" automáticamente
// cuando la URL coincide con el href

const LINKS_LEANFARMING = [
  { to: "/empleados", label: "Empleados" },
  { to: "/zonas", label: "Zonas" },
  { to: "/maquinaria", label: "Maquinaria" },
  { to: "/turnos", label: "Turnos" },
  { to: "/pedidos", label: "Pedidos" },
  { to: "/incidencias", label: "Incidencias" },
  { to: "/tareas-catalogo", label: "Catálogo tareas" },
  { to: "/tareas-recurrentes", label: "Tareas recurrentes" },
  { to: "/tareas-ejecuciones", label: "Ejecuciones" },
];

export default function Navbar() {
  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-3">
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
        LeanFarming
      </p>

      <div className="flex flex-wrap gap-2">
        {LINKS_LEANFARMING.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              // isActive es true cuando la URL actual coincide con link.to
              // Tailwind cambia el estilo automáticamente
              isActive
                ? "text-sm px-3 py-1 rounded-md bg-blue-50 text-blue-600 font-medium"
                : "text-sm px-3 py-1 rounded-md text-gray-600 hover:bg-gray-100"
            }
          >
            {link.label}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
