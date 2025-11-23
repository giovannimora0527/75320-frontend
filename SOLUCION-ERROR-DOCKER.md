# Solución al Error "Could not open JPA EntityManager for transaction"

## Problema Identificado

El error ocurre porque:
- El **backend está corriendo LOCALMENTE** (fuera de Docker)
- Está intentando conectarse a MySQL en `localhost:3306`
- Pero puede haber un conflicto de configuración entre Docker y local

## Soluciones Posibles

### Opción 1: Usar Docker para Todo (Recomendado)

**Ventajas:** Todo funciona automáticamente, sin configuración manual

1. **Detén el backend local** si está corriendo (Ctrl+C)

2. **Inicia todo con Docker:**
   ```bash
   cd C:\Clinica-Backend-Frontend
   docker-compose up -d
   ```

3. **Espera a que todos los contenedores estén listos:**
   ```bash
   docker-compose ps
   ```
   (Verifica que todos digan "Up" y "healthy")

4. **Accede a la aplicación:**
   - Frontend: http://localhost:4200
   - Backend: http://localhost:8000/clinica/v1
   - Swagger: http://localhost:8000/clinica/v1/swagger-ui/index.html

**Credenciales por defecto en Docker:**
- Usuario: `admin`
- Contraseña: `admin123`

---

### Opción 2: Usar Todo Localmente (Sin Docker)

Si prefieres NO usar Docker:

1. **Asegúrate de que MySQL esté corriendo localmente:**
   - Puerto: 3306
   - Usuario: `root`
   - Contraseña: `lozada11nahomi24*` (o la que configuraste)

2. **Crea la base de datos:**
   ```sql
   CREATE DATABASE IF NOT EXISTS clinica;
   ```

3. **Ejecuta el script SQL:**
   - Abre MySQL Workbench o línea de comandos
   - Ejecuta: `C:\Clinica-Backend-Frontend\75320-backend\database_complete.sql`

4. **Verifica que el archivo `application.properties` tenga:**
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/clinica
   spring.datasource.username=root
   spring.datasource.password=lozada11nahomi24*
   ```

5. **Reinicia el backend** si estaba corriendo

---

### Opción 3: MySQL en Docker, Backend Local

Si quieres MySQL en Docker pero el backend local:

1. **Comenta el servicio backend en docker-compose.yml:**
   ```yaml
   # backend:
   #   ...
   ```

2. **Inicia solo MySQL con Docker:**
   ```bash
   docker-compose up mysql -d
   ```

3. **Actualiza `application.properties` para conectarse al MySQL de Docker:**
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3307/clinica
   ```
   (Nota: 3307 es el puerto externo mapeado del contenedor)

---

## Verificación

Después de aplicar cualquier solución, verifica:

1. **Que MySQL esté corriendo:**
   ```bash
   netstat -ano | findstr :3306
   # O si usas Docker:
   netstat -ano | findstr :3307
   ```

2. **Que la base de datos exista:**
   ```sql
   USE clinica;
   SHOW TABLES;
   ```

3. **Que el backend pueda conectarse:**
   - Intenta iniciar sesión con `admin` / `admin123`
   - Revisa los logs del backend si falla

---

## Recomendación

**Usa Docker para todo** (`docker-compose up -d`). Es más fácil y evita conflictos de configuración.

