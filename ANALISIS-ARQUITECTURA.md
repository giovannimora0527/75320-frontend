# 🏗️ Análisis de Arquitectura - Sistema Clínica Uniminuto

## 1. Introducción

Este documento presenta el análisis de la arquitectura elegida para el sistema de gestión de clínica médica desarrollado como parte del examen final de Programación Web. El sistema permite la gestión integral de pacientes, médicos, citas, medicamentos y auditoría de seguridad.

## 2. Arquitectura Elegida: Arquitectura en Capas (Layered Architecture)

### 2.1 Justificación

Se ha seleccionado una **Arquitectura en Capas (Layered Architecture)**, también conocida como arquitectura de tres capas o N-tier, por las siguientes razones:

#### Ventajas Principales:

1. **Separación de Responsabilidades:**
   - Cada capa tiene una responsabilidad bien definida y única
   - Facilita la comprensión del sistema
   - Permite trabajar en paralelo en diferentes capas

2. **Mantenibilidad:**
   - Cambios en una capa no afectan directamente a las otras
   - Facilita la localización y corrección de errores
   - Reduce el acoplamiento entre componentes

3. **Escalabilidad:**
   - Permite escalar cada capa de forma independiente
   - Facilita la optimización de recursos
   - Permite distribuir la carga según necesidades

4. **Testabilidad:**
   - Cada capa puede ser probada de forma independiente
   - Facilita la implementación de pruebas unitarias
   - Permite mockear dependencias fácilmente

5. **Reutilización:**
   - Los servicios de la capa de negocio pueden ser reutilizados
   - Facilita la creación de nuevas interfaces (web, móvil, API)
   - Promueve el principio DRY (Don't Repeat Yourself)

### 2.2 Comparación con Otras Arquitecturas

#### Arquitectura Monolítica:
- ❌ **No elegida** porque:
  - Limita la escalabilidad independiente de componentes
  - Dificulta el despliegue de actualizaciones
  - Mayor acoplamiento entre módulos
  - Un fallo puede afectar todo el sistema

#### Arquitectura de Microservicios:
- ❌ **No elegida** porque:
  - Añade complejidad innecesaria para este proyecto
  - Requiere infraestructura más compleja (service discovery, API gateway)
  - Overhead de comunicación entre servicios
  - Mayor latencia en las comunicaciones
  - Requiere más recursos computacionales

#### Arquitectura en Capas (Elegida):
- ✅ **Elegida** porque:
  - Balance perfecto entre simplicidad y escalabilidad
  - Adecuada para proyectos de tamaño medio
  - Facilita el desarrollo y mantenimiento
  - Permite crecimiento futuro hacia microservicios si es necesario
  - Menor complejidad operacional

## 3. Descripción de las Capas

### 3.1 Capa de Presentación (Frontend)

**Tecnología:** Angular 19

**Responsabilidades:**
- Interfaz de usuario (UI)
- Validación de formularios en el cliente
- Comunicación con el backend mediante HTTP/REST
- Gestión del estado de la aplicación
- Enrutamiento y navegación
- Autenticación y autorización del lado del cliente

**Componentes Principales:**
- `LoginComponent`: Autenticación de usuarios
- `UsuarioComponent`: Gestión de usuarios
- `AuditoriaComponent`: Visualización de logs de auditoría
- `PacienteComponent`, `MedicoComponent`, `CitaComponent`, etc.

**Tecnologías Utilizadas:**
- Angular 19.0.5
- TypeScript
- RxJS (Observables)
- Bootstrap (UI)
- SweetAlert2 (Mensajería)
- NgxSpinner (Feedback visual)

**Puerto:** 4200 (desarrollo) / 80 (Docker)

### 3.2 Capa de Negocio (Backend)

**Tecnología:** Spring Boot 3.3.4

**Responsabilidades:**
- Lógica de negocio
- Validación de reglas de negocio
- Procesamiento de datos
- Gestión de transacciones
- Seguridad y autenticación
- Comunicación con la capa de datos

**Subcapas:**

1. **Capa de Controladores (API Layer):**
   - `AutenticarApiController`: Autenticación y recuperación de contraseña
   - `AuditoriaApiController`: Consulta de logs de auditoría
   - `UsuarioApiController`, `PacienteApiController`, etc.

2. **Capa de Servicios (Service Layer):**
   - `AutenticarServiceImpl`: Lógica de autenticación y bloqueo
   - `RecuperarPasswordServiceImpl`: Lógica de recuperación de contraseña
   - `AuditoriaServiceImpl`: Lógica de consulta de auditoría
   - `EmailService`: Envío de correos electrónicos

3. **Capa de Seguridad (Security Layer):**
   - `SecurityConfig`: Configuración de seguridad y CORS
   - `JwtTokenFilter`: Filtro de autenticación JWT
   - `JwtUtil`: Utilidades para JWT

4. **Capa de Repositorios (Repository Layer):**
   - `UsuarioRepository`: Acceso a datos de usuarios
   - `AuditoriaLoginRepository`: Acceso a logs de login
   - `AuditoriaRecuperacionRepository`: Acceso a logs de recuperación

**Tecnologías Utilizadas:**
- Spring Boot 3.3.4
- Spring Security
- Spring Data JPA / Hibernate
- JWT (JSON Web Tokens)
- Spring Mail

**Puerto:** 8000  
**Context Path:** /clinica/v1

### 3.3 Capa de Datos (Base de Datos)

**Tecnología:** MySQL 8.0

**Responsabilidades:**
- Almacenamiento persistente de datos
- Integridad referencial
- Optimización de consultas
- Respaldo y recuperación

**Tablas Principales:**
- `usuario`: Usuarios del sistema
- `auditoria_login`: Logs de intentos de login
- `auditoria_recuperacion`: Logs de recuperación de contraseña
- `paciente`, `medico`, `cita`, `medicamento`, etc.

**Puerto:** 3306 (local) / 3307 (Docker)

## 4. Flujo de Datos

```
Usuario
  │
  ▼
Frontend (Angular)
  │ HTTP/REST + JWT
  ▼
Backend (Spring Boot)
  │ JPA/Hibernate
  ▼
Base de Datos (MySQL)
  │
  ▼
Respuesta JSON
  │
  ▼
Frontend (Actualización UI)
```

## 5. Patrones de Diseño Implementados

### 5.1 Repository Pattern
- **Ubicación:** Capa de datos
- **Propósito:** Abstraer el acceso a datos
- **Implementación:** Interfaces `*Repository` que extienden `JpaRepository`

### 5.2 Service Layer Pattern
- **Ubicación:** Capa de negocio
- **Propósito:** Encapsular la lógica de negocio
- **Implementación:** Interfaces `*Service` con implementaciones `*ServiceImpl`

### 5.3 DTO Pattern (Data Transfer Object)
- **Ubicación:** Comunicación entre capas
- **Propósito:** Transferir datos entre frontend y backend
- **Implementación:** Clases `*Rq` (Request) y `*Rs` (Response)

### 5.4 Singleton Pattern
- **Ubicación:** Configuración de Spring
- **Propósito:** Garantizar una única instancia de beans
- **Implementación:** Anotaciones `@Service`, `@Repository`, `@Component`

### 5.5 Dependency Injection
- **Ubicación:** Todo el backend
- **Propósito:** Inversión de control y desacoplamiento
- **Implementación:** Anotaciones `@Autowired` y `@RequiredArgsConstructor`

## 6. Seguridad

### 6.1 Autenticación
- **JWT (JSON Web Tokens):** Tokens firmados con clave secreta
- **Expiración:** 24 horas (configurable)
- **Validación:** En cada petición mediante filtro

### 6.2 Autorización
- **Roles:** ADMIN, MEDICO, PACIENTE
- **Guards:** En frontend (AuthGuard, AdminGuard)
- **SecurityConfig:** En backend con roles

### 6.3 Protección contra Ataques
- **Bloqueo temporal:** Después de 3 intentos fallidos
- **Registro de IP:** Para trazabilidad
- **Mensajes genéricos:** No revelan información del sistema

## 7. Escalabilidad Futura

La arquitectura en capas permite migrar a microservicios en el futuro:

1. **Separación por dominio:**
   - Microservicio de autenticación
   - Microservicio de pacientes
   - Microservicio de citas
   - Microservicio de auditoría

2. **API Gateway:**
   - Punto único de entrada
   - Enrutamiento a microservicios
   - Autenticación centralizada

3. **Service Discovery:**
   - Registro de servicios
   - Balanceo de carga
   - Alta disponibilidad

## 8. Conclusión

La arquitectura en capas implementada proporciona:

✅ Separación clara de responsabilidades  
✅ Escalabilidad horizontal y vertical  
✅ Mantenibilidad y evolución del código  
✅ Seguridad robusta con auditoría completa  
✅ Documentación técnica exhaustiva  

El sistema está preparado para:
- Crecimiento futuro
- Integración con otros sistemas
- Migración a microservicios si es necesario
- Despliegue en diferentes entornos

---

**Documento generado:** Noviembre 2025  
**Versión del Sistema:** 1.0.0  
**Autor:** Equipo de Desarrollo - Clínica Uniminuto

