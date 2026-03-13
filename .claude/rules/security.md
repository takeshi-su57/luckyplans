# Security Rules

## Environment Variables

- Never hardcode secrets, tokens, passwords, or API keys in source code
- Always use `getEnvVar(key, defaultValue?)` from `@luckyplans/shared` — it throws on missing required vars
- `.env` is in `.gitignore` — never commit it
- `.env.example` documents all variables without real values — keep it updated
- Sensitive values (DB passwords, JWT secrets, API keys) must come from Kubernetes Secrets in production, never from code or ConfigMaps
- Production secrets use Bitnami Sealed Secrets — encrypted values in `values.prod.yaml`, decrypted by the in-cluster controller. Never commit plain-text secrets to git.

## CI Security Scanning

The CI pipeline (`.github/workflows/ci.yml`) enforces:
- **Trivy dependency scan:** Checks `package-lock.json`/`pnpm-lock.yaml` for CRITICAL and HIGH vulnerabilities
- **Trivy config scan:** Checks Dockerfiles and IaC for misconfigurations
- **SARIF upload:** Results sent to GitHub Security tab for tracking

Rules:
- Do not add `continue-on-error: true` to security scan steps
- Do not downgrade severity filters below CRITICAL,HIGH without team approval
- Fix or suppress (with justification) all security findings before merging

## Docker Security

Current practices (maintain these):
- Multi-stage builds to minimize production image size and attack surface
- Non-root user in all production containers (UID 1001)
- Alpine Linux base images
- `npm` removed from production images
- Security updates applied via `apk upgrade` in build stage
- `.dockerignore` excludes `node_modules`, `.env`, `.git`

Rules:
- Do not run containers as root
- Do not add `--privileged` or `SYS_ADMIN` capabilities
- Pin base image versions (e.g., `node:25-alpine`, not `node:latest`)

## Authentication — Gateway-Managed Sessions

Authentication uses Keycloak with gateway-managed server-side sessions. The gateway accepts credentials via REST endpoints, authenticates with Keycloak server-side, and issues opaque `session_id` cookies. No tokens are exposed to the browser.

### Architecture

- **Identity provider:** Keycloak
- **Login:** Gateway accepts `{ email, password }` via `POST /auth/login`, authenticates using ROPC grant (`grant_type=password`)
- **Registration:** Gateway accepts `{ email, password, firstName?, lastName? }` via `POST /auth/register`, creates user via Keycloak Admin REST API (`client_credentials` grant + service account with `manage-users` role), then auto-logs in via ROPC
- **Logout:** `POST /auth/logout` — deletes Redis session, clears cookie
- **Session storage:** Redis — `SessionData` contains userId, email, roles, accessToken, refreshToken, idToken, expiresAt
- **Session cookie:** `session_id` — HttpOnly, Secure (production), SameSite=Lax, Path=/
- **Token refresh:** Gateway transparently refreshes access tokens when within 60s of expiry
- **Frontend pages:** Custom login/register pages in Next.js at `/login` and `/register` (not Keycloak UI)

### Key files

- `apps/api-gateway/src/auth/oidc.controller.ts` — `POST /auth/login`, `POST /auth/register`, `POST /auth/logout`
- `apps/api-gateway/src/auth/session.service.ts` — Redis session CRUD + token refresh
- `apps/api-gateway/src/auth/session.guard.ts` — Reads cookie, validates session, injects `AuthUser`
- `infrastructure/keycloak/realm-export.json` — Keycloak realm config (ROPC enabled, service account with `manage-users`)

### Rules

- Never expose access tokens, refresh tokens, or id tokens to the browser
- Never send `Authorization: Bearer` headers from the frontend — auth is cookie-based
- Never implement auth logic on the frontend (no next-auth, no token storage, no token refresh)
- Session secrets (`SESSION_SECRET`) must come from Sealed Secrets in production
- id_token verification uses jose JWKS (`createRemoteJWKSet`) — never skip signature verification
- Cookie must use `Secure` flag in production (HTTPS only)
- Failed auth attempts should be rate-limited (not yet implemented)

## Input Validation (Future)

When validation is added:
- Use NestJS `ValidationPipe` with `class-validator` DTOs
- Validate all GraphQL inputs at the gateway level
- Sanitize user input before storage
- Reject unexpected fields (`whitelist: true` in ValidationPipe)

## Dependency Management

- Dependabot is configured (`.github/dependabot.yml`) for automated updates
- Review all dependency updates for security advisories before merging
- GitHub Actions use pinned SHA versions (e.g., `actions/checkout@<sha>`) — maintain this practice
- Avoid adding new dependencies without justification

## What AI Must Never Generate

- Hardcoded credentials, API keys, tokens, or passwords
- `eval()`, `Function()`, or any dynamic code execution
- Disabled or bypassed security checks (`--no-verify`, `continue-on-error` on security steps)
- Overly permissive CORS (`origin: '*'` in production)
- SQL/NoSQL injection-vulnerable queries (use parameterized queries when DB is added)
- Disabled TypeScript strict mode or ESLint security rules
- `dangerouslySetInnerHTML` without sanitization
- Logging of sensitive data (tokens, passwords, PII)
