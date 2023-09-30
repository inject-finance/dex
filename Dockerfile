FROM node:20-alpine

# Docker working directory
WORKDIR /app

COPY . /app

RUN yarn install

EXPOSE 3333

CMD ["yarn", "workspace", "server", "start"]