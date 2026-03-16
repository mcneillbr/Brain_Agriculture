-- Verify brain_agriculture:create_extension_on_database on pg

BEGIN;

SELECT * FROM pg_extension WHERE extname = 'uuid-ossp';

ROLLBACK;
