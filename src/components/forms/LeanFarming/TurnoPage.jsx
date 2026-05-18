import { useState } from "react";
import TurnoForm from "./TurnoForm";
import AsignacionTurnoForm from "./AsignacionTurnoForm";

export default function TurnoPage() {
  const [turnoId, setTurnoId] = useState(null);

  return (
    <div className="flex flex-row gap-6 items-start">
      <div className="flex-1">
        <TurnoForm onTurnoCreado={setTurnoId} />
      </div>
      <div className="flex-1">
        <AsignacionTurnoForm turnoId={turnoId} />
      </div>
    </div>
  );
}
