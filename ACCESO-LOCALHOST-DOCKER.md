# 🐳 Acceso a la Aplicación en Docker - Localhost

## 📍 URLs de Acceso

### Frontend (Angular)
```
URL: http://localhost:4200
Puerto: 4200 (mapeado desde puerto 80 del contenedor)
```

### Backend (Spring Boot)
```
URL Base: http://localhost:8000/clinica/v1
Puerto: 8000
Swagger UI: http://localhost:8000/clinica/v1/swagger-ui/index.html
```

### Base de Datos (MySQL)
```
Host: localhost
Puerto: 3307 (mapeado desde puerto 3306 del contenedor)
Usuario: root
Contraseña: 1234
Base de datos: clinica
```

## 🚀 Comandos para Iniciar Docker

### 1. Verificar que Docker Desktop esté corriendo

**Windows:**
- Abrir Docker Desktop desde el menú de inicio
- Verificar que el ícono de Docker esté en la bandeja del sistema (systray)

### 2. Construir las imágenes (primera vez o después de cambios)

```bash
cd C:\Backent
docker-compose build
```

### 3. Iniciar todos los contenedores

```bash
docker-compose up -d
```

El flag `-d` ejecuta los contenedores en modo "detached" (en segundo plano).

### 4. Ver el estado de los contenedores

```bash
docker-compose ps
```

O para ver todos los contenedores (incluyendo detenidos):

```bash
docker ps -a
```

### 5. Ver los logs

**Todos los servicios:**
```bash
docker-compose logs -f
```

**Solo backend:**
```bash
docker-compose logs -f backend
```

**Solo frontend:**
```bash
docker-compose logs -f frontend
```

**Solo MySQL:**
```bash
docker-compose logs -f mysql
```

### 6. Detener los contenedores

```bash
docker-compose down
```

### 7. Detener y eliminar volúmenes (⚠️ elimina datos de BD)

```bash
docker-compose down -v
```

## 🔍 Verificar que Todo Está Funcionando

### 1. Verificar contenedores activos

```bash
docker ps
```

Deberías ver 3 contenedores:
- `clinica-mysql`
- `clinica-backend`
- `clinica-frontend`

### 2. Verificar salud de los servicios

```bash
docker-compose ps
```

Todos deberían mostrar `Up` y `healthy` (después de unos minutos).

### 3. Probar acceso al Frontend

Abrir en el navegador:
```
http://localhost:4200
```

### 4. Probar acceso al Backend

Abrir en el navegador:
```
http://localhost:8000/clinica/v1/swagger-ui/index.html
```

### 5. Probar conexión a MySQL

```bash
mysql -h localhost -P 3307 -u root -p1234 clinica
```

O desde MySQL Workbench:
- Host: `localhost`
- Port: `3307`
- Username: `root`
- Password: `1234`
- Database: `clinica`

## 📊 Mapeo de Puertos

| Servicio | Puerto Contenedor | Puerto Localhost | URL Acceso |
|----------|-------------------|------------------|------------|
| MySQL | 3306 | 3307 | `localhost:3307` |
| Backend | 8000 | 8000 | `http://localhost:8000` |
| Frontend | 80 | 4200 | `http://localhost:4200` |

## 🔧 Configuración de Red

Los contenedores están en la red `clinica-network` y se comunican entre sí usando los nombres de servicio:

- Backend → MySQL: `mysql:3306`
- Frontend → Backend: `backend:8000` (dentro del contenedor)
- Frontend → Backend (desde navegador): `localhost:8000` (proxy en nginx.conf)

## 🌐 Configuración del Frontend en Docker

El frontend usa Nginx como servidor web. La configuración está en:
```
75320-frontend/nginx.conf
```

El proxy está configurado para redirigir las peticiones `/clinica/v1/` al backend:
```nginx
location /clinica/v1/ {
    proxy_pass http://backend:8000/clinica/v1/;
}
```

## ⚠️ Solución de Problemas

### Error: "Docker Desktop no está corriendo"

**Solución:**
1. Abrir Docker Desktop desde el menú de inicio
2. Esperar a que se inicie completamente (ícono en systray)
3. Verificar con: `docker ps`

### Error: "Puerto ya en uso"

**Solución:**
Si el puerto 8000 o 4200 ya está en uso:

1. Detener la aplicación que usa el puerto
2. O cambiar el puerto en `docker-compose.yml`:
   ```yaml
   ports:
     - "8001:8000"  # Cambiar 8000 a 8001
   ```

### Error: "No se puede conectar al backend"

**Solución:**
1. Verificar que el backend esté corriendo: `docker-compose logs backend`
2. Verificar que MySQL esté saludable: `docker-compose ps mysql`
3. Esperar a que el backend termine de iniciar (puede tardar 1-2 minutos)

### Error: "Frontend no carga"

**Solución:**
1. Verificar logs: `docker-compose logs frontend`
2. Verificar que el build se haya completado correctamente
3. Reconstruir la imagen: `docker-compose build frontend`

### Error: "MySQL connection refused"

**Solución:**
1. Verificar que MySQL esté corriendo: `docker-compose ps mysql`
2. Verificar logs: `docker-compose logs mysql`
3. Esperar a que MySQL termine de inicializar (puede tardar 30-60 segundos)

## 📝 Comandos Útiles

### Reiniciar un servicio específico

```bash
docker-compose restart backend
docker-compose restart frontend
docker-compose restart mysql
```

### Reconstruir un servicio específico

```bash
docker-compose build backend
docker-compose up -d backend
```

### Ver uso de recursos

```bash
docker stats
```

### Limpiar todo (⚠️ elimina contenedores, imágenes, volúmenes)

```bash
docker-compose down -v --rmi all
```

## 🔐 Credenciales por Defecto

### MySQL
- Usuario: `root`
- Contraseña: `1234`
- Base de datos: `clinica`

### Usuario Admin (creado automáticamente)
- Usuario: `admin`
- Contraseña: `admin123`
- Rol: `ADMIN`

## 📱 Acceso desde Otros Dispositivos en la Red Local

Si quieres acceder desde otro dispositivo en tu red local:

1. Obtener tu IP local:
   ```bash
   ipconfig  # Windows
   ```

2. Acceder usando tu IP:
   ```
   http://TU_IP_LOCAL:4200  # Frontend
   http://TU_IP_LOCAL:8000  # Backend
   ```

**Nota:** Asegúrate de que el firewall de Windows permita conexiones en los puertos 4200 y 8000.

---

**Última actualización:** Noviembre 2025

