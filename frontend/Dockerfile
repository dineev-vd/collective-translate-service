FROM node:16-alpine AS builder
WORKDIR /app
COPY . .
RUN npm ci
RUN npm run build

FROM nginx:alpine AS runner
WORKDIR /app
COPY --from=builder /app/build /usr/share/nginx/html
COPY ./proxy/nginx.frontend.conf /etc/nginx/conf.d/default.conf