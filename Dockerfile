FROM node:alpine as base

WORKDIR /V1flix-BE-GQL

COPY package.json yarn.lock ./

RUN rm -rf node_modules && yarn install --frozen-lockfile && yarn global add typescript tsc ts-node && yarn cache clean

COPY . .

RUN tsc

CMD ["ts-node", "--esm", "./server.ts"]