import { useState, useEffect } from "react";
import { Calendar, Clock, User, CheckCircle, XCircle, UserPlus } from "lucide-react";
import { apiClient } from "../utils/apsClient";
import { WalkInModal } from "../WalkInModal";

interface Turno {
  id: number;
  cliente: { nombre: string; apellido: string } | null;
  nombreWalkin: string | null;
  servicio: { nombre: string };
  sucursal: { nombre: string };
  fechaHoraInicio: string;
  estado: string;
}

function nombreCliente(t: Turno): string {
  if (t.nombreWalkin) return `${t.nombreWalkin} (walk-in)`;
  if (t.cliente)      return `${t.cliente.nombre} ${t.cliente.apellido}`;
  return "—";
}

function getBarberoIdDelToken(): number | undefined {
  try {
    const token = localStorage.getItem("token") ?? "";
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.id as number;
  } catch {
    return undefined;
  }
}

export function BarberDashboard() {
  const [turnos,     setTurnos]     = useState<Turno[]>([]);
  const [loading,    setLoading]    = useState(true);
  const [walkInOpen, setWalkInOpen] = useState(false);

  const barberoId = getBarberoIdDelToken();

  async function cargarTurnos() {
    setLoading(true);
    try {
      const data = await apiClient<Turno[]>("/turnos");
      setTurnos(data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { cargarTurnos(); }, []);

  async function completar(id: number) {
    await apiClient(`/turnos/${id}/completar`, { method: "PUT" });
    cargarTurnos();
  }

  async function cancelar(id: number) {
    await apiClient(`/turnos/${id}/cancelar`, { method: "PUT" });
    cargarTurnos();
  }

  const hoy = new Date().toISOString().split("T")[0];
  const turnosHoy = turnos.filter(t => t.fechaHoraInicio.startsWith(hoy) && t.estado === "PENDIENTE");

  return (
    <div style={{ padding: "1.5rem", color: "var(--text)" }}>

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <div>
          <h1 style={{ margin: 0, fontSize: "1.6rem", fontWeight: 700 }}>Mi Agenda</h1>
          <p style={{ margin: "0.25rem 0 0", color: "var(--text-muted)", fontSize: "0.9rem" }}>
            {turnosHoy.length} turno{turnosHoy.length !== 1 ? "s" : ""} pendiente{turnosHoy.length !== 1 ? "s" : ""} hoy
          </p>
        </div>
        <button
          onClick={() => setWalkInOpen(true)}
          style={{
            display: "flex", alignItems: "center", gap: "0.5rem",
            background: "var(--gold)", color: "#000",
            border: "none", borderRadius: "0.6rem",
            padding: "0.6rem 1.2rem", fontWeight: 700,
            cursor: "pointer", fontSize: "0.9rem",
          }}
        >
          <UserPlus size={17} /> Walk-in
        </button>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "1rem", marginBottom: "2rem" }}>
        {[
          { label: "Hoy",         value: turnosHoy.length,                                     icon: <Calendar size={20} color="var(--gold)" /> },
          { label: "Completados", value: turnos.filter(t => t.estado === "COMPLETADO").length,  icon: <CheckCircle size={20} color="#4ade80" /> },
          { label: "Cancelados",  value: turnos.filter(t => t.estado === "CANCELADO").length,   icon: <XCircle size={20} color="#f87171" /> },
        ].map(s => (
          <div key={s.label} style={{
            background: "var(--card-bg)", border: "1px solid var(--border)",
            borderRadius: "0.75rem", padding: "1.1rem",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>{s.label}</span>
              {s.icon}
            </div>
            <div style={{ fontSize: "1.8rem", fontWeight: 700, marginTop: "0.25rem" }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Lista */}
      <div style={{ background: "var(--card-bg)", border: "1px solid var(--border)", borderRadius: "0.75rem" }}>
        <div style={{ padding: "1rem 1.25rem", borderBottom: "1px solid var(--border)", fontWeight: 600 }}>
          Turnos de hoy
        </div>

        {loading ? (
          <p style={{ padding: "2rem", textAlign: "center", color: "var(--text-muted)" }}>Cargando...</p>
        ) : turnosHoy.length === 0 ? (
          <p style={{ padding: "2rem", textAlign: "center", color: "var(--text-muted)" }}>No hay turnos pendientes para hoy</p>
        ) : (
          turnosHoy.map(t => (
            <div key={t.id} style={{
              padding: "1rem 1.25rem",
              borderBottom: "1px solid var(--border)",
              display: "flex", justifyContent: "space-between", alignItems: "center",
            }}>
              <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
                <div style={{
                  width: 40, height: 40, borderRadius: "50%",
                  background: "var(--gold)22",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <User size={18} color="var(--gold)" />
                </div>
                <div>
                  <div style={{ fontWeight: 600 }}>{nombreCliente(t)}</div>
                  <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", display: "flex", gap: "0.75rem", marginTop: "0.1rem" }}>
                    <span style={{ display: "flex", alignItems: "center", gap: "0.2rem" }}>
                      <Clock size={11} /> {t.fechaHoraInicio.split("T")[1]?.slice(0, 5)}
                    </span>
                    <span>{t.servicio.nombre}</span>
                    <span>{t.sucursal.nombre}</span>
                  </div>
                </div>
              </div>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <ActionBtn onClick={() => completar(t.id)} bg="#4ade8022" color="#4ade80" icon={<CheckCircle size={15} />} label="Completar" />
                <ActionBtn onClick={() => cancelar(t.id)}  bg="#f8717122" color="#f87171" icon={<XCircle size={15} />}    label="Cancelar" />
              </div>
            </div>
          ))
        )}
      </div>

      <WalkInModal
        isOpen={walkInOpen}
        onClose={() => setWalkInOpen(false)}
        onSuccess={cargarTurnos}
        barberoPreseleccionado={barberoId}
      />
    </div>
  );
}

function ActionBtn({ onClick, bg, color, icon, label }: {
  onClick: () => void; bg: string; color: string;
  icon: React.ReactNode; label: string;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        display: "flex", alignItems: "center", gap: "0.3rem",
        background: bg, color,
        border: `1px solid ${color}44`,
        borderRadius: "0.4rem",
        padding: "0.35rem 0.7rem",
        cursor: "pointer", fontSize: "0.8rem", fontWeight: 600,
      }}
    >
      {icon} {label}
    </button>
  );
}