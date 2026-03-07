import React, { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router";
import { Scissors, LogOut, Sun, Moon } from "lucide-react";
import { applyTheme } from "../../constants";

export function BarberLayout() {
  const navigate = useNavigate();
  const [isDark, setIsDark] = useState(true);

  useEffect(() => { applyTheme(isDark); }, [isDark]);

  return (
    <div className="min-h-screen font-sans" style={{ background: "var(--bg)", color: "var(--text)" }}>
      <header className="sticky top-0 z-40 flex items-center justify-between px-6 h-16 backdrop-blur"
        style={{ background: isDark ? "rgba(0,0,0,0.85)" : "rgba(255,255,255,0.9)", borderBottom: "1px solid var(--border)" }}>
        <div className="flex items-center gap-2">
          <Scissors className="w-5 h-5" style={{ color: "var(--gold)" }} />
          <span className="font-bold" style={{ color: "var(--text)" }}>Panel Barbero</span>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setIsDark(!isDark)} className="w-9 h-9 rounded-lg flex items-center justify-center"
            style={{ background: "var(--surface2)", border: "1px solid var(--border)" }}>
            {isDark ? <Sun className="w-4 h-4" style={{ color: "var(--gold)" }} /> : <Moon className="w-4 h-4" style={{ color: "var(--gold)" }} />}
          </button>
          <button onClick={() => { localStorage.clear(); navigate("/"); }} className="text-sm flex gap-2 items-center" style={{ color: "var(--text2)" }}>
            <LogOut className="w-4 h-4" /> Salir
          </button>
        </div>
      </header>
      <main><Outlet /></main>
    </div>
  );
}