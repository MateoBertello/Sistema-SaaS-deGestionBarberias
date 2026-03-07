import React from "react";
import { Clock } from "lucide-react";

export function ScheduleConfig() {
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6" style={{ color: "var(--text)" }}>Configuración de Horarios</h1>
      <div className="p-6 rounded-xl text-center" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
        <Clock className="w-10 h-10 mx-auto mb-4" style={{ color: "var(--gold)" }} />
        <h3 className="text-lg font-medium mb-2" style={{ color: "var(--text)" }}>Próximamente</h3>
        <p style={{ color: "var(--text2)" }}>Aquí podrás configurar los horarios de apertura y cierre de cada sucursal.</p>
      </div>
    </div>
  );
}