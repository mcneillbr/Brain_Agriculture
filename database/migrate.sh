#!/bin/bash
# Migrate the database using sqitch
#
# -e  Exit immediately if a command exits with a non-zero status.
#-u  Treat unset variables as an error when substituting.
set -eu
# This script assumes that the database connection parameters are set as environment variables.
# Set default values for database connection parameters
DB_USER=${DB_USER:-"postgres"}
DB_PASSWORD=${DB_PASSWORD:-"123456"}
DB_HOST=${DB_HOST:-"localhost"}
DB_PORT=${DB_PORT:-"5432"}
DB_NAME=${DB_NAME:-"brain_agriculture"}
SQITCH_DB_URI="postgresql://$DB_USER:$DB_PASSWORD@$DB_HOST:$DB_PORT/$DB_NAME"
# PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -c "\l" > /dev/null 2>&1


# Check if the database exists, if not create it
DB_EXISTS=$(PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -tAc "SELECT 1 FROM pg_database WHERE datname='$DB_NAME'")
echo "Checking if database $DB_NAME exists..."
if [ -n "$DB_EXISTS" ]; then
  echo "Database $DB_NAME already exists."
else
  echo "Database $DB_NAME does not exist. Creating..."
  PGPASSWORD=$DB_PASSWORD createdb -h $DB_HOST -p $DB_PORT -U $DB_USER $DB_NAME
fi
# Change to the database directory and run sqitch deploy and verify
cd database || cd $(find $HOME -name database -type d | grep Brain_Agriculture/database | head -n 1)
# Run sqitch deploy and verify
sqitch deploy -t $SQITCH_DB_URI
sqitch verify -t $SQITCH_DB_URI
