FROM node:dubnium

RUN mkdir app
WORKDIR /app
COPY ./app/package.json ./package.json
RUN npm install
EXPOSE 4201

CMD npm start
