import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router";
import { Check } from "lucide-react";
import { apiClient } from "../utils/apsClient";

const STEP_LABELS = ["Sucursal", "Servicio", "Barbero", "Horario", "Confirmar"];

function Progress({ current }: { current: number }) {
  return (
    <div className="mb-12 max-w-3xl mx-auto w-full px-4 flex flex-col items-center">
      <div className="flex items-center justify-between w-full mb-8 relative z-10">
        {STEP_LABELS.map((label, i) => {
          const num = i + 1;
          const done = num <= current;
          const past = num < current;
          return (
            <div key={label} className="flex flex-col items-center gap-2">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg transition-all duration-300 ${done ? "bg-[var(--gold)] text-black shadow-[0_0_15px_rgba(255,215,0,0.5)]" : "bg-[var(--surface2)] text-[var(--text2)] border-2 border-[var(--border)]"}`}>
                {past ? <Check className="w-5 h-5" /> : num}
              </div>
              <span className={`text-sm font-medium hidden sm:block transition-colors duration-300 ${done ? "text-[var(--gold)]" : "text-[var(--text2)]"}`}>{label}</span>
            </div>
          );
        })}
      </div>
      <div className="h-3 w-full bg-[var(--surface2)] rounded-full overflow-hidden mb-6 mx-5 sm:mx-10 relative">
        <div className="h-full bg-[var(--gold)] transition-all duration-500 ease-in-out shadow-[0_0_10px_rgba(255,215,0,0.8)]" style={{ width: `${((current - 1) / (STEP_LABELS.length - 1)) * 100}%` }} />
      </div>
    </div>
  );
}

export function BookingWizard() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [branch, setBranch] = useState<any>(null);
  const [service, setService] = useState<any>(null);
  const [barber, setBarber] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selTime, setSelTime] = useState("");
  const [branches, setBranches] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [allBarbers, setAllBarbers] = useState<any[]>([]);
  const [horarios, setHorarios] = useState<any[]>([]);
  const [turnosOcupados, setTurnosOcupados] = useState<any[]>([]);

  useEffect(() => {
    Promise.all([
      apiClient<any[]>("/sucursales"),
      apiClient<any[]>("/servicios"),
      apiClient<any[]>("/usuarios/barberos"),
      apiClient<any[]>("/horarios"),
    ]).then(([b, s, bar, h]) => {
      setBranches(b.filter((x: any) => x.activa));
      setServices(s.filter((x: any) => x.activo));
      setAllBarbers(bar);
      setHorarios(h);
    });
  }, []);

  useEffect(() => {
    if (barber) {
      apiClient<any[]>(`/turnos?barberoId=${barber.id}`).then(setTurnosOcupados);
    }
  }, [barber]);

  // ✅ CORREGIDO: filtra barberos que tienen al menos un horario en la sucursal elegida
  const barberosDeLaSucursal = useMemo(() => {
    if (!branch) return [];
    const barberoIdsEnSucursal = new Set(
      horarios
        .filter((h: any) => h.sucursal?.id === branch.id)
        .map((h: any) => h.barbero?.id)
    );
    return allBarbers.filter((b: any) => barberoIdsEnSucursal.has(b.id));
  }, [branch, horarios, allBarbers]);

  const slots = useMemo(() => {
    if (!service || !barber || !branch || !selectedDate) return [];
    const dateObj = new Date(selectedDate + "T12:00:00");
    const dayOfWeek = ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"][dateObj.getDay()];
    const config = horarios.find(
      (h: any) => h.barbero?.id === barber.id && h.sucursal?.id === branch.id && h.diaSemana === dayOfWeek
    );
    if (!config) return [];

    const parseMin = (t: string) => {
      const [h, m] = t.split(":");
      return parseInt(h) * 60 + parseInt(m);
    };

    const inicio = parseMin(config.horaInicio);
    const fin = parseMin(config.horaFin);
    const res: string[] = [];

    for (let m = inicio; m + service.duracionMinutos <= fin; m += 15) {
      const hh = Math.floor(m / 60).toString().padStart(2, "0");
      const mm = (m % 60).toString().padStart(2, "0");
      const start = new Date(`${selectedDate}T${hh}:${mm}:00`);
      const end = new Date(start.getTime() + service.duracionMinutos * 60000);
      const isOcc = turnosOcupados.some(
        (t: any) => t.estado !== "CANCELADO" && start < new Date(t.fechaHoraFin) && end > new Date(t.fechaHoraInicio)
      );
      if (!isOcc) res.push(`${hh}:${mm}`);
    }
    return res;
  }, [service, barber, branch, selectedDate, horarios, turnosOcupados]);

  const handleConfirm = async () => {
  const userId = localStorage.getItem("userId") || localStorage.getItem("id");
  const [slotH, slotM] = selTime.split(":").map(Number);
  const totalMin = slotH * 60 + slotM + service.duracionMinutos;
  const finH = Math.floor(totalMin / 60).toString().padStart(2, "0");
  const finM = (totalMin % 60).toString().padStart(2, "0");

  await apiClient("/turnos", {
    method: "POST",
    body: JSON.stringify({
      fechaHoraInicio: `${selectedDate}T${selTime}:00.000Z`,
      fechaHoraFin: `${selectedDate}T${finH}:${finM}:00.000Z`,
      estado: "PENDIENTE",
      cliente: { id: Number(userId) },
      barbero: { id: barber.id },
      servicio: { id: service.id },
      sucursal: { id: branch.id },
    }),
    successMessage: "Reserva confirmada",
  });
  navigate("/client");
};

  const card = "p-4 mb-3 rounded-xl cursor-pointer bg-[var(--surface)] border border-[var(--border)] hover:border-[var(--gold)] hover:opacity-90 transition-all";

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <Progress current={step} />

      <div className="min-h-[400px]">
        {/* Paso 1 — Sucursal */}
        {step === 1 && branches.map(b => (
          <div key={b.id} onClick={() => { setBranch(b); setBarber(null); setStep(2); }} className={card}>
            <h3 className="text-white font-medium">{b.nombre}</h3>
            <p className="text-zinc-500 text-sm">{b.direccion}</p>
          </div>
        ))}

        {/* Paso 2 — Servicio */}
        {step === 2 && services.map(s => (
          <div key={s.id} onClick={() => { setService(s); setStep(3); }} className={card + " flex justify-between items-center"}>
            <div>
              <p className="text-white font-medium">{s.nombre}</p>
              <p className="text-zinc-500 text-sm">{s.duracionMinutos} min</p>
            </div>
            <span className="text-[var(--gold)] font-bold">${s.precio}</span>
          </div>
        ))}

        {/* ✅ Paso 3 — Barbero filtrado por sucursal */}
        {step === 3 && (
          <>
            {barberosDeLaSucursal.length === 0 ? (
              <div className="p-6 text-center rounded-xl bg-[var(--surface)] border border-[var(--border)]">
                <p className="text-zinc-400">No hay barberos disponibles en <strong className="text-white">{branch?.nombre}</strong>.</p>
                <button onClick={() => setStep(1)} className="mt-4 text-sm text-[var(--gold)] underline">Elegir otra sucursal</button>
              </div>
            ) : (
              barberosDeLaSucursal.map(b => (
                <div key={b.id} onClick={() => { setBarber(b); setStep(4); }} className={card}>
                  <h3 className="text-white font-medium">{b.nombre}</h3>
                  <p className="text-zinc-500 text-sm">{b.email}</p>
                </div>
              ))
            )}
          </>
        )}

        {/* Paso 4 — Horario */}
        {step === 4 && (
          <div>
            <input
              type="date"
              value={selectedDate}
              min={new Date().toISOString().split("T")[0]}
              onChange={e => { setSelectedDate(e.target.value); setSelTime(""); }}
              className="w-full p-4 mb-6 bg-[var(--surface)] text-white rounded-xl border border-[var(--border)] outline-none focus:border-[var(--gold)]"
              style={{ colorScheme: "dark" }}
            />
            {selectedDate && slots.length === 0 && (
              <p className="text-red-400 text-sm bg-red-500/10 p-4 rounded-xl border border-red-500/20">
                No hay horarios disponibles para este día. Probá con otra fecha.
              </p>
            )}
            <div className="grid grid-cols-4 gap-3">
              {slots.map(t => (
                <button key={t} onClick={() => { setSelTime(t); setStep(5); }}
                  className="p-3 rounded-xl text-sm font-bold border transition-all bg-[var(--surface2)] text-[var(--gold)] border-[var(--border)] hover:border-[var(--gold)]">
                  {t}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Paso 5 — Confirmación */}
        {step === 5 && (
          <div className="p-6 bg-[var(--surface)] border border-[var(--border)] rounded-xl space-y-3">
            <h3 className="text-white font-bold text-lg mb-4">Resumen de tu reserva</h3>
            <div className="flex justify-between text-sm">
              <span className="text-zinc-400">Sucursal</span>
              <span className="text-white">{branch?.nombre}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-zinc-400">Servicio</span>
              <span className="text-white">{service?.nombre}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-zinc-400">Barbero</span>
              <span className="text-white">{barber?.nombre}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-zinc-400">Fecha y hora</span>
              <span className="text-white">{selectedDate} a las {selTime}hs</span>
            </div>
            <div className="flex justify-between text-sm pt-2 border-t border-zinc-800">
              <span className="text-zinc-400">Precio</span>
              <span className="text-[var(--gold)] font-bold">${service?.precio}</span>
            </div>
            <button onClick={handleConfirm}
              className="w-full mt-4 py-3 bg-[var(--gold)] text-black font-bold rounded-xl shadow-lg hover:opacity-90 transition-opacity">
              Confirmar Reserva
            </button>
          </div>
        )}
      </div>

      <div className="mt-8 flex justify-between">
        {step > 1 && (
          <button onClick={() => setStep(s => s - 1)} className="text-zinc-500 hover:text-zinc-300 text-sm transition-colors">
            ← Volver
          </button>
        )}
      </div>
    </div>
  );
}