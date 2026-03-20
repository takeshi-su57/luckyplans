FROM node:25-alpine AS base
RUN apk add --no-cache libc6-compat
RUN npm install -g pnpm@9.15.4
WORKDIR /app

# --- Pruned workspace ---
FROM base AS pruner
RUN npm install -g turbo@^2.3.0
COPY . .
RUN turbo prune @luckyplans/web --docker

# --- Install dependencies ---
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
ARG NEXT_PUBLIC_GRAPHQL_URL=http://localhost:3001/graphql
ENV NEXT_PUBLIC_GRAPHQL_URL=${NEXT_PUBLIC_GRAPHQL_URL}
ENV STANDALONE=true
RUN pnpm turbo run build --filter=@luckyplans/web

# --- Production runner ---
FROM node:25-alpine AS runner
RUN apk upgrade --no-cache
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/apps/web/public ./apps/web/public
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/static ./apps/web/.next/static

# Install sharp for Next.js image optimization (standalone doesn't bundle native modules)
# Use a temp dir to avoid workspace:* resolution issues from the app's package.json
# Copy entire node_modules to /app/node_modules so all transitive deps are available
RUN mkdir -p /tmp/sharp-install \
    && cd /tmp/sharp-install \
    && npm init -y \
    && npm install sharp@0.34.5 \
    && cp -r /tmp/sharp-install/node_modules/* /app/node_modules/ \
    && rm -rf /tmp/sharp-install \
    && chown -R nextjs:nodejs /app/node_modules

# Remove npm/yarn to reduce attack surface
RUN rm -rf /usr/local/lib/node_modules/npm /opt/yarn-v*

USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "apps/web/server.js"]
