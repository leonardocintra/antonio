FROM node:18-alpine

USER node 

RUN mkdir -p /home/node/app

WORKDIR /home/node/app

COPY --chown=node:node . .

RUN npm install
RUN npm run build
RUN rm -R dist/

ENV NODE_ENV=prod

EXPOSE 3000

CMD ["npm", "run", "start:prod"]
