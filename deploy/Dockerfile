FROM node:15 as build

ARG build_env=development

WORKDIR /app

# cache node_modules
COPY package.json package.json
COPY yarn.lock yarn.lock

COPY desktop/main-app/package.json desktop/main-app/package.json
COPY desktop/renderer-app/package.json desktop/renderer-app/package.json

COPY packages/flat-components/package.json packages/flat-components/package.json
COPY packages/flat-i18n/package.json packages/flat-i18n/package.json
COPY packages/flat-types/package.json packages/flat-types/package.json

COPY web/flat-web/package.json web/flat-web/package.json

RUN sed -i "s/.*preinstall.*//g" package.json && sed -i "s/.*desktop.*//g" package.json && yarn install --frozen-lockfile


COPY scripts scripts
COPY packages packages
COPY config config
COPY assets assets
# make sure flat-web postinstall script run at bootstrap
COPY web/flat-web/scripts web/flat-web/scripts

RUN yarn run bootstrap


COPY web web

RUN NODE_OPTIONS="--max-old-space-size=6145" yarn --cwd web/flat-web build -m $build_env


FROM nginx

WORKDIR /app

# keep previous version
COPY --from=agoraflat/flat-web:latest /app/assets /app/assets

COPY deploy/nginx.conf /etc/nginx/nginx.conf
COPY deploy/nginx-mime.types /etc/nginx/nginx-mime.types

COPY --from=build /app/web/flat-web/dist /app

CMD ["nginx"]
