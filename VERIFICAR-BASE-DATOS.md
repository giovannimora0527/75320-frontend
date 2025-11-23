# Solución para el Error de Conexión a MySQL

## Problema
El backend no puede conectarse a la base de datos MySQL, mostrando el error:
```
Internal server error: Could not open JPA EntityManager for transaction
```

## Solución

### Opción 1: Verificar y crear la base de datos manualmente

1. **Abre MySQL Workbench o la línea de comandos de MySQL**

2. **Conéctate a MySQL con el usuario root:**
   ```sql
   mysql -u root -p
   ```
   (Usa la contraseña que configuraste para MySQL)

3. **Crea la base de datos si no existe:**
   ```sql
   CREATE DATABASE IF NOT EXISTS clinica;
   USE clinica;
   ```

4. **Ejecuta el script SQL completo:**
   - Abre el archivo: `C:\Clinica-Backend-Frontend\75320-backend\database_complete.sql`
   - Cópialo y ejecútalo en MySQL Workbench o desde la línea de comandos

### Opción 2: Verificar credenciales

El backend está configurado para conectarse con:
- **URL:** `jdbc:mysql://localhost:3306/clinica`
- **Usuario:** `root`
- **Contraseña:** `lozada11nahomi24*`

**Si tu contraseña de MySQL es diferente**, actualiza el archivo:
`C:\Clinica-Backend-Frontend\75320-backend\src\main\resources\application.properties`

Línea 13: Cambia `lozada11nahomi24*` por tu contraseña real.

### Opción 3: Verificar si hay múltiples instancias de MySQL

1. **Verifica qué está usando el puerto 3306:**
   ```powershell
   netstat -ano | findstr :3306
   ```

2. **Si hay Docker corriendo**, verifica los contenedores:
   ```powershell
   docker ps
   ```

### Usuario Admin por Defecto

Después de ejecutar el script SQL, puedes iniciar sesión con:
- **Usuario:** `admin`
- **Contraseña:** `admin123`

El hash de la contraseña en la base de datos es: `0192023a7bbd73250516f069df18b500` (MD5 de "admin123")

## Verificar que funciona

1. Reinicia el backend Spring Boot
2. Intenta iniciar sesión con `admin` / `admin123`
3. Si sigue fallando, revisa los logs del backend para ver el error específico de conexión

