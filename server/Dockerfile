FROM node

WORKDIR /app

COPY package.json /app

RUN npm install

COPY . .

EXPOSE 4001

CMD ["npm", "start"]