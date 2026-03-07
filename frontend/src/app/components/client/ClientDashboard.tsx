import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Scissors, Plus } from "lucide-react";
import { apiClient } from "../utils/apsClient";

export function ClientDashboard() {
  const navigate = useNavigate();
  const [misTurnos, setMisTurnos] = useState<any[]>([]);

  useEffect(() => {
    const fetchMisTurnos = async () => {
      try {
        const userId = localStorage.getItem("userId");
        if (!userId) return;
        const data = await apiClient<any[]>("/turnos");
        const turnosCliente = data.filter((t: any) => t.cliente.id === Number(userId));
        turnosCliente.sort((a: any, b: any) =>
          new Date(b.fechaHoraInicio).getTime() - new Date(a.fechaHoraInicio).getTime()
        );
        setMisTurnos(turnosCliente);
      } catch (error) { console.error("Error en dashboard:", error); }
    };
    fetchMisTurnos();
  }, []);

  const totalGastado = misTurnos.reduce((sum, t) => sum + Number(t.servicio.precio), 0);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 lg:px-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-sm mb-1" style={{ color: "var(--text2)" }}>Hola de nuevo 👋</p>
          <h1 style={{ fontSize: "2rem", color: "var(--text)", fontFamily: "'Cormorant Garamond', serif" }}>Mi Perfil</h1>
        </div>
        <button onClick={() => navigate("/client/booking")}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium hover:opacity-80"
          style={{ background: "var(--gold)", color: "#000" }}>
          <Plus className="w-4 h-4" /> Nueva Reserva
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-8">
        <div className="rounded-xl p-4" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
          <div className="text-xs mb-1" style={{ color: "var(--text2)" }}>Cortes totales</div>
          <div className="text-lg font-medium" style={{ color: "var(--text)" }}>{misTurnos.length}</div>
        </div>
        <div className="rounded-xl p-4" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
          <div className="text-xs mb-1" style={{ color: "var(--text2)" }}>Total invertido</div>
          <div className="text-lg font-medium" style={{ color: "var(--text)" }}>${totalGastado.toFixed(2)}</div>
        </div>
      </div>

      <section>
        <h2 className="text-sm font-medium mb-4 tracking-wide border-l-2 pl-2"
          style={{ color: "var(--text)", borderColor: "var(--gold)" }}>
          Mi Historial de Cortes
        </h2>
        <div className="rounded-2xl overflow-hidden" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
          {misTurnos.map(cut => {
            const fechaStr = new Date(cut.fechaHoraInicio).toLocaleDateString("es-ES", {
              day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit",
            });
            return (
              <div key={cut.id} className="px-5 py-4 flex items-center justify-between"
                style={{ borderBottom: "1px solid var(--border)" }}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ background: "var(--surface2)" }}>
                    <Scissors className="w-4 h-4" style={{ color: "var(--gold)" }} />
                  </div>
                  <div>
                    <div className="text-sm font-medium" style={{ color: "var(--text)" }}>{cut.servicio.nombre}</div>
                    <div className="text-xs" style={{ color: "var(--text2)" }}>{fechaStr} hs · con {cut.barbero.nombre}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium" style={{ color: "var(--text)" }}>${Number(cut.servicio.precio).toFixed(2)}</div>
                  <div className="text-xs" style={{ color: "var(--text2)" }}>{cut.sucursal.nombre}</div>
                </div>
              </div>
            );
          })}
          {misTurnos.length === 0 && (
            <div className="py-8 text-center text-sm" style={{ color: "var(--text2)" }}>
              Aún no tenés turnos registrados.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}