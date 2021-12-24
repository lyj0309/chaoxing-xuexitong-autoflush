FROM node:fermium-alpine3.11

WORKDIR /app

COPY ./package*.json /app/

RUN npm config set registry https://registry.npm.taobao.org
RUN yarn install && \
     yarn install --production  && \
     yarn cache clean

COPY ./ /app/

CMD ["yarn", "start"]

