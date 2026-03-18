# sqitch/sqitch includes sqitch, psql, and createdb out of the box.
FROM sqitch/sqitch:latest

USER root

WORKDIR /app

# Copy the Sqitch plan, config and all deploy/revert/verify scripts
COPY database/ ./

# Copy the Docker-specific entrypoint (replaces migrate.sh)
COPY docker/migrate/entrypoint.sh ./entrypoint.sh
RUN chmod +x ./entrypoint.sh

ENTRYPOINT ["sh", "./entrypoint.sh"]
