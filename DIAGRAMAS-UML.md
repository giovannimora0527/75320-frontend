# 📊 Diagramas UML - Sistema Clínica Uniminuto

## 1. Diagrama de Clases

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        DIAGRAMA DE CLASES                                │
└─────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────┐
│           Usuario                │
├──────────────────────────────────┤
│ - id: Long                       │
│ - username: String               │
│ - password: String                │
│ - email: String                  │
│ - rol: String                    │
│ - activo: Boolean                │
│ - intentosFallidos: Integer      │
│ - bloqueadoHasta: LocalDateTime  │
│ - fechaCreacion: LocalDateTime   │
└──────────────────────────────────┘
            │
            │ 1
            │
            │ *
┌──────────────────────────────────┐
│      AuditoriaLogin              │
├──────────────────────────────────┤
│ - id: Long                       │
│ - usernameIngresado: String       │
│ - fechaHora: LocalDateTime        │
│ - exitoso: Boolean               │
│ - descripcion: String            │
│ - ipOrigen: String               │
│ - usuarioId: Long                │
└──────────────────────────────────┘

┌──────────────────────────────────┐
│   AuditoriaRecuperacion           │
├──────────────────────────────────┤
│ - id: Long                       │
│ - usernameIngresado: String       │
│ - fechaHora: LocalDateTime        │
│ - exitoso: Boolean               │
│ - descripcion: String            │
│ - ipOrigen: String               │
│ - emailUsuario: String           │
└──────────────────────────────────┘

┌──────────────────────────────────┐
│    AutenticarService             │
│    (Interface)                   │
├──────────────────────────────────┤
│ + autenticar(request, ip):       │
│   AutenticatorRs                 │
└──────────────────────────────────┘
            ▲
            │ implements
            │
┌──────────────────────────────────┐
│  AutenticarServiceImpl           │
├──────────────────────────────────┤
│ - usuarioRepository              │
│ - auditoriaLoginRepository       │
│ - jwtUtil                        │
│ - blockDurationMinutes: int      │
│ - maxFailedAttempts: int         │
│                                  │
│ + autenticar(...)                │
│ - registrarIntentoFallido(...)   │
│ - registrarIntentoExitoso(...)   │
└──────────────────────────────────┘

┌──────────────────────────────────┐
│  RecuperarPasswordService        │
│  (Interface)                     │
├──────────────────────────────────┤
│ + recuperarPassword(request, ip): │
│   RespuestaRs                    │
└──────────────────────────────────┘
            ▲
            │ implements
            │
┌──────────────────────────────────┐
│ RecuperarPasswordServiceImpl     │
├──────────────────────────────────┤
│ - usuarioRepository              │
│ - auditoriaRepository            │
│ - cifrarService                  │
│ - emailService                   │
│                                  │
│ + recuperarPassword(...)         │
│ - generarPasswordTemporal():     │
│   String                         │
│ - registrarAuditoria(...)        │
└──────────────────────────────────┘

┌──────────────────────────────────┐
│      AuditoriaService            │
│      (Interface)                 │
├──────────────────────────────────┤
│ + getAuditoriaLogin(...): Page   │
│ + getAuditoriaRecuperacion(...): │
│   Page                           │
└──────────────────────────────────┘
            ▲
            │ implements
            │
┌──────────────────────────────────┐
│   AuditoriaServiceImpl           │
├──────────────────────────────────┤
│ - auditoriaLoginRepository       │
│ - auditoriaRecuperacionRepository│
│                                  │
│ + getAuditoriaLogin(...)         │
│ + getAuditoriaRecuperacion(...)  │
│ - mapToAuditoriaRs(...)          │
└──────────────────────────────────┘

┌──────────────────────────────────┐
│    UsuarioRepository             │
│    extends JpaRepository         │
├──────────────────────────────────┤
│ + findByUsername(username):      │
│   Optional<Usuario>               │
│ + findByEmail(email):            │
│   Optional<Usuario>              │
└──────────────────────────────────┘

┌──────────────────────────────────┐
│  AuditoriaLoginRepository        │
│  extends JpaRepository           │
├──────────────────────────────────┤
│ + findByUsernameIngresadoOrderBy │
│   FechaHoraDesc(username): List  │
│ + countByUsernameIngresadoAnd    │
│   ExitosoFalseAndFechaHoraAfter │
│   (username, fecha): long        │
└──────────────────────────────────┘

┌──────────────────────────────────┐
│ AuditoriaRecuperacionRepository  │
│ extends JpaRepository            │
├──────────────────────────────────┤
│ + findByUsernameIngresadoOrderBy │
│   FechaHoraDesc(username): List  │
└──────────────────────────────────┘
```

## 2. Diagrama de Despliegue

```
┌─────────────────────────────────────────────────────────────────────────┐
│                      DIAGRAMA DE DESPLIEGUE                             │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│                         MÁQUINA LOCAL                                   │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌──────────────────────────────────────────────────────────────┐    │
│  │                    Docker Engine                             │    │
│  │                                                               │    │
│  │  ┌─────────────────────────────────────────────────────┐    │    │
│  │  │         Docker Network: clinica-network              │    │    │
│  │  │                                                       │    │    │
│  │  │  ┌──────────────────────────────────────────────┐   │    │    │
│  │  │  │  Container: clinica-mysql                   │   │    │    │
│  │  │  │  Image: mysql:8.0                           │   │    │    │
│  │  │  │  Port: 3307:3306                           │   │    │    │
│  │  │  │  Volume: mysql_data                        │   │    │    │
│  │  │  └──────────────────────────────────────────────┘   │    │    │
│  │  │                                                       │    │    │
│  │  │  ┌──────────────────────────────────────────────┐   │    │    │
│  │  │  │  Container: clinica-backend                  │   │    │    │
│  │  │  │  Image: clinica-backend:latest               │   │    │    │
│  │  │  │  Port: 8000:8000                            │   │    │    │
│  │  │  │  Depends on: mysql                          │   │    │    │
│  │  │  └──────────────────────────────────────────────┘   │    │    │
│  │  │                                                       │    │    │
│  │  │  ┌──────────────────────────────────────────────┐   │    │    │
│  │  │  │  Container: clinica-frontend                 │   │    │    │
│  │  │  │  Image: clinica-frontend:latest               │   │    │    │
│  │  │  │  Port: 4200:80                              │   │    │    │
│  │  │  │  Web Server: Nginx                          │   │    │    │
│  │  │  │  Depends on: backend                        │   │    │    │
│  │  │  └──────────────────────────────────────────────┘   │    │    │
│  │  └─────────────────────────────────────────────────────┘    │    │
│  └──────────────────────────────────────────────────────────────┘    │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ HTTP/HTTPS
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                         CLIENTES                                        │
├─────────────────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐                │
│  │   Browser    │  │   Postman    │  │   Mobile     │                │
│  │  (Chrome)    │  │   (API Test) │  │   (Future)   │                │
│  └──────────────┘  └──────────────┘  └──────────────┘                │
│                                                                         │
│  URLs:                                                                  │
│  - Frontend: http://localhost:4200                                      │
│  - Backend: http://localhost:8000/clinica/v1                            │
│  - Swagger: http://localhost:8000/clinica/v1/swagger-ui/index.html     │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│                    SERVICIOS EXTERNOS                                   │
├─────────────────────────────────────────────────────────────────────────┤
│  ┌──────────────────────────────────────────────────────────────┐    │
│  │              SMTP Server (Gmail)                              │    │
│  │  - smtp.gmail.com:587                                        │    │
│  │  - Protocolo: SMTP/TLS                                       │    │
│  └──────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────────┘
```

## 3. Diagrama de Arquitectura General

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    ARQUITECTURA DEL SISTEMA                              │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│                      CAPA DE PRESENTACIÓN                               │
│                         (Frontend)                                       │
├─────────────────────────────────────────────────────────────────────────┤
│  Angular 19 Application                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐                 │
│  │  Components  │  │   Services   │  │    Guards    │                 │
│  │  - Login     │  │  - Auth      │  │  - AuthGuard │                 │
│  │  - Usuario   │  │  - Backend   │  │  - AdminGuard│                 │
│  │  - Auditoria │  │  - Auditoria │  │              │                 │
│  └──────────────┘  └──────────────┘  └──────────────┘                 │
│                                                                         │
│  Tecnologías: Angular 19, TypeScript, RxJS, Bootstrap, SweetAlert2    │
│  Puerto: 4200 (desarrollo) / 80 (Docker)                               │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ HTTP/REST (JSON)
                                    │ JWT Authentication
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                       CAPA DE NEGOCIO                                   │
│                         (Backend)                                       │
├─────────────────────────────────────────────────────────────────────────┤
│  Spring Boot 3.3.4 Application                                          │
│  ┌─────────────────────────────────────────────────────┐                │
│  │              API Controllers                        │                │
│  │  - AutenticarApiController                          │                │
│  │  - AuditoriaApiController                           │                │
│  └─────────────────────────────────────────────────────┘                │
│                        │                                                │
│                        ▼                                                │
│  ┌─────────────────────────────────────────────────────┐                │
│  │              Services Layer                         │                │
│  │  - AutenticarService                               │                │
│  │  - RecuperarPasswordService                         │                │
│  │  - AuditoriaService                                │                │
│  │  - EmailService                                    │                │
│  └─────────────────────────────────────────────────────┘                │
│                        │                                                │
│                        ▼                                                │
│  ┌─────────────────────────────────────────────────────┐                │
│  │              Security Layer                         │                │
│  │  - SecurityConfig (CORS, JWT)                      │                │
│  │  - JwtTokenFilter                                  │                │
│  └─────────────────────────────────────────────────────┘                │
│                        │                                                │
│                        ▼                                                │
│  ┌─────────────────────────────────────────────────────┐                │
│  │              Repository Layer                       │                │
│  │  - UsuarioRepository                               │                │
│  │  - AuditoriaLoginRepository                        │                │
│  │  - AuditoriaRecuperacionRepository                 │                │
│  └─────────────────────────────────────────────────────┘                │
│                                                                         │
│  Tecnologías: Spring Boot, Spring Security, JPA/Hibernate, JWT        │
│  Puerto: 8000                                                           │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ JPA/Hibernate
                                    │ JDBC
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                        CAPA DE DATOS                                    │
│                      (Base de Datos)                                    │
├─────────────────────────────────────────────────────────────────────────┤
│  MySQL 8.0 Database                                                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐                │
│  │   usuario    │  │auditoria_login│  │auditoria_    │                │
│  │              │  │               │  │recuperacion   │                │
│  └──────────────┘  └──────────────┘  └──────────────┘                │
│                                                                         │
│  Puerto: 3306 (local) / 3307 (Docker)                                  │
│  Base de Datos: clinica                                                │
└─────────────────────────────────────────────────────────────────────────┘
```

## 4. Análisis de Arquitectura

### Arquitectura Elegida: Arquitectura en Capas (Layered Architecture)

El sistema utiliza una **arquitectura en capas** que separa las responsabilidades en tres niveles principales:

1. **Capa de Presentación (Frontend):** Angular 19
2. **Capa de Negocio (Backend):** Spring Boot
3. **Capa de Datos (Base de Datos):** MySQL

**Ventajas:**
- Separación clara de responsabilidades
- Facilita el mantenimiento
- Permite escalabilidad
- Facilita las pruebas

**Comparación con otras arquitecturas:**
- **Monolítica:** No elegida por limitaciones de escalabilidad
- **Microservicios:** No elegida por complejidad innecesaria para este proyecto
- **En Capas:** Elegida por balance perfecto entre simplicidad y escalabilidad

