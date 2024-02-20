FROM node:18

RUN mkdir -p /home/app_front

COPY . /home/app_front

WORKDIR /home/app_front

RUN npm install

EXPOSE 3000

CMD ["npm","start"]