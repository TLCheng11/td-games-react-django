FROM node:16-alpine

WORKDIR /home/node/app

# set ownership and permissions to default node user
COPY --chown=node:node package.json .
RUN npm install

COPY --chown=node:node . .

USER node