# Dockerfile para el frontend Angular
# Multi-stage build para optimizar el tamaño de la imagen

# Etapa 1: Build - Compilar la aplicación Angular
FROM node:20-alpine AS build

WORKDIR /app

# Copiar archivos de configuración de npm
COPY package*.json ./

# Instalar dependencias
RUN npm ci --legacy-peer-deps

# Copiar el código fuente
COPY . .

# Compilar la aplicación para producción
RUN npm run build

# Etapa 2: Runtime - Servir la aplicación con Nginx
FROM nginx:alpine

# Copiar los archivos compilados desde la etapa de build
COPY --from=build /app/dist /usr/share/nginx/html

# Copiar configuración personalizada de Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exponer el puerto 80
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost/ || exit 1

# Nginx se inicia automáticamente
CMD ["nginx", "-g", "daemon off;"]

