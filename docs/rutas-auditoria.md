# Rutas y Configuración - Módulo de Auditoría

## 🗺️ Mapa de Rutas Completo

### Frontend (Angular)

#### Ruta Principal de Auditoría
```
URL: http://localhost:4200/#/inicio/auditoria
Ruta Angular: /inicio/auditoria
Componente: AuditoriaComponent
Guard: adminGuard (solo administradores)
```

#### Configuración en app-routing.module.ts
```typescript
{
  path: 'inicio',
  component: AdminComponent,
  canActivate: [authGuard],
  children: [
    {
      path: 'auditoria',
      component: AuditoriaComponent,
      canActivate: [adminGuard],
      data: {
        title: 'Logs de Auditoría',
        module: 'auditoria',
        roles: ['ADMIN']
      }
    }
  ]
}
```

#### Item de Menú
```typescript
// Archivo: src/app/theme/layout/admin/navigation/navigation.ts
{
  id: 'auditoria',
  title: 'Logs de Auditoría',
  type: 'item',
  url: '/inicio/auditoria',
  icon: 'feather icon-shield',
  classes: 'nav-item'
}
```

### Backend (Spring Boot)

#### Endpoint de Consulta
```
URL Completa: http://localhost:8000/clinica/v1/auditoria/consultar
Método: POST
Context Path: /clinica/v1
Ruta Relativa: /auditoria/consultar
```

#### Configuración en application.properties
```properties
server.port=8000
server.servlet.contextPath=/clinica/v1
```

#### Configuración de Seguridad
```java
// SecurityConfig.java
.authorizeHttpRequests(requests -> requests
    .requestMatchers("/auth/login", "/auth/recuperar-contrasena").permitAll()
    .anyRequest().authenticated() // /auditoria/** requiere JWT
)
```

## 📡 Flujo de Comunicación

```
┌─────────────────────────────────────────────────────────┐
│                    FRONTEND                              │
│  http://localhost:4200/#/inicio/auditoria               │
│                                                          │
│  AuditoriaComponent                                      │
│    ↓                                                     │
│  AuditoriaService.consultarAuditoria()                   │
│    ↓                                                     │
│  HTTP POST                                               │
└──────────────────┬──────────────────────────────────────┘
                   │
                   │ POST /clinica/v1/auditoria/consultar
                   │ Headers: Authorization: Bearer <token>
                   │ Body: { filtros, paginación }
                   │
┌──────────────────▼──────────────────────────────────────┐
│                    BACKEND                               │
│  http://localhost:8000/clinica/v1                       │
│                                                          │
│  JwtTokenFilter (valida token)                           │
│    ↓                                                     │
│  AuditoriaApiController.consultarAuditoria()            │
│    ↓                                                     │
│  AuditoriaLoginServiceImpl.consultarAuditoria()          │
│    ↓                                                     │
│  AuditoriaLoginRepository.buscarConFiltros()             │
│    ↓                                                     │
│  MySQL: SELECT FROM auditoria_login WHERE ...            │
│    ↓                                                     │
│  Response: { contenido, totalElementos, paginación }     │
└──────────────────┬──────────────────────────────────────┘
                   │
                   │ JSON Response
                   │
┌──────────────────▼──────────────────────────────────────┐
│                    FRONTEND                              │
│  Tabla se actualiza con nuevos datos                     │
└─────────────────────────────────────────────────────────┘
```

## 🔐 Autenticación y Autorización

### Backend

**Requisitos:**
- Token JWT válido en header `Authorization: Bearer <token>`
- El token debe contener el rol `ADMIN` en el claim `rol`

**Validación:**
1. `JwtTokenFilter` intercepta la petición
2. Extrae y valida el token JWT
3. Establece el contexto de seguridad
4. `AuditoriaApiController` procesa la petición

### Frontend

**Guards aplicados:**
1. `authGuard`: Verifica que el usuario esté autenticado
2. `adminGuard`: Verifica que el usuario tenga rol `ADMIN`

**Flujo:**
```
Usuario intenta acceder a /inicio/auditoria
    ↓
authGuard verifica token en localStorage
    ↓
adminGuard verifica rol en localStorage
    ↓
Si es ADMIN → Acceso permitido
Si no es ADMIN → Redirige a /dashboard
```

## 📝 Ejemplos de Peticiones

### Ejemplo 1: Consulta Básica

**Frontend (TypeScript):**
```typescript
const filtros: AuditoriaLoginRq = {
  pagina: 0,
  tamano: 20
};

this.auditoriaService.consultarAuditoria(filtros).subscribe(
  respuesta => {
    console.log('Total elementos:', respuesta.totalElementos);
    console.log('Datos:', respuesta.contenido);
  }
);
```

**Backend (cURL):**
```bash
curl -X POST "http://localhost:8000/clinica/v1/auditoria/consultar" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -d '{
    "pagina": 0,
    "tamano": 20
  }'
```

### Ejemplo 2: Con Filtros

**Frontend:**
```typescript
const filtros: AuditoriaLoginRq = {
  username: "admin",
  fechaDesde: "2025-11-01T00:00:00",
  fechaHasta: "2025-11-30T23:59:59",
  exitoso: false,
  pagina: 0,
  tamano: 50
};
```

**Backend:**
```bash
curl -X POST "http://localhost:8000/clinica/v1/auditoria/consultar" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "username": "admin",
    "fechaDesde": "2025-11-01T00:00:00",
    "fechaHasta": "2025-11-30T23:59:59",
    "exitoso": false,
    "pagina": 0,
    "tamano": 50
  }'
```

## 🗂️ Estructura de Rutas del Proyecto

### Backend - Paquetes Java

```
com.uniminuto.clinica
├── api/
│   └── AuditoriaApi.java                    → /auditoria
├── apicontroller/
│   └── AuditoriaApiController.java          → Implementa AuditoriaApi
├── entity/
│   └── AuditoriaLogin.java                  → Tabla: auditoria_login
├── model/
│   ├── AuditoriaLoginRq.java                → Request DTO
│   └── AuditoriaLoginRs.java                → Response DTO
├── repository/
│   └── AuditoriaLoginRepository.java        → JPA Repository
└── service/
    ├── AuditoriaLoginService.java           → Interfaz
    └── impl/
        └── AuditoriaLoginServiceImpl.java   → Implementación
```

### Frontend - Estructura Angular

```
src/app/
├── app-routing.module.ts                     → Configuración de rutas
├── guards/
│   └── guards.ts                             → adminGuard, authGuard
└── demo/pages/auditoria/
    ├── models/                               → TypeScript interfaces
    ├── service/
    │   └── auditoria.service.ts              → Servicio HTTP
    ├── auditoria.component.ts                → Lógica del componente
    ├── auditoria.component.html              → Template
    └── auditoria.component.scss              → Estilos
```

## 🔗 Enlaces Rápidos

### Desarrollo Local

- **Frontend:** http://localhost:4200/#/inicio/auditoria
- **Backend API:** http://localhost:8000/clinica/v1/auditoria/consultar
- **Swagger UI:** http://localhost:8000/clinica/v1/swagger-ui/index.html

### Documentación

- **Endpoint Backend:** `75320-backend/docs/auditoria-endpoint.md`
- **Componente Frontend:** `75320-frontend/src/app/demo/pages/auditoria/README.md`
- **Configuración Completa:** `75320-backend/docs/auditoria-configuracion-completa.md`

---

**Última actualización:** Noviembre 2025

