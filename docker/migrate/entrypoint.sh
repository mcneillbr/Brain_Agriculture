#!/bin/sh
# Docker entrypoint for database migrations.
# Runs inside the sqitch/sqitch container with the database/ directory
# mounted at /app.  Environment variables are injected by docker-compose.
set -eu

DB_USER="${DB_USER:-postgres}"
DB_PASSWORD="${DB_PASSWORD:-postgres}"
DB_HOST="${DB_HOST:-db}"
DB_PORT="${DB_PORT:-5432}"
DB_NAME="${DB_NAME:-brain_agriculture}"

SQITCH_URI="postgresql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}"

echo "[migrate] Checking database '${DB_NAME}'..."

DB_EXISTS=$(
  PGPASSWORD="${DB_PASSWORD}" psql \
    -h "${DB_HOST}" -p "${DB_PORT}" -U "${DB_USER}" \
    -tAc "SELECT 1 FROM pg_database WHERE datname='${DB_NAME}'" \
    2>/dev/null || echo ""
)

if [ -n "${DB_EXISTS}" ]; then
  echo "[migrate] Database '${DB_NAME}' already exists."
else
  echo "[migrate] Creating database '${DB_NAME}'..."
  PGPASSWORD="${DB_PASSWORD}" createdb \
    -h "${DB_HOST}" -p "${DB_PORT}" -U "${DB_USER}" "${DB_NAME}"
fi

echo "[migrate] Running sqitch deploy..."
sqitch deploy -t "${SQITCH_URI}"

echo "[migrate] Running sqitch verify..."
sqitch verify -t "${SQITCH_URI}"

echo "[migrate] Done."
