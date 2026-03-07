import React, { useState, useEffect } from "react";
import { apiClient } from "../utils/apsClient";

export function AdminDashboard() {
  const [appointments, setAppointments] = useState<any[]>([]);

  useEffect(() => {
    apiClient<any[]>("/turnos")
      .then(data => setAppointments(data))
      .catch(console.error);
  }, []);

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6" style={{ color: "var(--text)" }}>Panel de Control</h1>
      <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid var(--border)", background: "var(--surface)" }}>
        <table className="w-full">
          <thead>
            <tr style={{ background: "var(--surface2)" }}>
              {["Hora", "Cliente", "Barbero", "Servicio", "Precio", "Estado"].map(h =>
                <th key={h} className="px-5 py-3 text-left text-xs uppercase" style={{ color: "var(--text2)" }}>{h}</th>
              )}
            </tr>
          </thead>
          <tbody>
            {appointments.map((t) => (
              <tr key={t.id} style={{ borderBottom: "1px solid var(--border)" }}>
                <td className="px-5 py-4 text-sm font-medium" style={{ color: "var(--gold)" }}>{new Date(t.fechaHoraInicio).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                <td className="px-5 py-4 text-sm" style={{ color: "var(--text)" }}>{t.cliente.nombre}</td>
                <td className="px-5 py-4 text-sm" style={{ color: "var(--text2)" }}>{t.barbero.nombre}</td>
                <td className="px-5 py-4 text-sm" style={{ color: "var(--text2)" }}>{t.servicio.nombre}</td>
                <td className="px-5 py-4 text-sm" style={{ color: "var(--text)" }}>${t.servicio.precio}</td>
                <td className="px-5 py-4">
                  <span className="px-2 py-1 rounded text-xs" style={{ background: "var(--surface2)", color: "var(--text2)" }}>{t.estado}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {appointments.length === 0 &&
          <div className="p-8 text-center" style={{ color: "var(--text2)" }}>No hay turnos registrados.</div>
        }
      </div>
    </div>
  );
}