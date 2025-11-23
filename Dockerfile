# Dockerfile para Frontend Angular
FROM node:18-alpine AS build

WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar código fuente
COPY . .

# Construir la aplicación
RUN npm run build --prod

# Imagen de producción con Nginx
FROM nginx:alpine

# Copiar archivos construidos
COPY --from=build /app/dist/clinica-frontend /usr/share/nginx/html

# Exponer puerto
EXPOSE 80

# Iniciar Nginx
CMD ["nginx", "-g", "daemon off;"]
