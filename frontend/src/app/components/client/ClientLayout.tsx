import React, { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router";
import { useLocation } from "react-router";
import { Scissors, LogOut, Sun, Moon, CalendarPlus, ClipboardList } from "lucide-react";
import { applyTheme } from "../../constants";

export function ClientLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isDark, setIsDark] = useState(true);

  useEffect(() => { applyTheme(isDark); }, [isDark]);

  const isOnBooking = location.pathname.includes("booking");

  return (
    <div className="min-h-screen font-sans" style={{ background: "var(--bg)", color: "var(--text)" }}>
      <header className="sticky top-0 z-40 flex items-center justify-between px-6 h-16 backdrop-blur"
        style={{ background: isDark ? "rgba(0,0,0,0.85)" : "rgba(255,255,255,0.9)", borderBottom: "1px solid var(--border)" }}>

        {/* Logo */}
        <div className="flex items-center gap-2">
          <Scissors className="w-5 h-5" style={{ color: "var(--gold)" }} />
          <span className="font-bold" style={{ color: "var(--text)" }}>BarberApp</span>
        </div>

        {/* ✅ NAVEGACIÓN — antes no existía, el cliente no podía encontrar el wizard */}
        <nav className="flex items-center gap-2">
          <button
            onClick={() => navigate("/client")}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all"
            style={{
              background: !isOnBooking ? "var(--surface2)" : "transparent",
              color: !isOnBooking ? "var(--gold)" : "var(--text2)",
              border: "1px solid",
              borderColor: !isOnBooking ? "var(--gold)" : "transparent",
            }}
          >
            <ClipboardList className="w-4 h-4" />
            <span className="hidden sm:inline">Mis Reservas</span>
          </button>

          <button
            onClick={() => navigate("/client/booking")}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold transition-all"
            style={{
              background: isOnBooking ? "var(--gold)" : "var(--surface2)",
              color: isOnBooking ? "#000" : "var(--text2)",
              border: "1px solid",
              borderColor: isOnBooking ? "var(--gold)" : "transparent",
            }}
          >
            <CalendarPlus className="w-4 h-4" />
            <span className="hidden sm:inline">Reservar Turno</span>
          </button>
        </nav>

        {/* Acciones */}
        <div className="flex items-center gap-3">
          <button onClick={() => setIsDark(!isDark)} className="w-9 h-9 rounded-lg flex items-center justify-center"
            style={{ background: "var(--surface2)", border: "1px solid var(--border)" }}>
            {isDark ? <Sun className="w-4 h-4" style={{ color: "var(--gold)" }} /> : <Moon className="w-4 h-4" style={{ color: "var(--gold)" }} />}
          </button>
          <button onClick={() => { localStorage.clear(); navigate("/"); }} className="text-sm flex gap-2 items-center" style={{ color: "var(--text2)" }}>
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Salir</span>
          </button>
        </div>
      </header>
      <main><Outlet /></main>
    </div>
  );
}