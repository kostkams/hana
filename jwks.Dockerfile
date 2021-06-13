FROM node:12 AS node
WORKDIR source
RUN yarn global add typescript lerna

FROM node AS yarn
COPY ./package.json ./package.json
COPY ./tsconfig.json ./tsconfig.json
COPY ./lerna.json ./lerna.json


COPY ./packages/common/package.json ./packages/common/package.json
COPY ./packages/common/tsconfig.json ./packages/common/tsconfig.json


COPY ./packages/jwks/package.json ./packages/jwks/package.json
COPY ./packages/jwks/tsconfig.json ./packages/jwks/tsconfig.json

RUN yarn bootstrap

FROM yarn AS source
COPY ./packages/common/src ./packages/common/src

COPY ./packages/jwks/src ./packages/jwks/src

FROM source AS build
RUN yarn build
RUN yarn postbuild

FROM node:12-alpine
WORKDIR jwks
RUN yarn global add lerna

COPY ./package.json ./package.json
COPY ./lerna.json ./lerna.json

COPY ./packages/common/package.json ./packages/common/package.json
COPY ./packages/jwks/package.json ./packages/jwks/package.json

RUN lerna bootstrap -- --production --no-optional

COPY --from=build /source/packages/common/lib ./packages/common/lib

COPY --from=build /source/packages/jwks/lib ./packages/jwks/lib

WORKDIR ./packages/jwks
ENTRYPOINT ["yarn", "start"]
