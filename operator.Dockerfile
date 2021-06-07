FROM node:12 AS node
WORKDIR source
RUN yarn global add typescript lerna

FROM node AS yarn
COPY ./package.json ./package.json
COPY ./tsconfig.json ./tsconfig.json
COPY ./lerna.json ./lerna.json

COPY ./packages/operator/package.json ./packages/operator/package.json
COPY ./packages/operator/tsconfig.json ./packages/operator/tsconfig.json

RUN yarn bootstrap

FROM yarn AS source
COPY ./packages/operator/src ./packages/operator/src

FROM source AS build
RUN yarn build
RUN yarn postbuild
COPY ./packages/operator/src/ambassador/from-get-ambassador.io/*.yaml ./packages/operator/lib/ambassador/from-get-ambassador.io

FROM node:12-alpine
WORKDIR k8s-operator
RUN yarn global add lerna

COPY ./package.json ./package.json
COPY ./lerna.json ./lerna.json

COPY ./packages/operator/package.json ./packages/operator/package.json

RUN lerna bootstrap -- --production --no-optional

COPY --from=build /source/packages/operator/lib ./packages/operator/lib

WORKDIR ./packages/operator
ENTRYPOINT ["yarn", "start"]
