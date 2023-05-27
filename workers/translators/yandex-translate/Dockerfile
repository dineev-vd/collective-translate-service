FROM node:16-alpine
WORKDIR /app
COPY . .
RUN apk add g++ make py3-pip
RUN npm ci
RUN npm run build
WORKDIR /app/dist
CMD node main
