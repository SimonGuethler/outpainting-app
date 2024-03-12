FROM node:lts-alpine

WORKDIR /app

COPY package*.json .
RUN npm ci

COPY . .
RUN npm run build

EXPOSE 8080
CMD ["npm", "run", "start"]
#ENTRYPOINT ["tail", "-f", "/dev/null"]
