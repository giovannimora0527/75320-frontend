# Cómo Ejecutar el Script SQL de la Base de Datos

## Paso 1: Abrir MySQL

Tienes dos opciones:

### Opción A: MySQL Workbench (Recomendado)
1. Abre MySQL Workbench
2. Conéctate a tu servidor MySQL local
3. Usuario: `root`
4. Contraseña: La que configuraste para MySQL

### Opción B: Línea de Comandos
```bash
mysql -u root -p
```
(Te pedirá la contraseña)

## Paso 2: Verificar/Crear la Base de Datos

Si ya estás conectado, ejecuta:
```sql
CREATE DATABASE IF NOT EXISTS clinica;
USE clinica;
```

O el script ya lo hace automáticamente.

## Paso 3: Ejecutar el Script SQL

### En MySQL Workbench:
1. Ve a **File** → **Open SQL Script**
2. Busca el archivo: `C:\Clinica-Backend-Frontend\75320-backend\database_complete.sql`
3. Haz clic en el botón de ejecutar (⚡) o presiona `Ctrl+Shift+Enter`

### En Línea de Comandos:
```bash
mysql -u root -p clinica < C:\Clinica-Backend-Frontend\75320-backend\database_complete.sql
```

O si ya estás en MySQL:
```sql
source C:/Clinica-Backend-Frontend/75320-backend/database_complete.sql;
```

**Nota:** En Windows, usa barras normales `/` o barras invertidas dobles `\\` en la ruta.

## Paso 4: Verificar que Funcionó

Ejecuta estas consultas para verificar:
```sql
USE clinica;
SHOW TABLES;
SELECT * FROM usuario;
```

Deberías ver:
- Lista de todas las tablas creadas
- El usuario `admin` con su hash de contraseña

## Paso 5: Reiniciar el Backend

1. Detén el backend si está corriendo
2. Inícialo de nuevo
3. Intenta iniciar sesión con:
   - **Usuario:** `admin`
   - **Contraseña:** `admin123`

## Solución de Problemas

### Error: "Access denied"
- Verifica que la contraseña de MySQL sea correcta
- Asegúrate de usar el usuario `root` o un usuario con permisos de administrador

### Error: "Can't connect to MySQL server"
- Verifica que MySQL esté corriendo
- Revisa que esté en el puerto 3306

### Error: "Database 'clinica' doesn't exist"
- El script ahora crea la base de datos automáticamente
- Si aún falla, ejecuta manualmente: `CREATE DATABASE clinica;`

