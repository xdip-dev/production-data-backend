FROM node:20

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npx prisma generate

RUN chmod +x /app/entrypoint.sh

RUN npm run build

ENTRYPOINT ["/app/entrypoint.sh"]

CMD [ "npm", "run", "start" ]