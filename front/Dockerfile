FROM node:dubnium

RUN mkdir src
WORKDIR .
COPY ./src/package.json ./package.json
RUN npm install
EXPOSE 4201

CMD npm run serve
