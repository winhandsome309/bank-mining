
    CREATE USER bankadmin WITH PASSWORD 'jw8s0F4';
    CREATE DATABASE banking;
    GRANT ALL PRIVILEGES ON DATABASE banking TO bankadmin;
    CREATE DATABASE metabase;
    GRANT ALL PRIVILEGES ON DATABASE metabase TO bankadmin;