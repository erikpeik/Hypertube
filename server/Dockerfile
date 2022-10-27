FROM node:alpine

RUN mkdir -p /app
WORKDIR /app

COPY package.json ./
COPY package-lock.json ./
COPY ./ ./
RUN npm i
RUN apk update
RUN apk add
RUN apk add ffmpeg
CMD ["npm", "run", "start"]
