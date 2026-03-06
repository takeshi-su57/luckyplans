FROM node:25-alpine AS base
RUN apk add --no-cache libc6-compat
RUN npm install -g pnpm@9.15.4
WORKDIR /app

# --- Pruned workspace ---
FROM base AS pruner
RUN npm install -g turbo@^2.3.0
COPY . .
RUN turbo prune @luckyplans/service-core --docker

# --- Install dependencies ---
FROM base AS deps
COPY --from=pruner /app/out/json/ .
COPY --from=pruner /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=pruner /app/out/pnpm-workspace.yaml ./pnpm-workspace.yaml
RUN pnpm install --frozen-lockfile

# --- Build ---
FROM base AS builder
COPY --from=deps /app/ .
COPY --from=pruner /app/out/full/ .
COPY --from=pruner /app/tsconfig.base.json ./tsconfig.base.json
RUN pnpm turbo run build --filter=@luckyplans/service-core
# Resolve pnpm symlinks into a self-contained deployment directory
RUN pnpm --filter=@luckyplans/service-core deploy --prod /deploy

# --- Production runner ---
FROM node:25-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nestjs

COPY --from=builder --chown=nestjs:nodejs /app/apps/service-core/dist ./dist
COPY --from=builder --chown=nestjs:nodejs /deploy/node_modules ./node_modules
COPY --from=builder --chown=nestjs:nodejs /deploy/package.json ./package.json

USER nestjs

CMD ["node", "dist/main"]
