# ✂️ BarberSaaS — API REST

> Backend del sistema de reservas para barberías, construido con Spring Boot.

🚧 **En desarrollo activo**

---

## 🛠️ Stack

| Tecnología | Uso |
|---|---|
| Spring Boot 4 (Java 17) | Framework principal |
| Spring Security + JWT (JJWT 0.11.5) | Autenticación stateless |
| Spring Data JPA + Hibernate | Persistencia ORM |
| PostgreSQL (Supabase) | Base de datos en la nube |
| BCrypt | Encriptación de contraseñas |
| Maven | Gestor de dependencias |

---

## 🔐 Seguridad

- Contraseñas almacenadas con **BCrypt**
- Autenticación via **JWT Bearer Token** con validez de 24 horas
- `JwtFilter` intercepta cada request y valida el token antes de procesarlo
- Ruta pública: solo `/api/auth/**` — el resto requiere token válido

---

## 📁 Estructura del proyecto

```
src/main/java/com/example/bareberiaapi/
  controller/     → AuthController, TurnoController, UsuarioController...
  service/        → Lógica de negocio por entidad
  repository/     → Interfaces JpaRepository
  entity/         → Usuario, Turno, Servicio, Sucursal, HorarioBarbero
  security/       → JwtUtil, JwtFilter, SecurityConfig
  config/         → CorsConfig, GlobalExceptionHandler
  dto/            → AuthResponse, LoginRequest
```

---

## 🗄️ Modelo de datos

```
Usuario        (id, nombre, email, contrasena, telefono, rol, activo)
               rol: DUEÑO | BARBERO | CLIENTE

Turno          (id, cliente→Usuario, barbero→Usuario, servicio→Servicio,
                sucursal→Sucursal, fechaHoraInicio, estado)
               estado: PENDIENTE | COMPLETADO | CANCELADO

Servicio       (id, nombre, duracionMinutos, precio, activo)

Sucursal       (id, nombre, direccion, telefono, activa)

HorarioBarbero (id, barbero→Usuario, sucursal→Sucursal,
                diaSemana, horaInicio, horaFin)
```

---

## 🌐 Endpoints

| Método | Ruta | Descripción | Auth |
|---|---|---|---|
| POST | `/api/auth/login` | Iniciar sesión | No |
| POST | `/api/auth/register` | Registrar cliente | No |
| GET | `/api/turnos` | Listar turnos | JWT |
| POST | `/api/turnos` | Crear turno | JWT |
| PUT | `/api/turnos/{id}/estado` | Cambiar estado del turno | JWT |
| GET | `/api/usuarios` | Listar usuarios | JWT |
| POST | `/api/usuarios` | Crear usuario | JWT |
| GET | `/api/servicios` | Listar servicios | JWT |
| POST | `/api/servicios` | Crear servicio | JWT |
| GET | `/api/sucursales` | Listar sucursales | JWT |
| POST | `/api/sucursales` | Crear sucursal | JWT |
| GET | `/api/horarios` | Listar horarios | JWT |
| POST | `/api/horarios` | Crear horario | JWT |

---

## ⚙️ Ejecución

### Prerrequisitos
- Java 17+
- Maven

### Pasos

```bash
git clone <url-del-repo>
cd barberia-api
./mvnw spring-boot:run
# API disponible en http://localhost:8080
```

La base de datos está en **Supabase (PostgreSQL)**. Hibernate crea y actualiza las tablas automáticamente con `ddl-auto=update`.

