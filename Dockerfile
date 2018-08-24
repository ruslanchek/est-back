FROM node:8
RUN mkdir -p /electron_server
ADD . /electron_server
WORKDIR /electron_server
RUN npm i
EXPOSE 5500
CMD ["yarn", "start:prod"]
