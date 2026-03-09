import { useState, useEffect } from "react";
import { Users, Scissors, Building2, Calendar, UserPlus, TrendingUp } from "lucide-react";
import { apiClient } from "../utils/apsClient";
import { WalkInModal } from "../WalkInModal";

interface Turno {
  id: number;
  cliente: { nombre: string; apellido: string } | null;
  nombreWalkin: string | null;
  barbero: { nombre: string; apellido: string };
  servicio: { nombre: string };
  fechaHoraInicio: string;
  estado: string;
}

function nombreCliente(t: Turno): string {
  if (t.nombreWalkin) return `${t.nombreWalkin} (walk-in)`;
  if (t.cliente)      return `${t.cliente.nombre} ${t.cliente.apellido}`;
  return "—";
}

const ESTADO_COLOR: Record<string, { bg: string; text: string }> = {
  PENDIENTE:  { bg: "#fbbf2420", text: "#fbbf24" },
  COMPLETADO: { bg: "#4ade8020", text: "#4ade80" },
  CANCELADO:  { bg: "#f8717120", text: "#f87171" },
};

export function AdminDashboard() {
  const [stats,      setStats]      = useState({ usuarios: 0, servicios: 0, sucursales: 0, turnos: 0 });
  const [recientes,  setRecientes]  = useState<Turno[]>([]);
  const [walkInOpen, setWalkInOpen] = useState(false);
  const [loading,    setLoading]    = useState(true);

  async function cargarDatos() {
    setLoading(true);
    try {
      const [u, s, b, t] = await Promise.all([
        apiClient<any[]>("/usuarios"),
        apiClient<any[]>("/servicios"),
        apiClient<any[]>("/sucursales"),
        apiClient<Turno[]>("/turnos"),
      ]);
      setStats({
        usuarios:   u.length,
        servicios:  s.length,
        sucursales: b.length,
        turnos:     t.length,
      });
      setRecientes([...t].reverse().slice(0, 6));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { cargarDatos(); }, []);

  const statCards = [
    { label: "Usuarios",   value: stats.usuarios,   icon: <Users size={21} color="var(--gold)" /> },
    { label: "Servicios",  value: stats.servicios,  icon: <Scissors size={21} color="#a78bfa" /> },
    { label: "Sucursales", value: stats.sucursales, icon: <Building2 size={21} color="#38bdf8" /> },
    { label: "Turnos",     value: stats.turnos,     icon: <Calendar size={21} color="#4ade80" /> },
  ];

  return (
    <div style={{ padding: "1.5rem", color: "var(--text)" }}>

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <div>
          <h1 style={{ margin: 0, fontSize: "1.6rem", fontWeight: 700 }}>Panel de Control</h1>
          <p style={{ margin: "0.25rem 0 0", color: "var(--text-muted)", fontSize: "0.9rem" }}>
            Resumen general del sistema
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
          <UserPlus size={17} /> Turno Walk-in
        </button>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "1rem", marginBottom: "2rem" }}>
        {statCards.map(s => (
          <div key={s.label} style={{
            background: "var(--card-bg)", border: "1px solid var(--border)",
            borderRadius: "0.75rem", padding: "1.1rem",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.4rem" }}>
              <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>{s.label}</span>
              {s.icon}
            </div>
            <div style={{ fontSize: "2rem", fontWeight: 700 }}>
              {loading ? "—" : s.value}
            </div>
          </div>
        ))}
      </div>

      {/* Tabla */}
      <div style={{ background: "var(--card-bg)", border: "1px solid var(--border)", borderRadius: "0.75rem" }}>
        <div style={{
          padding: "1rem 1.25rem",
          borderBottom: "1px solid var(--border)",
          display: "flex", alignItems: "center", gap: "0.5rem", fontWeight: 600,
        }}>
          <TrendingUp size={17} color="var(--gold)" />
          Últimos turnos
        </div>

        {loading ? (
          <p style={{ padding: "2rem", textAlign: "center", color: "var(--text-muted)" }}>Cargando...</p>
        ) : recientes.length === 0 ? (
          <p style={{ padding: "2rem", textAlign: "center", color: "var(--text-muted)" }}>Sin turnos aún</p>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.88rem" }}>
            <thead>
              <tr>
                {["Cliente", "Barbero", "Servicio", "Fecha / Hora", "Estado"].map(h => (
                  <th key={h} style={{
                    padding: "0.6rem 1.25rem",
                    textAlign: "left",
                    fontSize: "0.75rem",
                    color: "var(--text-muted)",
                    fontWeight: 500,
                  }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recientes.map(t => {
                const ec = ESTADO_COLOR[t.estado] ?? ESTADO_COLOR.PENDIENTE;
                return (
                  <tr key={t.id} style={{ borderTop: "1px solid var(--border)" }}>
                    <td style={{ padding: "0.75rem 1.25rem" }}>{nombreCliente(t)}</td>
                    <td style={{ padding: "0.75rem 1.25rem" }}>{t.barbero.nombre} {t.barbero.apellido}</td>
                    <td style={{ padding: "0.75rem 1.25rem" }}>{t.servicio.nombre}</td>
                    <td style={{ padding: "0.75rem 1.25rem", color: "var(--text-muted)", fontSize: "0.82rem" }}>
                      {new Date(t.fechaHoraInicio).toLocaleString("es-AR", { dateStyle: "short", timeStyle: "short" })}
                    </td>
                    <td style={{ padding: "0.75rem 1.25rem" }}>
                      <span style={{
                        padding: "0.2rem 0.65rem",
                        borderRadius: "999px",
                        fontSize: "0.75rem",
                        fontWeight: 600,
                        background: ec.bg,
                        color: ec.text,
                      }}>
                        {t.estado}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      <WalkInModal
        isOpen={walkInOpen}
        onClose={() => setWalkInOpen(false)}
        onSuccess={cargarDatos}
      />
    </div>
  );
}