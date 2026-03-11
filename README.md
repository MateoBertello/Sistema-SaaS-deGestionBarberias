# ✂️ BarberSaaS — Sistema de Gestión para Barberías

> Plataforma SaaS full-stack para la gestión integral de barberías: reservas, staff, servicios y sucursales — lista para producción con Docker.

[![Spring Boot](https://img.shields.io/badge/Spring_Boot-4.0-6DB33F?style=flat-square&logo=springboot&logoColor=white)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Supabase-4169E1?style=flat-square&logo=postgresql&logoColor=white)](https://supabase.com)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?style=flat-square&logo=docker&logoColor=white)](https://docs.docker.com/compose)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](LICENSE)

---

## 📌 ¿Qué es BarberSaaS?

Sistema web multi-rol para barberías con soporte de múltiples sucursales. Permite a **dueños** administrar el negocio completo, a **barberos** gestionar su agenda diaria y a **clientes** reservar turnos desde cualquier dispositivo.

Construido con una arquitectura moderna: API REST stateless con Spring Boot + JWT en el backend, y una SPA React completamente tipada en el frontend. El stack completo levanta con un solo comando Docker.

---

## ✨ Funcionalidades

### 👤 Cliente
- Registro e inicio de sesión con JWT
- **Wizard de reservas en 5 pasos**: sucursal → servicio → barbero → horario → confirmación
- Barberos filtrados automáticamente por la sucursal seleccionada
- Slots de horario calculados en tiempo real según disponibilidad y duración del servicio
- Historial de turnos con estado en tiempo real (PENDIENTE / COMPLETADO / CANCELADO)
- Cancelación de turnos propios con un click

### ✂️ Barbero
- Agenda diaria filtrada automáticamente por usuario autenticado
- Cambio de estado de turnos: **Completado** / **Cancelado**
- Registro de clientes **walk-in** (sin cuenta previa) desde el mismo panel
- Panel con selección de slots disponibles, validando solapamientos en tiempo real

### 🏢 Dueño / Admin
- Dashboard con métricas globales: usuarios, servicios, sucursales, turnos
- Tabla de últimos turnos con cliente, barbero, servicio, fecha y estado
- Turno walk-in disponible también desde el panel administrativo
- **CRUD de Staff** — alta y baja de barberos
- **CRUD de Servicios** — nombre, duración en minutos y precio
- **CRUD de Sucursales** — nombre, dirección y teléfono
- **Gestión de horarios** de barberos por día y sucursal
- Soft delete en servicios y sucursales con badge visual de estado

---

## 🏗️ Arquitectura

```
┌──────────────────────────────────────────────────────────┐
│                     Docker Compose                       │
│                                                          │
│  ┌───────────────┐        ┌────────────────────────┐     │
│  │   Frontend    │        │       Backend          │     │
│  │  React + Vite │◄──────►│    Spring Boot 4       │     │
│  │  Nginx :80    │  HTTP  │    Java 17 :8080       │     │
│  └───────────────┘        └──────────┬─────────────┘     │
│                                      │ JPA / Hibernate   │
│                                      ▼                   │
│                            ┌─────────────────┐           │
│                            │   PostgreSQL    │           │
│                            │   (Supabase)    │           │
│                            └─────────────────┘           │
└──────────────────────────────────────────────────────────┘
```

**Flujo de autenticación:**
```
Cliente → POST /api/auth/login → JWT (24h) → Bearer Token en cada request
                                              ↓
                                    JwtFilter valida → Controller → Service → DB
```

**Flujo de reserva (BookingWizard):**
```
Sucursal → Servicio → Barbero (filtrado por sucursal) → Slot disponible → Confirmación
                                                              ↓
                                              Validación de solapamiento en DB
```

---

## 🛠️ Stack tecnológico

### Backend
| Tecnología | Versión | Rol |
|---|---|---|
| Java | 17 | Lenguaje |
| Spring Boot | 4.0.3 | Framework principal |
| Spring Security + JJWT | 0.11.5 | Autenticación JWT stateless |
| Spring Data JPA + Hibernate | — | ORM y persistencia |
| PostgreSQL | — | Base de datos (Supabase cloud) |
| BCrypt | — | Hash de contraseñas |
| Maven | 3.8+ | Build tool |

### Frontend
| Tecnología | Versión | Rol |
|---|---|---|
| React | 18.3.1 | UI |
| TypeScript | 5 | Tipado estático |
| Vite | 6 | Bundler y dev server |
| React Router | v7 | Navegación SPA |
| Tailwind CSS | v4 | Estilos utilitarios |
| shadcn/ui + Radix UI | — | Componentes accesibles |
| Sonner | — | Notificaciones toast |
| Lucide React | — | Iconografía |

### Infraestructura
| Tecnología | Rol |
|---|---|
| Docker + Docker Compose | Orquestación de servicios |
| Nginx | Servidor y reverse proxy del frontend |
| Supabase | PostgreSQL gestionado en la nube |

---

## 🔐 Seguridad

- **BCrypt** para hash de contraseñas — nunca expuestas en respuestas (patrón DTO)
- **JWT Bearer Token** firmado con HMAC-SHA256, validez de 24 horas
- **JwtFilter** intercepta y valida cada request antes del controlador
- **CORS** configurado por origen explícito (`localhost:3000`, `localhost:5173`, `localhost`)
- **Soft delete** en lugar de DELETE físico — preserva integridad referencial histórica
- Control de acceso granular por rol en `SecurityConfig`

### Matriz de permisos

| Endpoint | CLIENTE | BARBERO | DUEÑO |
|---|:---:|:---:|:---:|
| `POST /api/auth/login` | ✅ | ✅ | ✅ |
| `POST /api/auth/register` | ✅ | ✅ | ✅ |
| `GET /api/turnos` | ✅ propios | ✅ propios | ✅ todos |
| `POST /api/turnos` | ✅ | ✅ | ✅ |
| `PUT /api/turnos/{id}/estado` | ✅ | ✅ | ✅ |
| `POST /api/turnos/walkin` | ❌ | ✅ | ✅ |
| `GET /api/usuarios/barberos` | ✅ | ✅ | ✅ |
| `GET /api/usuarios` | ❌ | ❌ | ✅ |
| `DELETE /api/usuarios/{id}` | ❌ | ❌ | ✅ |
| `POST /api/auth/crear-staff` | ❌ | ❌ | ✅ |
| `POST/DELETE /api/servicios/**` | ❌ | ❌ | ✅ |
| `POST/DELETE /api/sucursales/**` | ❌ | ❌ | ✅ |
| `POST/DELETE /api/horarios/**` | ❌ | ❌ | ✅ |

---

## 🗄️ Modelo de datos

```
Usuario        (id, nombre, email, contrasena*, rol, telefono, activo)
               rol: DUEÑO | BARBERO | CLIENTE
               *almacenada como hash BCrypt, nunca expuesta

Turno          (id, cliente→Usuario, barbero→Usuario, servicio→Servicio,
                sucursal→Sucursal, fechaHoraInicio, fechaHoraFin,
                nombreWalkin, estado)
               estado: PENDIENTE | COMPLETADO | CANCELADO
               cliente_id nullable — permite turnos walk-in sin cuenta

Servicio       (id, nombre, duracionMinutos, precio, activo)

Sucursal       (id, nombre, direccion, telefono, activa)

HorarioBarbero (id, barbero→Usuario, sucursal→Sucursal,
                diaSemana, horaInicio, horaFin, activo)
               diaSemana: MONDAY | TUESDAY | ... | SUNDAY
```

---

## 🌐 Endpoints de la API

### Auth
| Método | Ruta | Descripción | Auth |
|---|---|---|---|
| POST | `/api/auth/login` | Iniciar sesión → JWT + rol + id | ❌ |
| POST | `/api/auth/register` | Registro público (crea CLIENTE) | ❌ |
| POST | `/api/auth/crear-staff` | Crear BARBERO o DUEÑO | JWT (DUEÑO) |

### Turnos
| Método | Ruta | Descripción | Auth |
|---|---|---|---|
| GET | `/api/turnos` | Listar (filtrables por `clienteId` o `barberoId`) | JWT |
| POST | `/api/turnos` | Crear turno con validación de solapamiento | JWT |
| POST | `/api/turnos/walkin` | Crear turno sin cliente registrado | JWT (BARBERO/DUEÑO) |
| PUT | `/api/turnos/{id}/estado` | Cambiar estado: COMPLETADO / CANCELADO | JWT |

### Recursos
| Método | Ruta | Auth |
|---|---|---|
| GET | `/api/usuarios` | JWT (DUEÑO) |
| GET | `/api/usuarios/barberos` | JWT |
| DELETE | `/api/usuarios/{id}` | JWT (DUEÑO) |
| GET/POST/DELETE | `/api/servicios/**` | GET: JWT — POST/DELETE: JWT (DUEÑO) |
| GET/POST/DELETE | `/api/sucursales/**` | GET: JWT — POST/DELETE: JWT (DUEÑO) |
| GET/POST/DELETE | `/api/horarios/**` | GET: JWT — POST/DELETE: JWT (DUEÑO) |

---

## ✨ Decisiones técnicas destacadas

**Validación de solapamiento anti-overbooking**

La validación se ejecuta directamente en base de datos con una query JPQL que compara intervalos. Evita condiciones de carrera si dos requests llegan simultáneamente:

```java
@Query("""
    SELECT t FROM Turno t
    WHERE t.barbero.id    = :barberoId
      AND t.estado       != 'CANCELADO'
      AND t.fechaHoraInicio < :fin
      AND t.fechaHoraFin   > :inicio
""")
List<Turno> findSolapados(Long barberoId, LocalDateTime inicio, LocalDateTime fin);
```

**Cálculo automático de `fechaHoraFin`**

El backend calcula el fin del turno a partir de la duración del servicio. El cliente solo envía la hora de inicio:

```java
LocalDateTime fin = inicio.plusMinutes(servicio.getDuracionMinutos());
turno.setFechaHoraFin(fin);
```

**HTTP client centralizado (`apiClient.ts`)**

Todas las llamadas pasan por un único wrapper que agrega el JWT automáticamente, muestra toasts con Sonner y redirige al login ante un 401:

```typescript
// Redirige automáticamente si el token expiró
if (response.status === 401) {
  localStorage.clear();
  window.location.href = '/';
}
```

**Filtrado de barberos por sucursal**

El BookingWizard filtra los barberos disponibles cruzando la tabla de horarios: solo muestra barberos que tienen al menos un horario configurado en la sucursal elegida, evitando selecciones inválidas antes de consultar al backend.

**Soft delete con indicador visual**

Servicios y sucursales eliminados mantienen `activo = false`. El frontend los muestra con un badge "INACTIVO / CERRADA" en lugar de ocultarlos, preservando la integridad histórica de los turnos.

**Rutas protegidas por rol**

`ProtectedRoute` valida el rol del token almacenado en `localStorage` y redirige automáticamente al panel correcto si el usuario intenta acceder a una ruta no autorizada.

---

## 📁 Estructura del repositorio

```
BarberSaaS/
├── backend/
│   └── src/main/java/com/example/bareberiaapi/
│       ├── controller/         → AuthController, TurnoController,
│       │                         UsuarioController, ServicioController,
│       │                         SucursalController, HorarioBarberoController
│       ├── service/            → Lógica de negocio por entidad
│       ├── repository/         → JPA + queries JPQL personalizadas
│       ├── entity/             → Usuario, Turno, Servicio, Sucursal, HorarioBarbero
│       ├── security/           → JwtUtil, JwtFilter, SecurityConfig
│       ├── config/             → CorsConfig, GlobalExceptionHandler
│       └── dto/                → AuthResponse, LoginRequest, UsuarioDTO, WalkInRequest
│
├── frontend/src/app/
│   ├── components/
│   │   ├── admin/              → AdminDashboard, StaffManagement,
│   │   │                         ServicesManagement, BranchManagement, ScheduleConfig
│   │   ├── barber/             → BarberLayout, BarberDashboard, WalkInModal
│   │   ├── client/             → ClientLayout, ClientDashboard, BookingWizard
│   │   ├── auth/               → ProtectedRoute
│   │   ├── login/              → LoginPage
│   │   └── ui/                 → Componentes shadcn/ui
│   ├── utils/
│   │   └── apsClient.ts        → HTTP client centralizado con JWT
│   ├── constants.ts            → Tokens de diseño (colores, tipografías, temas)
│   └── routes.tsx              → Router con rutas protegidas por rol
│
├── docker-compose.yml
├── .env.example
└── README.md
```

---

## ⚙️ Instalación y ejecución

### Prerrequisitos
- [Docker](https://www.docker.com/get-started) y Docker Compose
- Una base de datos PostgreSQL (podés usar [Supabase](https://supabase.com) gratis)

### 1. Clonar el repositorio

```bash
git clone https://github.com/MateoBertello/Sistema-SaaS-de-Gesti-n-para-Barber-as-.git
cd Sistema-SaaS-de-Gesti-n-para-Barber-as-
```

### 2. Configurar variables de entorno

```bash
cp .env.example .env
```

Completar `.env`:

```env
# Base de datos
DB_URL=jdbc:postgresql://<host>:<puerto>/<nombre_db>
DB_USERNAME=tu_usuario
DB_PASSWORD=tu_contraseña

# JWT — mínimo 32 caracteres
JWT_SECRET=cambia_esto_por_una_clave_segura_de_32_caracteres
```

### 3. Levantar el stack

```bash
docker compose up --build
```

| Servicio | URL |
|---|---|
| Frontend | http://localhost |
| API REST | http://localhost:8080/api |

> **Primera vez:** Hibernate crea las tablas automáticamente con `ddl-auto=update`. El primer usuario DUEÑO debe crearse directamente en la base de datos o habilitando temporalmente el endpoint de registro con ese rol.

### Desarrollo local (sin Docker)

```bash
# Backend
cd backend
./mvnw spring-boot:run

# Frontend
cd frontend
npm install
npm run dev   # http://localhost:5173
```

---

## 🐳 Docker

El proyecto usa builds multi-stage para minimizar el tamaño de las imágenes finales.

**Backend** — `maven:3.8.5-openjdk-17` compila el JAR, `amazoncorretto:17-alpine` lo ejecuta.

**Frontend** — `node:18-alpine` genera el build de Vite, `nginx:alpine` sirve los estáticos con la configuración necesaria para React Router (`try_files $uri /index.html`).

---

## 🚀 Deploy

El proyecto está diseñado para deployarse en cualquier servidor con Docker:

- **Railway** — soporta Docker Compose directamente
- **Render** — servicios separados de backend y frontend
- **VPS (DigitalOcean, Vultr)** — máximo control con el mismo `docker compose up`

---

## 👨‍💻 Autor

**Mateo Bertello** — Desarrollador Backend

[![GitHub](https://img.shields.io/badge/GitHub-MateoBertello-181717?style=flat-square&logo=github)](https://github.com/MateoBertello)
