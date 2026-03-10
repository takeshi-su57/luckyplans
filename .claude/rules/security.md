# Security Rules

## Environment Variables

- Never hardcode secrets, tokens, passwords, or API keys in source code
- Always use `getEnvVar(key, defaultValue?)` from `@luckyplans/shared` — it throws on missing required vars
- `.env` is in `.gitignore` — never commit it
- `.env.example` documents all variables without real values — keep it updated
- Sensitive values (DB passwords, JWT secrets, API keys) must come from Kubernetes Secrets in production, never from code or ConfigMaps

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

## Authentication (Current and Future)

Current state: Auth service uses placeholder logic (mock tokens). When implementing real authentication:
- Use bcrypt or argon2 for password hashing — never store plaintext passwords
- JWT tokens must have expiration (`exp` claim)
- Refresh tokens must be stored server-side and revocable
- API gateway must validate tokens before forwarding requests to services
- Failed auth attempts should be rate-limited

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
