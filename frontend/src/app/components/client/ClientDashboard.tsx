import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Scissors, Plus, XCircle } from "lucide-react";
import { apiClient } from "../utils/apsClient";

const ESTADO_STYLE: Record<string, { color: string; bg: string }> = {
  PENDIENTE:  { color: "#F59E0B", bg: "rgba(245,158,11,0.12)" },
  COMPLETADO: { color: "#22C55E", bg: "rgba(34,197,94,0.12)"  },
  CANCELADO:  { color: "#EF4444", bg: "rgba(239,68,68,0.12)"  },
};

export function ClientDashboard() {
  const navigate = useNavigate();
  const [misTurnos, setMisTurnos] = useState<any[]>([]);
  const [cancelando, setCancelando] = useState<number | null>(null);

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

  const cancelarTurno = async (id: number) => {
    if (!confirm("¿Cancelar este turno?")) return;
    setCancelando(id);
    try {
      await apiClient(`/turnos/${id}/estado`, {
        method: "PUT",
        body: JSON.stringify({ estado: "CANCELADO" }),
        successMessage: "Turno cancelado",
      });
      setMisTurnos(prev => prev.map(t => t.id === id ? { ...t, estado: "CANCELADO" } : t));
    } catch (e) {
      console.error(e);
    } finally {
      setCancelando(null);
    }
  };

  const totalGastado = misTurnos
    .filter(t => t.estado !== "CANCELADO")
    .reduce((sum, t) => sum + Number(t.servicio.precio), 0);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 lg:px-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-sm mb-1" style={{ color: "var(--text2)" }}>Hola de nuevo 👋</p>
          <h1 style={{ fontSize: "2rem", color: "var(--text)", fontFamily: "'Cormorant Garamond', serif" }}>
            Mi Perfil
          </h1>
        </div>
        <button
          onClick={() => navigate("/client/booking")}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium hover:opacity-80"
          style={{ background: "var(--gold)", color: "#000" }}
        >
          <Plus className="w-4 h-4" /> Nueva Reserva
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-8">
        <div className="rounded-xl p-4" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
          <div className="text-xs mb-1" style={{ color: "var(--text2)" }}>Cortes totales</div>
          <div className="text-lg font-medium" style={{ color: "var(--text)" }}>
            {misTurnos.filter(t => t.estado !== "CANCELADO").length}
          </div>
        </div>
        <div className="rounded-xl p-4" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
          <div className="text-xs mb-1" style={{ color: "var(--text2)" }}>Total invertido</div>
          <div className="text-lg font-medium" style={{ color: "var(--text)" }}>${totalGastado.toFixed(2)}</div>
        </div>
      </div>

      <section>
        <h2
          className="text-sm font-medium mb-4 tracking-wide border-l-2 pl-2"
          style={{ color: "var(--text)", borderColor: "var(--gold)" }}
        >
          Mi Historial de Cortes
        </h2>
        <div
          className="rounded-2xl overflow-hidden"
          style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
        >
          {misTurnos.map(cut => {
            const fechaStr = new Date(cut.fechaHoraInicio).toLocaleDateString("es-ES", {
              day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit",
            });
            const estilo = ESTADO_STYLE[cut.estado] ?? ESTADO_STYLE.PENDIENTE;

            return (
              <div
                key={cut.id}
                className="px-5 py-4 flex items-center justify-between"
                style={{ borderBottom: "1px solid var(--border)" }}
              >
                {/* Izquierda */}
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: "var(--surface2)" }}
                  >
                    <Scissors className="w-4 h-4" style={{ color: "var(--gold)" }} />
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-medium truncate" style={{ color: "var(--text)" }}>
                      {cut.servicio.nombre}
                    </div>
                    <div className="text-xs" style={{ color: "var(--text2)" }}>
                      {fechaStr} hs · con {cut.barbero.nombre}
                    </div>
                  </div>
                </div>

                {/* Derecha */}
                <div className="flex items-center gap-3 flex-shrink-0 ml-4">
                  <div className="text-right">
                    <div className="text-sm font-medium" style={{ color: "var(--text)" }}>
                      ${Number(cut.servicio.precio).toFixed(2)}
                    </div>
                    <div className="text-xs" style={{ color: "var(--text2)" }}>{cut.sucursal.nombre}</div>
                  </div>

                  {/* Badge estado */}
                  <span
                    className="hidden sm:inline-block text-xs px-2 py-0.5 rounded-full font-medium"
                    style={{ color: estilo.color, background: estilo.bg }}
                  >
                    {cut.estado}
                  </span>

                  {/* Botón cancelar — solo turnos PENDIENTE */}
                  {cut.estado === "PENDIENTE" ? (
                    <button
                      onClick={() => cancelarTurno(cut.id)}
                      disabled={cancelando === cut.id}
                      title="Cancelar turno"
                      className="p-1.5 rounded-lg transition-colors hover:bg-red-500/10 disabled:opacity-40"
                      style={{ color: "#EF4444", border: "1px solid rgba(239,68,68,0.25)" }}
                    >
                      <XCircle className="w-4 h-4" />
                    </button>
                  ) : (
                    <div className="w-8" />
                  )}
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