# ✂️ BarberSaaS — API REST

Backend del sistema de gestión de reservas para barberías, construido con **Spring Boot 4** y **Java 17**.

![Java](https://img.shields.io/badge/Java-17-orange?style=flat-square&logo=openjdk)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-4.0-green?style=flat-square&logo=springboot)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Supabase-blue?style=flat-square&logo=postgresql)
![Docker](https://img.shields.io/badge/Docker-ready-2496ED?style=flat-square&logo=docker)

---

## 📌 Descripción

API REST stateless que gestiona el ciclo completo de operación de una cadena de barberías:

- Autenticación y autorización por roles (DUEÑO, BARBERO, CLIENTE)
- Reserva de turnos con validación de solapamiento en base de datos
- Gestión de staff, servicios, sucursales y horarios
- Soporte para turnos walk-in (clientes sin cuenta)

---

## 🛠️ Stack Tecnológico

| Tecnología | Versión | Uso |
|---|---|---|
| Java | 17 | Lenguaje principal |
| Spring Boot | 4.0.3 | Framework principal |
| Spring Security | — | Autorización y filtros |
| JJWT | 0.11.5 | Generación y validación de JWT |
| Spring Data JPA + Hibernate | — | Persistencia ORM |
| PostgreSQL | — | Base de datos (Supabase cloud) |
| BCrypt | — | Hash de contraseñas |
| Maven | — | Gestión de dependencias |
| Docker | — | Containerización |

---

## 🏗️ Arquitectura

El proyecto sigue una arquitectura en capas estándar de Spring Boot:

```
Request → JwtFilter → Controller → Service → Repository → PostgreSQL
```

```
src/main/java/com/example/bareberiaapi/
├── controller/       → Endpoints REST (AuthController, TurnoController...)
├── service/          → Lógica de negocio por entidad
├── repository/       → Interfaces JpaRepository con queries personalizadas
├── entity/           → Modelos JPA (Usuario, Turno, Servicio, Sucursal, HorarioBarbero)
├── security/         → JwtUtil, JwtFilter, SecurityConfig
├── config/           → CorsConfig, GlobalExceptionHandler
└── dto/              → AuthResponse, LoginRequest, UsuarioDTO
```

---

## 🗄️ Modelo de Datos

```
Usuario        (id, nombre, email, contrasena*, rol, telefono, activo)
               rol: DUEÑO | BARBERO | CLIENTE
               *almacenada como hash BCrypt, nunca expuesta en respuestas

Turno          (id, cliente→Usuario, barbero→Usuario, servicio→Servicio,
                sucursal→Sucursal, fechaHoraInicio, fechaHoraFin, nombreWalkin, estado)
               estado: PENDIENTE | COMPLETADO | CANCELADO
               fechaHoraFin calculada automáticamente por el backend

Servicio       (id, nombre, duracionMinutos, precio, activo)

Sucursal       (id, nombre, direccion, telefono, activa)

HorarioBarbero (id, barbero→Usuario, sucursal→Sucursal,
                diaSemana, horaInicio, horaFin, activo)
```

---

## 🔐 Seguridad

- **Contraseñas** almacenadas con BCrypt — nunca se devuelven en respuestas (patrón DTO)
- **JWT Bearer Token** con validez de 24 horas firmado con clave HMAC-SHA256
- **JwtFilter** intercepta cada request antes de llegar al controlador
- **CORS** configurado explícitamente por origen, sin wildcards
- **Soft delete** en usuarios, servicios y sucursales — los registros históricos se preservan

### Control de acceso por rol

| Recurso | CLIENTE | BARBERO | DUEÑO |
|---|---|---|---|
| `POST /api/auth/login` | ✅ | ✅ | ✅ |
| `POST /api/auth/register` | ✅ | ✅ | ✅ |
| `GET /api/turnos` | ✅ (propios) | ✅ (propios) | ✅ (todos) |
| `POST /api/turnos` | ✅ | ✅ | ✅ |
| `PUT /api/turnos/{id}` | ✅ | ✅ | ✅ |
| `POST /api/turnos/walkin` | ❌ | ✅ | ✅ |
| `POST/DELETE /api/servicios` | ❌ | ❌ | ✅ |
| `POST/DELETE /api/sucursales` | ❌ | ❌ | ✅ |
| `POST/DELETE /api/horarios` | ❌ | ❌ | ✅ |
| `GET /api/usuarios` | ❌ | ❌ | ✅ |
| `DELETE /api/usuarios/{id}` | ❌ | ❌ | ✅ |
| `POST /api/auth/crear-staff` | ❌ | ❌ | ✅ |

---

## 🌐 Endpoints

### Auth
| Método | Ruta | Descripción | Auth |
|---|---|---|---|
| POST | `/api/auth/login` | Iniciar sesión, retorna JWT + rol + id | ❌ |
| POST | `/api/auth/register` | Registrar cliente nuevo | ❌ |
| POST | `/api/auth/crear-staff` | Crear barbero o dueño | JWT (DUEÑO) |

### Turnos
| Método | Ruta | Descripción | Auth |
|---|---|---|---|
| GET | `/api/turnos` | Listar turnos (filtrables por `clienteId` o `barberoId`) | JWT |
| POST | `/api/turnos` | Crear turno con validación de solapamiento | JWT |
| PUT | `/api/turnos/{id}` | Actualizar estado del turno | JWT |

### Usuarios
| Método | Ruta | Descripción | Auth |
|---|---|---|---|
| GET | `/api/usuarios` | Listar todos los usuarios activos | JWT (DUEÑO) |
| GET | `/api/usuarios/barberos` | Listar barberos activos | JWT |
| POST | `/api/usuarios` | Crear usuario | JWT (DUEÑO) |
| DELETE | `/api/usuarios/{id}` | Soft delete de usuario | JWT (DUEÑO) |

### Servicios
| Método | Ruta | Descripción | Auth |
|---|---|---|---|
| GET | `/api/servicios` | Listar servicios | JWT |
| POST | `/api/servicios` | Crear servicio | JWT (DUEÑO) |
| DELETE | `/api/servicios/{id}` | Soft delete de servicio | JWT (DUEÑO) |

### Sucursales
| Método | Ruta | Descripción | Auth |
|---|---|---|---|
| GET | `/api/sucursales` | Listar sucursales | JWT |
| POST | `/api/sucursales` | Crear sucursal | JWT (DUEÑO) |
| DELETE | `/api/sucursales/{id}` | Soft delete de sucursal | JWT (DUEÑO) |

### Horarios
| Método | Ruta | Descripción | Auth |
|---|---|---|---|
| GET | `/api/horarios` | Listar horarios activos | JWT |
| POST | `/api/horarios` | Crear horario de barbero | JWT (DUEÑO) |
| DELETE | `/api/horarios/{id}` | Desactivar horario | JWT (DUEÑO) |

---

## ✨ Decisiones técnicas destacadas

**Validación de solapamiento de turnos**
La lógica anti-overbooking se implementa en base de datos con una query JPQL que detecta intersección de intervalos, evitando condiciones de carrera a nivel de aplicación:

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

**Cálculo automático de fechaHoraFin**
El backend calcula el fin del turno a partir de la duración del servicio, evitando inconsistencias si el cliente envía un valor incorrecto:

```java
LocalDateTime fin = inicio.plusMinutes(servicio.getDuracionMinutos());
turno.setFechaHoraFin(fin);
```

**Soft delete en lugar de DELETE físico**
Servicios, sucursales y usuarios se desactivan con `activo = false`, preservando la integridad referencial con turnos históricos.

---

## ⚙️ Instalación y ejecución

### Prerrequisitos
- Java 17+
- Maven 3.8+

### Variables de entorno requeridas

```env
SPRING_DATASOURCE_URL=jdbc:postgresql://<host>/<db>
SPRING_DATASOURCE_USERNAME=<usuario>
SPRING_DATASOURCE_PASSWORD=<contraseña>
JWT_SECRET=<clave-minimo-32-caracteres>
```

### Ejecución local

```bash
git clone https://github.com/tu-usuario/barbersaas
cd barbersaas/backend

# Con Maven Wrapper
./mvnw spring-boot:run

# API disponible en http://localhost:8080
```

### Ejecución con Docker Compose (stack completo)

```bash
# Desde la raíz del repositorio
cp .env.example .env   # completar variables
docker compose up --build
```

---

## 🐳 Docker

El backend usa un build multi-stage para optimizar el tamaño de la imagen final:

1. **Etapa build**: `maven:3.8.5-openjdk-17` compila y empaqueta el JAR
2. **Etapa runtime**: `amazoncorretto:17-alpine` ejecuta únicamente el JAR

```dockerfile
FROM maven:3.8.5-openjdk-17 AS build
# ...compilación...

FROM amazoncorretto:17-alpine
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
```
