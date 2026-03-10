# ✂️ BarberSaaS — Sistema de Gestión para Barberías

> Plataforma SaaS full-stack para la gestión integral de barberías: reservas, staff, servicios y sucursales — lista para producción con Docker.

[![Spring Boot](https://img.shields.io/badge/Spring_Boot-4.0-6DB33F?style=flat-square&logo=springboot&logoColor=white)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Supabase-4169E1?style=flat-square&logo=postgresql&logoColor=white)](https://supabase.com)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?style=flat-square&logo=docker&logoColor=white)](https://docs.docker.com/compose)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](LICENSE)

---

<!--
  📸 CAPTURA RECOMENDADA #1
  ─────────────────────────
  Una imagen panorámica del sistema: podés hacer un collage de 3 pantallas lado a lado
  (Login | Panel Cliente | Panel Admin) o una sola screenshot del panel más vistoso.
  Tamaño ideal: 1280×640px o similar. La podés crear con herramientas como:
  - Shots.so (gratis, muy lindo)
  - Screely (gratis)
  - Una simple captura del browser en pantalla completa
  Reemplazá la línea de abajo con tu imagen real:
-->

![BarberSaaS Preview](./docs/preview.png)

---

## 📌 ¿Qué es BarberSaaS?

Sistema web multi-rol para barberías con múltiples sucursales. Permite a **dueños** administrar el negocio completo, a **barberos** gestionar su agenda diaria y a **clientes** reservar turnos desde cualquier dispositivo.

Construido con una arquitectura moderna: API REST stateless con Spring Boot + JWT en el backend, y una SPA React completamente tipada en el frontend. El stack completo levanta con un solo comando Docker.

---

## 🖥️ Demo visual

<!--
  📸 CAPTURAS RECOMENDADAS #2 — TABLA DE PANTALLAS
  ──────────────────────────────────────────────────
  Esta tabla es lo primero que mira un reclutador. Necesitás 4 screenshots:
    1. LoginPage (el formulario oscuro con la foto de fondo)
    2. ClientDashboard (historial de turnos con los badges de estado)
    3. BookingWizard (alguno de los 5 pasos, el de selección de horario queda muy visual)
    4. AdminDashboard (la tabla de últimos turnos con las 4 stat cards)
  
  Guardalas en una carpeta /docs/ dentro del repo.
  Medida ideal por imagen: 900×560px.
-->

| Login | Panel Cliente | Wizard de Reservas | Panel Admin |
|:-----:|:-------------:|:------------------:|:-----------:|
| ![Login](./docs/screen-login.png) | ![Cliente](./docs/screen-client.png) | ![Wizard](./docs/screen-booking.png) | ![Admin](./docs/screen-admin.png) |

---

## ✨ Funcionalidades principales

### 👤 Cliente
- Registro e inicio de sesión con JWT
- **Wizard de reservas** en 5 pasos: sucursal → servicio → barbero → horario → confirmación
- Historial de turnos con estado en tiempo real (PENDIENTE / COMPLETADO / CANCELADO)
- Estadísticas personales: total de cortes e inversión acumulada

### ✂️ Barbero
- Agenda diaria filtrada automáticamente por usuario autenticado
- Gestión de estados de turno con un click
- Registro de clientes **walk-in** (sin cuenta previa) desde el mismo panel

### 🏢 Dueño / Admin
- Dashboard con métricas globales del sistema (usuarios, servicios, sucursales, turnos)
- CRUD completo de **staff**, **servicios**, **sucursales** y **horarios**
- Soft delete en servicios y sucursales — los datos históricos se preservan
- Turno walk-in disponible también desde el panel administrativo

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
| React | 18 | UI |
| TypeScript | 5 | Tipado estático |
| Vite | 6 | Bundler y dev server |
| React Router | v7 | Navegación SPA |
| Tailwind CSS | v4 | Estilos |
| shadcn/ui + Radix UI | — | Componentes accesibles |
| Sonner | — | Notificaciones toast |

### Infraestructura
| Tecnología | Rol |
|---|---|
| Docker + Docker Compose | Orquestación de servicios |
| Nginx | Servidor y reverse proxy del frontend |
| Supabase | PostgreSQL gestionado en la nube |

---

## 🔐 Seguridad

- **BCrypt** para hash de contraseñas — nunca se exponen en respuestas (patrón DTO)
- **JWT Bearer Token** firmado con HMAC-SHA256, validez de 24 horas
- **JwtFilter** intercepta y valida cada request antes del controlador
- **CORS** configurado por origen explícito, sin wildcards en producción
- **Soft delete** en lugar de DELETE físico — preserva integridad referencial histórica
- Control de acceso granular por rol en `SecurityConfig` con `hasRole()`

### Matriz de permisos

| Endpoint | CLIENTE | BARBERO | DUEÑO |
|---|:---:|:---:|:---:|
| `POST /api/auth/login` | ✅ | ✅ | ✅ |
| `POST /api/auth/register` | ✅ | ✅ | ✅ |
| `GET /api/turnos` | ✅ propios | ✅ propios | ✅ todos |
| `POST /api/turnos` | ✅ | ✅ | ✅ |
| `POST /api/turnos/walkin` | ❌ | ✅ | ✅ |
| `POST/DELETE /api/servicios` | ❌ | ❌ | ✅ |
| `POST/DELETE /api/sucursales` | ❌ | ❌ | ✅ |
| `GET/POST/DELETE /api/horarios` | ❌ | ❌ | ✅ |
| `GET /api/usuarios` | ❌ | ❌ | ✅ |
| `DELETE /api/usuarios/{id}` | ❌ | ❌ | ✅ |
| `POST /api/auth/crear-staff` | ❌ | ❌ | ✅ |

---

## 📁 Estructura del repositorio

```
BarberSaaS/
├── backend/                    → API REST (Spring Boot)
│   ├── src/
│   │   └── main/java/com/example/bareberiaapi/
│   │       ├── controller/     → Endpoints REST
│   │       ├── service/        → Lógica de negocio
│   │       ├── repository/     → JPA + queries JPQL personalizadas
│   │       ├── entity/         → Modelos JPA
│   │       ├── security/       → JWT, filtros, SecurityConfig
│   │       ├── config/         → CORS, GlobalExceptionHandler
│   │       └── dto/            → DTOs (sin exponer hash de contraseña)
│   ├── DockerFile
│   └── pom.xml
│
├── frontend/                   → SPA React + TypeScript
│   ├── src/app/
│   │   ├── components/
│   │   │   ├── admin/          → Dashboard, Staff, Servicios, Sucursales, Horarios
│   │   │   ├── barber/         → BarberDashboard, WalkInModal
│   │   │   ├── client/         → ClientDashboard, BookingWizard (5 pasos)
│   │   │   ├── auth/           → ProtectedRoute
│   │   │   └── login/          → LoginPage
│   │   ├── utils/
│   │   │   └── apiClient.ts    → HTTP client centralizado con JWT
│   │   └── routes.tsx          → Rutas protegidas por rol
│   ├── DockerFile
│   └── package.json
│
├── docs/                       → 📸 Capturas de pantalla (ver sección Demo)
├── docker-compose.yml          → Orquestación completa del stack
├── .env.example                → Variables de entorno requeridas
└── README.md
```

---

## ⚙️ Instalación y ejecución

### Prerrequisitos

- [Docker](https://www.docker.com/get-started) y Docker Compose instalados
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

Editá `.env` con tus datos:

```env
# Base de datos
DB_URL=jdbc:postgresql://<host>:<puerto>/<nombre_db>
DB_USERNAME=tu_usuario
DB_PASSWORD=tu_contraseña

# JWT — usá una clave aleatoria de al menos 32 caracteres
JWT_SECRET=cambia_esto_por_una_clave_segura_de_32_caracteres
```

### 3. Levantar el stack completo

```bash
docker compose up --build
```

| Servicio | URL |
|---|---|
| Frontend | http://localhost |
| API REST | http://localhost:8080/api |

> **Primera vez:** Hibernate crea las tablas automáticamente. Podés crear el primer usuario DUEÑO directamente en la base de datos o habilitando temporalmente el endpoint público de registro con rol DUEÑO.

---

## 🧪 Usuarios de prueba

<!--
  💡 RECOMENDACIÓN
  ─────────────────
  Agregá acá 2-3 usuarios de prueba que hayas creado en tu base de datos de demo.
  Esto permite que un reclutador o entrevistador pruebe el sistema en segundos
  sin tener que registrarse. Ejemplo:

  | Rol | Email | Contraseña |
  |---|---|---|
  | Dueño | admin@barbersaas.com | demo1234 |
  | Barbero | juan@barbersaas.com | demo1234 |
  | Cliente | cliente@demo.com | demo1234 |

  Si el sistema está deployado online, esto es especialmente valioso.
-->

> 🔧 Próximamente — Credenciales de demo para entorno de prueba.

---

## 🚀 Deploy

El proyecto está diseñado para deployarse en cualquier servidor con Docker. Algunas opciones recomendadas:

- **Railway** — soporta Docker Compose directamente
- **Render** — servicios separados de backend y frontend
- **VPS (DigitalOcean, Vultr)** — máximo control, mismo `docker compose up`

<!--
  💡 RECOMENDACIÓN
  ─────────────────
  Si llegás a hacer un deploy online (aunque sea en un tier gratuito),
  agregá el link acá. Nada impresiona más a un entrevistador que poder
  probar el sistema en vivo sin instalar nada.

  Ejemplo:
  🌐 **Demo en vivo:** https://barbersaas.railway.app
-->

---

## ✨ Decisiones técnicas destacadas

**Validación de solapamiento anti-overbooking**
En lugar de detectar conflictos de horario en memoria, la validación se hace directamente en base de datos con una query JPQL que compara intervalos. Esto evita condiciones de carrera si dos requests llegan al mismo tiempo:

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
El backend calcula el fin del turno a partir de la duración del servicio. El cliente solo envía la hora de inicio — el backend garantiza la consistencia:

```java
LocalDateTime fin = inicio.plusMinutes(servicio.getDuracionMinutos());
turno.setFechaHoraFin(fin);
```

**Soft delete con indicador visual**
Servicios y sucursales eliminados mantienen su registro en BD con `activo = false`. El frontend los muestra con un badge "INACTIVO/CERRADA" en lugar de ocultarlos, preservando la integridad del historial de turnos.

**HTTP client centralizado (`apiClient.ts`)**
Todas las llamadas a la API pasan por un único wrapper que agrega el JWT automáticamente, centraliza el manejo de errores, muestra toasts y redirige al login si el token expira (HTTP 401).

---

## 🗂️ Repositorios individuales

| Repo | Descripción |
|---|---|
| 📦 [Este repositorio](https://github.com/MateoBertello/Sistema-SaaS-de-Gesti-n-para-Barber-as-.git) | Stack completo con Docker Compose |
| 🔧 Backend | API REST Spring Boot — [ver README](./backend/README.md) |
| 🎨 Frontend | SPA React + TypeScript — [ver README](./frontend/README.md) |

---

## 👨‍💻 Autor

**Mateo Bertello** — Desarrollador Backend

[![GitHub](https://img.shields.io/badge/GitHub-MateoBertello-181717?style=flat-square&logo=github)](https://github.com/MateoBertello)

<!--
  💡 RECOMENDACIONES FINALES PARA SUMAR PUNTOS
  ─────────────────────────────────────────────
  1. LinkedIn: agregá tu perfil de LinkedIn acá
     [![LinkedIn](https://img.shields.io/badge/LinkedIn-tu--nombre-0A66C2?style=flat-square&logo=linkedin)](https://linkedin.com/in/tu-perfil)
  
  2. Si tenés un portfolio o CV online, agregalo también.
  
  3. Estas dos líneas al final de un README tienen más peso del que parece
     en una búsqueda de trabajo — hacen que el reclutador te contacte con 1 click.
-->
