FROM node:26-alpine AS base
RUN apk add --no-cache libc6-compat
RUN npm install -g pnpm@11.2.2
RUN pnpm config set fetch-retries 6 \
    && pnpm config set fetch-retry-factor 2 \
    && pnpm config set fetch-retry-mintimeout 10000 \
    && pnpm config set fetch-retry-maxtimeout 120000
WORKDIR /app

FROM base AS pruner
RUN npm install -g turbo@^2.3.0
COPY . .
RUN turbo prune @luckyplans/landing --docker

FROM base AS deps
COPY --from=pruner /app/out/json/ .
COPY --from=pruner /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=pruner /app/out/pnpm-workspace.yaml ./pnpm-workspace.yaml
COPY --from=pruner /app/.pnpmfile.cjs ./.pnpmfile.cjs
COPY --from=pruner /app/patches ./patches
RUN pnpm install --frozen-lockfile

FROM base AS builder
COPY --from=deps /app/ .
COPY --from=pruner /app/out/full/ .
COPY --from=pruner /app/tsconfig.base.json ./tsconfig.base.json
ARG VITE_APP_URL=/login
ARG VITE_DOCS_URL=/docs
ENV VITE_APP_URL=${VITE_APP_URL}
ENV VITE_DOCS_URL=${VITE_DOCS_URL}
RUN pnpm turbo run build --filter=@luckyplans/landing

FROM nginxinc/nginx-unprivileged:1.27-alpine AS runner
USER root
RUN apk upgrade --no-cache
COPY --from=builder /app/apps/landing/dist /usr/share/nginx/html

USER 101

EXPOSE 8080
