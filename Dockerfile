FROM node

RUN mkdir /application
WORKDIR /application

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 4201
CMD ["node","dist/server.js"]
