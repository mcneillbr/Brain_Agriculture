-- Revert brain_agriculture:create_extension_on_database from pg

BEGIN;

DROP EXTENSION IF EXISTS "uuid-ossp" CASCADE;

COMMIT;
