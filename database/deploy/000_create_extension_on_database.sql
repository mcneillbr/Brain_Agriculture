-- Deploy brain_agriculture:create_extension_on_database to pg

BEGIN;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;

COMMIT;
