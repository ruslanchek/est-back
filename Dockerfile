FROM node:8
RUN mkdir -p /realthub
ADD . /realthub
WORKDIR /realthub
RUN npm i
EXPOSE 5500
CMD ["yarn", "start:prod"]
