-- Create the application database (separate from Keycloak).
-- PostgreSQL runs scripts in /docker-entrypoint-initdb.d/ on first startup only.
-- For existing volumes: docker compose down -v && docker compose up -d

CREATE DATABASE luckyplans;
CREATE USER luckyplans WITH PASSWORD 'luckyplans' CREATEDB;
GRANT ALL PRIVILEGES ON DATABASE luckyplans TO luckyplans;
-- Required for Prisma migrations (schema creation)
\c luckyplans
GRANT ALL ON SCHEMA public TO luckyplans;
