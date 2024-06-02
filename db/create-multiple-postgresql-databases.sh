#!/bin/bash
set -e

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    CREATE USER bankadmin;
    CREATE DATABASE banking;
    GRANT ALL PRIVILEGES ON DATABASE banking TO bankadmin;
    CREATE DATABASE metabase;
    GRANT ALL PRIVILEGES ON DATABASE metabase TO bankadmin;
EOSQL
