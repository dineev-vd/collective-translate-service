FROM node:16-alpine
WORKDIR /app
COPY . .
RUN apk add g++ make py3-pip
RUN npm ci
WORKDIR /app/backend
RUN npm run build
WORKDIR /app/backend/dist
CMD node main
