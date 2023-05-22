FROM node:16-alpine AS builder
WORKDIR /app
COPY . .
RUN apk add g++ make py3-pip
RUN npm ci
WORKDIR /app/frontend
RUN npm run build

FROM nginx:alpine AS runner
WORKDIR /app
COPY --from=builder /app/frontend/build /usr/share/nginx/html
COPY ./proxy/nginx.frontend.conf /etc/nginx/conf.d/default.conf