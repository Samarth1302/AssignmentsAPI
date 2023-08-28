FROM node:latest

WORKDIR /home/app

COPY . /home/app

RUN npm install

EXPOSE 3000

CMD ["node", "./src/server.js"]
