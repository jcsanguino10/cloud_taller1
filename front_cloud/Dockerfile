FROM node:18

RUN mkdir -p app_front

COPY . /app_front

WORKDIR /app_front

RUN npm install

EXPOSE 3000

CMD ["npm","start"]