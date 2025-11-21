# Componente de Auditoría de Login

## Descripción

Componente Angular para visualizar y filtrar los logs de auditoría de inicio de sesión.

## Características

- ✅ Tabla dinámica con Bootstrap
- ✅ Filtros por usuario, fecha y tipo de evento
- ✅ Paginación completa
- ✅ Actualización en tiempo real (debounce de 500ms)
- ✅ Formateo de fechas
- ✅ Badges de estado (exitoso/fallido)
- ✅ Responsive design

## Estructura de Archivos

```
auditoria/
├── models/
│   ├── auditoria-login.ts          # Entidad de auditoría
│   ├── auditoria-login-rq.ts       # Request con filtros
│   └── auditoria-login-rs.ts       # Response paginado
├── service/
│   └── auditoria.service.ts        # Servicio para consumir API
├── auditoria.component.ts           # Lógica del componente
├── auditoria.component.html         # Template con tabla y filtros
└── auditoria.component.scss        # Estilos
```

## Uso

### Acceso

1. Iniciar sesión como administrador
2. Navegar a: `/inicio/auditoria`
3. O desde el menú lateral: "Logs de Auditoría"

### Filtros Disponibles

- **Usuario**: Búsqueda parcial por nombre de usuario
- **Fecha Desde**: Inicio del rango de fechas
- **Fecha Hasta**: Fin del rango de fechas
- **Tipo de Evento**: Todos / Exitosos / Fallidos

### Paginación

- Tamaño de página: 20 registros por defecto
- Navegación: Botones Anterior/Siguiente y números de página
- Información: Muestra rango de elementos y página actual

## API Consumida

**Endpoint:** `POST /auditoria/consultar`

**Autenticación:** Requiere token JWT (solo administradores)

## Mejoras Futuras

- Exportar a CSV/Excel
- Gráficos de estadísticas
- Filtro por IP
- Búsqueda avanzada con múltiples criterios

