FROM node

WORKDIR /app

COPY package.json /app

RUN npm install

COPY . .

EXPOSE 3004

CMD ["npm", "start"]