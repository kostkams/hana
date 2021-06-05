FROM node:12 AS node
WORKDIR source
RUN yarn global add typescript

FROM node AS yarn
COPY ./package.json ./package.json
COPY ./tsconfig.json ./tsconfig.json
RUN yarn install

FROM yarn AS source
COPY ./src ./src

FROM source AS build
RUN yarn build

FROM node:12-alpine
WORKDIR k8s-operator
COPY ./package.json ./package.json
RUN yarn install --prod
COPY --from=build /source/dist ./dist

ENTRYPOINT ["yarn", "start"]
