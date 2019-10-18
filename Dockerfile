FROM node:10 as node

WORKDIR /app/

COPY src/ /app/src/
COPY package.json webpack.config.js yarn.lock /app/

ENV NODE_ENV production

RUN yarn install && yarn build

FROM nginx:alpine

COPY --from=node --chown=1000 /app/build/ /usr/share/nginx/html/

COPY config/vhost.conf /etc/nginx/conf.d/default.conf
