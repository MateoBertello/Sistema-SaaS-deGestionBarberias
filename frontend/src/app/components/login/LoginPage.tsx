import React, { useState } from "react";
import { useNavigate } from "react-router";
import { Eye, EyeOff, Scissors } from "lucide-react";
import { GOLD, FONT_BODY, FONT_DISPLAY, SURFACE, SURFACE2, BORDER } from "../../constants";

type AuthMode = "login" | "register";

export function LoginPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<AuthMode>("login");
  const [showPass, setShowPass] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Estados del formulario
  const [email, setEmail] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (mode === "login") {
      // --- LÓGICA DE INICIAR SESIÓN ---
      try {
        const response = await fetch('http://localhost:8080/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, contrasena }),
        });

        if (response.ok) {
          const data = await response.json();
          localStorage.setItem('token', data.token);
          localStorage.setItem('rol', data.rol);
          localStorage.setItem('nombre', data.nombre);
          localStorage.setItem('userId', data.id);

          if (data.rol === 'DUEÑO') navigate('/admin');
          else if (data.rol === 'BARBERO') navigate('/barber');
          else navigate('/client');
        } else {
          setErrorMsg("Correo o contraseña incorrectos");
        }
      } catch (error) {
        setErrorMsg("Error al conectar con el servidor.");
      }

    } else {
      // --- LÓGICA DE CREAR CUENTA (REGISTRO) ---
      try {
        const response = await fetch('http://localhost:8080/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ nombre, email, telefono, contrasena }),
        });

        if (response.ok) {
          setSuccessMsg("¡Cuenta creada con éxito! Ahora puedes iniciar sesión.");
          setMode("login"); // Lo devolvemos a la pestaña de login automáticamente
          setContrasena(""); // Limpiamos la contraseña por seguridad
        } else {
          setErrorMsg("No se pudo crear la cuenta. Quizás el correo ya está en uso.");
        }
      } catch (error) {
        setErrorMsg("Error al conectar con el servidor.");
      }
    }
  };

  const inputStyle: React.CSSProperties = { background: SURFACE2, border: `1px solid ${BORDER}`, color: "#F0EFE9" };
  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => { e.target.style.borderColor = GOLD; };
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => { e.target.style.borderColor = BORDER; };

  return (
    <div className="min-h-screen flex" style={{ fontFamily: FONT_BODY, background: "#0A0A0A" }}>
      
      {/* ── PANEL IZQUIERDO (Visual) ── */}
      <div className="hidden lg:flex lg:w-[52%] relative flex-col justify-between p-12 overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1759134198561-e2041049419c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080')` }} />
        <div className="absolute inset-0" style={{ background: "linear-gradient(150deg,rgba(10,10,10,0.88) 0%,rgba(10,10,10,0.50) 60%,rgba(201,168,76,0.08) 100%)" }} />
        <div className="relative flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: GOLD }}>
            <Scissors className="w-5 h-5 text-black" />
          </div>
          <span className="text-white text-sm tracking-widest uppercase" style={{ letterSpacing: "0.22em" }}>Barber<span style={{ color: GOLD }}>SaaS</span></span>
        </div>
        <div className="relative">
          <div className="w-10 h-px mb-6" style={{ background: GOLD }} />
          <h1 className="text-white mb-4" style={{ fontFamily: FONT_DISPLAY, fontSize: "clamp(2rem,3.5vw,3.2rem)", fontWeight: 500, lineHeight: 1.2 }}>
            La plataforma premium para barberías modernas
          </h1>
        </div>
      </div>

      {/* ── PANEL DERECHO (Formulario interactivo) ── */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-14" style={{ background: "#0D0D0D" }}>
        <div className="w-full max-w-[420px]">
          
          <div className="mb-6">
            <h2 className="text-white mb-1" style={{ fontFamily: FONT_DISPLAY, fontSize: "2rem", fontWeight: 500 }}>
              {mode === "login" ? "Bienvenido de nuevo" : "Crear cuenta"}
            </h2>
          </div>

          {/* PESTAÑAS: Login vs Registro */}
          <div className="flex rounded-lg p-1 mb-6" style={{ background: "#111", border: `1px solid ${BORDER}` }}>
            {(["login", "register"] as const).map((m) => (
              <button
                key={m}
                onClick={() => { setMode(m); setErrorMsg(""); setSuccessMsg(""); }}
                className="flex-1 py-2 rounded-md text-xs transition-all"
                style={{
                  background: mode === m ? SURFACE2 : "transparent",
                  color: mode === m ? "#F0EFE9" : "#555",
                  borderBottom: mode === m ? `2px solid ${GOLD}` : "2px solid transparent",
                }}
              >
                {m === "login" ? "Iniciar Sesión" : "Crear Cuenta"}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            
            {/* MENSAJES DE ÉXITO O ERROR */}
            {successMsg && <div className="text-green-400 text-xs p-3 rounded bg-green-900/20 border border-green-800/50">{successMsg}</div>}
            {errorMsg && <div className="text-red-400 text-xs p-3 rounded bg-red-900/20 border border-red-800/50">{errorMsg}</div>}

            {/* CAMPOS SOLO PARA REGISTRO */}
            {mode === "register" && (
              <>
                <div>
                  <label className="block text-zinc-500 text-xs mb-1.5 uppercase tracking-wider">Nombre completo</label>
                  <input type="text" required value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Ej. Lucas Fernández" className="w-full rounded-lg px-4 py-3 text-sm outline-none" style={inputStyle} onFocus={handleFocus} onBlur={handleBlur} />
                </div>
                <div>
                  <label className="block text-zinc-500 text-xs mb-1.5 uppercase tracking-wider">Teléfono</label>
                  <input type="tel" value={telefono} onChange={(e) => setTelefono(e.target.value)} placeholder="+54 9 11 1234-5678" className="w-full rounded-lg px-4 py-3 text-sm outline-none" style={inputStyle} onFocus={handleFocus} onBlur={handleBlur} />
                </div>
              </>
            )}

            {/* CAMPOS PARA AMBOS (Email y Password) */}
            <div>
              <label className="block text-zinc-500 text-xs mb-1.5 uppercase tracking-wider">Correo electrónico</label>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="tu@email.com" className="w-full rounded-lg px-4 py-3 text-sm outline-none" style={inputStyle} onFocus={handleFocus} onBlur={handleBlur} />
            </div>

            <div>
              <label className="block text-zinc-500 text-xs mb-1.5 uppercase tracking-wider">Contraseña</label>
              <div className="relative">
                <input type={showPass ? "text" : "password"} required value={contrasena} onChange={(e) => setContrasena(e.target.value)} placeholder="••••••••" className="w-full rounded-lg px-4 py-3 pr-11 text-sm outline-none" style={inputStyle} onFocus={handleFocus} onBlur={handleBlur} />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-400">
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button type="submit" className="w-full rounded-xl py-3.5 text-sm font-medium mt-2 transition-all shadow-lg" style={{ background: `linear-gradient(135deg, ${GOLD} 0%, #A8832A 100%)`, color: "#0A0A0A" }}>
              {mode === "login" ? "Ingresar al Sistema" : "Registrarme"}
            </button>
            
          </form>
        </div>
      </div>
    </div>
  );
}