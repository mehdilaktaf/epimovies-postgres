
module.exports = Object.freeze({
    postgres_user: 'postgres' || process.env.POSTGRESQL_ADDON_USER,
    postgres_pwd: 'Bounana1!' || process.env.POSTGRESQL_ADDON_PASSWORD,
    postgres_db: 'epimovies_psql' || process.env.POSTGRESQL_ADDON_DB,
    postgres_port: 5432 || process.env.POSTGRESQL_ADDON_PORT,
    postgres_host: 'localhost' || process.env.POSTGRESQL_ADDON_HOST,
    server_port: 5000,
    roles: ["user", "admin", "moderator"],
    secret: "epimovies-secret-key"
});