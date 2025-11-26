# Etapa 1: Build de Angular 19
FROM node:20 AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Etapa 2: Servir con NGINX
FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80