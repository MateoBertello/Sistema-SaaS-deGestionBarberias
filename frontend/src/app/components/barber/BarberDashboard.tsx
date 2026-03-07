import React, { useState, useEffect } from "react";
import { CheckCircle, XCircle } from "lucide-react";
import { apiClient } from "../utils/apsClient";

export function BarberDashboard() {
  const [misTurnos, setMisTurnos] = useState<any[]>([]);

  useEffect(() => {
    const fetchTurnos = async () => {
      try {
        const userId = localStorage.getItem('userId');
        if (!userId) return;
        const data = await apiClient<any[]>("/turnos");
        const soloMisTurnos = data.filter((t: any) => t.barbero.id === Number(userId));
        soloMisTurnos.sort((a: any, b: any) => new Date(a.fechaHoraInicio).getTime() - new Date(b.fechaHoraInicio).getTime());
        setMisTurnos(soloMisTurnos);
      } catch (error) { console.error("Error al cargar turnos", error); }
    };
    fetchTurnos();
  }, []);

  const cambiarEstadoTurno = async (id: number, nuevoEstado: string) => {
    try {
      await apiClient(`/turnos/${id}/estado`, {
        method: "PUT",
        body: JSON.stringify({ estado: nuevoEstado }),
        successMessage: `Turno ${nuevoEstado.toLowerCase()} correctamente`
      });
      setMisTurnos(prev => prev.map(t => t.id === id ? { ...t, estado: nuevoEstado } : t));
    } catch (error) { console.error("Error actualizando turno", error); }
  };

  const turnosPendientes = misTurnos.filter(t => t.estado === "PENDIENTE").length;
  const turnosCompletados = misTurnos.filter(t => t.estado === "COMPLETADO").length;

  return (
    <div className="p-4 lg:p-6 max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-medium mb-1" style={{ color: "var(--text)" }}>Mi Agenda</h1>
        <p className="text-sm" style={{ color: "var(--text2)" }}>Gestioná tus cortes programados para hoy.</p>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="rounded-xl p-5" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
          <div className="text-xs mb-1 uppercase tracking-wider" style={{ color: "var(--text2)" }}>Pendientes</div>
          <div className="text-3xl font-bold" style={{ color: "var(--text)" }}>{turnosPendientes}</div>
        </div>
        <div className="rounded-xl p-5" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
          <div className="text-xs mb-1 uppercase tracking-wider" style={{ color: "var(--text2)" }}>Completados</div>
          <div className="text-3xl font-bold" style={{ color: "var(--gold)" }}>{turnosCompletados}</div>
        </div>
      </div>

      <div className="rounded-2xl overflow-hidden" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
        <div className="px-5 py-4" style={{ borderBottom: "1px solid var(--border)" }}>
          <h3 className="text-sm font-medium" style={{ color: "var(--text)" }}>Próximos Turnos</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ background: "var(--surface2)" }}>
                {["Hora", "Cliente", "Servicio", "Sucursal", "Estado", "Acciones"].map(h => (
                  <th key={h} className="px-5 py-3 text-left text-xs uppercase font-medium" style={{ color: "var(--text2)" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {misTurnos.map(t => {
                const fechaStr = new Date(t.fechaHoraInicio).toLocaleString('es-ES', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
                return (
                  <tr key={t.id} style={{ borderBottom: "1px solid var(--border)" }}>
                    <td className="px-5 py-4 text-sm font-medium" style={{ color: "var(--gold)" }}>{fechaStr} hs</td>
                    <td className="px-5 py-4 text-sm" style={{ color: "var(--text)" }}>{t.cliente.nombre}</td>
                    <td className="px-5 py-4 text-sm" style={{ color: "var(--text2)" }}>{t.servicio.nombre}</td>
                    <td className="px-5 py-4 text-xs" style={{ color: "var(--text2)" }}>{t.sucursal.nombre}</td>
                    <td className="px-5 py-4">
                      <span className="px-2.5 py-1 rounded-full text-xs" style={{ background: "var(--surface2)", color: "var(--text2)", border: "1px solid var(--border)" }}>{t.estado}</span>
                    </td>
                    <td className="px-5 py-4">
                      {t.estado === "PENDIENTE" ? (
                        <div className="flex gap-2">
                          <button onClick={() => cambiarEstadoTurno(t.id, "COMPLETADO")} className="p-1.5 rounded-md text-green-400 hover:bg-green-400/10 border border-green-400/20"><CheckCircle className="w-4 h-4" /></button>
                          <button onClick={() => cambiarEstadoTurno(t.id, "CANCELADO")} className="p-1.5 rounded-md text-red-400 hover:bg-red-400/10 border border-red-400/20"><XCircle className="w-4 h-4" /></button>
                        </div>
                      ) : (
                        <span className="text-xs" style={{ color: "var(--text2)" }}>-</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {misTurnos.length === 0 && <div className="py-12 text-center text-sm" style={{ color: "var(--text2)" }}>No tienes turnos agendados.</div>}
        </div>
      </div>
    </div>
  );
}