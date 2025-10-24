FROM node:18-alpine as builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

FROM nginx:alpine

# Copy built React app saja
COPY --from=builder /app/dist /usr/share/nginx/html

# NGINX config akan di-mount via docker-compose volumes
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
