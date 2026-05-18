import { useState } from "react";
import EmpleadoForm from "./components/forms/LeanFarming/EmpleadoForm";
import PedidoForm from "./components/forms/LeanFarming/PedidoForm";
import TurnoForm from "./components/forms/LeanFarming/TurnoForm";
import AsignacionTurnoForm from "./components/forms/LeanFarming/AsignacionTurnoForm";
import IncidenciaForm from "./components/forms/LeanFarming/IncidenciaForm";
import ZonaForm from "./components/forms/LeanFarming/ZonaForm";
import MaquinariaForm from "./components/forms/LeanFarming/MaquinariaForm";
import TareasCatalogoForm from "./components/forms/LeanFarming/TareasCatalogo";
import TareaRecurrenteForm from "./components/forms/LeanFarming/TareasRecurrentesForm";
import TareaEjecucionForm from "./components/forms/LeanFarming/TareaEjecucionForm";

export default function App() {
  // El turnoId creado sube al padre para pasárselo a AsignacionTurnoForm
  const [turnoId, setTurnoId] = useState(null);

  return (
    <div>
      <EmpleadoForm />
      <PedidoForm />
      <TurnoForm onTurnoCreado={setTurnoId} />
      <AsignacionTurnoForm turnoId={turnoId} />
      <IncidenciaForm></IncidenciaForm>
      <ZonaForm></ZonaForm>
      <MaquinariaForm></MaquinariaForm>
      <TareasCatalogoForm></TareasCatalogoForm>
      <TareaRecurrenteForm></TareaRecurrenteForm>
      <TareaEjecucionForm></TareaEjecucionForm>
    </div>
  );
}
