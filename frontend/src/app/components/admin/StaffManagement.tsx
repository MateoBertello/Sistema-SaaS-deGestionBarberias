import React, { useState, useEffect } from "react";
import { Plus, Mail } from "lucide-react";
import { apiClient } from "../utils/apsClient";

const Input = ({ label, value, onChange, placeholder, type = "text" }: any) => (
  <div className="mb-3">
    <label className="block text-xs mb-1 uppercase" style={{ color: "var(--text2)" }}>{label}</label>
    <input
      type={type}
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full rounded p-2 outline-none"
      style={{ background: "var(--surface2)", border: "1px solid var(--border)", color: "var(--text)" }}
    />
  </div>
);

const Modal = ({ title, onClose, children }: any) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
    <div className="w-full max-w-md rounded-xl p-6" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
      <div className="flex justify-between mb-4">
        <h3 className="font-bold" style={{ color: "var(--text)" }}>{title}</h3>
        <button onClick={onClose} style={{ color: "var(--text2)" }}>✕</button>
      </div>
      {children}
    </div>
  </div>
);

export function StaffManagement() {
  const [staff, setStaff] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });

  const loadStaff = () =>
    apiClient<any[]>("/usuarios")
      .then(users => setStaff(users.filter((u: any) => u.rol === "BARBERO")))
      .catch(console.error);

  useEffect(() => { loadStaff(); }, []);

  const handleSave = async () => {
    if (!form.name || !form.email || !form.password) return;
    try {
      await apiClient("/auth/crear-staff", {
        method: "POST",
        body: JSON.stringify({ nombre: form.name, email: form.email, contrasena: form.password, telefono: form.phone, rol: "BARBERO", activo: true }),
        successMessage: "Barbero creado exitosamente",
      });
      setShowModal(false);
      setForm({ name: "", email: "", phone: "", password: "" });
      loadStaff();
    } catch (e) { console.error(e); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("¿Eliminar este barbero?")) return;
    try {
      await apiClient(`/usuarios/${id}`, { method: "DELETE", successMessage: "Barbero eliminado" });
      setStaff(s => s.filter(b => b.id !== id));
    } catch (e) { console.error(e); }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="flex justify-between mb-8">
        <h1 className="text-2xl font-bold" style={{ color: "var(--text)" }}>Staff</h1>
        <button onClick={() => setShowModal(true)} className="flex gap-2 px-4 py-2 rounded font-medium" style={{ background: "var(--gold)", color: "#000" }}>
          <Plus className="w-4 h-4" /> Nuevo Barbero
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {staff.map(m => (
          <div key={m.id} className="p-5 rounded-xl" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
            <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold mb-3" style={{ background: "var(--surface2)", color: "var(--text)" }}>
              {m.nombre.charAt(0).toUpperCase()}
            </div>
            <h3 className="font-medium" style={{ color: "var(--text)" }}>{m.nombre}</h3>
            <div className="text-xs mt-1 flex gap-1 items-center" style={{ color: "var(--text2)" }}>
              <Mail className="w-3 h-3" /> {m.email}
            </div>
            {m.telefono && <div className="text-xs mt-1" style={{ color: "var(--text2)" }}>{m.telefono}</div>}
            <span className="inline-block mt-2 text-xs px-2 py-0.5 rounded" style={{ background: "var(--gold-dim, rgba(201,168,76,0.15))", color: "var(--gold)", border: "1px solid var(--gold)" }}>BARBERO</span>
            <button onClick={() => handleDelete(m.id)} className="mt-4 w-full py-2 rounded border border-red-900/30 text-red-400 hover:bg-red-900/10 text-xs">Eliminar</button>
          </div>
        ))}
        {staff.length === 0 && <div className="col-span-3 text-center py-12" style={{ color: "var(--text2)" }}>No hay barberos registrados.</div>}
      </div>
      {showModal && (
        <Modal title="Nuevo Barbero" onClose={() => setShowModal(false)}>
          <Input label="Nombre" value={form.name} onChange={(v: string) => setForm({ ...form, name: v })} placeholder="Ej. Juan Perez" />
          <Input label="Email" value={form.email} onChange={(v: string) => setForm({ ...form, email: v })} placeholder="juan@barberia.com" />
          <Input label="Contraseña" value={form.password} onChange={(v: string) => setForm({ ...form, password: v })} type="password" placeholder="Mínimo 6 caracteres" />
          <Input label="Teléfono (opcional)" value={form.phone} onChange={(v: string) => setForm({ ...form, phone: v })} placeholder="+54 9 11 1234-5678" />
          <button onClick={handleSave} className="w-full py-2 font-bold rounded mt-2" style={{ background: "var(--gold)", color: "#000" }}>Guardar Barbero</button>
        </Modal>
      )}
    </div>
  );
}