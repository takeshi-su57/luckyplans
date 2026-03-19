FROM node:25-alpine AS base
RUN apk add --no-cache libc6-compat
RUN npm install -g pnpm@9.15.4
WORKDIR /app

# --- Pruned workspace ---
FROM base AS pruner
RUN npm install -g turbo@^2.3.0
COPY . .
RUN turbo prune @luckyplans/prisma --docker

# --- Install dependencies (including devDeps for prisma CLI) ---
FROM base AS deps
COPY --from=pruner /app/out/json/ .
COPY --from=pruner /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=pruner /app/out/pnpm-workspace.yaml ./pnpm-workspace.yaml
COPY --from=pruner /app/.pnpmfile.cjs ./.pnpmfile.cjs
RUN pnpm install --frozen-lockfile

# --- Build ---
FROM base AS builder
COPY --from=deps /app/ .
COPY --from=pruner /app/out/full/ .
COPY --from=pruner /app/tsconfig.base.json ./tsconfig.base.json
# .pnpmfile.cjs hooks apply during `pnpm deploy` (unlike pnpm.overrides which do not).
# This ensures minimatch and tar are resolved to patched versions in the deploy dir.
COPY .pnpmfile.cjs .pnpmfile.cjs
RUN pnpm turbo run build --filter=@luckyplans/prisma
# Deploy with ALL deps (not --prod) so prisma CLI is included
RUN pnpm --filter=@luckyplans/prisma deploy /deploy

# --- Migration runner ---
FROM node:25-alpine AS runner
RUN apk upgrade --no-cache && \
    rm -rf /usr/local/lib/node_modules/npm /opt/yarn-v*
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 prisma

# Copy everything from deploy: prisma CLI, client, schema, migrations
COPY --from=builder --chown=prisma:nodejs /deploy/node_modules ./node_modules
COPY --from=builder --chown=prisma:nodejs /deploy/package.json ./package.json
COPY --from=builder --chown=prisma:nodejs /app/packages/prisma/prisma ./prisma
COPY --from=builder --chown=prisma:nodejs /app/packages/prisma/prisma.config.ts ./prisma.config.ts

USER prisma

CMD ["node", "node_modules/prisma/build/index.js", "migrate", "deploy"]
