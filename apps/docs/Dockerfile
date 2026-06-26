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
RUN turbo prune @luckyplans/docs --docker

FROM base AS deps
COPY --from=pruner /app/out/json/ .
COPY --from=pruner /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=pruner /app/out/pnpm-workspace.yaml ./pnpm-workspace.yaml
COPY --from=pruner /app/.pnpmfile.cjs ./.pnpmfile.cjs
RUN pnpm install --frozen-lockfile

FROM base AS builder
COPY --from=deps /app/ .
COPY --from=pruner /app/out/full/ .
COPY --from=pruner /app/tsconfig.base.json ./tsconfig.base.json
ARG DOCS_APP_URL=/login
ENV DOCS_APP_URL=${DOCS_APP_URL}
RUN pnpm turbo run build --filter=@luckyplans/docs

FROM nginxinc/nginx-unprivileged:1.27-alpine AS runner
COPY --from=builder /app/apps/docs/build /usr/share/nginx/html

USER 101

EXPOSE 8080
