import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/elements/Navbar";
import EmpleadoForm from "./components/forms/LeanFarming/EmpleadoForm";
import ZonaForm from "./components/forms/LeanFarming/ZonaForm";
import MaquinariaForm from "./components/forms/LeanFarming/MaquinariaForm";
import TurnoForm from "./components/forms/LeanFarming/TurnoForm";
import AsignacionTurnoForm from "./components/forms/LeanFarming/AsignacionTurnoForm";
import PedidoForm from "./components/forms/LeanFarming/PedidoForm";
import IncidenciaForm from "./components/forms/LeanFarming/IncidenciaForm";
import TareaCatalogoForm from "./components/forms/LeanFarming/TareasCatalogoForm";
import TareaRecurrenteForm from "./components/forms/LeanFarming/TareasRecurrentesForm";
import TareaEjecucionForm from "./components/forms/LeanFarming/TareaEjecucionForm";
import TurnoPage from "./components/forms/LeanFarming/TurnoPage";

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <main className="p-6">
        <Routes>
          {/* Redirige de / a /empleados */}
          <Route path="/" element={<Navigate to="/empleados" replace />} />

          {/* LeanFarming */}
          <Route path="/empleados" element={<EmpleadoForm />} />
          <Route path="/zonas" element={<ZonaForm />} />
          <Route path="/maquinaria" element={<MaquinariaForm />} />
          <Route path="/turnos" element={<TurnoPage />} />
          <Route path="/pedidos" element={<PedidoForm />} />
          <Route path="/incidencias" element={<IncidenciaForm />} />
          <Route path="/tareas-catalogo" element={<TareaCatalogoForm />} />
          <Route path="/tareas-recurrentes" element={<TareaRecurrenteForm />} />
          <Route path="/tareas-ejecuciones" element={<TareaEjecucionForm />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}
