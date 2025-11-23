# Fase de construcción
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install --legacy-peer-deps
COPY . .

# Compilar y VERIFICAR qué se genera
RUN npm run build -- --configuration production

# DEBUG: Listar contenido de dist
RUN echo "=== CONTENIDO DE DIST ==="
RUN ls -la /app/dist/
RUN echo "=== FIN CONTENIDO ==="

FROM nginx:alpine
# Copiar TODO el contenido de dist (sin nombre específico)
COPY --from=builder /app/dist/ /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 4200
