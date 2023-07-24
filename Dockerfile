# Image source
FROM node:19-alpine

# Docker working directory
WORKDIR /app

# Copying file into APP directory of docker
COPY ./package.json /app

# Then install the NPM module
RUN yarn

RUN yarn add @nestjs/cli --global -W

# Copy current directory to APP folder
COPY . /app

EXPOSE 3333

CMD ["yarn", "workspace", "server", "dev"]