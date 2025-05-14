# Base image
FROM node:18 AS base
WORKDIR /app
COPY package*.json ./
RUN npm install

# ---------- DEVELOPMENT ----------
FROM base AS development
COPY . .
ENV PATH /app/node_modules/.bin:$PATH
ENV CHOKIDAR_USEPOLLING=true
CMD ["npm", "run", "dev", "--", "--host"]

# ---------- PRODUCTION ----------
FROM base AS build
COPY . .
RUN npm run build

FROM nginx:stable-alpine AS production
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
