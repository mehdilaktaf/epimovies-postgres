
module.exports = Object.freeze({
    postgres_user: process.env.POSTGRESQL_ADDON_USER || 'postgres' ,
    postgres_pwd: process.env.POSTGRESQL_ADDON_PASSWORD  || 'Bounana1!' ,
    postgres_db:  process.env.POSTGRESQL_ADDON_DB ||  'epimovies_psql',
    postgres_port: process.env.POSTGRESQL_ADDON_PORT  || 5432 ,
    postgres_host:  process.env.POSTGRESQL_ADDON_HOST || 'localhost' ,
    server_port: process.env.PORT || 5000,
    roles: ["user", "admin", "moderator"],
    secret: "epimovies-secret-key"
});

