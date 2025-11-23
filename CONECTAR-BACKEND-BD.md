# Cómo Conectar el Backend a la Base de Datos

## Paso 1: Verificar que MySQL está corriendo

### Opción A: MySQL Local (puerto 3306)
```powershell
netstat -ano | findstr :3306
```

### Opción B: MySQL en Docker (puerto 3307)
```powershell
netstat -ano | findstr :3307
```

---

## Paso 2: Crear la Base de Datos

### Usando MySQL Workbench (Recomendado)

1. **Abre MySQL Workbench**
2. **Conéctate a tu servidor MySQL:**
   - Host: `localhost` (o `127.0.0.1`)
   - Puerto: `3306` (o `3307` si usas Docker)
   - Usuario: `root`
   - Contraseña: La que configuraste (por defecto: `lozada11nahomi24*` o `1234` en Docker)

3. **Crea la base de datos:**
   ```sql
   CREATE DATABASE IF NOT EXISTS clinica;
   USE clinica;
   ```

4. **Ejecuta el script SQL completo:**
   - Abre: `C:\Clinica-Backend-Frontend\75320-backend\database_complete.sql`
   - Cópialo todo y ejecútalo en MySQL Workbench
   - O ve a **File** → **Run SQL Script** y selecciona el archivo

### Usando Línea de Comandos

```bash
mysql -u root -p < C:\Clinica-Backend-Frontend\75320-backend\database_complete.sql
```

O si ya estás en MySQL:
```sql
source C:/Clinica-Backend-Frontend/75320-backend/database_complete.sql;
```

---

## Paso 3: Verificar la Configuración del Backend

Abre el archivo:
`C:\Clinica-Backend-Frontend\75320-backend\src\main\resources\application.properties`

Verifica que tenga:
```properties
# Para MySQL local:
spring.datasource.url=jdbc:mysql://localhost:3306/clinica
spring.datasource.username=root
spring.datasource.password=lozada11nahomi24*

# O si usas MySQL en Docker (puerto 3307):
spring.datasource.url=jdbc:mysql://localhost:3307/clinica
spring.datasource.username=root
spring.datasource.password=1234
```

**Nota:** Cambia la contraseña si la tuya es diferente.

---

## Paso 4: Verificar que la Base de Datos Esté Creada

Ejecuta en MySQL:
```sql
USE clinica;
SHOW TABLES;
SELECT * FROM usuario;
```

Deberías ver:
- Lista de todas las tablas creadas
- El usuario `admin` con su hash de contraseña

---

## Paso 5: Reiniciar el Backend

1. **Detén el backend** si está corriendo (Ctrl+C)

2. **Inicia el backend de nuevo:**
   ```bash
   cd C:\Clinica-Backend-Frontend\75320-backend
   mvn spring-boot:run
   ```

3. **Verifica los logs** - deberías ver mensajes como:
   ```
   HikariPool-1 - Starting...
   HikariPool-1 - Start completed.
   ```

---

## Solución de Problemas

### Error: "Access denied for user 'root'@'localhost'"
- Verifica que la contraseña en `application.properties` sea correcta
- Prueba conectarte manualmente a MySQL con esa contraseña

### Error: "Unknown database 'clinica'"
- Ejecuta el script SQL `database_complete.sql` para crear la base de datos

### Error: "Could not open JPA EntityManager"
- Verifica que MySQL esté corriendo
- Verifica que el puerto sea correcto (3306 local o 3307 Docker)
- Verifica que las credenciales sean correctas

### Si usas Docker
- Verifica que el contenedor de MySQL esté corriendo: `docker ps`
- Verifica que el puerto esté mapeado correctamente: `docker-compose.yml` usa `3307:3306`

---

## Credenciales por Defecto

**Usuario Admin en la aplicación:**
- Usuario: `admin`
- Contraseña: `admin123`

**MySQL Local:**
- Usuario: `root`
- Contraseña: `lozada11nahomi24*` (según application.properties)

**MySQL en Docker:**
- Usuario: `root`
- Contraseña: `1234` (según docker-compose.yml)

