import React, { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router";
import { LayoutDashboard, Users, Star, MapPin, Calendar, LogOut, Sun, Moon } from "lucide-react";
import { applyTheme } from "../../constants";

const NAV_ITEMS = [
  // ✅ CORREGIDO: era "Turnos" pero la ruta es el AdminDashboard con métricas globales
  { icon: LayoutDashboard, label: "Dashboard",  path: "/admin" },
  { icon: Users,           label: "Staff",      path: "/admin/staff" },
  { icon: Star,            label: "Servicios",  path: "/admin/services" },
  { icon: MapPin,          label: "Sucursales", path: "/admin/branches" },
  { icon: Calendar,        label: "Horarios",   path: "/admin/schedules" },
];

export function AdminLayout() {
  const navigate = useNavigate();
  const [isDark, setIsDark] = useState(true);

  useEffect(() => { applyTheme(isDark); }, [isDark]);

  return (
    <div className="flex min-h-screen font-sans" style={{ background: "var(--bg)", color: "var(--text)" }}>
      <aside className="w-64 hidden lg:flex flex-col" style={{ background: "var(--surface)", borderRight: "1px solid var(--border)" }}>
        <div className="p-6" style={{ borderBottom: "1px solid var(--border)" }}>
          <span className="font-bold text-xl" style={{ color: "var(--text)" }}>
            Barber<span style={{ color: "var(--gold)" }}>SaaS</span>
          </span>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {NAV_ITEMS.map((item) => (
            <button key={item.path} onClick={() => navigate(item.path)}
              className="flex items-center gap-3 w-full px-4 py-3 text-sm rounded-xl transition-colors hover:opacity-80"
              style={{ color: "var(--text2)" }}>
              <item.icon className="w-4 h-4" /> {item.label}
            </button>
          ))}
        </nav>
        <div className="p-4 space-y-1" style={{ borderTop: "1px solid var(--border)" }}>
          <button onClick={() => setIsDark(!isDark)}
            className="flex items-center gap-3 w-full px-4 py-3 text-sm rounded-xl transition-colors"
            style={{ color: "var(--text2)" }}>
            {isDark
              ? <><Sun className="w-4 h-4" style={{ color: "var(--gold)" }} /> Modo claro</>
              : <><Moon className="w-4 h-4" style={{ color: "var(--gold)" }} /> Modo oscuro</>}
          </button>
          <button onClick={() => { localStorage.clear(); navigate("/"); }}
            className="flex items-center gap-3 w-full px-4 py-3 text-sm rounded-xl text-red-400 hover:bg-red-900/10">
            <LogOut className="w-4 h-4" /> Cerrar Sesión
          </button>
        </div>
      </aside>
      <main className="flex-1 overflow-auto"><Outlet /></main>
    </div>
  );
}