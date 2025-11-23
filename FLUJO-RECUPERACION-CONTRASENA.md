# 🔐 Flujo de Recuperación de Contraseña

## 📋 Descripción General

El módulo de recuperación de contraseña permite a los usuarios solicitar una contraseña temporal que se envía a su correo electrónico registrado. Por motivos de seguridad, el sistema no revela si el usuario existe o no en el sistema.

## 🔄 Flujo del Proceso

```
1. Usuario ingresa username en el formulario
   ↓
2. Frontend envía POST /auth/recuperar-contrasena
   ↓
3. Backend valida que el username no esté vacío
   ↓
4. Backend busca el usuario en la base de datos
   ↓
5a. Si NO existe:
    - Registra auditoría (fallido)
    - Retorna mensaje genérico
   ↓
5b. Si existe:
    - Genera contraseña temporal (8 caracteres)
    - Cifra la contraseña
    - Actualiza el usuario en BD
    - Envía email con contraseña temporal
    - Registra auditoría (exitoso)
    - Retorna mensaje genérico
```

## 🗄️ Modificaciones en la Base de Datos

### Tabla: `auditoria_recuperacion`

```sql
CREATE TABLE `auditoria_recuperacion` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `username_ingresado` VARCHAR(50) NOT NULL,
  `fecha_hora` DATETIME NOT NULL,
  `descripcion` TEXT,
  `exitoso` TINYINT(1) NOT NULL DEFAULT 0,
  `email_usuario` VARCHAR(100) DEFAULT NULL,
  `ip_origen` VARCHAR(45) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_username` (`username_ingresado`),
  KEY `idx_fecha_hora` (`fecha_hora`),
  KEY `idx_exitoso` (`exitoso`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

**Campos:**
- `username_ingresado`: Nombre de usuario ingresado
- `fecha_hora`: Fecha y hora de la transacción
- `descripcion`: Descripción del error o resultado
- `exitoso`: Indica si el intento fue exitoso
- `email_usuario`: Email del usuario (solo si fue exitoso)
- `ip_origen`: IP desde donde se realizó la solicitud

## 🔧 Modificaciones en el Backend

### 1. Entidad: `AuditoriaRecuperacion`
- **Ubicación:** `com.uniminuto.clinica.entity.AuditoriaRecuperacion`
- Mapea la tabla `auditoria_recuperacion`

### 2. Repositorio: `AuditoriaRecuperacionRepository`
- **Ubicación:** `com.uniminuto.clinica.repository.AuditoriaRecuperacionRepository`
- Extiende `JpaRepository<AuditoriaRecuperacion, Long>`

### 3. Servicio: `RecuperarPasswordService` / `RecuperarPasswordServiceImpl`
- **Ubicación:** `com.uniminuto.clinica.service.impl.RecuperarPasswordServiceImpl`
- **Métodos principales:**
  - `recuperarPassword()`: Procesa la solicitud
  - `generarPasswordTemporal()`: Genera contraseña aleatoria de 8 caracteres
  - `registrarAuditoria()`: Registra el intento en la auditoría

### 4. Controlador: `AutenticarApiController`
- **Endpoint:** `POST /auth/recuperar-contrasena`
- **Request:** `RecuperarPasswordRq { username: string }`
- **Response:** `RespuestaRs { mensaje: string, success: boolean }`

### 5. Seguridad
- No revela si el usuario existe o no
- Siempre retorna el mismo mensaje genérico
- Registra todos los intentos (exitosos y fallidos)

## 🎨 Modificaciones en el Frontend

### Componente: `LoginComponent`
- **Método:** `onForgotPassword()`
- **Tecnología:** SweetAlert2 para el formulario
- **Comportamiento:**
  - Muestra formulario modal
  - Valida que el username tenga mínimo 3 caracteres
  - Llama al servicio `RecuperarPasswordService`
  - Muestra mensaje genérico (por seguridad)

### Servicio: `RecuperarPasswordService`
- **Ubicación:** `src/app/demo/pages/login/service/recuperar-password.service.ts`
- **Método:** `recuperarPassword(username: string)`

## 📝 Ejemplo de Uso

### Request:
```json
POST /auth/recuperar-contrasena
{
  "username": "admin"
}
```

### Response (siempre genérico):
```json
{
  "status": 200,
  "success": true,
  "mensaje": "Si el usuario existe y tiene un correo electrónico registrado, se enviará una contraseña temporal."
}
```

## 🔒 Consideraciones de Seguridad

1. **No revelar información:**
   - No indica si el usuario existe
   - No indica si el email es válido
   - Mensaje genérico siempre

2. **Auditoría completa:**
   - Todos los intentos se registran
   - Incluye IP de origen
   - Fecha y hora exacta

3. **Contraseña temporal:**
   - 8 caracteres aleatorios
   - Alfanumérica (mayúsculas, minúsculas, números)
   - Se cifra antes de guardar

## ✅ Verificación

Para verificar que funciona:
1. Ingresar un username válido → Debe recibir email
2. Ingresar un username inválido → No debe revelar error
3. Revisar tabla `auditoria_recuperacion` → Debe tener registros

