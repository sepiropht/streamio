FROM jrottenberg/ffmpeg:3.3-alpine
FROM wernight/youtube-dl
FROM node:14

COPY --from=0 / /
COPY --from=1 / /

RUN useradd -ms /bin/bash node

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package.json ./
COPY yarn.lock ./

RUN yarn


COPY . .
COPY .env.production .env
ENV accessKeyId=$accessKeyId
ENV secretAccessKey=$secretAccessKey

RUN yarn build

ENV NODE_ENV production

EXPOSE 8080
CMD [ "node", "dist/index.js" ]