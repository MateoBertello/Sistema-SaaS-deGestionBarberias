import { useState, useEffect, useMemo } from "react";
import { X, UserPlus } from "lucide-react";
import { apiClient } from "./utils/apsClient";

interface Barbero  { id: number; nombre: string; apellido: string; }
interface Servicio { id: number; nombre: string; duracionMinutos: number; }
interface Sucursal { id: number; nombre: string; }

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  barberoPreseleccionado?: number;
}

function generarSlots(duracion: number): string[] {
  const slots: string[] = [];
  for (let m = 9 * 60; m + duracion <= 18 * 60; m += duracion) {
    const hh = Math.floor(m / 60).toString().padStart(2, "0");
    const mm = (m % 60).toString().padStart(2, "0");
    slots.push(`${hh}:${mm}`);
  }
  return slots;
}

const ESTADO_INICIAL = {
  nombre: "", barberoId: "", servicioId: "",
  sucursalId: "", fecha: "", slot: "",
};

export function WalkInModal({ isOpen, onClose, onSuccess, barberoPreseleccionado }: Props) {
  const [form,       setForm]       = useState(ESTADO_INICIAL);
  const [barberos,   setBarberos]   = useState<Barbero[]>([]);
  const [servicios,  setServicios]  = useState<Servicio[]>([]);
  const [sucursales, setSucursales] = useState<Sucursal[]>([]);
  const [loading,    setLoading]    = useState(false);
  const [error,      setError]      = useState("");

  const servicioActual = servicios.find(s => s.id.toString() === form.servicioId);
  const slots = useMemo(
    () => servicioActual ? generarSlots(servicioActual.duracionMinutos) : [],
    [servicioActual]
  );

  useEffect(() => {
    if (!isOpen) return;
    Promise.all([
      apiClient<Barbero[]>("/usuarios/barberos"),
      apiClient<Servicio[]>("/servicios"),
      apiClient<Sucursal[]>("/sucursales"),
    ]).then(([b, s, su]) => {
      setBarberos(b);
      setServicios(s);
      setSucursales(su);
    }).catch(() => setError("Error al cargar datos"));

    setForm({ ...ESTADO_INICIAL, barberoId: barberoPreseleccionado?.toString() ?? "" });
    setError("");
  }, [isOpen, barberoPreseleccionado]);

  function set(field: keyof typeof ESTADO_INICIAL, value: string) {
    setForm(prev => ({
      ...prev,
      [field]: value,
      ...(field === "servicioId" || field === "fecha" ? { slot: "" } : {}),
    }));
  }

  async function handleSubmit() {
    if (!form.nombre.trim())       return setError("Ingresá el nombre del cliente");
    if (!form.barberoId)           return setError("Seleccioná un barbero");
    if (!form.servicioId)          return setError("Seleccioná un servicio");
    if (!form.sucursalId)          return setError("Seleccioná una sucursal");
    if (!form.fecha || !form.slot) return setError("Seleccioná fecha y horario");

    setLoading(true);
    setError("");

    try {
      await apiClient("/turnos/walkin", {
        method: "POST",
        body: JSON.stringify({
          nombreWalkin:    form.nombre.trim(),
          barberoId:       parseInt(form.barberoId),
          servicioId:      parseInt(form.servicioId),
          sucursalId:      parseInt(form.sucursalId),
          fechaHoraInicio: `${form.fecha}T${form.slot}:00`,
        }),
      });
      onSuccess();
      onClose();
    } catch {
      setError("No se pudo crear el turno");
    } finally {
      setLoading(false);
    }
  }

  if (!isOpen) return null;

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 50,
      background: "rgba(0,0,0,0.65)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "1rem",
    }}>
      <div style={{
        background: "var(--card-bg)",
        border: "1px solid var(--border)",
        borderRadius: "1rem",
        padding: "2rem",
        width: "100%",
        maxWidth: "480px",
        color: "var(--text)",
        boxShadow: "0 24px 64px rgba(0,0,0,0.5)",
        maxHeight: "90vh",
        overflowY: "auto",
      }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <UserPlus size={22} color="var(--gold)" />
            <h2 style={{ margin: 0, fontSize: "1.2rem", fontWeight: 700 }}>Turno Walk-in</h2>
          </div>
          <button
            onClick={onClose}
            style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", padding: "0.25rem" }}
          >
            <X size={20} />
          </button>
        </div>

        <Field label="Nombre del cliente">
          <input
            value={form.nombre}
            onChange={e => set("nombre", e.target.value)}
            placeholder="Ej: Juan Pérez"
            style={inputStyle}
          />
        </Field>

        {!barberoPreseleccionado && (
          <Field label="Barbero">
            <select value={form.barberoId} onChange={e => set("barberoId", e.target.value)} style={inputStyle}>
              <option value="">— Seleccioná —</option>
              {barberos.map(b => (
                <option key={b.id} value={b.id}>{b.nombre} {b.apellido}</option>
              ))}
            </select>
          </Field>
        )}

        <Field label="Servicio">
          <select value={form.servicioId} onChange={e => set("servicioId", e.target.value)} style={inputStyle}>
            <option value="">— Seleccioná —</option>
            {servicios.map(s => (
              <option key={s.id} value={s.id}>{s.nombre} ({s.duracionMinutos} min)</option>
            ))}
          </select>
        </Field>

        <Field label="Sucursal">
          <select value={form.sucursalId} onChange={e => set("sucursalId", e.target.value)} style={inputStyle}>
            <option value="">— Seleccioná —</option>
            {sucursales.map(s => (
              <option key={s.id} value={s.id}>{s.nombre}</option>
            ))}
          </select>
        </Field>

        <Field label="Fecha">
          <input
            type="date"
            value={form.fecha}
            onChange={e => set("fecha", e.target.value)}
            min={new Date().toISOString().split("T")[0]}
            style={inputStyle}
          />
        </Field>

        {slots.length > 0 && form.fecha && (
          <Field label="Horario disponible">
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginTop: "0.25rem" }}>
              {slots.map(s => (
                <button
                  key={s}
                  onClick={() => set("slot", s)}
                  style={{
                    padding: "0.35rem 0.8rem",
                    borderRadius: "0.5rem",
                    border: `1px solid ${form.slot === s ? "var(--gold)" : "var(--border)"}`,
                    background: form.slot === s ? "var(--gold)" : "transparent",
                    color: form.slot === s ? "#000" : "var(--text)",
                    cursor: "pointer",
                    fontWeight: form.slot === s ? 700 : 400,
                    fontSize: "0.85rem",
                    transition: "all 0.15s",
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          </Field>
        )}

        {error && (
          <p style={{ color: "#f87171", fontSize: "0.85rem", marginBottom: "1rem", marginTop: "0.5rem" }}>
            {error}
          </p>
        )}

        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{
            width: "100%",
            padding: "0.8rem",
            background: "var(--gold)",
            color: "#000",
            border: "none",
            borderRadius: "0.6rem",
            fontWeight: 700,
            fontSize: "1rem",
            cursor: loading ? "not-allowed" : "pointer",
            opacity: loading ? 0.7 : 1,
            marginTop: "0.5rem",
          }}
        >
          {loading ? "Creando turno..." : "Confirmar Turno"}
        </button>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: "1rem" }}>
      <label style={{ display: "block", fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "0.35rem" }}>
        {label}
      </label>
      {children}
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "0.6rem 0.8rem",
  background: "var(--bg)",
  border: "1px solid var(--border)",
  borderRadius: "0.5rem",
  color: "var(--text)",
  fontSize: "0.95rem",
  boxSizing: "border-box",
};