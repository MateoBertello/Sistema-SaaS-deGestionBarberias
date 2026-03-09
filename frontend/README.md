# ✂️ BarberSaaS — Frontend

Frontend del sistema de gestión de reservas para barberías, construido con **React 18 + TypeScript**.

🐳 **Proyecto completo con Docker:** [Sistema-SaaS-de-Gestion-para-Barberias](https://github.com/MateoBertello/Sistema-SaaS-de-Gesti-n-para-Barber-as-.git)

![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript)
![Vite](https://img.shields.io/badge/Vite-latest-646CFF?style=flat-square&logo=vite)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38BDF8?style=flat-square&logo=tailwindcss)

---

## 📌 Descripción

Interfaz web SPA con tres paneles diferenciados según el rol del usuario autenticado:

- **Cliente** — Wizard de reservas paso a paso + historial de turnos
- **Barbero** — Agenda diaria con gestión de estados de turno
- **Dueño / Admin** — Panel completo de gestión (staff, servicios, sucursales, turnos)

---

## 🛠️ Stack Tecnológico

| Tecnología | Versión | Uso |
|---|---|---|
| React | 18 | UI principal |
| TypeScript | 5 | Tipado estático |
| Vite | latest | Bundler y dev server |
| React Router | v7 | Navegación SPA |
| Tailwind CSS | v4 | Estilos utilitarios |
| shadcn/ui + Radix UI | — | Componentes accesibles |
| Lucide React | — | Iconografía |
| Sonner | — | Notificaciones (toasts) |

---

## 🧩 Funcionalidades por rol

### 👤 Cliente
- Registro e inicio de sesión
- **Wizard de reservas** de 5 pasos: sucursal → servicio → barbero → horario → confirmación
- Historial de turnos con estado, precio y barbero asignado
- Estadísticas personales (total de cortes e inversión acumulada)

### ✂️ Barbero
- Vista de agenda diaria filtrada por usuario autenticado
- Cambio de estado de turnos: **Pendiente → Completado / Cancelado**
- Registro de clientes walk-in sin cuenta
- Resumen rápido (turnos pendientes y completados del día)

### 🏢 Dueño / Admin
- Dashboard completo con todos los turnos del sistema
- **CRUD de Staff** — Alta y baja de barberos por sucursal
- **CRUD de Servicios** — Nombre, duración y precio
- **CRUD de Sucursales** — Nombre, dirección y teléfono
- **Gestión de horarios** de barberos por día y sucursal

---

## 📁 Estructura del proyecto

```
src/
├── app/
│   ├── components/
│   │   ├── admin/          → AdminDashboard, StaffManager, ServiciosManager,
│   │   │                     SucursalesManager, HorariosManager
│   │   ├── barber/         → BarberLayout, BarberDashboard, WalkInModal
│   │   ├── client/         → ClientLayout, ClientDashboard, BookingWizard
│   │   │                     (SelectSucursal, SelectServicio, SelectBarbero,
│   │   │                      SelectHorario, Confirmacion)
│   │   ├── auth/           → ProtectedRoute (validación de rol)
│   │   ├── login/          → LoginPage (login + registro unificados)
│   │   └── ui/             → Componentes shadcn/ui (Radix UI)
│   ├── utils/
│   │   └── apiClient.ts    → HTTP client centralizado (JWT + manejo de errores)
│   ├── constants.ts        → Tokens de diseño (colores, tipografías)
│   └── routes.tsx          → Rutas protegidas por rol
├── styles/
│   ├── theme.css           → Variables CSS personalizadas
│   └── fonts.css           → Google Fonts
└── main.tsx
```

---

## 🔐 Autenticación y rutas protegidas

El sistema usa **JWT Bearer Token**. Al iniciar sesión, el token y el rol se persisten en `localStorage`. Cada ruta privada pasa por el componente `ProtectedRoute`, que valida el rol antes de renderizar el panel correspondiente.

| Rol | Ruta |
|---|---|
| `CLIENTE` | `/client` |
| `BARBERO` | `/barber` |
| `DUEÑO` | `/admin` |

Un token expirado o inválido redirige automáticamente al login y limpia el storage.

---

## ⚙️ Instalación y ejecución

### Prerrequisitos
- Node.js 18+
- Backend corriendo (ver repo API REST)

### Pasos

```bash
# 1. Clonar el repositorio
git clone <url-del-repo>
cd barbersaas-frontend

# 2. Instalar dependencias
npm install

# 3. Configurar entorno
cp .env.example .env
# Editar VITE_API_URL si el backend no corre en localhost:8080

# 4. Iniciar en modo desarrollo
npm run dev
```

### Variables de entorno

```env
VITE_API_URL=http://localhost:8080/api
```

> Si no se define `VITE_API_URL`, el cliente HTTP apunta a `http://localhost:8080/api` por defecto.

---

## 🐳 Ejecución con Docker Compose (stack completo)

Para levantar frontend + backend + base de datos con un solo comando, usar el repositorio principal:

```bash
git clone https://github.com/MateoBertello/Sistema-SaaS-de-Gesti-n-para-Barber-as-.git
cd Sistema-SaaS-de-Gesti-n-para-Barber-as-
cp .env.example .env   # completar variables
docker compose up --build
```

El frontend queda disponible en `http://localhost` vía Nginx como reverse proxy.
