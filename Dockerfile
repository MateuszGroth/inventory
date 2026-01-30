##################################
# STAGE: BASE                    #
##################################
ARG NODE_VERSION

FROM node:$NODE_VERSION-trixie-slim AS base

RUN apt-get update && apt-get install -y procps && rm -rf /var/lib/apt/lists/*
RUN npm install -g pnpm

RUN mkdir /app

##################################
# STAGE: DEPENDENCIES-BASE       #
##################################

FROM base AS dependencies-base

ENV NODE_ENV development

COPY package.json pnpm-lock.yaml tsconfig.json tsconfig.base.json nx.json eslint.config.mjs .prettierrc /app/
COPY apps /app/apps
COPY libs /app/libs

WORKDIR /app

RUN pnpm install --frozen-lockfile --store-dir .pnpm-store

##################################
# STAGE: DEV                     #
##################################

FROM dependencies-base AS dev

WORKDIR /app

COPY scripts/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

ENTRYPOINT [ "/entrypoint.sh" ]
