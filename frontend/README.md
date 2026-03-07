# ✂️ BarberSaaS — Sistema de Reservas para Barberías

> Plataforma web full-stack para la gestión integral de barberías: turnos, staff, servicios y sucursales.

---

## 📌 Estado del proyecto

🚧 **En desarrollo activo** — El frontend está completamente funcional y conectado a una API REST de Spring Boot.

---

## 🖥️ Demo visual

| Login | Panel Cliente | Panel Barbero | Panel Admin |
|-------|--------------|---------------|-------------|
| Registro / inicio de sesión con roles | Historial de cortes y nueva reserva | Agenda del día con acciones | Gestión de turnos, staff y sucursales |

---

## 🚀 Stack tecnológico

### Frontend
| Tecnología | Uso |
|-----------|-----|
| **React 18** + **TypeScript** | UI principal |
| **Vite** | Bundler y dev server |
| **React Router v7** | Navegación SPA |
| **Tailwind CSS v4** | Estilos utilitarios |
| **shadcn/ui** + **Radix UI** | Componentes accesibles |
| **Lucide React** | Iconografía |
| **Sonner** | Sistema de notificaciones (toasts) |

### Backend (externo)
| Tecnología | Uso |
|-----------|-----|
| **Spring Boot** | API REST |
| **JWT** | Autenticación stateless |

---

## 🧩 Funcionalidades por rol

### 👤 Cliente
- Registro e inicio de sesión
- **Wizard de reservas** paso a paso (sucursal → servicio → barbero → horario → confirmación)
- Historial de turnos con estado, precio y barbero asignado
- Estadísticas personales (total de cortes e inversión)

### ✂️ Barbero
- Vista de agenda diaria filtrada por usuario autenticado
- Cambio de estado de turnos: **Pendiente → Completado / Cancelado**
- Estadísticas rápidas (pendientes y completados)

### 🏢 Dueño / Admin
- Dashboard completo de todos los turnos del sistema
- **CRUD de Staff** — Alta, listado y baja de barberos
- **CRUD de Servicios** — Nombre, duración y precio
- **CRUD de Sucursales** — Nombre, dirección y teléfono
- Configuración de horarios *(próximamente)*

---

## 📁 Estructura del proyecto

```
src/
  app/
    components/
      admin/        → Dashboard, Staff, Servicios, Sucursales, Horarios
      barber/       → Layout y Dashboard del barbero
      client/       → Layout, Dashboard y Wizard de reserva
      auth/         → ProtectedRoute con control de roles
      login/        → LoginPage (login + registro)
      ui/           → Componentes shadcn/ui (Radix UI)
      utils/
        apsClient.ts  → HTTP client centralizado (JWT + toasts de error)
    constants.ts    → Tokens de diseño (colores, tipografías)
    routes.tsx      → Rutas protegidas por rol
  styles/
    theme.css       → Variables CSS personalizadas
    fonts.css       → Google Fonts
  main.tsx
```

---

## ⚙️ Instalación y ejecución

### Prerrequisitos
- Node.js 18+
- Backend corriendo en `http://localhost:8080` (o configurar variable de entorno)

### Pasos

```bash
# 1. Clonar el repositorio
git clone <url-del-repo>
cd sistema-reservas-barberias

# 2. Instalar dependencias
npm install

# 3. Configurar entorno (opcional)
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

## 🔐 Autenticación y roles

El sistema usa **JWT Bearer Token**. Al iniciar sesión, el token y el rol se almacenan en `localStorage`. Las rutas están protegidas mediante el componente `ProtectedRoute` que valida el rol antes de renderizar.

| Rol | Ruta |
|-----|------|
| `CLIENTE` | `/client` |
| `BARBERO` | `/barber` |
| `DUEÑO` | `/admin` |

Un token expirado o inválido redirige automáticamente al login y limpia el storage.

---

